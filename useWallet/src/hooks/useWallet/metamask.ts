import { hooks, metaMask } from './connectors/metaMask';
import { useEffect } from 'react';
import useConnect from './connect';

export function useMetaMask({
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
    void metaMask.connectEagerly();
  }, []);
  const { switchChain, disconnect } = useConnect({
    connector: metaMask,
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
