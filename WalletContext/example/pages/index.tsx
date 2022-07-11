import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import { useActiveWeb3React, useWallet } from 'web3react-v8-ian'
import styles from '../styles/Home.module.css'

const Home: NextPage = () => {
  const { connector } = useActiveWeb3React()
  const { setSelectedWallet } = useWallet()
  return <div className={styles.container}></div>
}

export default Home
