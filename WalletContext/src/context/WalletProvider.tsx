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
import { AddEthereumChainParameter } from '@web3-react/types'
import { ethers } from 'ethers'
import { RomeEventType, widgetBridge } from '@romeblockchain/bridge'

type WidgetBridge = typeof widgetBridge

export const initialConnectors: [MetaMask | WalletConnect | Network, Web3ReactHooks][] = [
  [network, networkHooks],
  [metaMask, metaMaskHooks],
  [walletConnect, walletConnectHooks],
]

export const SUPPORTED_WALLETS: { [key: string]: WalletInfo } = {
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
export interface IWalletContext {
  setSelectedWallet: (Wallet: Wallet | undefined) => void
  selectedWallet: Wallet | undefined
  handleConnect: (
    connector: MetaMask | WalletConnect | Network,
    setSelectedWallet: (wallet: Wallet) => void,
    wallet: Wallet,
    widgetBridge: WidgetBridge | null,
  ) => void
}

export const WalletContext = React.createContext<IWalletContext>({
  setSelectedWallet: () => {},
  selectedWallet: undefined,
  handleConnect: () => {},
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

  const handleConnect = async (
    connector: MetaMask | WalletConnect | Network,
    setSelectedWallet: (wallet: Wallet) => void,
    wallet: Wallet,
    widgetBridge: WidgetBridge | null,
    chainParams?: number | AddEthereumChainParameter,
  ) => {
    if (connector instanceof MetaMask) {
      let error
      //Metamask will automatically add the network if doesnt no
      await connector.activate(chainParams).catch(() => (error = true))
      if (error) return
    } else {
      if (typeof chainParams === 'number') {
        let error

        await connector.activate(chainParams).catch(() => (error = true))
        if (error) return
        connector.provider?.once('chainChanged', () => {
          setSelectedWallet(wallet)
          connector.provider?.removeListener('chainChanged', () => {})
        })
      } else {
        let error
        // error would return true if user rejects the wallet connection request
        // if network doesnt exist yet connector.activate would not throw an error and still successsfully activate
        await connector.activate(chainParams && chainParams.chainId).catch(() => (error = true))

        if (error) return

        // activate needs to occur before wallet_addEthereumChain because we can only make requests with an active
        // connector.
        // calling wallet_addEthereumChain will check if the chainId is already present in the wallet
        // if the chainId alreaady exists then it wont add the duplicate network to the wallet
        chainParams &&
          (await connector.provider?.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                ...chainParams,
                chainId: ethers.utils.hexValue(chainParams.chainId),
              },
            ],
          }))

        // we need to subscribe to chainChanged because we would only want to switch selectedWallet when
        // the user has switched networks especially when the netork is newly added
        connector.provider?.once('chainChanged', () => {
          setSelectedWallet(wallet)
          connector.provider?.removeListener('chainChanged', () => {})
        })
      }
    }

    // If wallet is already connected to the correct network then set wallet as priority wallet
    const chainId = await connector.provider?.request<string | number>({
      method: 'eth_chainId',
    })

    if (!chainId) return
    let targetChainId
    if (typeof chainParams === 'number') {
      targetChainId = chainParams
    } else {
      targetChainId = chainParams?.chainId
    }

    if (targetChainId && chainId === ethers.utils.hexValue(targetChainId)) {
      setSelectedWallet(wallet)
    }
    if (targetChainId && chainId === targetChainId) {
      setSelectedWallet(wallet)
    }
    widgetBridge?.emit(RomeEventType.WIDGET_GOOGLE_ANALYTICS_EVENT, {
      event: `${wallet.replace(' ', '_')}_Successful_Connection`,
      eventGroup: 'Wallet_Connection',
    })
  }

  useEffect(() => {
    network.activate()
  }, [])

  return (
    <WalletContext.Provider value={{ selectedWallet, setSelectedWallet, handleConnect }}>
      <Web3ReactProvider connectors={connectors}>{children}</Web3ReactProvider>
    </WalletContext.Provider>
  )
}
