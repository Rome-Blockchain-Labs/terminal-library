import { FC } from 'react';
import { NetworkName, WalletName } from './constants';
declare type ProviderProps = Record<string, unknown>;
declare type WalletsContextState = {
    chainId: number | undefined;
    isOnNetwork: (networkName: NetworkName) => boolean;
    switchNetwork: (networkName?: NetworkName | undefined) => void;
    promptWalletChange: () => void;
    cancelWalletChangePrompt: () => void;
    promptingWalletChange: boolean;
    active: boolean;
    connectToWallet: (walletName: WalletName) => void;
    disconnectFromWallet: () => void;
    walletName: WalletName;
    library: any;
};
export declare const WalletsContextProvider: FC<ProviderProps>;
export declare function useWallets(): WalletsContextState;
export {};
