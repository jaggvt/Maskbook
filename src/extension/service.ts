import { AsyncCall } from '@holoflows/kit/es/Extension/Async-Call'
import { GetContext, OnlyRunInContext } from '@holoflows/kit/es/Extension/Context'
import * as MockService from './mock-service'

interface Services {
    Crypto: typeof import('./background-script/CryptoService')
    People: typeof import('./background-script/PeopleService')
    Welcome: typeof import('./background-script/WelcomeService')
}
const Services: Services = {} as any
export default Services
if (!('Services' in window)) {
    Object.assign(window, { Services })
    register(() => import('./background-script/CryptoService'), 'Crypto', MockService.CryptoService)
    register(() => import('./background-script/WelcomeService'), 'Welcome', MockService.WelcomeService)
    register(() => import('./background-script/PeopleService'), 'People', MockService.PeopleService)
}

if (GetContext() === 'background') {
    Object.assign(window, { tasks: require('./content-script/tasks') })
    // Run tests
    require('../tests/1to1')
    require('../tests/1toN')
    require('../tests/sign&verify')
    require('../tests/friendship-discover')
    Object.assign(window, {
        db2: {
            avatar: require('../database/avatar'),
            group: require('../database/group'),
            people: require('../database/people'),
            type: require('../database/type'),
            util: require('../database/utils'),
            post: require('../database/post'),
        },
    })
}

//#region
type Service = Record<string, (...args: any[]) => Promise<any>>
async function register<T extends Service>(service: () => Promise<T>, name: keyof Services, mock?: Partial<T>) {
    if (GetContext() === 'background') {
        console.log(`Service ${name} registered in Background page`)
        const loaded = await service()
        Object.assign(Services, { [name]: loaded })
        AsyncCall(loaded, { key: name })
    } else if (OnlyRunInContext(['content', 'options', 'debugging'], false)) {
        console.log(`Service ${name} registered in Content script & Options page`)
        Object.assign(Services, { [name]: AsyncCall({}, { key: name }) })
        if (GetContext() === 'debugging') {
            // ? -> UI developing
            console.log(`Service ${name} mocked`)
            const mockService = new Proxy(mock || {}, {
                get(target: any, key: string) {
                    return async function(...args: any[]) {
                        if (target[key]) return target[key](...args)
                        return void 0
                    }
                },
            })
            AsyncCall(mockService, { key: name })
        }
    } else {
        console.warn('Unknown environment, service not registered')
    }
}
//#endregion
