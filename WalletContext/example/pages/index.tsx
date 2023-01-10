import Head from 'next/head'
import styles from '../styles/Home.module.css'
import { getAddChainParameters, useWallets, useWeb3React, ConnectionList } from '@romeblockchain/wallet'

const ethparams = getAddChainParameters(1)
const avaxparams = getAddChainParameters(43114)

export default function Home() {
  const { handleConnect, selectedWallet, loading } = useWallets()
  const { account, connector } = useWeb3React()
  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <meta name='description' content='Generated by create next app' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <div>
        {loading && <div>Currently connecting to wallet</div>}
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
        {ConnectionList.map((c, index) => {
          const isActive = selectedWallet === c.type

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
                  console.log(c)
                  await handleConnect(c.connector, ethparams as any)
                } catch (error) {
                  console.log(error)
                }
              }}
            >
              {c.type}
            </button>
          )
        })}
      </div>
      <div>connect to avalanche</div>

      {ConnectionList.map((c, index) => {
        const isActive = selectedWallet === c.type

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
                await handleConnect(c.connector, avaxparams as any)
              } catch (error) {
                console.log(error)
              }
            }}
          >
            {c.type}
          </button>
        )
      })}
    </div>
  )
}
