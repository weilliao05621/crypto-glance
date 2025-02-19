# CryptoGlance

Link: https://crypto-glance-feweil.netlify.app

## Setup and running instructions

1. Fill up .env by following the `env.example`

```
VITE_INFURA_KEY =  # Ethereum Mainnet & Ethereum Testnet Sepolia
VITE_WALLET_CONNECT_PROJECT_ID =
```

2. dev script
```bash
node -v # >=20.12.0
pnpm -v # >=9.0.0

pnpm run dev
```

## Technical Decision
### Bundler

#### Why `Vite`
- REALLY FAST even with not fully esbuild depended...😅 
- Heavily depends on Rollup, but its v4 has switched parser to SWC 
- Create boilerplate quickly with all setting
- Can customize plugins & server setting

#### Comparision
- `parcel` is easy to go for a side project, but not suitable for a real produnction.
- `Webpack` requires a lots of loaders & plugins, which are more overwhelmed when building slowly


### State Management 
#### Integrate server & client state
- map server data with token list to use client data as single source

#### Why `Zustand`
- avoid boilerplate
- easily prevent global state re-rendering unnecessarily 
```ts
const AssetAmount = (props: { token: ValidToken }) => {
  // only update when the selector's returned value changes
  const amount = useAssetsStore((state) => state.getAmount(props.token).value);
  const decimals = useAssetsStore(
    (state) => state.getAmount(props.token).decimals,
  );

  const toDecimals = 10n ** BigInt(decimals);
  const value = (amount * 100n) / toDecimals;

  const valueString = `${(parseFloat(value.toString()) / 100).toFixed(2)} ${props.token}`;

  return <span>{valueString}</span>;
};
```

### Real time data

#### Price oracle: AAVE
- great API usage & npm pkg for developing

#### Watch transaction receipt
- can check success for all types of txs
- can self-handle polling with `useTransactionReceipt`
  - found wagmi's watchers to keep polling block status even if unmounted


### Optimization

#### hooks
- use `useEventCallback` & `useEventData` to optimize rendering (ref: [rfcs](https://github.com/reactjs/rfcs/blob/useevent/text/0000-useevent.md))

#### types
- use [`ts-brand`](src/types/brand/index.ts) to ensure chain id to be an unique type

#### UI
- make card & table config-based for maintainance

#### package manager
- `pnpm` can have better performance if combining CI/CD due to its package linking system & cached.

## Demo

### Connect Wallet

![Connect Wallet](docs/images/connect-wallet.gif)

### Send Tx

![Send Tx](docs/images/send-tx.gif)