# Wallet Context

This is an opinionated implementation fo web3react v8 library for Rome Terminal iframe widgets.
This allows users to have multiple wallets active simultaneously but only have one priority wallet.
The priority wallet is determined by the last wallet the user has activated.

The package exposes the following

1. WalletProvider - React Context Provider for the connectors
2. useWallets - Hook that exposes setSelectedWallet function that updates the priority wallet
3. useWeb3React - Hook that exposes the connector and hooks for the priority wallet
4. SUPPORTED_WALLETS - An object map that contains all supported wallets by the package.

## Quick Start

1. Check /example folder for React example
