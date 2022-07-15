import './App.css'
import { MetaMask } from '@web3-react/metamask'
import { Network } from '@web3-react/network'
import { WalletConnect } from '@web3-react/walletconnect'

import { SUPPORTED_WALLETS, useWeb3React , useWallets } from "@romeblockchain/wallet""

function App() {
  const { connector, account } = useWeb3React()
  const { setSelectedWallet } = useWallets()
  return (
    <>
      <div style={{ display: 'flex', width: '100%', padding: '2.5rem' }}>
        <div
          style={{
            width: '50%',
            border: '1px solid black',
            marginRight: 'auto',
            marginLeft: 'auto',
          }}
        >
          <div>Priority Wallet</div>
          <div>{getName(connector)}</div>
          <div>Account: {account}</div>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'center' }}>
        {Object.keys(SUPPORTED_WALLETS).map((key) => {
          const wallet = SUPPORTED_WALLETS[key]
          const activeWallet = getName(connector) === wallet.name
          const activeColor = activeWallet ? 'lightblue' : 'gray'
          return (
            <button
              style={{ backgroundColor: activeColor, width: '40%', height: '50px' }}
              onClick={() => {
                setSelectedWallet(wallet.wallet)
                wallet.connector.activate()
              }}
            >
              {activeWallet ? `Connected to ${wallet.name}` : `Connect to ${wallet.name}`}
            </button>
          )
        })}
      </div>
    </>
  )
}

export default App

export function getName(connector) {
  if (connector instanceof MetaMask) return 'MetaMask'
  if (connector instanceof WalletConnect) return 'WalletConnect'
  if (connector instanceof Network) return 'Network'
  return 'Unknown'
}
