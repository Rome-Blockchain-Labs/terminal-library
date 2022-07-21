import { initializeConnector } from '@web3-react/core'
import { WalletConnect } from '@web3-react/walletconnect'
import { generateURLS } from '../chains'

export const initializeWalletConnectConnector = (INFURA_KEY: string | undefined, ALCHEMY_KEY: string | undefined) => {
  const URLS = generateURLS(INFURA_KEY, ALCHEMY_KEY)
  const [walletConnect, hooks] = initializeConnector<WalletConnect>(
    (actions) =>
      new WalletConnect({
        actions,
        options: {
          rpc: URLS,
        },
      }),
  )
  return { walletConnect, walletConnectHooks: hooks }
}
