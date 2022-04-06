interface Token {
    decimals: number;
    id: string;
    name: string;
    symbol: string;
    image: string;
    tradingVolume: string;
    balance: number;
    amount: number;
    allowance: number;
    usd: number;
}
declare type TokenPair = {
    id: string;
    token0: Token;
    token0Price: string;
    token1: Token;
    token1Price: string;
    volumeToken0: string;
    volumeToken1: string;
    volumeUSD: string;
};
export declare type TokenSearchState = {
    searchText: string;
    suggestions: Array<any>;
    isLoading: boolean;
    fetchError: string | null;
    isSelecting: boolean;
    selectedPair: TokenPair | undefined;
    pairSearchTimestamp: number;
    serializedTradeEstimator: string;
    exchangeMap: any;
    networkMap: any;
};
export {};
