import type { NextPage } from 'next'
import { useCallback } from 'react'
import { useWallet, MetamaskConnector, WalletConnectConnector, WALLETS, getWalletForConnector } from 'web3react-v8-ian'
import styles from '../styles/Home.module.css'

const Home: NextPage = () => {
  const { setSelectedWallet, connectors, priorityWallet } = useWallet()
  console.log(connectors)
  console.log('priorty', priorityWallet)
  const metamaskHooks = connectors[1][1]
  const mb = metamaskHooks.useAccount()
  console.log(mb)
  const tryActivation = useCallback(async (connector: any) => {
    const wallet = getWalletForConnector(connector)
    console.log(wallet)
    try {
      await connector.activate().catch((err: any) => {
        console.log(err)
      })
      setSelectedWallet(wallet as any)
    } catch (error) {
      console.debug(`web3-react connection error: ${error}`)
    }
  }, [])

  return (
    <div className={styles.container}>
      {connectors
        .filter((connec) => getWalletForConnector(connec[0]) !== 'NETWORK')
        .map((connec) => {
          return (
            <div>
              <button
                onClick={() => {
                  tryActivation(connec[0])
                }}
              >
                activate
              </button>
            </div>
          )
        })}
    </div>
  )
}

export default Home
