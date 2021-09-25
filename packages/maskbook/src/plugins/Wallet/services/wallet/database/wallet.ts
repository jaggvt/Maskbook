import type { api } from '@dimensiondev/mask-wallet-core/proto'
import { WalletMessages } from '@masknet/plugin-wallet'
import { currySameAddress, formatEthereumAddress, isSameAddress, ProviderType } from '@masknet/web3-shared'
import { EthereumAddress } from 'wallet.ts'
import { asyncIteratorToArray } from '../../../../../utils'
import { PluginDB } from '../../../database/Plugin.db'
import { currentAccountMaskWalletSettings, currentAccountSettings, currentProviderSettings } from '../../../settings'
import type { WalletRecord } from '../type'

export async function getWallet(address = currentAccountMaskWalletSettings.value) {
    if (!address) return null
    if (!EthereumAddress.isValid(address)) throw new Error('Not a valid address.')
    return PluginDB.get('wallet', formatEthereumAddress(address))
}

export async function getWalletRequired(address: string) {
    const wallet = await getWallet(address)
    if (!wallet) throw new Error('The wallet does not exist.')
    return wallet
}

export async function hasWallet(address: string) {
    return PluginDB.has('wallet', formatEthereumAddress(address))
}

export async function hasWalletRequired(address: string) {
    const has = await hasWallet(address)
    if (!has) throw new Error('The wallet does not exist.')
    return has
}

export async function hasStoredKeyInfo(storedKeyInfo?: api.IStoredKeyInfo) {
    const wallets = await getWallets()
    if (!storedKeyInfo) return false
    return wallets.filter((x) => x.storedKeyInfo?.hash).some((x) => x.storedKeyInfo?.hash === storedKeyInfo?.hash)
}

export async function hasStoredKeyInfoRequired(storedKeyInfo?: api.IStoredKeyInfo) {
    const has = await hasStoredKeyInfo(storedKeyInfo)
    if (!has) throw new Error('The stored key info does not exist.')
    return has
}

export async function getWallets(provider?: ProviderType) {
    const wallets = await asyncIteratorToArray(PluginDB.iterate('wallet'))
    const address =
        provider === ProviderType.MaskWallet ? currentAccountMaskWalletSettings.value : currentAccountSettings.value

    wallets.sort((a, z) => {
        if (isSameAddress(a.address, address)) return -1
        if (isSameAddress(z.address, address)) return 1
        if (a.updatedAt > z.updatedAt) return -1
        if (a.updatedAt < z.updatedAt) return 1
        if (a.createdAt > z.createdAt) return -1
        if (a.createdAt < z.createdAt) return 1
        return 0
    })
    if (provider === ProviderType.MaskWallet) return wallets.filter((x) => x.storedKeyInfo)
    if (provider === currentProviderSettings.value) return wallets.filter(currySameAddress(address))
    if (provider) return []
    return wallets
}

export async function addWallet(
    address: string,
    name?: string,
    derivationPath?: string,
    storedKeyInfo?: api.IStoredKeyInfo,
) {
    if (await hasWallet(address)) throw new Error('The wallet already exists.')
    const now = new Date()
    const address_ = formatEthereumAddress(address)
    await PluginDB.add({
        id: address_,
        type: 'wallet',
        address: address_,
        name: name?.trim() || `Account ${(await getWallets()).length + 1}`,
        derivationPath,
        storedKeyInfo,
        erc20_token_whitelist: new Set(),
        erc20_token_blacklist: new Set(),
        erc721_token_whitelist: new Set(),
        erc721_token_blacklist: new Set(),
        erc1155_token_whitelist: new Set(),
        erc1155_token_blacklist: new Set(),
        createdAt: now,
        updatedAt: now,
    })
    WalletMessages.events.walletsUpdated.sendToAll(undefined)
    return address_
}

export async function updateWallet(
    address: string,
    updates: Partial<
        Omit<
            WalletRecord,
            | 'id'
            | 'type'
            | 'address'
            | 'createdAt'
            | 'updatedAt'
            | 'erc20_token_whitelist'
            | 'erc20_token_blacklist'
            | 'erc721_token_whitelist'
            | 'erc721_token_blacklist'
            | 'erc1155_token_whitelist'
            | 'erc1155_token_blacklist'
        >
    >,
) {
    const wallet = await getWalletRequired(address)
    await PluginDB.add({
        ...wallet,
        ...updates,
        updatedAt: new Date(),
    })
    WalletMessages.events.walletsUpdated.sendToAll(undefined)
}

export async function removeWallet(address: string) {
    const wallet = await getWalletRequired(address)

    // delete a wallet with mnemonic is not allowed
    if (wallet.derivationPath) throw new Error('Illegal operation.')

    await PluginDB.remove('wallet', address)
    WalletMessages.events.walletsUpdated.sendToAll(undefined)
}
