import { hooks, network } from './connectors/network';
import { useEffect } from 'react';
import useConnect from './connect';

export function useNetwork({
  infuraKey,
  alchemyKey,
}: {
  infuraKey: string;
  alchemyKey: string;
}) {
  const {
    useChainId,
    useAccounts,
    useError,
    useIsActivating,
    useIsActive,
    useProvider,
    useENSNames,
  } = hooks;

  const chainId = useChainId();
  const accounts = useAccounts();
  const error = useError();
  const isActivating = useIsActivating();
  const isActive = useIsActive();
  const provider = useProvider();
  const ENSNames = useENSNames(provider);

  useEffect(() => {
    void network.activate();
  }, []);

  const { switchChain, disconnect } = useConnect({
    connector: network,
    chainId,
    infuraKey,
    alchemyKey,
  });
  return {
    accounts,
    switchChain,
    disconnect,
    isActivating,
    isActive,
    provider,
    ENSNames,
    error,
  };
}
