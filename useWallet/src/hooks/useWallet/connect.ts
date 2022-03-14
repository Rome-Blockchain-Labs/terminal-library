import type { Web3ReactHooks } from '@web3-react/core';
import type { MetaMask } from '@web3-react/metamask';
import { Network } from '@web3-react/network';
import { useCallback, useState } from 'react';
import { generateChains, getAddChainParameters, generateURLS } from './chains';

// interface IConnect {
//   chainId: number;
//   switchChain: (chainId: number) => void | undefined;
//   displayDefault: boolean;
//   chainIds: number[];
// }

// function Connect({ chainId, switchChain, displayDefault, chainIds }: IConnect) {
//   const handleChainChange = (chainID: number) => {
//     switchChain(chainID);
//   };
// }

interface IConnectSelect {
  connector: MetaMask | Network;
  chainId: ReturnType<Web3ReactHooks['useChainId']>;
  infuraKey: string;
  alchemyKey: string;
}

export default function useConnect({
  connector,
  chainId,
  infuraKey,
  alchemyKey,
}: IConnectSelect) {
  const CHAINS = generateChains({ alchemyKey, infuraKey });
  const URLS = generateURLS(CHAINS);
  const isNetwork = connector instanceof Network;
  // const displayDefault = !isNetwork;
  // const chainIds = (isNetwork ? Object.keys(URLS) : Object.keys(CHAINS)).map(
  //   (chainId) => Number(chainId),
  // );

  const switchChain = useCallback(
    async (desiredChainId: number) => {
      // setDesiredChainId(desiredChainId);
      // if we're already connected to the desired chain, return
      if (desiredChainId === chainId) return;
      // if they want to connect to the default chain and we're already connected, return
      if (desiredChainId === -1 && chainId !== undefined) return;

      if (connector instanceof Network) {
        await connector.activate(desiredChainId === -1 ? undefined : desiredChainId);
      } else {
        await connector.activate(
          desiredChainId === -1
            ? undefined
            : getAddChainParameters({ CHAINS, chainId: desiredChainId }),
        );
      }
    },
    [connector, chainId],
  );

  const disconnect = connector.deactivate();
  return {
    disconnect,
    switchChain,
  };
}
