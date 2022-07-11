import { Web3ReactProvider } from '@web3-react/core'
import { Connector } from '@web3-react/types'
import { injected, network, Wallet } from '../hooks/useConnectors'
import React, { ReactNode, useEffect } from 'react'
import { useLocalStorage } from 'usehooks-ts'
import { useConnectors, getConnectorForWallet } from '../hooks/useConnectors'

export const WalletContext = React.createContext<WalletContext>({
  setSelectedWallet: () => {},
})

type WalletContext = {
  setSelectedWallet: (wallet: Wallet) => void
}

interface WalletProviderProps {
  children: ReactNode
}

export default function WalletProvider({ children }: WalletProviderProps) {
  const [selectedWallet, setSelectedWallet] = useLocalStorage<Wallet | null>('selectedWallet', null)

  const connectors = useConnectors(selectedWallet)

  const connect = async (connector: Connector) => {
    try {
      if (connector.connectEagerly) {
        await connector.connectEagerly()
      } else {
        await connector.activate()
      }
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
      connect(getConnectorForWallet(selectedWallet))
    }
    // The dependency list is empty so this is only run once on mount
    // eslint-disable-line react-hooks/exhaustive-deps
  }, [])

  return (
    <WalletContext.Provider
      value={{
        setSelectedWallet,
      }}
    >
      <Web3ReactProvider connectors={connectors}>{children}</Web3ReactProvider>
    </WalletContext.Provider>
  )
}
