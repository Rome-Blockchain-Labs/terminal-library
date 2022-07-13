import { Connector } from '@web3-react/types'
import { getHooksForWallet, injected, network } from '../hooks/useConnectors'
import React, { ReactNode, useEffect, useState } from 'react'
import { getConnectorForWallet } from '../hooks/useConnectors'
import { MetaMask } from '@web3-react/metamask'
import { WalletConnect } from '@web3-react/walletconnect'
import { Network } from '@web3-react/network'
import { Web3ReactHooks } from '@web3-react/core'

export const WalletContext = React.createContext<WalletContext>({
  setSelectedWallet: () => {},
  connector: null,
  hooks: null,
})

type WalletContext = {
  setSelectedWallet: React.Dispatch<React.SetStateAction<Wallet | null>>
  connector: MetaMask | WalletConnect | Network | null
  hooks: Web3ReactHooks | null
}

interface WalletProviderProps {
  children: ReactNode
}
export enum Wallet {
  INJECTED = 'INJECTED',
  COINBASE_WALLET = 'COINBASE_WALLET',
  WALLET_CONNECT = 'WALLET_CONNECT',
  FORTMATIC = 'FORTMATIC',
  NETWORK = 'NETWORK',
  GNOSIS_SAFE = 'GNOSIS_SAFE',
}
export default function WalletProvider({ children }: WalletProviderProps) {
  const [selectedWallet, setSelectedWallet] = useState<Wallet | null>(null)
  const connector = getConnectorForWallet(selectedWallet)
  const hooks = getHooksForWallet(selectedWallet)

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
    if (selectedWallet) {
      window.localStorage.setItem('wallet', selectedWallet)
    }
  }, [selectedWallet])

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
        connector,
        hooks,
      }}
    >
      {children}
    </WalletContext.Provider>
  )
}
