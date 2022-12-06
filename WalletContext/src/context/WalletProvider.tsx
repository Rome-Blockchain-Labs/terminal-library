import { useWeb3React, Web3ReactHooks, Web3ReactProvider } from '@web3-react/core'
import { MetaMask } from '@web3-react/metamask'
import { Network } from '@web3-react/network'
import { WalletConnect } from '@web3-react/walletconnect'
import React, { useEffect, useState, ReactNode } from 'react'
import { Wallet } from '..'
import { hooks as metaMaskHooks, metaMask } from '../connectors/metaMask'
import { hooks as networkHooks, network } from '../connectors/network'
import { hooks as walletConnectHooks, walletConnect } from '../connectors/walletConnect'
import { hooks as coinbaseWalletHooks, coinbase } from '../connectors/coinbase'
import { WalletInfo } from '../types'
import { AddEthereumChainParameter } from '@web3-react/types'
import { ethers } from 'ethers'
import { RomeEventType, widgetBridge } from '@romeblockchain/bridge'
import { CoinbaseWallet } from '@web3-react/coinbase-wallet'
import bannedAccounts from '../../src/bannedAccounts.json'

export const initialConnectors: [MetaMask | WalletConnect | CoinbaseWallet | Network, Web3ReactHooks][] = [
  [network, networkHooks],
  [metaMask, metaMaskHooks],
  [walletConnect, walletConnectHooks],
  [coinbase, coinbaseWalletHooks],
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
  COINBASE: {
    connector: coinbase,
    hooks: coinbaseWalletHooks,
    wallet: Wallet.COINBASE,
    name: 'Coinbase',
  },
}
export interface IWalletContext {
  setSelectedWallet: (Wallet: Wallet | undefined) => void
  selectedWallet: Wallet | undefined
  handleConnect: (wallet: WalletInfo, chainParams: number | AddEthereumChainParameter) => Promise<void>
}

export const WalletContext = React.createContext<IWalletContext>({
  setSelectedWallet: () => {},
  selectedWallet: undefined,
  handleConnect: async () => {},
})

const OfacBan = ({ children }: any) => {
  const { account } = useWeb3React()
  const ofacBanned = account && bannedAccounts.includes(account.toLowerCase())
  if (ofacBanned) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          height: '100%',
        }}
      >
        <div
          style={{
            padding: '1.25rem',
            backgroundColor: '#991b1b',
            borderRadius: '0.375rem',
          }}
        >
          <p
            style={{
              marginBottom: '0.75rem',
              fontSize: 'large',
            }}
          >
            Blocked Address
          </p>
          <p>This address is blocked because it is associated with banned activities.</p>
        </div>
      </div>
    )
  }
  return children
}

export default function WalletProvider({
  children,
  connectToNetwork,
}: {
  children: ReactNode
  connectToNetwork?: boolean
}) {
  const [selectedWallet, setSelectedWallet] = useState<Wallet>()

  const handleConnect = async (wallet: WalletInfo, chainParams: number | AddEthereumChainParameter) => {
    const { connector, wallet: name } = wallet
    try {
      if (connector instanceof MetaMask || connector instanceof CoinbaseWallet) {
        //Metamask will automatically add theWidgetRomeBridgeIframe network if doesnt no
        await connector.activate(chainParams)
        console.log('connected to metamask/coinbase')
      } else {
        if (typeof chainParams === 'number') {
          await connector.activate(chainParams)
          connector.provider?.once('chainChanged', () => {
            console.log('Chain changed')
            setSelectedWallet(name)
            connector.provider?.removeListener('chainChanged', () => {})
          })
        } else {
          // error would return true if user rejects the wallet connection request
          // if network doesnt exist yet connector.activate would not throw an error and still successsfully activate
          await connector.activate(chainParams && chainParams.chainId)

          // activate needs to occur before wallet_addEthereumChain because we can only make requests with an active
          // connector.
          // calling wallet_addEthereumChain will check if the chainId is already present in the wallet
          // if the chainId alreaady exists then it wont add the duplicate network to the wallet
          chainParams &&
            connector.provider
              ?.request({
                method: 'wallet_addEthereumChain',
                params: [
                  {
                    ...chainParams,
                    chainId: ethers.utils.hexValue(chainParams.chainId),
                  },
                ],
              })
              .then(() => console.log('chain added'))

          chainParams &&
            connector.provider
              ?.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: ethers.utils.hexValue(chainParams.chainId) }],
              })
              .then(() => console.log('switched network'))

          // we need to subscribe to chainChanged because we would only want to switch selectedWallet when
          // the user has switched networks especially when the netork is newly added
          connector.provider?.once('chainChanged', () => {
            console.log('Chain changed')
            setSelectedWallet(name)
            connector.provider?.removeListener('chainChanged', () => {})
          })
        }
      }

      // If wallet is already connected to the correct network then set wallet as priority wallet
      const chainId = await connector.provider?.request({
        method: 'eth_chainId',
      })

      const accounts = (await connector.provider?.request({
        method: 'eth_requestAccounts',
      })) as string[]

      widgetBridge?.sendWalletConnectEvent(RomeEventType.WIDGET_WALLET_CONNECT_EVENT, {
        address: accounts[0],
        wallet: name,
      })

      if (!chainId) throw new Error('Unable to get chainID from provider')
      let targetChainId
      if (typeof chainParams === 'number') {
        targetChainId = chainParams
      } else {
        targetChainId = chainParams?.chainId
      }

      if (targetChainId && chainId === ethers.utils.hexValue(targetChainId)) {
        setSelectedWallet(name)
      }
      if (targetChainId && chainId === targetChainId) {
        setSelectedWallet(name)
      }
    } catch (error: any) {
      throw new Error('Unable to connect to wallet. error:', error)
    }
  }

  useEffect(() => {
    if (!selectedWallet) {
      widgetBridge?.sendWalletDisconnectEvent(RomeEventType.WIDGET_WALLET_DISCONNECT_EVENT)
    }
  }, [selectedWallet])

  useEffect(() => {
    if (connectToNetwork) {
      network.activate()
    }
  }, [connectToNetwork])

  return (
    <Web3ReactProvider connectors={initialConnectors}>
      <WalletContext.Provider value={{ selectedWallet, setSelectedWallet, handleConnect }}>
        <OfacBan>{children}</OfacBan>
      </WalletContext.Provider>
    </Web3ReactProvider>
  )
}
