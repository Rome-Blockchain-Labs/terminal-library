import WalletProvider, { SUPPORTED_WALLETS } from './context/WalletProvider'
import { useWeb3React } from '@web3-react/core'
import { useWallets } from './hooks/useWallets'
import { Wallet } from './types'

export { WalletProvider, SUPPORTED_WALLETS, useWeb3React, Wallet, useWallets }
