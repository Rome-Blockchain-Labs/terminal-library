import { Web3ReactHooks, Web3ReactProvider } from '@web3-react/core'
import { MetaMask } from '@web3-react/metamask'
import { Network } from '@web3-react/network'
import { WalletConnect } from '@web3-react/walletconnect'
import React, { useMemo, useEffect, useState } from 'react'
import { Wallet } from '..'
import { hooks as metaMaskHooks, metaMask } from '../connectors/metaMask'
import { hooks as networkHooks, network } from '../connectors/network'
import { hooks as walletConnectHooks, walletConnect } from '../connectors/walletConnect'
import { WalletInfo } from '../types'

export const initialConnectors: [MetaMask | WalletConnect | Network, Web3ReactHooks][] = [
  [metaMask, metaMaskHooks],
  [walletConnect, walletConnectHooks],
  [network, networkHooks],
]

export const SUPPORTED_WALLETS: { [key: string]: WalletInfo } = {
  NETWORK: {
    connector: network,
    hooks: networkHooks,
    wallet: Wallet.NETWORK,
    name: 'Network',
  },
  METAMASK: {
    connector: metaMask,
    hooks: metaMaskHooks,
    wallet: Wallet.METAMASK,
    name: 'MetaMask',
  },
  WALLET_CONNECT: {
    connector: walletConnect,
    hooks: walletConnectHooks,
    wallet: Wallet.WALLET_CONNECT,
    name: 'WalletConnect',
    mobile: true,
  },
}
interface IWalletContext {
  setSelectedWallet: (Wallet: Wallet) => void
}

export const WalletContext = React.createContext<IWalletContext>({
  setSelectedWallet: () => {},
})

export default function ProviderExample({ children }: any) {
  const [selectedWallet, setSelectedWallet] = useState<Wallet>()
  const connectors = useMemo(() => {
    if (!selectedWallet) return initialConnectors

    const connectorList: [MetaMask | WalletConnect | Network, Web3ReactHooks][] = []
    if (selectedWallet) {
      const wallet = SUPPORTED_WALLETS[selectedWallet]
      connectorList.push([wallet.connector, wallet.hooks])
    }
    Object.keys(SUPPORTED_WALLETS)
      .filter((wallet) => wallet !== selectedWallet)
      .forEach((ele) => {
        const wallet = SUPPORTED_WALLETS[ele]
        connectorList.push([wallet.connector, wallet.hooks])
      })
    connectorList.push([network, networkHooks])
    return connectorList
  }, [selectedWallet])

  useEffect(() => {
    network.activate()
  }, [])

  return (
    <WalletContext.Provider value={{ setSelectedWallet }}>
      <Web3ReactProvider connectors={connectors}>{children}</Web3ReactProvider>
    </WalletContext.Provider>
  )
}
