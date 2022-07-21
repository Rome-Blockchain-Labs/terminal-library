import { initializeConnector } from '@web3-react/core'
import { Network } from '@web3-react/network'
import { generateURLS } from '../chains'

export const initializeNetworkConnector = (INFURA_KEY: string | undefined, ALCHEMY_KEY: string | undefined) => {
  const URLS = generateURLS(INFURA_KEY, ALCHEMY_KEY)
  const [network, hooks] = initializeConnector<Network>((actions) => new Network({ actions, urlMap: URLS }))
  return { network, networkHooks: hooks }
}
