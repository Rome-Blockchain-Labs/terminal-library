import * as ethers from 'ethers';
export declare type NetworkName = 'Ethereum' | 'Avalanche' | 'BSC' | 'Rinkeby';
export declare type WalletName = 'metamask';
declare type Network = {
    chainHex: string;
    chainId: number;
    name: NetworkName;
    provider: ethers.providers.BaseProvider;
    supportingWallets: Array<WalletName>;
    blockExplorerUrl: string;
    nativeCurrency: {
        decimals: number;
        name: string;
        symbol: string;
    };
    rpcUrl: string;
};
export declare const getNetworkByNetworkName: (networkName: NetworkName) => Network;
export declare const getChainHexByNetworkName: (networkName: NetworkName) => string;
export declare const getChainIdByNetworkName: (networkName: NetworkName) => number;
export declare const getProviderForNetworkName: (networkName: NetworkName) => ethers.ethers.providers.BaseProvider;
export declare const getNetworkNameFromChainHex: (chainHex: string) => NetworkName;
export declare const getNetworkNameFromChainId: (chainId: number) => "unknown" | NetworkName;
export declare const getSupportedNetworksNameByWallet: (walletName: WalletName) => NetworkName[];
export {};
