var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));

// src/searchbar/index.tsx
import React11 from "react";
import { Provider } from "react-redux";

// src/searchbar/redux/store.ts
import {
  configureStore,
  getDefaultMiddleware
} from "@reduxjs/toolkit";

// src/searchbar/redux/tokenSearchSlice.ts
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import retry from "async-retry";
import { stringify as stringify2 } from "flatted";

// src/searchbar/tokenSearch/helpers/async.ts
import BN from "bignumber.js";
import { stringify } from "flatted";
import { gql } from "graphql-request";

// src/searchbar/tokenSearch/helpers/graphqlClients.ts
import { GraphQLClient } from "graphql-request";

// src/searchbar/tokenSearch/helpers/config.ts
import { uniq } from "lodash";
var romeTokenSyncUri = String(process.env.REACT_APP_HASURA_API_ENDPOINT_WS || "https://romenet.prod.velox.global/v1/graphql").replace("ws", "http");
var maxHits = Number(process.env.REACT_APP_SEARCH_ASYNC_DATASET_LENGTH_MAXIMUM || 500);
var minStringSearch = Number(process.env.REACT_APP_SEARCH_INPUT_LENGTH_MINIMUM || 3);
var AvalanchePairs = [
  ["avalanche", "baguette"],
  ["avalanche", "canary"],
  ["avalanche", "complusnetwork"],
  ["avalanche", "elkfinance"],
  ["avalanche", "kyberdmm"],
  ["avalanche", "lydiafinance"],
  ["avalanche", "oliveswap"],
  ["avalanche", "pandaswap"],
  ["avalanche", "pangolin"],
  ["avalanche", "sushiswap"],
  ["avalanche", "traderjoe"],
  ["avalanche", "yetiswap"],
  ["avalanche", "zeroexchange"]
];
var BSCPairs = [
  ["bsc", "apeswap"],
  ["bsc", "babyswap"],
  ["bsc", "biswap"],
  ["bsc", "ellipsis.finance"],
  ["bsc", "mdex"],
  ["bsc", "pancakeswap"],
  ["bsc", "safeswap"],
  ["bsc", "sushiswap"]
];
var moonbeamPairs = [
  ["moonbeam", "beamswap"],
  ["moonbeam", "solarflare"],
  ["moonbeam", "stellaswap"],
  ["moonbeam", "sushiswap"]
];
var moonriverPairs = [
  ["moonriver", "solarbeam"],
  ["moonriver", "sushiswap"]
];
var networkExchangePairs = [...BSCPairs, ...AvalanchePairs, ...moonbeamPairs, ...moonriverPairs];
var networkNames = uniq(networkExchangePairs.map((pair) => pair[0]));
var exchangeNames = (networkNames2) => uniq(networkExchangePairs.filter((pair) => networkNames2.includes(pair[0])).map((pair) => pair[1]));

// src/searchbar/tokenSearch/helpers/graphqlClients.ts
var romePairsClient = new GraphQLClient(romeTokenSyncUri);

// src/searchbar/tokenSearch/helpers/async.ts
var getRomeSearchTokenQuery = (networks) => {
  let network;
  let pair_search = ``;
  const networkDatasetLength = Math.round(maxHits / networks.length);
  for (network of networks) {
    pair_search += `
      ${network}:
        ${network}_pair_search(
          where:{
            concat_ws:{_ilike:$searchText}, 
            exchange:{_in:$exchanges}
          }, 
          limit:${networkDatasetLength}, 
          order_by:{ last_24hour_usd_volume:desc_nulls_last }
        ) 
        {
          id:pair_address
          exchange
          token0 {
            address
            symbol
            name
            decimals
            id:address
            image:primary_img_uri
          }
          token1 {
            address
            symbol
            name
            decimals
            id:address
            image:primary_img_uri
          }
          last_24hour_usd_volume
          latest_token0_usd_price
          latest_token1_usd_price
        }`;
  }
  return gql`query SearchTokens($searchText:String!,$exchanges:[String!]!){${pair_search}}`;
};
var searchTokenAsync_Parameters = (searchText, searchExchanges) => {
  return {
    exchanges: [...searchExchanges],
    searchText
  };
};
var searchTokenAsync_searchString = (searchString) => {
  return searchString ? `%${searchString}%` : "%0x%";
};
var searchTokensAsync = async (searchString, searchNetworks, searchExchanges) => {
  let res;
  const searchText = searchTokenAsync_searchString(searchString);
  const parameters = searchTokenAsync_Parameters(searchText, searchExchanges);
  const query = getRomeSearchTokenQuery(searchNetworks);
  try {
    res = await romePairsClient.request(query, parameters);
  } catch (e) {
    throw new Error(`${stringify(e, Object.getOwnPropertyNames(e))}, args:${stringify({ parameters, query })}`);
  }
  const mappedPairs = Object.entries(res).map((network) => {
    network[1].map((result) => result.network = network[0]);
    return network[1];
  }).flat().filter((pair) => pair.token0 && pair.token1).map((pair) => {
    const tokenPrices = pair.latest_token0_usd_price && pair.latest_token1_usd_price ? {
      token0Price: new BN(pair.latest_token1_usd_price).dividedBy(pair.latest_token0_usd_price).toString(),
      token1Price: new BN(pair.latest_token0_usd_price).dividedBy(pair.latest_token1_usd_price).toString()
    } : {
      token0Price: 1,
      token1Price: 1
    };
    return __spreadValues(__spreadProps(__spreadValues({}, pair), {
      volumeUSD: pair.last_24hour_usd_volume
    }), tokenPrices);
  });
  return mappedPairs;
};

// src/searchbar/redux/tokenSearchSlice.ts
import { uniq as uniq2, omitBy } from "lodash";
var setPair = createAsyncThunk("token/setPair", async ({ selectedPair }) => {
  console.log("setPair");
  return selectedPair;
});
var resetSearchOnNewExchange = createAsyncThunk("token/searchReset", async (searchString, thunkAPI) => {
  console.log("resetSearchOnNewExchange");
  thunkAPI.dispatch(searchTokenPairs(""));
});
var setPairSearchTimestamp = createAsyncThunk("token/saveTime", async (timestamp) => {
  return timestamp;
});
var allValueHandler = (networkMap, exchangeMap) => {
  let returnedNetworkMap = networkMap;
  let returnedExchangeMap = exchangeMap;
  if (networkMap.length === 0 || networkMap.includes("All")) {
    returnedNetworkMap = uniq2(networkExchangePairs.map((pair) => pair[0]));
  }
  if (exchangeMap.length === 0 || exchangeMap.includes("All")) {
    returnedExchangeMap = uniq2(networkExchangePairs.map((pair) => pair[1]));
  }
  return [returnedNetworkMap, returnedExchangeMap];
};
var valueCleaner = (networkMap, exchangeMap) => {
  networkMap = Object.keys(omitBy(networkMap, (b) => !b));
  exchangeMap = Object.keys(omitBy(exchangeMap, (b) => !b));
  return [networkMap, exchangeMap];
};
var searchTokenPairs = createAsyncThunk("token/search", async (searchString, thunkAPI) => {
  try {
    let { networkMap, exchangeMap } = thunkAPI.getState();
    let processedNetworks;
    let processedExchanges;
    const pairSearchTimestamp = new Date().getTime();
    thunkAPI.dispatch(setPairSearchTimestamp(pairSearchTimestamp));
    [processedNetworks, processedExchanges] = valueCleaner(networkMap, exchangeMap);
    [processedNetworks, processedExchanges] = allValueHandler(processedNetworks, processedExchanges);
    processedExchanges = processedExchanges.filter((exchange) => networkExchangePairs.filter((pair) => processedNetworks.includes(pair[0]) && pair[1] === exchange).length >= 1);
    processedNetworks = processedNetworks.filter((network) => networkExchangePairs.filter((pair) => pair[0] === network && processedExchanges.includes(pair[1])).length >= 1);
    const data = await retry(() => searchTokensAsync(searchString, processedNetworks, processedExchanges), { retries: 1 });
    console.log("data", data.length);
    return { data, pairSearchTimestamp };
  } catch (e) {
    console.log("err searchTokenPairs", e);
    throw new Error(stringify2(e, Object.getOwnPropertyNames(e)));
  }
});
var initialTimestamp = new Date().getTime();
var initialState = {
  fetchError: null,
  isLoading: false,
  isSelecting: false,
  pairSearchTimestamp: initialTimestamp,
  searchText: "",
  selectedPair: void 0,
  serializedTradeEstimator: "",
  suggestions: [],
  exchangeMap: {},
  networkMap: {}
};
var tokenSearchSlice = createSlice({
  extraReducers: (builder) => {
    builder.addCase(resetSearchOnNewExchange.fulfilled, (state, action) => {
      state.searchText = "";
      state.suggestions = [];
      state.isLoading = true;
      state.fetchError = null;
      state.isSelecting = false;
      state.selectedPair = void 0;
      state.serializedTradeEstimator = "";
    });
    builder.addCase(setPairSearchTimestamp.fulfilled, (state, action) => {
      state.pairSearchTimestamp = action.payload;
    });
    builder.addCase(setPair.fulfilled, (state, action) => {
      state.searchText = "";
      state.isSelecting = false;
      state.selectedPair = action.payload;
    });
    builder.addCase(searchTokenPairs.pending, (state) => {
      state.isLoading = true;
      state.fetchError = null;
    });
    builder.addCase(searchTokenPairs.fulfilled, (state, action) => {
      var _a;
      if (((_a = action.payload) == null ? void 0 : _a.pairSearchTimestamp) >= state.pairSearchTimestamp) {
        state.pairSearchTimestamp = action.payload.pairSearchTimestamp;
        state.suggestions = action.payload.data;
        state.isLoading = false;
        state.fetchError = null;
      }
    });
    builder.addCase(searchTokenPairs.rejected, (state, action) => {
      state.suggestions = [];
      state.isLoading = false;
      state.fetchError = "Something went wrong fetching token pair.";
    });
  },
  initialState,
  name: "tokenSearch",
  reducers: {
    setSearchText: (state, action) => {
      state.searchText = action.payload;
    },
    startSelecting: (state) => {
      state.isSelecting = true;
    },
    stopSelecting: (state) => {
      state.isSelecting = false;
    },
    toggleSelecting: (state) => {
      state.isSelecting = !state.isSelecting;
    },
    setExchangeMap: (state, action) => {
      state.exchangeMap[action.payload.exchangeName] = action.payload.checked;
    },
    setExchangeMapAll: (state, action) => {
      let exchangeName;
      for (exchangeName of action.payload.exchangeNames) {
        if (action.payload.exchangeAll) {
          state.exchangeMap[exchangeName] = true;
        } else {
          delete state.exchangeMap[exchangeName];
        }
      }
      ;
    },
    setNetworkMap: (state, action) => {
      state.networkMap[action.payload.networkName] = action.payload.checked;
    },
    setNetworkMapAll: (state, action) => {
      let networkName;
      for (networkName of action.payload.networkNames) {
        if (action.payload.networkAll) {
          state.networkMap[networkName] = true;
        } else {
          delete state.networkMap[networkName];
        }
      }
      ;
    }
  }
});
var { setSearchText, startSelecting, stopSelecting, toggleSelecting, setExchangeMap, setExchangeMapAll, setNetworkMap, setNetworkMapAll } = tokenSearchSlice.actions;
var tokenSearchSlice_default = tokenSearchSlice.reducer;

// src/searchbar/redux/store.ts
var rootReducer = tokenSearchSlice.reducer;
var store = configureStore({
  devTools: process.env.NODE_ENV !== "production",
  middleware: getDefaultMiddleware({
    immutableCheck: false
  }),
  reducer: rootReducer
});

// src/searchbar/tokenSearch/index.tsx
import React10, { useEffect as useEffect2, useRef } from "react";
import { useDispatch as useDispatch4, useSelector as useSelector6 } from "react-redux";
import "styled-components/macro";

// src/searchbar/tokenSearch/SearchInput.tsx
import React3, { useEffect, useCallback, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled2 from "styled-components";

// src/searchbar/tokenSearch/SearchIcon.tsx
import React, { memo } from "react";
import styled from "styled-components";
var StyledSVG = styled.svg`
  '&:hover': {     
      ${({ hoverColor }) => `stroke: ${hoverColor};`}
     
  }
`;
var SearchIcon = memo(({ active, activeColor, color, height, width }) => /* @__PURE__ */ React.createElement(StyledSVG, {
  height: height != null ? height : 19.519,
  hoverColor: activeColor,
  viewBox: "0 0 19.519 19.519",
  width: width != null ? width : 19.519,
  xmlns: "http://www.w3.org/2000/svg"
}, /* @__PURE__ */ React.createElement("path", {
  d: "M1427.667,779.6l-5.554-5.555a7.774,7.774,0,1,0-1.061,1.06l5.554,5.555a.75.75,0,0,0,1.061-1.06Zm-17.8-10.482a6.258,6.258,0,1,1,6.258,6.257A6.265,6.265,0,0,1,1409.868,769.119Z",
  "data-name": "Search icon",
  stroke: active ? activeColor : color,
  id: "Search_icon",
  transform: "translate(-1408.368 -761.362)"
})));
var SearchIcon_default = SearchIcon;

// src/searchbar/tokenSearch/SearchInput.tsx
import debounce from "lodash.debounce";

// src/searchbar/Context/TokenSearch.tsx
import { createContext } from "react";
var TokenSearchContext = createContext({});
var TokenSearch_default = TokenSearchContext;

// src/searchbar/tokenSearch/SearchInput.tsx
var StyledInput = styled2.input`
  background-color: inherit;
  margin-left: auto;
  margin-right: auto;
  position: relative;

  ${({ props }) => {
  var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l;
  return `
    width: ${((_a = props == null ? void 0 : props.styles) == null ? void 0 : _a.width) || "-webkit-fill-available"};
    border: ${((_b = props == null ? void 0 : props.styles) == null ? void 0 : _b.border) || "none"};   
    color: ${((_c = props == null ? void 0 : props.styles) == null ? void 0 : _c.color) || "#FFF"};
    display: ${((_d = props == null ? void 0 : props.styles) == null ? void 0 : _d.display) || "block"};   
    border-color: ${((_e = props == null ? void 0 : props.styles) == null ? void 0 : _e.borderColor) || "#067c82"};  
    border-style: ${((_f = props == null ? void 0 : props.styles) == null ? void 0 : _f.borderStyle) || "solid"};  
    border-width: ${((_g = props == null ? void 0 : props.styles) == null ? void 0 : _g.borderWidth) || "1px"};  
    border-radius: ${((_h = props == null ? void 0 : props.styles) == null ? void 0 : _h.borderRadius) || "0"};  
    background: ${((_i = props == null ? void 0 : props.styles) == null ? void 0 : _i.background) || "#08333c"};   
    padding: ${((_j = props == null ? void 0 : props.styles) == null ? void 0 : _j.padding) || "11px 15px"};    
    font-size: ${((_k = props == null ? void 0 : props.styles) == null ? void 0 : _k.fontSize) || "15px"};      
    font-family: ${((_l = props == null ? void 0 : props.styles) == null ? void 0 : _l.fontFamily) || "'Fira Code', monospace"};
  `;
}}  
`;
var StyledSearchIconWrapper = styled2.div`  
  cursor: pointer;
  float: right;
  position: absolute;
  ${({ props }) => {
  var _a, _b;
  return `
    right: ${((_a = props == null ? void 0 : props.styles) == null ? void 0 : _a.right) || "15px"};      
    top: ${((_b = props == null ? void 0 : props.styles) == null ? void 0 : _b.top) || "12px"};        
  `;
}}    
`;
var StyledWrapper = styled2.div`
  position: relative;
`;
var SearchInput = () => {
  var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q, _r;
  const dispatch = useDispatch();
  const renderProps = useContext(TokenSearch_default);
  const { customSearchInput } = renderProps;
  const { searchText, networkMap, exchangeMap } = useSelector((state) => state);
  useEffect(() => {
    if (searchText.length >= minStringSearch) {
      dispatch(searchTokenPairs(searchText));
    }
  }, [dispatch, searchText, networkMap, exchangeMap]);
  const onChangeFilter = (event) => {
    const value = event.target.value;
    dispatch(setSearchText(value));
  };
  const debounceChangeHandler = useCallback(debounce(onChangeFilter, 350), [searchText]);
  const placeholder = (customSearchInput == null ? void 0 : customSearchInput.placeholder) ? customSearchInput == null ? void 0 : customSearchInput.placeholder : "Please input token name or address.";
  const activeColor = ((_b = (_a = customSearchInput == null ? void 0 : customSearchInput.styles) == null ? void 0 : _a.search) == null ? void 0 : _b.activeColor) ? (_d = (_c = customSearchInput == null ? void 0 : customSearchInput.styles) == null ? void 0 : _c.search) == null ? void 0 : _d.activeColor : "#666699";
  const color = ((_f = (_e = customSearchInput == null ? void 0 : customSearchInput.styles) == null ? void 0 : _e.search) == null ? void 0 : _f.color) ? (_h = (_g = customSearchInput == null ? void 0 : customSearchInput.styles) == null ? void 0 : _g.search) == null ? void 0 : _h.color : "#FFF";
  const height = ((_j = (_i = customSearchInput == null ? void 0 : customSearchInput.styles) == null ? void 0 : _i.search) == null ? void 0 : _j.height) ? (_l = (_k = customSearchInput == null ? void 0 : customSearchInput.styles) == null ? void 0 : _k.search) == null ? void 0 : _l.height : 14;
  const width = ((_n = (_m = customSearchInput == null ? void 0 : customSearchInput.styles) == null ? void 0 : _m.search) == null ? void 0 : _n.width) ? (_p = (_o = customSearchInput == null ? void 0 : customSearchInput.styles) == null ? void 0 : _o.search) == null ? void 0 : _p.width : 14;
  return /* @__PURE__ */ React3.createElement(StyledWrapper, {
    onClick: () => dispatch(startSelecting())
  }, /* @__PURE__ */ React3.createElement(StyledInput, {
    placeholder,
    autocomplete: "off",
    onChange: debounceChangeHandler,
    styles: (_q = customSearchInput == null ? void 0 : customSearchInput.styles) == null ? void 0 : _q.input
  }), /* @__PURE__ */ React3.createElement(StyledSearchIconWrapper, {
    styles: (_r = customSearchInput == null ? void 0 : customSearchInput.styles) == null ? void 0 : _r.search
  }, /* @__PURE__ */ React3.createElement(SearchIcon_default, {
    activeColor,
    color,
    height,
    width
  })));
};
var SearchInput_default = SearchInput;

// src/searchbar/tokenSearch/SearchResult.tsx
import React5, { useContext as useContext3 } from "react";
import styled4 from "styled-components";
import { useSelector as useSelector2 } from "react-redux";

// src/searchbar/tokenSearch/TokenPairDetail.tsx
import React4, { useContext as useContext2 } from "react";
import styled3 from "styled-components";
import {
  Accordion,
  AccordionItem,
  AccordionItemHeading,
  AccordionItemButton,
  AccordionItemPanel
} from "react-accessible-accordion";

// src/searchbar/tokenSearch/helpers/firstAndLast.ts
var firstAndLast = (str, chars = 8) => str && str.slice(0, chars) + "..." + str.slice(-chars);
var capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

// src/searchbar/tokenSearch/helpers/intToWords.ts
function intToWords(int) {
  if (typeof int !== "number") {
    int = Number(int);
  }
  if (isNaN(int)) {
    return "?";
  }
  if (int < 1e6) {
    return "$" + Math.round(int).toLocaleString();
  }
  if (int < 1e9) {
    return "$" + Math.round(int / 1e5) / 10 + " Million";
  }
  return "$" + Math.round(int / 1e8) / 10 + " Billion";
}

// src/searchbar/tokenSearch/TokenPairDetail.tsx
var imageSize = 26;
var DetailWrapper = styled3.div`
  .accordion__button: hover {
    cursor: pointer;
  }
`;
var StyledHeader = styled3.div`
  display: grid;
  grid-auto-flow: column;
  gap: 10px;
  
  ${({ props }) => {
  var _a, _b, _c;
  return `
    padding: ${((_a = props == null ? void 0 : props.styles) == null ? void 0 : _a.padding) || "10px"};
    color: ${((_b = props == null ? void 0 : props.styles) == null ? void 0 : _b.color) || "black"};
    background: ${((_c = props == null ? void 0 : props.styles) == null ? void 0 : _c.background) || "green"};
  `;
}}  
`;
var StyeldPanel = styled3.div`
  display: grid;
  grid-auto-flow: column;
  gap: 10px;
  ${({ props }) => {
  var _a, _b, _c;
  return `
    padding: ${((_a = props == null ? void 0 : props.styles) == null ? void 0 : _a.padding) || "10px"};
    color: ${((_b = props == null ? void 0 : props.styles) == null ? void 0 : _b.color) || "black"};
    background: ${((_c = props == null ? void 0 : props.styles) == null ? void 0 : _c.background) || "white"};  
  `;
}}    
`;
var StyledActionWrapper = styled3.div`
  display: flex;  
  margin-top: 10px;  
`;
var StyledAction = styled3.div`
  cursor: pointer;
  padding: 10;
`;
var Action = (props) => {
  const { component, detail } = props;
  const Component = component;
  return /* @__PURE__ */ React4.createElement(StyledAction, null, /* @__PURE__ */ React4.createElement(Component, {
    detail
  }));
};
var TokenPairDetail = (props) => {
  var _a, _b;
  const { index, suggestions } = props;
  const renderProps = useContext2(TokenSearch_default);
  const { customTokenDetail, customActions } = renderProps;
  const selectedPair = suggestions[index];
  const tokenImage = (token) => {
    return (token == null ? void 0 : token.image) && /* @__PURE__ */ React4.createElement("img", {
      alt: token == null ? void 0 : token.symbol,
      src: token == null ? void 0 : token.image,
      style: { borderRadius: "50%" },
      width: imageSize
    });
  };
  return /* @__PURE__ */ React4.createElement(DetailWrapper, null, /* @__PURE__ */ React4.createElement(Accordion, {
    allowZeroExpanded: true
  }, /* @__PURE__ */ React4.createElement(AccordionItem, {
    key: selectedPair.id
  }, /* @__PURE__ */ React4.createElement(AccordionItemHeading, null, /* @__PURE__ */ React4.createElement(AccordionItemButton, null, /* @__PURE__ */ React4.createElement(StyledHeader, {
    styles: (_a = customTokenDetail == null ? void 0 : customTokenDetail.styles) == null ? void 0 : _a.header
  }, /* @__PURE__ */ React4.createElement("div", null, /* @__PURE__ */ React4.createElement("div", null, selectedPair.network.toUpperCase(), " - ", capitalizeFirstLetter(selectedPair.exchange), " - "), /* @__PURE__ */ React4.createElement("div", null, "Volume: ", intToWords(selectedPair.volumeUSD))), /* @__PURE__ */ React4.createElement("div", null, tokenImage(selectedPair.token0), selectedPair.token0.name, " -", tokenImage(selectedPair.token1), selectedPair.token1.name)))), /* @__PURE__ */ React4.createElement(AccordionItemPanel, null, /* @__PURE__ */ React4.createElement(StyeldPanel, {
    styles: (_b = customTokenDetail == null ? void 0 : customTokenDetail.styles) == null ? void 0 : _b.panel
  }, /* @__PURE__ */ React4.createElement("div", null, /* @__PURE__ */ React4.createElement("div", null, /* @__PURE__ */ React4.createElement("b", null, "Pair Address:"), " ", selectedPair.id), /* @__PURE__ */ React4.createElement("div", null, /* @__PURE__ */ React4.createElement("b", null, tokenImage(selectedPair.token0), " token0 address: "), firstAndLast(selectedPair.token0.address)), /* @__PURE__ */ React4.createElement("div", null, /* @__PURE__ */ React4.createElement("b", null, tokenImage(selectedPair.token1), " token1 address: "), firstAndLast(selectedPair.token1.address))), /* @__PURE__ */ React4.createElement("div", null, /* @__PURE__ */ React4.createElement("div", null, /* @__PURE__ */ React4.createElement("b", null, selectedPair.network.toUpperCase())), /* @__PURE__ */ React4.createElement("div", null, /* @__PURE__ */ React4.createElement("b", null, capitalizeFirstLetter(selectedPair.exchange))), /* @__PURE__ */ React4.createElement(StyledActionWrapper, null, customActions.map((action) => /* @__PURE__ */ React4.createElement(Action, {
    key: `action-${action.index}`,
    component: action.component,
    detail: selectedPair
  })))))))));
};
var TokenPairDetail_default = TokenPairDetail;

// src/searchbar/tokenSearch/SearchResult.tsx
var StyledResult = styled4.div`
  background-color: inherit;
  margin-left: auto;
  margin-right: auto;
  position: relative;
  overflow: auto;

  ${({ props }) => {
  var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m;
  return `
    width: ${((_a = props == null ? void 0 : props.styles) == null ? void 0 : _a.width) || "auto"};
    height: ${((_b = props == null ? void 0 : props.styles) == null ? void 0 : _b.height) || "300px"};
    border: ${((_c = props == null ? void 0 : props.styles) == null ? void 0 : _c.border) || "1px solid grey"};   
    color: ${((_d = props == null ? void 0 : props.styles) == null ? void 0 : _d.color) || "#FFF"};
    display: ${((_e = props == null ? void 0 : props.styles) == null ? void 0 : _e.display) || "block"};   
    border-color: ${((_f = props == null ? void 0 : props.styles) == null ? void 0 : _f.borderColor) || "#067c82"};  
    border-style: ${((_g = props == null ? void 0 : props.styles) == null ? void 0 : _g.borderStyle) || "solid"};  
    border-width: ${((_h = props == null ? void 0 : props.styles) == null ? void 0 : _h.borderWidth) || "1px"};  
    border-radius: ${((_i = props == null ? void 0 : props.styles) == null ? void 0 : _i.borderRadius) || "0"};  
    background: ${((_j = props == null ? void 0 : props.styles) == null ? void 0 : _j.background) || "#08333c"};   
    padding: ${((_k = props == null ? void 0 : props.styles) == null ? void 0 : _k.padding) || "0"};    
    font-size: ${((_l = props == null ? void 0 : props.styles) == null ? void 0 : _l.fontSize) || "15px"};      
    font-family: ${((_m = props == null ? void 0 : props.styles) == null ? void 0 : _m.fontFamily) || "'Fira Code', monospace"};  
  `;
}}  
`;
var StyledLoading = styled4.div`
  position: relative;
  display: flex;
  justify-content: center;  
  margin: 10px;
  ${({ props }) => {
  var _a, _b;
  return `
    color: ${((_a = props == null ? void 0 : props.styles) == null ? void 0 : _a.color) || "black"};
    font-size: ${((_b = props == null ? void 0 : props.styles) == null ? void 0 : _b.fontSize) || "15px"};      
  `;
}}    
`;
var SearchResult = (props) => {
  const renderProps = useContext3(TokenSearch_default);
  const { customResult, customLoading } = renderProps;
  const { suggestions, searchText } = useSelector2((state) => state);
  const filteredSuggestions = suggestions.slice().sort((pair1, pair2) => pair2.volumeUSD - pair1.volumeUSD);
  if (props.loading) {
    const loadingTitle = (customLoading == null ? void 0 : customLoading.loadingTitle) ? customLoading.loadingTitle : "Loading...";
    return /* @__PURE__ */ React5.createElement(StyledLoading, {
      styles: customLoading == null ? void 0 : customLoading.styles
    }, loadingTitle);
  }
  if (!!searchText && !filteredSuggestions.length) {
    const notFoundTitle = (customLoading == null ? void 0 : customLoading.notFoundTitle) ? customLoading.notFoundTitle : "No pairs found...";
    return /* @__PURE__ */ React5.createElement(StyledLoading, {
      styles: customLoading == null ? void 0 : customLoading.styles
    }, notFoundTitle);
  }
  return /* @__PURE__ */ React5.createElement(StyledResult, {
    styles: customResult == null ? void 0 : customResult.styles
  }, filteredSuggestions.map((suggestions2, index) => /* @__PURE__ */ React5.createElement(TokenPairDetail_default, {
    suggestions: filteredSuggestions,
    index,
    key: `token-detail-${index}`
  })));
};
var SearchResult_default = SearchResult;

// src/searchbar/tokenSearch/SearchFilters.tsx
import React9, { useContext as useContext5 } from "react";
import { useSelector as useSelector5 } from "react-redux";
import styled6 from "styled-components";
import {
  Accordion as Accordion2,
  AccordionItem as AccordionItem2,
  AccordionItemHeading as AccordionItemHeading2,
  AccordionItemButton as AccordionItemButton2,
  AccordionItemPanel as AccordionItemPanel2
} from "react-accessible-accordion";

// src/searchbar/tokenSearch/SearchFiltersNetworkSelectors.tsx
import React7 from "react";
import { useDispatch as useDispatch2, useSelector as useSelector3 } from "react-redux";
import { omitBy as omitBy2 } from "lodash";

// src/searchbar/tokenSearch/Chip.tsx
import React6, { memo as memo2, useContext as useContext4 } from "react";
import styled5 from "styled-components";
var StyledChip = styled5.div`
  > input {
    display: none;
  }

  > input + label {
    -webkit-transition: all 500ms ease;
    transition: all 500ms ease;    
    cursor: pointer;    
    display: inline-block;
    -moz-user-select: -moz-none;
    -webkit-user-select: none;
    -ms-user-select: none;
    user-select: none;
    ${({ props }) => {
  var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j;
  return `
        font-size: ${((_a = props == null ? void 0 : props.styles) == null ? void 0 : _a.fontSize) || "14px"};  
        border-radius: ${((_b = props == null ? void 0 : props.styles) == null ? void 0 : _b.borderRadius) || "5px"};  
        background-color: ${((_c = props == null ? void 0 : props.styles) == null ? void 0 : _c.backgroundColor) || "#FFF"};  
        border: ${((_d = props == null ? void 0 : props.styles) == null ? void 0 : _d.border) || "solid 2px #7d7d7d"};   
        padding: ${((_e = props == null ? void 0 : props.styles) == null ? void 0 : _e.padding) || "0.1rem 0.3rem"};   
        margin: ${((_f = props == null ? void 0 : props.styles) == null ? void 0 : _f.margin) || "5px"};   
        color: ${((_g = props == null ? void 0 : props.styles) == null ? void 0 : _g.defaultColor) || "black"};   
        width: ${((_h = props == null ? void 0 : props.styles) == null ? void 0 : _h.width) || "100px"};   
        height: ${((_i = props == null ? void 0 : props.styles) == null ? void 0 : _i.height) || "auto"};   
        text-align: ${((_j = props == null ? void 0 : props.styles) == null ? void 0 : _j.textAlign) || "center"}; 
      `;
}}      
  }

  > input:checked + label {
    -webkit-transition: all 500ms ease;
    transition: all 500ms ease;   
    ${({ props }) => {
  var _a, _b, _c;
  return `
        border-color: ${((_a = props == null ? void 0 : props.styles) == null ? void 0 : _a.checkedColor) || "#666699"};    
        color: ${((_b = props == null ? void 0 : props.styles) == null ? void 0 : _b.checkedColor) || "white"};   
        background-color: ${((_c = props == null ? void 0 : props.styles) == null ? void 0 : _c.checkedBackgroundColor) || "gray"};  
      `;
}}     
  }
`;
var Chip = memo2((props) => {
  const renderProps = useContext4(TokenSearch_default);
  const { label, checked, onChange, name, value } = props;
  const { customChip } = renderProps;
  return /* @__PURE__ */ React6.createElement(StyledChip, {
    styles: customChip == null ? void 0 : customChip.styles
  }, /* @__PURE__ */ React6.createElement("input", {
    type: "checkbox",
    id: `${label}-${name}`,
    onChange,
    checked,
    name,
    value
  }), /* @__PURE__ */ React6.createElement("label", {
    htmlFor: `${label}-${name}`
  }, label, " "));
});

// src/searchbar/tokenSearch/SearchFiltersNetworkSelectors.tsx
var FilterNetworkAll = () => {
  const dispatch = useDispatch2();
  const { exchangeMap, networkMap } = useSelector3((state) => state);
  const networkAll = Object.values(omitBy2(networkMap, (b) => !b)).length === 0;
  const exchangeNamesActive = Object.keys(omitBy2(exchangeMap, (b) => !b));
  return /* @__PURE__ */ React7.createElement(Chip, {
    name: "AllNetworks",
    label: "All",
    checked: networkAll,
    onChange: (e) => {
      dispatch(setNetworkMapAll({ networkNames, networkAll }));
      dispatch(setExchangeMapAll({ exchangeNames: exchangeNamesActive, exchangeAll: false }));
    }
  });
};
var FilterNetworkSelectors = () => {
  const dispatch = useDispatch2();
  const { networkMap } = useSelector3((state) => state);
  const networkElement = (networkName) => {
    return /* @__PURE__ */ React7.createElement(Chip, {
      key: networkName,
      name: networkName,
      label: networkName,
      checked: networkMap[networkName] || false,
      onChange: (e) => dispatch(setNetworkMap({ networkName, checked: e.target.checked }))
    });
  };
  return /* @__PURE__ */ React7.createElement(React7.Fragment, null, networkNames.map((networkName) => networkElement(networkName)));
};

// src/searchbar/tokenSearch/SearchFiltersExchangeSelectors.tsx
import React8 from "react";
import { omitBy as omitBy3 } from "lodash";
import { useDispatch as useDispatch3, useSelector as useSelector4 } from "react-redux";
var FilterExchangeAll = () => {
  const dispatch = useDispatch3();
  const { exchangeMap, networkMap } = useSelector4((state) => state);
  const exchangeAll = Object.values(omitBy3(exchangeMap, (b) => !b)).length === 0;
  const exchangeNamesActive = exchangeNames(Object.keys(omitBy3(networkMap, (b) => !b)));
  return /* @__PURE__ */ React8.createElement(Chip, {
    name: "AllExchanges",
    label: "All",
    checked: exchangeAll,
    onChange: () => dispatch(setExchangeMapAll({ exchangeNames: exchangeNamesActive, exchangeAll }))
  });
};
var FilterExchangeSelectors = () => {
  const dispatch = useDispatch3();
  const { networkMap, exchangeMap } = useSelector4((state) => state);
  const exchangeNamesActive = exchangeNames(Object.keys(omitBy3(networkMap, (b) => !b)));
  const exchangeElement = (exchangeName) => {
    return /* @__PURE__ */ React8.createElement(Chip, {
      key: exchangeName,
      name: exchangeName,
      label: exchangeName,
      checked: exchangeMap[exchangeName] || false,
      onChange: (e) => dispatch(setExchangeMap({ exchangeName, checked: e.target.checked }))
    });
  };
  return exchangeNamesActive.map((exchangeName) => exchangeElement(exchangeName));
};

// src/searchbar/tokenSearch/SearchFilters.tsx
var FilterWrapper = styled6.div`  
  .accordion__button {
    position: relative;
  }

  .accordion__button:first-child:after {
    display: block;    
    content: '';
    position: absolute;
    right: 0;
    transform: rotate(-45deg);

    ${({ props }) => {
  var _a, _b, _c, _d, _e, _f;
  return `
      height: ${((_a = props == null ? void 0 : props.styles) == null ? void 0 : _a.toggleHeight) || "10px"};
      width: ${((_b = props == null ? void 0 : props.styles) == null ? void 0 : _b.toggleWidth) || "10px"};
      margin-right: ${((_c = props == null ? void 0 : props.styles) == null ? void 0 : _c.toggleMarginRight) || "25px"};    
      top: ${((_d = props == null ? void 0 : props.styles) == null ? void 0 : _d.toggleTop) || "20px"};    
      border-bottom: ${((_e = props == null ? void 0 : props.styles) == null ? void 0 : _e.toggleBorderBottom) || "2px solid currentColor"}; 
      border-right: ${((_f = props == null ? void 0 : props.styles) == null ? void 0 : _f.toggleBorderRight) || "2px solid currentColor"}; 
    `;
}}
  }

  .accordion__button[aria-expanded='true']:first-child:after,
  .accordion__button[aria-selected='true']:first-child:after {
    transform: rotate(45deg);
  }

  .accordion__panel {
    ${({ props }) => {
  var _a, _b, _c, _d, _e, _f, _g;
  return `
      border: ${((_a = props == null ? void 0 : props.styles) == null ? void 0 : _a.contentBorder) || "0"}; 
      border-top-style: ${((_b = props == null ? void 0 : props.styles) == null ? void 0 : _b.contentBorderTop) || "none"}; 
      border-right-style: ${((_c = props == null ? void 0 : props.styles) == null ? void 0 : _c.contentBorderRight) || "none"}; 
      border-bottom-style: ${((_d = props == null ? void 0 : props.styles) == null ? void 0 : _d.contentBorderBottom) || "none"}; 
      border-left-style: ${((_e = props == null ? void 0 : props.styles) == null ? void 0 : _e.contentBorderLeft) || "none"}; 
      border-radius: ${((_f = props == null ? void 0 : props.styles) == null ? void 0 : _f.borderRadius) || "0"}; 
      margin:  ${((_g = props == null ? void 0 : props.styles) == null ? void 0 : _g.margin) || "0 10px"};       
    `;
}}    
  }
`;
var StyledFilterHeader = styled6.div`  
  ${({ props }) => {
  var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k;
  return `
    display: ${((_a = props == null ? void 0 : props.styles) == null ? void 0 : _a.display) || "inline"};
    width: ${((_b = props == null ? void 0 : props.styles) == null ? void 0 : _b.width) || "auto"};
    border: ${((_c = props == null ? void 0 : props.styles) == null ? void 0 : _c.border) || "none"}; 
    background-color: ${((_d = props == null ? void 0 : props.styles) == null ? void 0 : _d.backgroundColor) || "#f4f4f4"}; 
    color: ${((_e = props == null ? void 0 : props.styles) == null ? void 0 : _e.color) || "#444"};
    display: ${((_f = props == null ? void 0 : props.styles) == null ? void 0 : _f.display) || "block"}; 
    cursor: pointer;
    padding: ${((_g = props == null ? void 0 : props.styles) == null ? void 0 : _g.padding) || "18px"};   
    text-align: ${((_h = props == null ? void 0 : props.styles) == null ? void 0 : _h.textAlign) || "left"};     
    margin: ${((_i = props == null ? void 0 : props.styles) == null ? void 0 : _i.margin) || "5px"};     
    border-radius: ${((_j = props == null ? void 0 : props.styles) == null ? void 0 : _j.borderRadius) || "0"};     
    &:hover {
      background-color: ${((_k = props == null ? void 0 : props.styles) == null ? void 0 : _k.hoverColor) || "#ddd"};
    }
  `;
}}      
`;
var StyledFilterContent = styled6.div`
  display: flex;
  flex-wrap: wrap;

  ${({ props }) => {
  var _a, _b, _c, _d, _e;
  return `
    justify-content: ${((_a = props == null ? void 0 : props.styles) == null ? void 0 : _a.justifyContent) || "center"};
    align-items: ${((_b = props == null ? void 0 : props.styles) == null ? void 0 : _b.alignItems) || "center"};  
    padding:  ${((_c = props == null ? void 0 : props.styles) == null ? void 0 : _c.padding) || "5px 10px"};       
    background-color: ${((_d = props == null ? void 0 : props.styles) == null ? void 0 : _d.backgroundColor) || "#ddd"};
    border-radius: ${((_e = props == null ? void 0 : props.styles) == null ? void 0 : _e.borderRadius) || "0"};     
  `;
}}      
`;
var SearchFilters = () => {
  const { networkMap, exchangeMap } = useSelector5((state) => state);
  const renderProps = useContext5(TokenSearch_default);
  const { customSearchFilter } = renderProps;
  const exchangesActive = Object.values(networkMap).filter((b) => b).length !== 0;
  const networkCount = Object.values(networkMap).filter((b) => b).length;
  const exchangeCount = Object.values(exchangeMap).filter((b) => b).length;
  const title = (customSearchFilter == null ? void 0 : customSearchFilter.title) || "Filter Networks";
  const description = networkCount === 0 && exchangeCount === 0 ? "Searching all networks and exchanges" : (customSearchFilter == null ? void 0 : customSearchFilter.description(networkCount, exchangeCount)) || `Searching {networkCount} networks and {exchangeCount} exchanges`;
  return /* @__PURE__ */ React9.createElement(FilterWrapper, {
    styles: customSearchFilter == null ? void 0 : customSearchFilter.styles.wrapper
  }, /* @__PURE__ */ React9.createElement(Accordion2, {
    allowZeroExpanded: true
  }, /* @__PURE__ */ React9.createElement(AccordionItem2, null, /* @__PURE__ */ React9.createElement(AccordionItemHeading2, null, /* @__PURE__ */ React9.createElement(AccordionItemButton2, null, /* @__PURE__ */ React9.createElement(StyledFilterHeader, {
    styles: customSearchFilter == null ? void 0 : customSearchFilter.styles.header
  }, /* @__PURE__ */ React9.createElement("b", null, title, ":"), "  \xA0 ", description))), /* @__PURE__ */ React9.createElement(AccordionItemPanel2, null, /* @__PURE__ */ React9.createElement(StyledFilterContent, {
    styles: customSearchFilter == null ? void 0 : customSearchFilter.styles.network
  }, /* @__PURE__ */ React9.createElement(FilterNetworkAll, null), /* @__PURE__ */ React9.createElement(FilterNetworkSelectors, null))), /* @__PURE__ */ React9.createElement(AccordionItemPanel2, null, /* @__PURE__ */ React9.createElement(StyledFilterContent, {
    styles: customSearchFilter == null ? void 0 : customSearchFilter.styles.exchange
  }, exchangesActive && /* @__PURE__ */ React9.createElement(FilterExchangeAll, null), exchangesActive && /* @__PURE__ */ React9.createElement(FilterExchangeSelectors, null))))));
};
var SearchFilters_default = SearchFilters;

// src/searchbar/tokenSearch/index.tsx
var TokenSearch = (renderProps) => {
  const dispatch = useDispatch4();
  const { isSelecting, isLoading } = useSelector6((state) => state);
  const searchRef = useRef();
  useEffect2(() => {
    window.onmousedown = (e) => {
      var _a;
      if (!((_a = searchRef == null ? void 0 : searchRef.current) == null ? void 0 : _a.contains(e.target))) {
        dispatch(stopSelecting());
      }
    };
  }, [dispatch]);
  return /* @__PURE__ */ React10.createElement(TokenSearch_default.Provider, {
    value: renderProps
  }, /* @__PURE__ */ React10.createElement("div", {
    ref: searchRef
  }, /* @__PURE__ */ React10.createElement(SearchInput_default, null), /* @__PURE__ */ React10.createElement(SearchFilters_default, null), isSelecting && /* @__PURE__ */ React10.createElement(SearchResult_default, {
    loading: isLoading
  })));
};
var tokenSearch_default = TokenSearch;

// src/searchbar/index.tsx
function SearchBar(renderProps) {
  return /* @__PURE__ */ React11.createElement(Provider, {
    store
  }, /* @__PURE__ */ React11.createElement(tokenSearch_default, {
    customSearchInput: renderProps == null ? void 0 : renderProps.customSearchInput,
    customSearchFilter: renderProps == null ? void 0 : renderProps.customSearchFilter,
    customChip: renderProps == null ? void 0 : renderProps.customChip,
    customResult: renderProps == null ? void 0 : renderProps.customResult,
    customTokenDetail: renderProps == null ? void 0 : renderProps.customTokenDetail,
    customLoading: renderProps == null ? void 0 : renderProps.customLoading,
    customActions: renderProps == null ? void 0 : renderProps.customActions
  }));
}

// src/types.ts
import {
  Accordion as Accordion3,
  AccordionItem as AccordionItem3,
  AccordionItemHeading as AccordionItemHeading3,
  AccordionItemButton as AccordionItemButton3,
  AccordionItemPanel as AccordionItemPanel3
} from "react-accessible-accordion";
export {
  Accordion3 as Accordion,
  AccordionItem3 as AccordionItem,
  AccordionItemButton3 as AccordionItemButton,
  AccordionItemHeading3 as AccordionItemHeading,
  AccordionItemPanel3 as AccordionItemPanel,
  SearchBar
};
//# sourceMappingURL=index.mjs.map