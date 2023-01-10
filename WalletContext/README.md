# Wallet Context

Current version is 0.1.32
| version | description |
| 0.1.32 | simplified handle connect logic, added loading event
| 0.1.30 | emit wallet connect and disconnect events
| 0.1.29 | use latest version of bridge to allow type consistency
| 0.1.29 | remove window.localstorage.clear
| 0.1.27 | always return chain information
| 0.1.25 | delete deprecated testnets
| 0.1.23 | added ofac list
| 0.1.22 | added coinbase
| 0.1.19 | return error when wallet fails to connect
| 0.1.18 | add boolean for eagerly connecting to network
| 0.1.17 | revert package versions due to incompatibility
| 0.1.16 | revert handleConnect args dues to referential equality requirement
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
4. ConnectionList - An array that contains all supported wallets by the package.

## Quick Start

1. `yarn add @romeblockchain/wallet`
2. If using React add 2 the following env variables. REACT_APP_INFURA_KEY and REACT_APP_ALCHEMY_KEY
3. if using Next JS add 2 the following env variables instead. INFURA_KEY and ALCHEMY_KEY.

## Demo

1. Check /example folder for React example
