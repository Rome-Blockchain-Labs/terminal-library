import { useWeb3React, Web3ReactHooks, Web3ReactProvider } from '@web3-react/core'
import React, { useEffect, useState, ReactNode, useMemo } from 'react'
import { AddEthereumChainParameter, Connector } from '@web3-react/types'
import { ethers } from 'ethers'
import { RomeEventType, widgetBridge } from '@romeblockchain/bridge'
import bannedAccounts from '../../src/bannedAccounts.json'
import { Connection, ConnectionType, networkConnection } from '../connection/connectors'
import { getConnectionName } from '../connection/utils'
import useOrderedConnections from '../hooks/useOrderedConnections'

export interface IWalletContext {
  setSelectedWallet: (ConnectionType: undefined) => void
  selectedWallet: ConnectionType | undefined
  handleConnect: (connector: Connector, chainParams?: AddEthereumChainParameter) => Promise<void>
  loading: boolean
}

export const WalletContext = React.createContext<IWalletContext>({
  setSelectedWallet: () => {},
  selectedWallet: undefined,
  handleConnect: async () => {},
  loading: false,
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

export const WalletProvider = ({ children, connectToNetwork }: { children: ReactNode; connectToNetwork?: boolean }) => {
  const [selectedWallet, setSelectedWallet] = useState<ConnectionType>()
  const [loading, setLoading] = useState(false)

  const connections = useOrderedConnections(selectedWallet)

  const handleConnect = async (connector: Connector, chainParams?: AddEthereumChainParameter) => {
    const chainIdInput = chainParams && chainParams.chainId
    const chainIdInputHex = chainIdInput && ethers.utils.hexValue(chainIdInput)

    setLoading(true)

    try {
      // error would return true if user rejects the wallet connection request
      // if network doesnt exist yet connector.activate would not throw an error and still successsfully activate
      await connector.activate(chainIdInput)
      // activate needs to occur before wallet_addEthereumChain because we can only make requests with an active
      // connector.
      console.log(connector.provider, 'provider')
      // only trigger addethereumchain and switchethereumchain for wallet connect connector
      // calling wallet_addEthereumChain will check if the chainId is already present in the wallet
      // if the chainId alreaady exists then it wont add the duplicate network to the wallet
      await connector.provider?.request({
        method: 'wallet_addEthereumChain',
        params: [
          {
            ...chainParams,
            chainId: chainIdInputHex,
          },
        ],
      })

      await connector.provider?.request({
        method: 'wallet_switchEthereumChain',
        params: [
          {
            chainId: chainIdInputHex,
          },
        ],
      })

      const accounts =
        connector.provider &&
        ((await connector.provider.request({
          method: 'eth_requestAccounts',
        })) as string[])

      widgetBridge &&
        accounts &&
        widgetBridge.sendWalletConnectEvent(RomeEventType.WIDGET_WALLET_CONNECT_EVENT, {
          address: accounts[0],
          wallet: ConnectionType as any,
        })
    } catch (error: any) {
      throw new Error('Unable to connect to wallet. error:', error)
    }

    setLoading(false)
  }

  useEffect(() => {
    if (!selectedWallet && widgetBridge) {
      widgetBridge.sendWalletDisconnectEvent(RomeEventType.WIDGET_WALLET_DISCONNECT_EVENT)
    }
  }, [selectedWallet])

  useEffect(() => {
    if (connectToNetwork) {
      networkConnection.connector.activate()
    }
  }, [connectToNetwork])

  const key = useMemo(() => connections.map(({ type }: Connection) => getConnectionName(type)).join('-'), [connections])

  const connectors: [Connector, Web3ReactHooks][] = connections.map(({ hooks, connector }) => [connector, hooks])
  return (
    <Web3ReactProvider connectors={connectors} key={key}>
      <WalletContext.Provider value={{ selectedWallet, setSelectedWallet, handleConnect, loading }}>
        <OfacBan>{children}</OfacBan>
      </WalletContext.Provider>
    </Web3ReactProvider>
  )
}
