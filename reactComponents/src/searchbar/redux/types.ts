import { NetworkId, ExchangeName } from '../../types';
export interface Token {
  decimals: number;
  id: string;
  name: string;
  symbol: string;
  image: string;
  address: string;
  tradingVolume: string;  
  balance: number;
  amount: number;
  allowance: number;
  usd: number;
}

type NetworkItemType = {
  [key in NetworkId]?: boolean;
};
type ExchangeItemType = {
  [key in ExchangeName]?: boolean;
};

export type TokenPair = {
  id: string;
  token0: Token;
  token0Price: string;
  token1: Token;
  token1Price: string;
  volumeToken0: string;
  volumeToken1: string;
  volumeUSD: string;
  network: string;
  exchange: string;
};

export type TokenSearchState = {
  searchText: string;
  suggestions: Array<any>;
  suggestionRendered: Array<any>;
  page: number;
  isLoading: boolean;
  fetchError: string | null;
  isSelecting: boolean;
  selectedPair: TokenPair | undefined;
  pairSearchTimestamp: number;
  serializedTradeEstimator: string;
  exchangeMap: ExchangeItemType;
  networkMap: NetworkItemType;
  viewResult: boolean;
};
