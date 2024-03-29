import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { WalletProvider } from '@romeblockchain/wallet'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <WalletProvider>
      <Component {...pageProps} />
    </WalletProvider>
  )
}
