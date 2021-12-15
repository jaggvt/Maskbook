# A new EVM-compatible chain to Mask Network

It's easy to integrate an EVM-compatible chain into Mask Network. After you add a new `ChainId` and `NetworkType` in `packages/web3-shared/evm/types/index.ts`. You can follow the TypeScript compiler. By fixing these errors the integration progress will keep moving forward.

But in case of you don't get a TypeScript compiler. Here is a complete instruction list to make sure you wouldn't missing anything. Before we get start, make sure you have good network connection to google.com and github.com. You will know why later.

## Integration Instructions

### Setup Metadata

- [ ] Add a logo image
  - `packages/mask/src/plugins/EVM/assets/`
- [ ] Add chain detailed data
  - `packages/web3-shared/evm/assets/chains.json`

### Setup External APIs

- [ ] Setup for Debank
- [ ] Setup for CoinGecko
  - `packages/web3-shared/evm/assets/coingecko-asset-platforms.json`
  - `packages/web3-shared/evm/assets/coingecko-coin-list.json`
- [ ] Setup for CoinMarketCap

## DEX

### Uniswap V2 Like

### Uniswap V3 Like

### API-based

## Token List

## Deploy Contracts

- [ ] Multicall Contract
- [ ] BalanceChecker
- [ ] Contracts from the Mask team

Congratulation! You have done the coding part.

## Testing Checklist

Before we ship the new chain to the user. We need to do some basic ability checks.

- [ ] Check if the asset list on the dashboard page is working when you choose the new chain as the network.
  - Setup the new chain for DEBANK API.
- [ ] Check if the trending view is working. Try to hover a the new chain token in any tweets.
  - Setup the new chain for Coingecko API.
  - Setup the new chain for CMC API.

![image](https://user-images.githubusercontent.com/52657989/144754788-460bad98-bf62-4e5e-8592-ea8580430e63.png)

- [ ] Check if the gas estimate dialog is working.
  - Setup the new chain for Coingecko API.

Goto `chrome-extension://jkoeaghipilijlahjplgbfiocjhldnap/dashboard.html#/wallets/transfer` and check the estimated USD value is working.

![image](https://user-images.githubusercontent.com/52657989/144754866-9c5f389b-6eb4-4325-8f3d-ae53ee6e3b4a.png)

- [ ] Trade with the DEX on the new chain.

  - Integrate a DEX for the new chain.

- [ ] Send a transaction and check if the explorer links are working.
