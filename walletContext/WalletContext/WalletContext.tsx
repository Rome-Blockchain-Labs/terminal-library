import { useWeb3React } from '@web3-react/core'
import { InjectedConnector } from '@web3-react/injected-connector'
import { createContext, FC, useContext, useEffect, useState } from 'react'
import { isMobile } from 'react-device-detect'
import { injected } from '../connectors'
import {
  getChainHexByNetworkName,
  getNetworkByNetworkName,
  NetworkName,
  WalletName,
} from './constants'
import { getChainIdByNetworkName } from './constants'

const injectedProvider = new InjectedConnector({})

type ProviderProps = Record<string, unknown>

type WalletsContextState = {
  chainId: number | undefined
  isOnNetwork: (networkName: NetworkName) => boolean
  switchNetwork: (networkName?: NetworkName | undefined) => void
  promptWalletChange: () => void
  cancelWalletChangePrompt: () => void
  promptingWalletChange: boolean
  active: boolean
  connectToWallet: (walletName: WalletName) => void
  disconnectFromWallet: () => void
  walletName: WalletName
  library: any
}

const defaultState: WalletsContextState = {
  active: false,
  cancelWalletChangePrompt: () => {
    return {}
  },
  chainId: 43114,
  connectToWallet: () => {
    console.log('hello')
    return {}
  },
  disconnectFromWallet: () => {
    return {}
  },

  isOnNetwork: () => false,
  /** promptWalletChange
   * no argument should open all wallets for selection, followed by network selection
   * When given a networkName argument:
   * if currentWallet supports network, change network
   * if currentWallet doesn't support network, show UI to select from wallet supporting the network
   * **/
  promptWalletChange: () => {
    return {}
  },
  promptingWalletChange: false,
  switchNetwork: () => {
    return {}
  },
  walletName: 'metamask',
  library: null,
}

const WalletsContext = createContext<WalletsContextState>(defaultState)

export const WalletsContextProvider: FC<ProviderProps> = (props) => {
  const { activate, active, chainId, deactivate, library } = useWeb3React()
  const [promptingWalletChange, setPromptingWalletChange] = useState(false)
  const promptWalletChange = () => setPromptingWalletChange(true)
  const cancelWalletChangePrompt = () => setPromptingWalletChange(false)

  useEffect(() => {
    injected.isAuthorized().then((isAuthorized) => {
      if (isAuthorized || (isMobile && window.ethereum)) {
        activate(injected)
        // next line is a for for: https://giters.com/NoahZinsmeister/web3-react/issues/257
        window?.ethereum?.removeAllListeners(['networkChanged'])
      }
    })
  }, [activate])

  const isOnNetwork = (expectedNetworkName: NetworkName) =>
    getChainIdByNetworkName(expectedNetworkName) === chainId
  const switchNetwork = async (networkName: NetworkName | undefined) => {
    if (!active || !networkName) {
      promptWalletChange()
    } else {
      console.log(networkName)
      //todo make this more generic -- ie switch network for non evm
      await window?.ethereum
        ?.request({
          method: 'wallet_switchEthereumChain',

          params: [{ chainId: getChainHexByNetworkName(networkName) }],
        })
        .catch((err: any) => {
          console.log(err)
          const { blockExplorerUrl, chainHex, name, nativeCurrency, rpcUrl } =
            getNetworkByNetworkName(networkName)

          window?.ethereum?.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                blockExplorerUrls: [blockExplorerUrl],
                chainId: chainHex,
                chainName: name,
                nativeCurrency,
                rpcUrls: [rpcUrl],
              },
            ],
          })
        })
      cancelWalletChangePrompt()
    }
  }
  const connectToWallet = async (wallet: WalletName) => {
    console.log('connecting')
    //todo handle more wallets

    await activate(injectedProvider)
    // next line is a for for: https://giters.com/NoahZinsmeister/web3-react/issues/257
    window?.ethereum?.removeAllListeners(['networkChanged'])
    cancelWalletChangePrompt()
    switchNetwork('Ethereum')
  }
  const disconnectFromWallet = () => deactivate()

  return (
    <WalletsContext.Provider
      value={{
        active,
        cancelWalletChangePrompt,
        chainId,
        connectToWallet,
        disconnectFromWallet,
        isOnNetwork,
        promptWalletChange,
        promptingWalletChange,
        switchNetwork,
        walletName: 'metamask',
        library,
      }}
    >
      {props.children}
    </WalletsContext.Provider>
  )
}

export function useWallets() {
  const context = useContext(WalletsContext)
  if (context === undefined) {
    throw new Error('useWallets must be used within a useWalletsProvider')
  }
  return context
}
