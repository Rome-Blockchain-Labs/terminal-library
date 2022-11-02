# Wallet Context

Current version is 0.1.19
| version | description |
| 0.0.19 | return error when wallet fails to connect
| 0.0.18 | add boolean for eagerly connecting to network
| 0.0.17 | revert package versions due to incompatibility
| 0.0.16 | revert handleConnect args dues to referential equality requirement
| 0.1.14 | update package versions
| 0.1.13 | add DFK
| 0.1.12 | add rinkeby
| 0.1.10 | add handle connect
| 0.1.8 | remove eager connect, add utility fn

This is an opinionated implementation fo web3react v8 library for Rome Terminal iframe widgets.
This allows users to have multiple wallets active simultaneously but only have one priority wallet.
The priority wallet is determined by the last wallet the user has activated.

The package exposes the following

1. WalletProvider - React Context Provider for the connectors
2. useWallets - Hook that exposes setSelectedWallet function that updates the priority wallet
3. useWeb3React - Hook that exposes the connector and hooks for the priority wallet
4. SUPPORTED_WALLETS - An object map that contains all supported wallets by the package.

## Quick Start

1. `yarn add @romeblockchain/wallet`
2. If using React add 2 the following env variables. REACT_APP_INFURA_KEY and REACT_APP_ALCHEMY_KEY
3. if using Next JS add 2 the following env variables instead. INFURA_KEY and ALCHEMY_KEY.

## Demo

1. Check /example folder for React example
