import { useMemo } from 'react'
import { useAsync } from 'react-use'
import { useChainId, GasOption } from '@masknet/web3-shared-evm'
import { WalletRPC } from '../../../../../plugins/Wallet/messages'
import { useI18N } from '../../../../../utils'

export function useGasOptions() {
    const chainId = useChainId()
    const { t } = useI18N()

    //#region Get gas options from debank
    const { value: gasOptions } = useAsync(async () => {
        const response = await WalletRPC.getGasPriceDictFromDeBank(chainId)
        if (!response) return { slow: 0, standard: 0, fast: 0 }
        const { data } = response
        return {
            slow: data.slow.price,
            standard: data.normal.price,
            fast: data.fast.price,
        }
    }, [chainId])
    //#endregion

    const options = useMemo(
        () => [
            {
                title: t('popups_wallet_gas_fee_settings_low'),
                gasOption: GasOption.Low,
                gasPrice: gasOptions?.slow ?? 0,
            },
            {
                title: t('popups_wallet_gas_fee_settings_medium'),
                gasOption: GasOption.Medium,
                gasPrice: gasOptions?.standard ?? 0,
            },
            {
                title: t('popups_wallet_gas_fee_settings_high'),
                gasOption: GasOption.High,
                gasPrice: gasOptions?.fast ?? 0,
            },
        ],
        [gasOptions],
    )
    return { options, gasOptions }
}
