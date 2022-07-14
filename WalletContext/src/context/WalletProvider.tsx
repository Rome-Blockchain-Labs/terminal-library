import { Connector } from '@web3-react/types'
import { injected, network, useConnectors, Wallet, Web3ReactConnector } from '../hooks/useConnectors'
import React, { ReactNode, useEffect } from 'react'
import { Web3ReactHooks } from '@web3-react/core'
import useLocalStorage from '../hooks/useLocalStorage'

export const WalletContext = React.createContext<WalletContext>({
  setSelectedWallet: () => {},
  connectors: [],
  priorityWallet: {
    connector: null,
    hooks: null,
    wallet: null,
  },
})

type WalletContext = {
  setSelectedWallet: React.Dispatch<React.SetStateAction<Wallet | null>>
  connectors: Web3ReactConnector[]
  priorityWallet: {
    connector: Connector | null
    hooks: Web3ReactHooks | null
    wallet: Wallet | null
  }
}

interface WalletProviderProps {
  children: ReactNode
}

export default function WalletProvider({ children }: WalletProviderProps) {
  const [selectedWallet, setSelectedWallet] = useLocalStorage('wallet', null)
  const connectors = useConnectors(selectedWallet)
  const priorityWallet = connectors[0]

  const connect = async (connector: Connector) => {
    try {
      await connector.activate()
    } catch (error) {
      console.debug(`web3-react eager connection error: ${error}`)
    }
  }

  useEffect(() => {
    const load = async () => {
      const UAParser = (await import('ua-parser-js')).default

      const parser = new UAParser(window.navigator.userAgent)
      const { type } = parser.getDevice()
      const isMobile = type === 'mobile' || type === 'tablet'
      const isMetaMask = !!window.ethereum?.isMetaMask
      if (isMobile && isMetaMask) {
        injected.activate()
      }
    }

    connect(network)
    load()
    if (selectedWallet) {
      const connector = connectors.find((c) => c.wallet === selectedWallet)?.connector
      if (connector) {
        connect(connector)
      }
    }
    // The dependency list is empty so this is only run once on mount
    // eslint-disable-line react-hooks/exhaustive-deps
  }, [])

  return (
    <WalletContext.Provider
      value={{
        setSelectedWallet,
        connectors,
        priorityWallet,
      }}
    >
      {children}
    </WalletContext.Provider>
  )
}
