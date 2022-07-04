import { FC, ReactNode } from 'react';

import {
  Accordion,
  AccordionItem,
  AccordionItemHeading,
  AccordionItemButton,
  AccordionItemPanel,
} from 'react-accessible-accordion';
export { Accordion, AccordionItem, AccordionItemHeading, AccordionItemButton, AccordionItemPanel };

import { TokenPair } from './searchbar/redux/types';

type CustomWrapperType = {
  backgroundColor?: string;
  borderRadius?: string;
  border?: string;
  button?: {
    borderColor?: string;
    backColor?: string;
    color?: string;
    borderRadius?: string;
    fontSize?: string;
    padding?: string;
    hoverBackColor?: string;
  };
};

type CustomSearchInputType = {
  input?: {
    width?: string;
    height?: string;
    border?: string;
    color?: string;
    display?: string;
    borderRadius?: string;
    background?: string;
    padding?: string;
    fontSize?: string;
    fontFamily?: string;
  };

  icon?: {
    right?: string;
    top?: string;
    height?: number;
    width?: number;
    color?: string;
    activeColor?: string;
  };

  placeholder?: string;
};

type CustomSearchFilterType = {
  wrapper?: {
    backgroundColor?: string;
    borderRadius?: string;
    toggleColor?: string;
    toggleHeight?: string;
    toggleWidth?: string;
    toggleMarginRight?: string;
    toggleLeft?: string;
    toggleTop?: string;
    toggleBorderBottom?: string;
    toggleBorderRight?: string;
    contentBorder?: string;
    contentBorderRadius?: string;
    margin?: string;
  };

  content?: {
    network?: string;
    exchange?: string;
    header?: {
      display?: string;
      justifyContent?: string;
      alignItems?: string;
      width?: string;
      border?: string;
      backgroundColor?: string;
      color?: string;
      padding?: string;
      textAlign?: string;
      margin?: string;
      borderRadius?: string;
      fontSize?: string;
      fontWeight?: string;
      hoverColor?: string;
    };
    wrapper?: {
      justifyContent?: string;
      alignItems?: string;
      padding?: string;
      backgroundColor?: string;
      borderRadius?: string;
    };
    content?: {
      justifyContent?: string;
      alignItems?: string;
      padding?: string;
    };
    description?: {
      textAlign?: string;
      fontSize?: string;
      fontWeight?: string;
      padding?: string;
      backgroundColor?: string;
      color?: string;
    };
  };
};

type CustomResultType = {
  title?: {
    color?: string;
    fontSize?: string;
    padding?: string;
    margin?: string;
    fontSize2?: string;
  };
  content?: {
    padding?: string;
    background?: string;
    borderRadius?: string;
    width?: string;
    height?: string;
    border?: string;
    color?: string;
    display?: string;
    borderColor?: string;
    borderStyle?: string;
    borderWidth?: string;
    fontSize?: string;
    fontFamily?: string;
  };
};

type CustomLoadingType = {
  loadingTitle?: string;
  notFoundTitle?: string;
  color?: string;
  fontSize?: string;
};

type CustomChipType = {
  fontSize?: string;
  fontWeight?: string;
  borderRadius?: string;
  backgroundColor?: string;
  border?: string;
  padding?: string;
  margin?: string;
  defaultColor?: string;
  width?: string;
  height?: string;
  textAlign?: string;
  textTransform?: string;
  gridTemplateColumns?: string;
  justifySelf?: string;
  checkedBorderColor?: string;
  checkedColor?: string;
  checkedBackgroundColor?: string;
};

type CustomAllChipType = {
  fontSize?: string;
  fontWeight?: string;
  borderRadius?: string;
  backgroundColor?: string;
  border?: string;
  padding?: string;
  margin?: string;
  defaultColor?: string;
  width?: string;
  height?: string;
  textAlign?: string;
  textTransform?: string;
  gridTemplateColumns?: string;
  justifySelf?: string;
};

type CustomTokenDetailType = {
  list?: {
    container?: {
      display?: string;
      alignItems?: string;
      padding?: string;
      background?: string;
      borderBottom?: string;
      gridTemplateColumns?: string;
    };

    token?: {
      color?: string;
      fontSize?: string;
      fontWeight?: string;
      padding?: string;
    };

    pair?: {
      color?: string;
      fontSize?: string;
    };

    detail?: {
      padding?: string;
    };
  };
  details?: {
    content?: {
      display?: string;
      alignItems?: string;
      padding?: string;
      margin?: string;
      background?: string;
      borderBottom?: string;
      borderRadius?: string;
      fontSize?: string;
      gridTemplateColumns?: string;
    };

    token?: {
      fontSize?: string;
      fontWeight?: string;
    };

    address?: {
      fontSize?: string;
    };

    detail?: {
      fontSize?: string;
    };
  };
};

export type ActionComponentType = {
  detail: TokenPair
};

export type NetworkId = 'ethereum' | 'avalanche' | 'bsc' | 'moonriver' | 'moonbeam';
export type ExchangeName =
  | 'uniswapv2'
  | 'uniswapv3'
  | 'sushiswap'
  | 'pangolin'
  | 'traderjoe'
  | 'pancakeswap'
  | 'safeswap'
  | 'kyberdmm'
  | 'zeroexchange'
  | 'yetiswap'
  | 'baguette'
  | 'canary'
  | 'lydiafinance'
  | 'elkfinance'
  | 'pandaswap'
  | 'complusnetwork'
  | 'oliveswap'
  | 'mdex'
  | 'ellipsis.finance'
  | 'biswap'
  | 'apeswap'
  | 'knightswap.finance'
  | 'babyswap'
  | 'synapse'
  | 'beamswap'
  | 'solarflare'
  | 'stellaswap'
  | 'zenlink'
  | 'solarbeam'
  | 'shibaswap'
  | 'quickswap'
  | 'solidex'
  | 'spookyswap'
  | 'spiritswap'
  | 'vvs.finance'
  | 'mm.finance'
  | 'cronaswap'
  | 'crodex'
  | 'cyborgswap'
  | 'hermesprotocol';

export type ExchangeType = {
  name: ExchangeName;
  title?: string;
  icon?: ReactNode;
};

export type NetworkType = {
  id: NetworkId;
  name?: string;
  icon?: ReactNode;
  exchanges: ExchangeType[];
};

export type RenderProps = {
  customWrapper?: CustomWrapperType;
  customSearchInput?: CustomSearchInputType;
  customSearchFilter?: CustomSearchFilterType;
  customChip?: CustomChipType;
  customResult?: CustomResultType;
  customTokenDetail?: CustomTokenDetailType;
  customLoading?: CustomLoadingType;
  customActions?: Array<FC<ActionComponentType>>;
  customAllChip?: CustomAllChipType;
  networks: Array<NetworkType>;
};
