import { Web3ReactHooks, Web3ReactProvider } from '@web3-react/core'
import { MetaMask } from '@web3-react/metamask'
import { Network } from '@web3-react/network'
import { AddEthereumChainParameter } from '@web3-react/types'
import { WalletConnect } from '@web3-react/walletconnect'
import React, { useMemo, useEffect } from 'react'
import { Wallet } from '..'
import { isExtendedChainInformation, generateChains } from '../chains'
import { hooks as metaMaskHooks, metaMask } from '../connectors/metaMask'
import { initializeNetworkConnector } from '../connectors/network'
import { initializeWalletConnectConnector } from '../connectors/walletConnect'
import useLocalStorage from '../hooks/useLocalStorage'
import { WalletInfo } from '../types'

export interface IWalletContext {
  setSelectedWallet: (Wallet: Wallet) => void
  SUPPORTED_WALLETS: { [key: string]: WalletInfo }
  getAddChainParameters: (chainId: number) => AddEthereumChainParameter | number | void
}

export const WalletContext = React.createContext<IWalletContext>({
  setSelectedWallet: () => {},
  SUPPORTED_WALLETS: {},
  getAddChainParameters: () => {},
})

interface WalletProviderProps {
  children: React.ReactNode
  INFURA_KEY: string
  ALCHEMY_KEY: string
}

export default function WalletProvider({ children, INFURA_KEY, ALCHEMY_KEY }: WalletProviderProps) {
  const { walletConnect, walletConnectHooks } = initializeWalletConnectConnector(INFURA_KEY, ALCHEMY_KEY)
  const { network, networkHooks } = initializeNetworkConnector(INFURA_KEY, ALCHEMY_KEY)

  const initialConnectors: [MetaMask | WalletConnect | Network, Web3ReactHooks][] = [
    [metaMask, metaMaskHooks],
    [walletConnect, walletConnectHooks],
    [network, networkHooks],
  ]

  const SUPPORTED_WALLETS: { [key: string]: WalletInfo } = {
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
  function getAddChainParameters(chainId: number): AddEthereumChainParameter | number {
    const CHAINS = generateChains(INFURA_KEY, ALCHEMY_KEY)
    const chainInformation = CHAINS[chainId]
    if (isExtendedChainInformation(chainInformation)) {
      return {
        chainId,
        chainName: chainInformation.name,
        nativeCurrency: chainInformation.nativeCurrency,
        rpcUrls: chainInformation.urls as any,
        blockExplorerUrls: chainInformation.blockExplorerUrls,
      }
    } else {
      return chainId
    }
  }

  const [selectedWallet, setSelectedWallet] = useLocalStorage('wallet', null)
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
  }, [])

  useEffect(() => {
    network.activate()
    if (selectedWallet) {
      SUPPORTED_WALLETS[selectedWallet].connector.activate()
    }
  }, [])

  return (
    <WalletContext.Provider value={{ setSelectedWallet, SUPPORTED_WALLETS, getAddChainParameters }}>
      <Web3ReactProvider connectors={connectors}>{children}</Web3ReactProvider>
    </WalletContext.Provider>
  )
}
