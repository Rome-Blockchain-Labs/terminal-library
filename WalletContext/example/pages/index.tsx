import { getAddChainParameters, SUPPORTED_WALLETS, useWallets, useWeb3React } from '@romeblockchain/wallet'
import Head from 'next/head'
import styles from '../styles/Home.module.css'
const ethparams = getAddChainParameters(1)
const avaxparams = getAddChainParameters(43114)

export default function Home() {
  const { handleConnect, selectedWallet, setSelectedWallet } = useWallets()
  const { account, connector } = useWeb3React()
  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <meta name='description' content='Generated by create next app' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <div>
        <div>{account}</div>
        {account && (
          <button
            onClick={() => {
              if (connector?.deactivate) {
                void connector.deactivate()
              } else {
                void connector.resetState()
              }
            }}
          >
            disconnect
          </button>
        )}
        <div>connect to ethereum</div>
        {Object.keys(SUPPORTED_WALLETS).map((key, index) => {
          const wallet = SUPPORTED_WALLETS[key]
          const isActive = selectedWallet === wallet.wallet

          return (
            <button
              style={{
                background: isActive ? 'green' : 'gray',
              }}
              disabled={!!account}
              key={index}
              onClick={async () => {
                try {
                  console.log(ethparams)
                  await handleConnect(wallet, ethparams)
                } catch (error) {
                  console.log(error)
                }
              }}
            >
              {wallet.wallet}
            </button>
          )
        })}
      </div>
      <div>connect to avalanche</div>
      <div>
        {Object.keys(SUPPORTED_WALLETS).map((key, index) => {
          const wallet = SUPPORTED_WALLETS[key]
          const isActive = selectedWallet === wallet.wallet

          return (
            <button
              style={{
                background: isActive ? 'green' : 'gray',
              }}
              disabled={!!account}
              key={index}
              onClick={async () => {
                try {
                  await handleConnect(wallet, avaxparams)
                } catch (error) {
                  console.log(error)
                }
              }}
            >
              {wallet.wallet}
            </button>
          )
        })}
      </div>
    </div>
  )
}
