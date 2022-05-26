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
import React46 from "react";
import { Provider } from "react-redux";

// src/searchbar/redux/store.ts
import {
  configureStore
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
var romeTokenSyncUri = String(process.env.REACT_APP_HASURA_API_ENDPOINT_WS || "https://romenet.prod.velox.global/v1/graphql").replace("ws", "http");
var maxHits = Number(process.env.REACT_APP_SEARCH_ASYNC_DATASET_LENGTH_MAXIMUM || 500);

// src/searchbar/tokenSearch/helpers/graphqlClients.ts
var romePairsClient = new GraphQLClient(romeTokenSyncUri);

// src/searchbar/tokenSearch/helpers/async.ts
var getRomeSearchTokenQuery = (networks, isPair = false) => {
  let network;
  let pair_search = "";
  const networkDatasetLength = Math.round(maxHits / networks.length);
  let where = `{
    concat_ws:{_ilike:$searchText},             
    exchange:{_in:$exchanges}
  }`;
  if (isPair)
    where = `
      {
        _and:[
          {concat_ws:{_ilike:$filter1}},
          {concat_ws:{_ilike:$filter2}}
        ],        
        exchange:{_in:$exchanges}
      }
    `;
  for (network of networks) {
    pair_search += `
      ${network}:
        ${network}_pair_search(
          where:${where}, 
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
  let graphQl = gql`query SearchTokens($searchText:String!,$exchanges:[String!]!){${pair_search}}`;
  if (isPair)
    graphQl = gql`query SearchTokens($filter1:String!,$filter2:String!,$exchanges:[String!]!){${pair_search}}`;
  return graphQl;
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
  let isPair = false;
  const queries = searchString.split(" ");
  const searchText = searchTokenAsync_searchString(searchString);
  let parameters = searchTokenAsync_Parameters(searchText, searchExchanges);
  if (queries.length > 1) {
    parameters = {
      exchanges: [...searchExchanges],
      filter1: `%${queries[0]}%`,
      filter2: `%${queries[1]}%`
    };
    isPair = true;
  }
  const query = getRomeSearchTokenQuery(searchNetworks, isPair);
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
import { uniq, omitBy } from "lodash";

// src/searchbar/config.tsx
var _a, _b, _c, _d;
var config_default = {
  SEARCH_INPUT_LENGTH_MINIMUM: (_a = process.env.REACT_APP_SEARCH_INPUT_LENGTH_MINIMUM) != null ? _a : 2,
  SEARCH_ASYNC_DELAY: (_b = process.env.REACT_APP_SEARCH_ASYNC_DELAY) != null ? _b : 300,
  SEARCH_ASYNC_DATASET_LENGTH_MAXIMUM: (_c = process.env.REACT_APP_SEARCH_ASYNC_DATASET_LENGTH_MAXIMUM) != null ? _c : 500,
  IS_ENV_PRODUCTION: process.env.REACT_APP_ROME_ENV === "production" ? true : false,
  LOAD_LIMIT: (_d = process.env.REACT_APP_LOAD_LIMIT) != null ? _d : 10
};

// src/searchbar/redux/tokenSearchSlice.ts
var LOAD_LIMIT = Number(config_default.LOAD_LIMIT || 10);
var allValueHandler = (networkMap, exchangeMap, networks) => {
  let returnedNetworkMap = networkMap;
  let returnedExchangeMap = exchangeMap;
  if (networkMap.length === 0 || networkMap.includes("All")) {
    returnedNetworkMap = uniq(networks.map((network) => network.id));
  }
  if (exchangeMap.length === 0 || exchangeMap.includes("All")) {
  }
  const exchanges = [];
  networks.forEach((network) => {
    if (returnedNetworkMap.includes(network.id)) {
      network.exchanges.forEach((exchange) => {
        exchanges.push(exchange.name);
      });
    }
  });
  returnedExchangeMap = exchanges;
  return [returnedNetworkMap, returnedExchangeMap];
};
var valueCleaner = (networkMap, exchangeMap) => {
  networkMap = Object.keys(omitBy(networkMap, (b) => !b));
  exchangeMap = Object.keys(omitBy(exchangeMap, (b) => !b));
  return [networkMap, exchangeMap];
};
var searchTokenPairs = createAsyncThunk("token/search", async (dataProp, thunkAPI) => {
  try {
    const { networkMap, exchangeMap } = thunkAPI.getState();
    const { searchString, networks } = dataProp;
    let processedNetworks;
    let processedExchanges;
    const pairSearchTimestamp = new Date().getTime();
    thunkAPI.dispatch(setPairSearchTimestamp(pairSearchTimestamp));
    [processedNetworks, processedExchanges] = valueCleaner(networkMap, exchangeMap);
    [processedNetworks, processedExchanges] = allValueHandler(processedNetworks, processedExchanges, networks);
    const data = await retry(() => searchTokensAsync(searchString, processedNetworks, processedExchanges), {
      retries: 1
    });
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
  suggestionRendered: [],
  page: 1,
  exchangeMap: {},
  networkMap: {},
  viewResult: false
};
var loadMoreItem = (state) => {
  state.suggestionRendered = state.suggestions.slice(0, state.page * LOAD_LIMIT);
  state.page += 1;
};
var tokenSearchSlice = createSlice({
  extraReducers: (builder) => {
    builder.addCase(searchTokenPairs.pending, (state) => {
      state.isLoading = true;
      state.fetchError = null;
    });
    builder.addCase(searchTokenPairs.fulfilled, (state, action) => {
      var _a2;
      if (((_a2 = action.payload) == null ? void 0 : _a2.pairSearchTimestamp) >= state.pairSearchTimestamp) {
        state.pairSearchTimestamp = action.payload.pairSearchTimestamp;
        const suggestions = action.payload.data;
        suggestions.sort((pair1, pair2) => pair2.volumeUSD - pair1.volumeUSD);
        state.suggestions = suggestions;
        state.isLoading = false;
        state.fetchError = null;
        loadMoreItem(state);
      }
    });
    builder.addCase(searchTokenPairs.rejected, (state) => {
      state.suggestions = [];
      state.isLoading = false;
      state.fetchError = "Something went wrong fetching token pair.";
    });
  },
  initialState,
  name: "tokenSearch",
  reducers: {
    resetSearch: (state) => {
      state.searchText = "";
      state.suggestions = [];
      state.isLoading = false;
      state.exchangeMap = {}, state.networkMap = {}, state.isSelecting = false;
      state.viewResult = false;
    },
    setViewResult: (state, action) => {
      state.viewResult = action.payload;
    },
    setPairSearchTimestamp: (state, action) => {
      state.pairSearchTimestamp = action.payload;
    },
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
    },
    setNetworkMap: (state, action) => {
      state.networkMap[action.payload.networkName] = action.payload.checked;
      if (!action.payload.checked) {
        action.payload.networks.forEach((network) => {
          if (network.id === action.payload.networkName) {
            network.exchanges.forEach((exhange) => {
              if (state.exchangeMap[exhange])
                state.exchangeMap[exhange] = false;
            });
          } else
            return false;
        });
      }
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
    },
    loadMore: (state) => {
      loadMoreItem(state);
    }
  }
});
var {
  setSearchText,
  startSelecting,
  stopSelecting,
  toggleSelecting,
  setExchangeMap,
  setExchangeMapAll,
  setNetworkMap,
  setNetworkMapAll,
  setViewResult,
  resetSearch,
  loadMore,
  setPairSearchTimestamp
} = tokenSearchSlice.actions;
var tokenSearchSlice_default = tokenSearchSlice.reducer;

// src/searchbar/redux/store.ts
var rootReducer = tokenSearchSlice.reducer;
var store = configureStore({
  devTools: process.env.NODE_ENV !== "production",
  reducer: rootReducer
});

// src/searchbar/tokenSearch/index.tsx
import React45, { useEffect as useEffect3, useRef } from "react";
import { useDispatch as useDispatch6, useSelector as useSelector6 } from "react-redux";
import styled6 from "styled-components";

// src/searchbar/tokenSearch/SearchInput.tsx
import React4, { useEffect, useCallback, useContext, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";

// src/searchbar/icons/search.tsx
import React2 from "react";

// src/searchbar/icons/abstract.tsx
import React from "react";
var SVGIcon = ({ children, width, height, viewBox }) => {
  return /* @__PURE__ */ React.createElement("svg", {
    height: height != null ? height : 16,
    width: width != null ? width : 16,
    viewBox,
    fill: "none"
  }, children);
};
var abstract_default = SVGIcon;

// src/searchbar/icons/search.tsx
var SearchIcon = ({ height, width }) => /* @__PURE__ */ React2.createElement(abstract_default, {
  height: height != null ? height : 18,
  width: width != null ? width : 18,
  viewBox: "0 0 18 18"
}, /* @__PURE__ */ React2.createElement("g", {
  transform: "translate(0)"
}, /* @__PURE__ */ React2.createElement("circle", {
  cx: "7.4",
  cy: "7.4",
  r: "6.4",
  stroke: "#7A808A"
}), /* @__PURE__ */ React2.createElement("path", {
  d: "M7.39995 4.20001C6.97972 4.20001 6.56361 4.28278 6.17536 4.4436C5.78712 4.60441 5.43436 4.84012 5.13721 5.13727C4.84006 5.43442 4.60435 5.78718 4.44354 6.17543C4.28272 6.56367 4.19995 6.97978 4.19995 7.40001",
  "data-name": "Search icon",
  id: "Search_icon",
  stroke: "#7A808A"
}), /* @__PURE__ */ React2.createElement("path", {
  d: "M17 17L13.8 13.8",
  stroke: "#7A808A"
})));
var search_default = SearchIcon;

// src/searchbar/icons/reset.tsx
import React3 from "react";
var ResetIcon = ({ height, width }) => /* @__PURE__ */ React3.createElement(abstract_default, {
  height: height != null ? height : 9,
  width: width != null ? width : 9,
  viewBox: "0 0 9 9"
}, /* @__PURE__ */ React3.createElement("g", {
  transform: "translate(0)"
}, /* @__PURE__ */ React3.createElement("path", {
  d: "M1 4.05747C1.25047 2.1328 3.01695 0.779376 4.94163 1.02985C6.8663 1.28032 8.22412 3.0468 7.96925 4.97147C7.71878 6.89615 5.9523 8.25397 4.02763 7.9991C2.76648 7.83212 1.68989 6.99722 1.21971 5.81517M1 8.01228V5.81517H3.19712",
  stroke: "#B4BBC7",
  strokeLinecap: "round",
  strokeLinejoin: "round"
})));
var reset_default = ResetIcon;

// src/searchbar/tokenSearch/SearchInput.tsx
import debounce from "lodash.debounce";

// src/searchbar/Context/TokenSearch.tsx
import { createContext } from "react";
var TokenSearchContext = createContext({ networks: [] });
var TokenSearch_default = TokenSearchContext;

// src/searchbar/tokenSearch/SearchInput.tsx
var StyledInputGroup = styled.div`
  ${({ styleOverrides }) => ` 
    position: relative;
    width: ${(styleOverrides == null ? void 0 : styleOverrides.width) || "-webkit-fill-available"};
    color: ${(styleOverrides == null ? void 0 : styleOverrides.color) || "#B7BEC9"};
    background: ${(styleOverrides == null ? void 0 : styleOverrides.background) || "#00070E"};  
  `}
`;
var StyledInput = styled.input`
  ${({ styleOverrides }) => `    
    margin-left: auto;
    margin-right: auto;
    position: relative;
    outline: 0;
    border: none;
    width: ${(styleOverrides == null ? void 0 : styleOverrides.width) || "-webkit-fill-available"};
    height: ${(styleOverrides == null ? void 0 : styleOverrides.height) || "auto"};    
    color: ${(styleOverrides == null ? void 0 : styleOverrides.color) || "#B7BEC9"};
    display: ${(styleOverrides == null ? void 0 : styleOverrides.display) || "block"}; 
    padding: ${(styleOverrides == null ? void 0 : styleOverrides.padding) || "10px 14px"};    
    background: ${(styleOverrides == null ? void 0 : styleOverrides.background) || "#00070E"};  
  `}
`;
var StyledSearchIconWrapper = styled.div`
  ${({ styleOverrides }) => `
    float: right;
    position: absolute;
    right: ${(styleOverrides == null ? void 0 : styleOverrides.right) || "14px"};      
    top: 50%;
    transform: translateY(-50%);   
  `}
`;
var StyledWrapper = styled.div`
  ${({ styleOverrides }) => `    
    position: relative;
    border: ${(styleOverrides == null ? void 0 : styleOverrides.border) || "4px solid #474F5C"}; 
    border-radius: ${(styleOverrides == null ? void 0 : styleOverrides.borderRadius) || "4px"}; 
    color: ${(styleOverrides == null ? void 0 : styleOverrides.color) || "#7A808A"};
    background: ${(styleOverrides == null ? void 0 : styleOverrides.background) || "#00070E"};  
    font-size: ${(styleOverrides == null ? void 0 : styleOverrides.fontSize) || "8px"};      
    font-family: ${(styleOverrides == null ? void 0 : styleOverrides.fontFamily) || "'Fira Code', monospace"};
    box-shadow: 0 0 8px 2px #474f5c;

    .invalid-error {
      padding: ${(styleOverrides == null ? void 0 : styleOverrides.padding) || "0 14px 5px"};   
      color: ${(styleOverrides == null ? void 0 : styleOverrides.colorError) || "#F52E2E"};  
    }
  `}
`;
var StyledResetBtn = styled.button`
  position: absolute;
  right: 40px;
  top: 50%;
  transform: translateY(-50%);
`;
var SearchInput = () => {
  var _a2, _b2, _c2, _d2;
  const dispatch = useDispatch();
  const renderProps = useContext(TokenSearch_default);
  const { customSearchInput } = renderProps;
  const [text, setText] = useState("");
  const [error, setError] = useState(false);
  const { searchText, networkMap, exchangeMap } = useSelector((state) => state);
  useEffect(() => {
    if (searchText.length >= config_default.SEARCH_INPUT_LENGTH_MINIMUM) {
      setError(false);
      dispatch(searchTokenPairs({ searchString: searchText, networks: renderProps.networks }));
      dispatch(setSearchText(searchText));
    } else if (searchText.length > 0) {
      setError(true);
    }
  }, [dispatch, networkMap, exchangeMap, searchText]);
  const debounceChangeHandler = useCallback(debounce((value) => dispatch(setSearchText(value)), 350), []);
  const onChangeFilter = (event) => {
    const value = event.target.value;
    setText(value);
    debounceChangeHandler(value);
    dispatch(setViewResult(true));
  };
  const handleClick = () => {
    text.length > 0 && dispatch(setViewResult(true));
  };
  const placeholder = (customSearchInput == null ? void 0 : customSearchInput.placeholder) ? customSearchInput == null ? void 0 : customSearchInput.placeholder : "Search pair by symbol, name, contract or token";
  const height = ((_a2 = customSearchInput == null ? void 0 : customSearchInput.icon) == null ? void 0 : _a2.height) ? (_b2 = customSearchInput == null ? void 0 : customSearchInput.icon) == null ? void 0 : _b2.height : 14;
  const width = ((_c2 = customSearchInput == null ? void 0 : customSearchInput.icon) == null ? void 0 : _c2.width) ? (_d2 = customSearchInput == null ? void 0 : customSearchInput.icon) == null ? void 0 : _d2.width : 14;
  const handleReset = () => {
    setText("");
    dispatch(resetSearch());
  };
  return /* @__PURE__ */ React4.createElement(StyledWrapper, {
    onClick: () => dispatch(startSelecting()),
    styleOverrides: customSearchInput == null ? void 0 : customSearchInput.input
  }, /* @__PURE__ */ React4.createElement(StyledInputGroup, {
    styleOverrides: customSearchInput == null ? void 0 : customSearchInput.input
  }, /* @__PURE__ */ React4.createElement(StyledInput, {
    placeholder,
    autocomplete: "off",
    onChange: onChangeFilter,
    onClick: handleClick,
    styleOverrides: customSearchInput == null ? void 0 : customSearchInput.input,
    value: text
  }), /* @__PURE__ */ React4.createElement(StyledResetBtn, {
    onClick: handleReset
  }, /* @__PURE__ */ React4.createElement("span", null, "Reset Search"), /* @__PURE__ */ React4.createElement(reset_default, null)), /* @__PURE__ */ React4.createElement(StyledSearchIconWrapper, {
    styleOverrides: customSearchInput == null ? void 0 : customSearchInput.icon
  }, /* @__PURE__ */ React4.createElement(search_default, {
    height,
    width
  }))), error && /* @__PURE__ */ React4.createElement("div", {
    className: "invalid-error"
  }, "Please input ", config_default.SEARCH_INPUT_LENGTH_MINIMUM, " characters minimum"));
};
var SearchInput_default = SearchInput;

// src/searchbar/tokenSearch/SearchResult.tsx
import React39, { useContext as useContext3, useState as useState2, useMemo } from "react";
import useInfiniteScroll from "react-infinite-scroll-hook";
import styled3 from "styled-components";
import { useSelector as useSelector2, useDispatch as useDispatch2 } from "react-redux";

// src/searchbar/icons/unchecked.tsx
import React5 from "react";
var UnCheckedIcon = ({ height, width }) => /* @__PURE__ */ React5.createElement(abstract_default, {
  height: height != null ? height : 8,
  width: width != null ? width : 8,
  viewBox: "0 0 8 8"
}, /* @__PURE__ */ React5.createElement("g", {
  transform: "translate(0)"
}, /* @__PURE__ */ React5.createElement("g", {
  clipPath: "url(#clip0_1021_1505)"
}, /* @__PURE__ */ React5.createElement("path", {
  d: "M0.75 0.75L6.92 6.92",
  stroke: "#7A808A",
  strokeWidth: "1.5",
  strokeLinecap: "round"
}), /* @__PURE__ */ React5.createElement("path", {
  d: "M6.92 0.75L0.75 6.92",
  stroke: "#7A808A",
  strokeWidth: "1.5",
  strokeLinecap: "round"
})), /* @__PURE__ */ React5.createElement("defs", null, /* @__PURE__ */ React5.createElement("clipPath", {
  id: "clip0_1021_1505"
}, /* @__PURE__ */ React5.createElement("rect", {
  width: "7.67",
  height: "7.67",
  fill: "white"
})))));
var unchecked_default = UnCheckedIcon;

// src/searchbar/tokenSearch/ResultDetail.tsx
import React38, { useContext as useContext2 } from "react";
import styled2 from "styled-components";

// src/searchbar/icons/default.tsx
import React6 from "react";
var DefaultIcon = ({ height, width }) => /* @__PURE__ */ React6.createElement(abstract_default, {
  height: height != null ? height : 16,
  width: width != null ? width : 16,
  viewBox: "0 0 16 16"
}, /* @__PURE__ */ React6.createElement("g", {
  transform: "translate(0)"
}, /* @__PURE__ */ React6.createElement("path", {
  d: "M7.97 15.94C12.3717 15.94 15.94 12.3717 15.94 7.97C15.94 3.56829 12.3717 0 7.97 0C3.56829 0 0 3.56829 0 7.97C0 12.3717 3.56829 15.94 7.97 15.94Z",
  fill: "white"
})));
var default_default = DefaultIcon;

// src/searchbar/tokenSearch/Logo.tsx
import React35 from "react";

// src/searchbar/icons/kyber.tsx
import React7 from "react";
var KyberIcon = ({ height, width }) => /* @__PURE__ */ React7.createElement(abstract_default, {
  height: height != null ? height : 16,
  width: width != null ? width : 16,
  viewBox: "0 0 11 15"
}, /* @__PURE__ */ React7.createElement("g", {
  transform: "translate(0)"
}, /* @__PURE__ */ React7.createElement("g", {
  clipPath: "url(#clip0_1021_1517)"
}, /* @__PURE__ */ React7.createElement("path", {
  d: "M4.53003 7.01998L10.2 10.02C10.34 10.1 10.52 10.06 10.61 9.92998C10.64 9.88998 10.65 9.83998 10.65 9.78998V4.25998C10.65 4.09998 10.51 3.97998 10.36 3.97998C10.3 3.97998 10.25 3.98998 10.2 4.01998L4.53003 7.01998V7.01998Z",
  fill: "#7A808A"
}), /* @__PURE__ */ React7.createElement("path", {
  d: "M10.0801 2.68995L6.21006 0.0599538C6.07006 -0.0400462 5.89006 -0.0100462 5.78006 0.109954C5.76006 0.139954 5.74006 0.169954 5.73006 0.209954L4.31006 6.06995L10.0501 3.13995C10.1801 3.07995 10.2401 2.92995 10.1801 2.79995V2.77995C10.1801 2.77995 10.1201 2.70995 10.0801 2.67995",
  fill: "#7A808A"
}), /* @__PURE__ */ React7.createElement("path", {
  d: "M6.20006 13.98L10.0801 11.35C10.2001 11.28 10.2401 11.12 10.1701 11L10.1501 10.98C10.1501 10.98 10.0901 10.92 10.0501 10.9L4.31006 7.96997L5.72006 13.84C5.77006 14 5.93006 14.09 6.09006 14.05C6.13006 14.05 6.17006 14.03 6.20006 14",
  fill: "#7A808A"
}), /* @__PURE__ */ React7.createElement("path", {
  d: "M3.06 6.91L4.53 0.540004C4.56 0.390004 4.46 0.250004 4.31 0.220004C4.23 0.200004 4.15 0.220004 4.09 0.260004L0.31 2.95C0.12 3.08 0 3.29 0 3.52V10.31C0 10.54 0.11 10.76 0.31 10.9L4.06 13.57C4.19 13.65 4.37 13.63 4.47 13.5C4.51 13.44 4.53 13.37 4.52 13.29L3.07 6.92L3.06 6.91Z",
  fill: "#7A808A"
})), /* @__PURE__ */ React7.createElement("defs", null, /* @__PURE__ */ React7.createElement("clipPath", {
  id: "clip0_1021_1517"
}, /* @__PURE__ */ React7.createElement("rect", {
  width: "10.65",
  height: "14.05",
  fill: "white"
})))));
var kyber_default = KyberIcon;

// src/searchbar/icons/pangolin.tsx
import React8 from "react";
var PangolinIcon = ({ height, width }) => /* @__PURE__ */ React8.createElement(abstract_default, {
  height: height != null ? height : 16,
  width: width != null ? width : 16,
  viewBox: "0 0 14 12"
}, /* @__PURE__ */ React8.createElement("g", {
  transform: "translate(0)"
}, /* @__PURE__ */ React8.createElement("g", {
  clipPath: "url(#clip0_1021_1532)"
}, /* @__PURE__ */ React8.createElement("path", {
  d: "M10.6201 1.61L7.31006 4.01L9.93006 5.92L13.0401 3.66L11.8501 0H10.0901L10.6101 1.6L10.6201 1.61Z",
  fill: "#7A808A"
}), /* @__PURE__ */ React8.createElement("path", {
  d: "M1.19 0L0 3.65L3.11 5.91L5.73 4.01L2.42 1.6L2.94 0H1.19Z",
  fill: "#7A808A"
}), /* @__PURE__ */ React8.createElement("path", {
  d: "M3.11011 1.38L6.22011 3.64V1.94L3.56011 0L3.11011 1.38Z",
  fill: "#7A808A"
}), /* @__PURE__ */ React8.createElement("path", {
  d: "M9.48007 0L6.82007 1.93V3.63L9.93007 1.37L9.48007 0Z",
  fill: "#7A808A"
}), /* @__PURE__ */ React8.createElement("path", {
  d: "M3.12012 6.64V6.66L6.22012 8.92V4.38L3.12012 6.63V6.64Z",
  fill: "#7A808A"
}), /* @__PURE__ */ React8.createElement("path", {
  d: "M9.92007 6.64L6.82007 4.38V8.91L9.93007 6.65V6.63L9.92007 6.64Z",
  fill: "#7A808A"
}), /* @__PURE__ */ React8.createElement("path", {
  d: "M3.11011 9.57004L6.22011 11.83V9.63004L3.69011 7.79004L3.11011 9.57004Z",
  fill: "#7A808A"
}), /* @__PURE__ */ React8.createElement("path", {
  d: "M6.82007 9.64005V11.84L9.93007 9.58005L9.35007 7.80005L6.82007 9.64005Z",
  fill: "#7A808A"
})), /* @__PURE__ */ React8.createElement("defs", null, /* @__PURE__ */ React8.createElement("clipPath", {
  id: "clip0_1021_1532"
}, /* @__PURE__ */ React8.createElement("rect", {
  width: "13.04",
  height: "11.84",
  fill: "white"
})))));
var pangolin_default = PangolinIcon;

// src/searchbar/icons/sushi.tsx
import React9 from "react";
var SushiIcon = ({ height, width }) => /* @__PURE__ */ React9.createElement(abstract_default, {
  height: height != null ? height : 16,
  width: width != null ? width : 16,
  viewBox: "0 0 16.982 16.982"
}, /* @__PURE__ */ React9.createElement("g", {
  transform: "translate(0)"
}, /* @__PURE__ */ React9.createElement("g", {
  id: "Strategies_-_logo_-_SUSHI",
  "data-name": "Strategies - logo - SUSHI",
  transform: "translate(0.5 0.5)"
}, /* @__PURE__ */ React9.createElement("g", {
  id: "Group_216",
  "data-name": "Group 216",
  transform: "translate(0 0)"
}, /* @__PURE__ */ React9.createElement("g", {
  id: "Group_203",
  "data-name": "Group 203",
  transform: "translate(0 0)"
}, /* @__PURE__ */ React9.createElement("ellipse", {
  id: "Ellipse_16",
  "data-name": "Ellipse 16",
  cx: "7.991",
  cy: "7.991",
  rx: "7.991",
  ry: "7.991",
  transform: "translate(0)",
  fill: "#08333c",
  stroke: "#15b3b0",
  strokeWidth: "1"
})), /* @__PURE__ */ React9.createElement("rect", {
  id: "Rectangle_60",
  "data-name": "Rectangle 60",
  width: "13.404",
  height: "13.404",
  transform: "translate(1.168 1.299)",
  fill: "none"
})), /* @__PURE__ */ React9.createElement("g", {
  id: "Group_227",
  "data-name": "Group 227",
  transform: "translate(2.238 2.846)"
}, /* @__PURE__ */ React9.createElement("g", {
  id: "Group_226",
  "data-name": "Group 226"
}, /* @__PURE__ */ React9.createElement("path", {
  id: "Path_110",
  "data-name": "Path 110",
  d: "M2022.047,649.65c-2.451-1.73-5.046-2.162-5.815-1.057l-2.211,3.22.014.01c-.556.943.242,2.537,1.839,4.013a2.1,2.1,0,0,0,1.126-.706,5.673,5.673,0,0,1,.787-.724.955.955,0,0,1,.7-.237c.336,0,.721.336,1.346,1.153s1.49,1.057,2.018.625c.048-.048.1-.048.144-.1a2.451,2.451,0,0,0,.441-.412c-.129-.039-.276-.078-.393-.117-.048,0-.048-.048-.048-.1s.048-.048.1-.048c.089.029.2.059.3.089l.146.044c.029-.041.059-.084.091-.133.051-.078.107-.166.168-.268a6.452,6.452,0,0,1-.873-.25,10.216,10.216,0,0,1-2.376-1.26,10.928,10.928,0,0,1-2.125-1.877c-.9-1.067-1.277-2.085-.855-2.688l.006-.007c.679-.952,3.028-.47,5.281,1.112a8.78,8.78,0,0,1,2.9,3.1,1.539,1.539,0,0,1,.417.071,1.82,1.82,0,0,1,0,1.586C2025.892,653.59,2024.546,651.284,2022.047,649.65Zm-6.1,0c.048-.048.1,0,.1.048a.939.939,0,0,1,.048.336c.048.048,0,.1-.048.1-.048.048-.1,0-.1-.048a1.225,1.225,0,0,0-.1-.336C2015.848,649.7,2015.9,649.7,2015.944,649.65Zm3.412,4.325c-.048,0-.1.048-.144,0a9.146,9.146,0,0,1-2.676-2.708,6.158,6.158,0,0,1-.4-.752c0-.048,0-.048.048-.1s.1,0,.1.048a6.328,6.328,0,0,0,.478.851,8.921,8.921,0,0,0,2.6,2.513C2019.356,653.879,2019.4,653.927,2019.356,653.975Z",
  transform: "translate(-2013.859 -647.985)",
  fill: "#15b3b0"
}), /* @__PURE__ */ React9.createElement("path", {
  id: "Path_111",
  "data-name": "Path 111",
  d: "M2050.206,663.994c-.007.009-.016.016-.023.026-.336.481.336,1.49,1.442,2.259,1.153.769,2.306,1.009,2.643.529.006-.009.01-.019.016-.029.293-.491-.373-1.475-1.457-2.23C2051.7,663.795,2050.567,663.551,2050.206,663.994Z",
  transform: "translate(-2045.407 -661.731)",
  fill: "#15b3b0"
})), /* @__PURE__ */ React9.createElement("path", {
  id: "Path_112",
  "data-name": "Path 112",
  d: "M2038.732,687.115a1.54,1.54,0,0,0-.417-.071,1.55,1.55,0,0,1,.1,1.437c-.005.009-.01.018-.016.027-.335.479-1.087.6-2.037.4-.061.1-.116.191-.167.268-.032.048-.062.092-.091.133l.037.012c.048,0,.048.048.048.1s-.048.048-.1.048h0l-.085-.026a2.452,2.452,0,0,1-.441.412c-.048.048-.1.048-.144.1-.529.432-1.394.192-2.019-.625s-1.009-1.153-1.346-1.153a.954.954,0,0,0-.7.237,5.674,5.674,0,0,0-.787.724,2.093,2.093,0,0,1-1.126.706,12.5,12.5,0,0,0,1.271,1.024c2.427,1.713,4.994,2.153,5.79,1.089l.024.017,2.211-3.268A1.822,1.822,0,0,0,2038.732,687.115Zm-1.057,2.5a4.731,4.731,0,0,1-1.153-.048.1.1,0,1,1,0-.192,4.642,4.642,0,0,0,1.153.048.1.1,0,1,1,0,.192Z",
  transform: "translate(-2027.421 -681.99)",
  fill: "#15b3b0"
})))));
var sushi_default = SushiIcon;

// src/searchbar/icons/trader.tsx
import React10 from "react";
var TraderIcon = ({ height, width }) => /* @__PURE__ */ React10.createElement(abstract_default, {
  height: height != null ? height : 16,
  width: width != null ? width : 16,
  viewBox: "0 0 11 15"
}, /* @__PURE__ */ React10.createElement("g", {
  transform: "translate(0)"
}, /* @__PURE__ */ React10.createElement("g", {
  clipPath: "url(#clip0_1021_1562)"
}, /* @__PURE__ */ React10.createElement("path", {
  d: "M10.6501 10.88C10.6501 10.88 10.7101 10.96 10.7101 11C10.7101 11.39 10.7101 11.78 10.7101 12.17C10.7101 12.24 10.6701 12.3 10.6101 12.34C9.96006 12.72 9.31006 13.1 8.66006 13.47C8.64006 13.48 8.59006 13.47 8.56006 13.47C8.58006 13.41 8.59006 13.36 8.60006 13.3V12.11C8.68006 12.06 8.75006 12.01 8.83006 11.96C9.25006 11.73 9.67006 11.5 10.0801 11.27C10.2701 11.16 10.4501 11.02 10.6401 10.89L10.6501 10.88Z",
  fill: "#7A808A"
}), /* @__PURE__ */ React10.createElement("path", {
  d: "M8.30992 13.33C8.35992 13.65 8.14992 13.76 7.91992 13.88C7.33992 14.2 6.76992 14.53 6.19992 14.86V13.68C6.19992 13.61 6.17992 13.55 6.16992 13.48C6.32992 13.39 6.49992 13.3 6.65992 13.21C7.06992 12.97 7.48992 12.74 7.88992 12.49C7.98992 12.42 8.08992 12.34 8.17992 12.26C8.29992 12.26 8.27992 12.34 8.27992 12.41C8.28992 12.71 8.29992 13.01 8.30992 13.32V13.33Z",
  fill: "#7A808A"
}), /* @__PURE__ */ React10.createElement("path", {
  d: "M6.15999 13.49C6.16999 13.56 6.18999 13.62 6.18999 13.69V14.86C5.93999 14.72 5.67999 14.59 5.42999 14.45C4.69999 14.03 3.96999 13.6 3.23999 13.17C3.28999 13.13 3.33999 13.09 3.38999 13.05L4.09999 12.63L4.61999 12.89C4.70999 12.95 4.80999 13 4.89999 13.06C4.95999 13.09 5.01999 13.13 5.07999 13.16L5.52999 13.41C5.58999 13.38 5.64999 13.34 5.70999 13.31C5.74999 13.29 5.79999 13.28 5.83999 13.26C5.93999 13.34 6.04999 13.41 6.14999 13.48L6.15999 13.49Z",
  fill: "#7A808A"
}), /* @__PURE__ */ React10.createElement("path", {
  d: "M10.65 10.88C10.46 11.01 10.28 11.15 10.08 11.26C9.66995 11.5 9.23995 11.72 8.82995 11.95C8.74995 11.99 8.66995 12.05 8.59995 12.1C8.46995 12.04 8.33995 11.98 8.19995 11.92L9.09995 11.38C9.09995 11.38 9.10995 11.38 9.11995 11.38L9.22995 11.32C9.22995 11.32 9.26995 11.3 9.29995 11.28C9.61995 11.1 9.92995 10.91 10.25 10.73C10.27 10.73 10.29 10.72 10.31 10.71H10.39L10.44 10.73C10.52 10.78 10.59 10.84 10.67 10.89L10.65 10.88Z",
  fill: "#7A808A"
}), /* @__PURE__ */ React10.createElement("path", {
  d: "M8.19992 11.92C8.32992 11.98 8.45992 12.04 8.59992 12.1V13.29C8.59992 13.35 8.57992 13.41 8.55992 13.46L8.31992 13.34C8.30992 13.04 8.29992 12.74 8.28992 12.43C8.28992 12.36 8.30992 12.27 8.18992 12.28C8.09992 12.22 8.00992 12.16 7.91992 12.1C8.00992 12.04 8.10992 11.98 8.19992 11.93V11.92Z",
  fill: "#7A808A"
}), /* @__PURE__ */ React10.createElement("path", {
  d: "M7.91011 12.09C8.00011 12.15 8.09011 12.21 8.18011 12.27C8.09011 12.35 7.99011 12.43 7.89011 12.5C7.48011 12.74 7.07011 12.98 6.66011 13.22C6.50011 13.31 6.33011 13.4 6.17011 13.49C6.07011 13.42 5.96011 13.35 5.86011 13.28C5.87011 13.26 5.89011 13.24 5.90011 13.22C5.94011 13.2 5.99011 13.17 6.04011 13.14C6.28011 13 6.53011 12.86 6.77011 12.72C6.81011 12.7 6.85011 12.68 6.89011 12.66C7.23011 12.47 7.58011 12.28 7.92011 12.09H7.91011Z",
  fill: "#7A808A"
}), /* @__PURE__ */ React10.createElement("path", {
  d: "M0.0500488 2.89C0.350049 2.71 0.620049 2.56 0.880049 2.4C2.21005 1.64 3.54005 0.880005 4.86005 0.110005C5.04005 -0.0299951 5.29005 -0.0299951 5.48005 0.110005C6.60005 0.780005 7.74005 1.43 8.87005 2.09C9.28005 2.33 9.69005 2.56 10.09 2.79C10.15 2.82 10.2 2.86 10.29 2.91L5.16005 5.86L0.0500488 2.89Z",
  fill: "#7A808A"
}), /* @__PURE__ */ React10.createElement("path", {
  d: "M9.31011 10.4799L9.15011 10.7099L8.99011 10.9199L8.77011 10.8199L8.11011 11.8199L7.43011 11.5899L7.53011 11.9199C7.33011 11.8399 7.15011 11.9599 6.97011 11.8799C6.84011 11.8099 6.69011 11.8199 6.57011 11.9099C6.47011 11.9799 6.29011 11.9299 6.15011 11.9199C6.05011 11.9199 5.95011 11.8899 5.85011 11.8699C5.63011 11.7799 5.37011 11.8299 5.19011 11.9899C5.04011 11.8999 4.89011 11.8099 4.75011 11.7199C4.62011 11.6099 4.44011 11.5899 4.30011 11.6799C4.27011 11.6999 4.21011 11.6799 4.11011 11.6799L4.31011 11.4999C4.31011 11.4999 4.31011 11.4599 4.29011 11.4499C4.05011 11.3099 3.80011 11.1699 3.56011 11.0199C3.43011 10.9299 3.25011 10.9599 3.14011 11.0799C3.20011 11.1799 3.25011 11.2899 3.31011 11.3899C3.36011 11.4699 3.40011 11.5599 3.43011 11.6399C3.43011 11.6699 3.42011 11.6999 3.39011 11.7199C3.36011 11.7299 3.33011 11.7299 3.30011 11.7199C3.25011 11.6599 3.20011 11.5999 3.16011 11.5399C3.08011 11.4199 3.01011 11.2899 2.93011 11.1599L2.42011 11.3699C2.33011 11.4099 2.25011 11.4099 2.21011 11.2699L2.80011 10.9699C2.77011 10.7899 2.55011 10.6799 2.65011 10.4799L1.66011 9.87994C1.62011 9.58994 1.63011 9.28994 1.70011 8.99994C1.78011 8.71994 1.85011 8.43994 1.92011 8.15994C1.94011 8.06994 1.95011 7.96994 1.95011 7.87994V6.56994C1.95011 6.38994 2.07011 6.22994 2.25011 6.18994C2.30011 6.18994 2.35011 6.18994 2.39011 6.22994C2.53011 6.29994 2.66011 6.38994 2.79011 6.44994C2.89011 6.49994 2.95011 6.60994 2.93011 6.71994V7.97994C2.93011 8.08994 2.96011 8.19994 3.03011 8.27994C3.71011 9.10994 4.39011 9.93994 5.06011 10.7699C5.06011 10.7699 5.08011 10.7699 5.10011 10.7899C5.10011 10.7199 5.10011 10.6599 5.10011 10.5999V8.51994C5.10011 8.36994 5.09011 8.22994 5.07011 8.08994C5.04011 7.93994 5.11011 7.78994 5.24011 7.71994C5.52011 7.55994 5.81011 7.39994 6.09011 7.23994C6.16011 7.18994 6.25011 7.17994 6.33011 7.22994C6.75011 7.46994 7.18011 7.69994 7.66011 7.96994L7.03011 8.33994V9.09994C7.25011 9.01994 7.45011 8.90994 7.63011 8.75994C7.67011 8.72994 7.69011 8.63994 7.69011 8.57994C7.69011 8.40994 7.69011 8.23994 7.69011 8.03994L7.93011 8.14994C8.26011 7.83994 8.62011 7.55994 9.00011 7.30994C9.08011 7.51994 9.00011 7.72994 9.07011 7.93994C9.27011 7.82994 9.45011 7.72994 9.63011 7.61994C9.68011 7.56994 9.72011 7.50994 9.73011 7.42994C9.75011 7.31994 9.75011 7.20994 9.73011 7.09994C9.70011 6.96994 9.79011 6.83994 9.92011 6.80994C10.0201 6.77994 10.1101 6.73994 10.2301 6.68994V7.81994C10.2301 7.81994 10.2801 7.86994 10.3101 7.88994C10.4201 7.97994 10.6301 7.98994 10.6301 8.14994C10.6301 8.40994 10.7201 8.68994 10.5201 8.93994C10.2301 9.29994 9.97011 9.67994 9.69011 10.0499C9.65011 10.1199 9.57011 10.1799 9.49011 10.1899L9.26011 10.4699L9.31011 10.4799Z",
  fill: "#7A808A"
}), /* @__PURE__ */ React10.createElement("path", {
  d: "M9.73007 5.18C9.83007 5.12 9.92007 5.06 10.0101 5.02C10.1001 4.98 10.1801 4.94 10.3001 4.88C10.3001 5.06 10.3101 5.2 10.3001 5.34C10.2701 5.49 10.3601 5.64 10.5001 5.69C10.5601 5.72 10.6101 5.75 10.6601 5.79C10.5901 5.9 10.4901 5.91 10.4001 5.94C9.93007 6.09 9.48007 6.31 9.06007 6.58C8.77007 6.79 8.49007 7.01 8.21007 7.24C8.11007 7.31 8.03007 7.4 7.89007 7.32C7.38007 7.02 6.87007 6.73 6.32007 6.41C6.40007 6.31 6.49007 6.22 6.58007 6.14C7.05007 5.73 7.57007 5.4 8.13007 5.14C8.39007 5.03 8.66007 4.93 8.92007 4.82C9.00007 4.79 9.09007 4.81 9.16007 4.86C9.34007 4.97 9.52007 5.08 9.73007 5.19V5.18Z",
  fill: "#7A808A"
}), /* @__PURE__ */ React10.createElement("path", {
  d: "M2.45009 12.1601C2.29009 12.1501 2.29009 12.0101 2.22009 11.9201C2.15009 11.8301 2.07009 11.7401 1.98009 11.6401L1.57009 11.7201C1.60009 11.5401 1.75009 11.5201 1.86009 11.4201C1.76009 11.2401 1.69009 11.0301 1.58009 10.8501C1.43009 10.6001 1.29009 10.3501 1.14009 10.1001C1.05009 9.95006 0.960088 9.79006 0.870088 9.64006C0.810088 9.54006 0.720088 9.56006 0.620088 9.59006C0.550088 9.61006 0.480088 9.63006 0.400088 9.65006C0.390088 9.65006 0.370088 9.63006 0.340088 9.60006L0.820088 9.31006C1.36009 10.2701 2.00009 11.1501 2.44009 12.1501L2.45009 12.1601Z",
  fill: "#7A808A"
}), /* @__PURE__ */ React10.createElement("path", {
  d: "M2.14002 13.71C1.60002 13.41 1.08002 13.08 0.530018 12.81C0.220018 12.7 0.0400178 12.38 0.110018 12.06C0.130018 11.77 0.140018 11.49 0.140018 11.2H0.290018L1.20002 11.75C1.32002 11.82 1.44002 11.89 1.57002 11.95C1.76002 12.06 1.95002 12.17 2.14002 12.28V12.34C2.15002 12.8 2.14002 13.25 2.14002 13.71Z",
  fill: "#7A808A"
}), /* @__PURE__ */ React10.createElement("path", {
  d: "M2.13988 13.71C2.13988 13.26 2.13988 12.81 2.13988 12.35C2.34988 12.45 2.54988 12.55 2.75988 12.65L3.05988 12.45C3.10988 12.42 3.16988 12.4 3.21988 12.37L3.66988 12.12C3.71988 12.09 3.77988 12.06 3.82988 12.04L4.14988 11.92C4.14988 11.97 4.14988 12.03 4.14988 12.08V12.28C4.13988 12.38 4.11988 12.47 4.11988 12.56C3.83988 12.73 3.54988 12.89 3.26988 13.06C3.20988 13.1 3.14988 13.15 3.09988 13.2C2.80988 13.35 2.51988 13.51 2.23988 13.66C2.19988 13.68 2.16988 13.69 2.12988 13.71H2.13988Z",
  fill: "#7A808A"
}), /* @__PURE__ */ React10.createElement("path", {
  d: "M0.1 10.7C0.04 10.7 0 10.66 0 10.6V3.00002C0 2.94002 0.04 2.90002 0.1 2.90002C0.16 2.90002 0.2 2.94002 0.2 3.00002V10.6C0.2 10.66 0.16 10.7 0.1 10.7Z",
  fill: "#7A808A"
}), /* @__PURE__ */ React10.createElement("path", {
  d: "M10.2599 4.45003C10.1999 4.45003 10.1599 4.41003 10.1599 4.35003V3.01003C10.1599 2.95003 10.1999 2.91003 10.2599 2.91003C10.3199 2.91003 10.3599 2.95003 10.3599 3.01003V4.35003C10.3599 4.41003 10.3199 4.45003 10.2599 4.45003Z",
  fill: "#7A808A"
})), /* @__PURE__ */ React10.createElement("defs", null, /* @__PURE__ */ React10.createElement("clipPath", {
  id: "clip0_1021_1562"
}, /* @__PURE__ */ React10.createElement("rect", {
  width: "10.72",
  height: "14.87",
  fill: "white"
})))));
var trader_default = TraderIcon;

// src/searchbar/icons/bsc.tsx
import React11 from "react";
var BscIcon = ({ height, width }) => /* @__PURE__ */ React11.createElement(abstract_default, {
  height: height != null ? height : 16,
  width: width != null ? width : 16,
  viewBox: "0 0 16 16"
}, /* @__PURE__ */ React11.createElement("g", {
  transform: "translate(0)"
}, /* @__PURE__ */ React11.createElement("path", {
  d: "M7.97 15.94C12.3717 15.94 15.94 12.3717 15.94 7.97C15.94 3.56829 12.3717 0 7.97 0C3.56829 0 0 3.56829 0 7.97C0 12.3717 3.56829 15.94 7.97 15.94Z",
  fill: "white"
}), /* @__PURE__ */ React11.createElement("path", {
  d: "M5.0799 6.78001L7.9799 3.88001L10.8799 6.78001L12.5599 5.09001L7.9799 0.51001L3.3999 5.09001L5.0799 6.78001Z",
  fill: "#F3BA2F"
}), /* @__PURE__ */ React11.createElement("path", {
  d: "M2.20122 6.28291L0.518311 7.96582L2.20122 9.64873L3.88414 7.96582L2.20122 6.28291Z",
  fill: "#F3BA2F"
}), /* @__PURE__ */ React11.createElement("path", {
  d: "M5.07991 9.15002L7.97991 12.05L10.8799 9.15002L12.5699 10.84L7.98991 15.42L3.40991 10.84L5.08991 9.16002",
  fill: "#F3BA2F"
}), /* @__PURE__ */ React11.createElement("path", {
  d: "M13.7554 6.28291L12.0725 7.96582L13.7554 9.64873L15.4383 7.96582L13.7554 6.28291Z",
  fill: "#F3BA2F"
}), /* @__PURE__ */ React11.createElement("path", {
  d: "M9.68001 7.97001L7.97001 6.26001L6.71001 7.52001L6.56001 7.66001L6.26001 7.96001L7.97001 9.67001L9.68001 7.96001",
  fill: "#F3BA2F"
})));
var bsc_default = BscIcon;

// src/searchbar/icons/avalanche.tsx
import React12 from "react";
var AvalancheIcon = ({ height, width }) => /* @__PURE__ */ React12.createElement(abstract_default, {
  height: height != null ? height : 16,
  width: width != null ? width : 16,
  viewBox: "0 0 16 16"
}, /* @__PURE__ */ React12.createElement("g", {
  transform: "translate(0)"
}, /* @__PURE__ */ React12.createElement("path", {
  d: "M8 16C12.4183 16 16 12.4183 16 8C16 3.58172 12.4183 0 8 0C3.58172 0 0 3.58172 0 8C0 12.4183 3.58172 16 8 16Z",
  fill: "#E84142"
}), /* @__PURE__ */ React12.createElement("path", {
  d: "M10.7799 8.17002C10.8699 7.89002 11.1699 7.74002 11.4499 7.84002C11.6099 7.89002 11.7299 8.02002 11.7799 8.17002L13.4999 11.19C13.7799 11.67 13.5499 12.06 12.9999 12.06H9.53988C8.98988 12.06 8.76988 11.67 9.03988 11.19L10.7799 8.17002ZM7.44988 2.37002C7.53988 2.10002 7.83988 1.95002 8.10988 2.04002C8.26988 2.09002 8.38988 2.21002 8.43988 2.37002L8.81988 3.06002L9.71988 4.65002C9.93988 5.10002 9.93988 5.63002 9.71988 6.09002L6.68988 11.34C6.41988 11.77 5.94988 12.04 5.44988 12.07H2.94988C2.39988 12.07 2.16988 11.69 2.44988 11.2L7.44988 2.37002Z",
  fill: "white"
})));
var avalanche_default = AvalancheIcon;

// src/searchbar/icons/moonbeam.tsx
import React13 from "react";
var MoonBeamIcon = ({ height, width }) => /* @__PURE__ */ React13.createElement(abstract_default, {
  height: height != null ? height : 16,
  width: width != null ? width : 16,
  viewBox: "0 0 400 400"
}, /* @__PURE__ */ React13.createElement("g", {
  transform: "translate(0)"
}, /* @__PURE__ */ React13.createElement("path", {
  id: "Path_185",
  fill: "#53CBC8",
  d: "M237.65,32.88c-67.68,0.03-122.53,54.91-122.51,122.59l0,0c0,0.09,0,0.17,0,0.26v0.19\n	c0.18,3.2,2.83,5.7,6.03,5.69h232.97c3.2,0.01,5.85-2.49,6.03-5.69v-0.19c0-0.09,0-0.17,0-0.26l0,0\n	C360.19,87.78,305.33,32.9,237.65,32.88L237.65,32.88z"
}), /* @__PURE__ */ React13.createElement("path", {
  id: "Path_186",
  fill: "#E1147B",
  d: "M34.01,292.35c0,4.12-3.34,7.46-7.46,7.46s-7.46-3.34-7.46-7.46c0-4.12,3.34-7.46,7.46-7.46l0,0\n	C30.67,284.89,34.01,288.23,34.01,292.35z"
}), /* @__PURE__ */ React13.createElement("path", {
  id: "Path_187",
  fill: "#E1147B",
  d: "M346.04,251.07H96.06c-4.06,0.01-7.35,3.3-7.34,7.36c0,1.22,0.3,2.41,0.88,3.48l0.12,0.23\n	c1.28,2.37,3.77,3.85,6.46,3.85h249.73c2.7,0,5.18-1.47,6.46-3.85l0.12-0.23c1.93-3.58,0.59-8.04-2.99-9.96\n	C348.44,251.38,347.25,251.08,346.04,251.07z"
}), /* @__PURE__ */ React13.createElement("path", {
  id: "Path_188",
  fill: "#E1147B",
  d: "M379.25,183.44H96.04c-4.06,0.01-7.35,3.31-7.34,7.38c0,0.13,0,0.26,0.01,0.4\n	c0,0.08,0,0.16,0,0.23c0.22,3.89,3.44,6.92,7.33,6.91h283.18c3.89,0.01,7.11-3.03,7.33-6.91c0-0.08,0-0.16,0-0.23\n	c0.23-4.06-2.88-7.53-6.94-7.76C379.5,183.45,379.37,183.44,379.25,183.44z"
}), /* @__PURE__ */ React13.createElement("path", {
  id: "Path_189",
  fill: "#E1147B",
  d: "M272.61,352.53H144.98c-4.06,0.01-7.34,3.31-7.33,7.37c0.01,2.78,1.58,5.31,4.06,6.55l0.47,0.23\n	c1.02,0.51,2.14,0.77,3.27,0.76h126.7c1.14,0,2.26-0.26,3.28-0.76l0.47-0.23c3.63-1.82,5.1-6.23,3.28-9.86\n	C277.94,354.1,275.39,352.53,272.61,352.53z"
}), /* @__PURE__ */ React13.createElement("path", {
  id: "Path_190",
  fill: "#E1147B",
  d: "M350.61,318.71H222.96c-4.06,0.01-7.34,3.31-7.33,7.37c0.01,2.78,1.58,5.31,4.06,6.55l0.47,0.23\n	c1.02,0.5,2.14,0.77,3.28,0.76h126.7c1.14,0,2.26-0.26,3.28-0.76l0.47-0.23c3.63-1.82,5.1-6.23,3.28-9.86\n	C355.93,320.29,353.39,318.72,350.61,318.71z"
}), /* @__PURE__ */ React13.createElement("path", {
  id: "Path_191",
  fill: "#E1147B",
  d: "M176.56,297.47l-0.22-0.23c-2.75-2.98-2.57-7.63,0.41-10.38c1.35-1.25,3.13-1.95,4.97-1.95\n	h207.15c4.06,0,7.34,3.3,7.34,7.35c0,1.84-0.7,3.62-1.95,4.97l-0.22,0.23c-1.39,1.49-3.34,2.34-5.38,2.35H181.95\n	C179.9,299.81,177.95,298.96,176.56,297.47z"
}), /* @__PURE__ */ React13.createElement("path", {
  id: "Path_192",
  fill: "#E1147B",
  d: "M53.19,284.89h98.92c4.06,0.01,7.34,3.31,7.33,7.37c-0.01,2.78-1.58,5.31-4.06,6.55l-0.47,0.23\n	c-1.02,0.51-2.14,0.77-3.27,0.76H53.66c-1.14,0-2.26-0.26-3.28-0.76l-0.47-0.23c-3.63-1.82-5.1-6.23-3.28-9.86\n	C47.87,286.47,50.41,284.9,53.19,284.89z"
}), /* @__PURE__ */ React13.createElement("path", {
  id: "Path_193",
  fill: "#E1147B",
  d: "M76.87,190.92c0,4.12-3.34,7.45-7.46,7.45s-7.45-3.34-7.45-7.46c0-4.11,3.34-7.45,7.45-7.45\n	C73.53,183.46,76.87,186.8,76.87,190.92z"
}), /* @__PURE__ */ React13.createElement("path", {
  id: "Path_194",
  fill: "#E1147B",
  d: "M252.65,226.71l0.06-0.23c1.05-3.92-1.27-7.94-5.19-8.99c-0.63-0.17-1.27-0.25-1.92-0.25H38.44\n	c-4.05-0.01-7.35,3.26-7.36,7.32c0,0.65,0.08,1.3,0.25,1.92c0,0.08,0.04,0.16,0.06,0.23c0.87,3.21,3.78,5.45,7.11,5.44h207.05\n	c3.33,0,6.25-2.23,7.11-5.44"
}), /* @__PURE__ */ React13.createElement("path", {
  id: "Path_195",
  fill: "#E1147B",
  d: "M19.26,224.72c0,4.12-3.34,7.45-7.46,7.45c-4.12,0-7.45-3.34-7.45-7.46\n	c0-4.12,3.34-7.45,7.45-7.45C15.92,217.26,19.26,220.6,19.26,224.72z"
}), /* @__PURE__ */ React13.createElement("path", {
  id: "Path_196",
  fill: "#E1147B",
  d: "M76.87,258.53c0,4.12-3.34,7.45-7.46,7.45c-4.12,0-7.45-3.34-7.45-7.46\n	c0-4.11,3.34-7.45,7.45-7.45C73.53,251.07,76.87,254.41,76.87,258.53z"
}), /* @__PURE__ */ React13.createElement("path", {
  id: "Path_197",
  fill: "#E1147B",
  d: "M203.79,326.17c0,4.12-3.34,7.46-7.46,7.46c-4.12,0-7.46-3.34-7.46-7.46\n	c0-4.12,3.34-7.46,7.46-7.46l0,0C200.45,318.71,203.79,322.05,203.79,326.17z"
}), /* @__PURE__ */ React13.createElement("path", {
  id: "Path_198",
  fill: "#E1147B",
  d: "M125.8,359.97c0,4.12-3.34,7.45-7.46,7.45c-4.12,0-7.45-3.34-7.45-7.46\n	c0-4.12,3.34-7.45,7.45-7.45C122.47,352.51,125.8,355.85,125.8,359.97z"
})));
var moonbeam_default = MoonBeamIcon;

// src/searchbar/icons/moonriver.tsx
import React14 from "react";
var MoonRiverIcon = ({ height, width }) => /* @__PURE__ */ React14.createElement(abstract_default, {
  height: height != null ? height : 16,
  width: width != null ? width : 16,
  viewBox: "0 0 400 400"
}, /* @__PURE__ */ React14.createElement("g", {
  transform: "translate(0)"
}, /* @__PURE__ */ React14.createElement("path", {
  fill: "#EFB505",
  d: "M64.78,180.08c-4.92-20.6-3.71-39.83,0.69-58.92C80.77,54.7,141.25,7.78,208.66,9.89\n		c69.28,2.16,127.08,51.69,137.91,119.6c2.4,15.07,0.88,30.83,0.29,46.24c-0.13,3.46-3.2,7.83-6.2,10\n		c-32.54,23.48-78.97,23.69-112.12,0.91c-7.67-5.27-15.35-10.53-23.02-15.81c-38.93-26.77-88.15-26.81-127.02-0.1\n		C74.33,173.59,70.15,176.42,64.78,180.08z"
}), /* @__PURE__ */ React14.createElement("path", {
  fill: "#4FC2C1",
  d: "M145.2,170.15c23.06,0.43,45.95,6.11,66.14,20.76c7.3,5.3,14.84,10.28,22.32,15.33\n		c32.52,21.95,72.33,21.87,104.93-0.17c2.1-1.42,4.17-2.91,6.33-4.24c4.73-2.92,9.27-2.93,12.55,2.01c3.05,4.6,1.37,8.63-2.69,11.8\n		c-18.77,14.66-39.9,23.18-63.83,24.01c-25.02,0.86-47.8-5.49-68.47-20.15c-16.48-11.68-32.24-24.93-52.94-29.15\n		c-30.34-6.19-58.9-3.18-84.63,15.59c-4.55,3.32-9.27,6.43-14.03,9.47c-4.39,2.8-9.61,2.98-11.66-1.82\n		c-1.35-3.14-0.47-9.38,1.89-11.62C82.28,181.86,113.4,170.23,145.2,170.15z"
}), /* @__PURE__ */ React14.createElement("path", {
  fill: "#50C6C4",
  d: "M266.7,306.33c-0.01,13.51-0.06,27.02,0.02,40.53c0.04,6.48-2.04,11.57-9.32,11.29\n		c-6.75-0.26-8.48-5.34-8.47-11.36c0.05-27.02,0.05-54.04,0.01-81.07c-0.01-6.03,1.77-11.08,8.55-11.26\n		c7.25-0.2,9.32,4.8,9.26,11.33C266.61,279.3,266.7,292.82,266.7,306.33z"
}), /* @__PURE__ */ React14.createElement("path", {
  fill: "#51C6C4",
  d: "M108.32,258.02c-0.01-12.7-0.02-25.39,0-38.09c0.01-6.44,1.46-12.67,9.14-12.69c7.3-0.01,8.77,6.28,8.81,12.2\n		c0.17,26.52,0.2,53.05,0.05,79.57c-0.03,5.67-1.92,11.48-8.69,11.44c-6.91-0.04-9.29-5.41-9.3-11.8\n		C108.33,285.1,108.33,271.56,108.32,258.02z"
}), /* @__PURE__ */ React14.createElement("path", {
  fill: "#50C5C3",
  d: "M301.77,303.77c0,11.28-0.04,22.57,0.02,33.85c0.03,6.16-2.1,10.94-8.87,10.95\n		c-6.76,0.01-8.94-4.77-8.94-10.92c0.03-23.13,0.02-46.26,0-69.39c0-5.8,2.13-10.31,8.43-10.52c6.73-0.22,9.33,4.26,9.35,10.5\n		C301.79,280.07,301.77,291.92,301.77,303.77z"
}), /* @__PURE__ */ React14.createElement("path", {
  fill: "#4EC0BF",
  d: "M91.15,265.64c0.01,8.75,0,17.49,0.01,26.24c0.01,6.48-1.41,12.41-9.26,12.5c-7.46,0.08-9-5.62-9-11.77\n		c-0.02-18.62-0.01-37.23,0.1-55.85c0.03-5.96,2.14-11.11,8.96-10.98c6.58,0.13,9.02,5.15,9.13,11.1\n		C91.27,246.46,91.14,256.05,91.15,265.64z"
}), /* @__PURE__ */ React14.createElement("path", {
  fill: "#4DC0BF",
  d: "M196.58,259.35c0,9.31-0.02,18.63,0,27.94c0.02,6.07-2.08,11.05-8.74,11.27c-7.33,0.24-9.35-5.1-9.35-11.44\n		c-0.01-18.63-0.01-37.26,0.05-55.88c0.02-5.87,1.67-11.28,8.55-11.35c7.09-0.07,9.45,5.13,9.49,11.52\n		C196.62,240.72,196.59,250.04,196.58,259.35z"
}), /* @__PURE__ */ React14.createElement("path", {
  fill: "#4FC4C2",
  d: "M337.24,274.32c0.01,5.06,0.2,10.13-0.05,15.17c-0.27,5.58-3.64,9.84-8.96,8.76c-3.32-0.67-7.99-5.2-8.3-8.36\n		c-1.04-10.57-1.04-21.38,0.01-31.95c0.31-3.17,4.96-7.7,8.29-8.39c5.34-1.1,8.69,3.17,8.95,8.75\n		C337.43,263.63,337.24,268.98,337.24,274.32z"
}), /* @__PURE__ */ React14.createElement("path", {
  fill: "#50C6C4",
  d: "M231.57,259.23c-0.01,13.51-0.05-7.42,0.03,6.09c0.04,6.48-2.04,11.57-9.32,11.29\n		c-6.75-0.26-8.48-5.34-8.47-11.36c0.05-27.02,0.03,13.84-0.01-13.18c-0.01-6.03,1.77-11.08,8.55-11.26\n		c7.25-0.2,9.32,4.8,9.26,11.33C231.48,265.65,231.57,245.72,231.57,259.23z"
}), /* @__PURE__ */ React14.createElement("path", {
  fill: "#50C6C4",
  d: "M161.19,257.74c-0.01,13.51-0.06,110.54,0.02,124.05c0.04,6.48-2.04,11.57-9.32,11.29\n		c-6.75-0.26-8.48-5.34-8.47-11.36c0.05-27.02,0.05-137.56,0.01-164.58c-0.01-6.03,1.77-11.08,8.55-11.26\n		c7.25-0.2,9.32,4.8,9.26,11.33C161.1,230.72,161.19,244.23,161.19,257.74z"
})));
var moonriver_default = MoonRiverIcon;

// src/searchbar/icons/apeswap.tsx
import React15 from "react";
var ApeSwapIcon = ({ height, width }) => /* @__PURE__ */ React15.createElement(abstract_default, {
  height: height != null ? height : 16,
  width: width != null ? width : 16,
  viewBox: "0 0 400 400"
}, /* @__PURE__ */ React15.createElement("g", {
  transform: "translate(0)"
}, /* @__PURE__ */ React15.createElement("path", {
  fill: "#AB705C",
  d: "M201,14.2c1.1,4.4,2.2,8.9,3.2,13.3c0.3,1.5,1.1,1.7,2.5,2c4.7,1,8.5-0.5,12.3-3.1c5.9-3.9,12-7.3,18.2-11\n		c0.2,0.6,0.4,0.9,0.4,1.2c0.2,5.6,0.5,11.3,0.5,16.9c0,1.6,0.6,2.2,2,2.7c24.8,8.8,45.7,23.5,63.4,42.7\n		c15.7,17,27.6,36.4,35.5,58.2c0.2,0.7,0.5,1.4,0.8,2c13.5-6.8,26.3-5.5,38.2,3.2c8.5,6.2,13,15.3,15.4,25.5\n		c6.3,27.4-5.7,54.9-30.3,69c-2.4,1.4-5,2.3-7.8,3.6c0.5,3.5,1.2,7.2,1.7,10.9c2.6,20.4-0.7,39.9-9.3,58.5\n		c-11.9,25.5-30.9,44.3-54.7,58.6c-20.9,12.5-43.6,20-67.7,23.1c-4.9,0.6-9.9,1-14.9,1.5c-0.4,0-0.8,0.3-1.2,0.5c-0.8,0-1.6,0-2.5,0\n		c-0.4-0.2-0.9-0.5-1.3-0.5c-5.3,0-10.6,0-15.9,0c-4.7-0.4-9.5-0.8-14.2-1.2c-0.5-0.5-0.9-1.1-1.5-1.5c-8.8-5-16.6-11.5-24.3-18.1\n		c-1.6-1.3-2.7-3.1-4.1-4.7c0.6,0.2,1.2,0.4,1.8,0.6c15.5,7.5,32,11,49.2,11.5c10.1,0.3,20.1-0.7,29.9-2.9\n		c26-5.9,47.9-18.4,64.2-39.8c10.1-13.3,15.7-28.3,16.9-45c0.7-9.9-1.9-19.3-5-28.5c-4-11.9-2.6-23,3.9-33.6\n		c7-11.4,10.3-23.6,9.1-37.1c-1.3-14.9-7.5-27.5-18.1-37.8c-10.4-10.2-23-16.1-37.6-17.8c-14.1-1.7-27.6,0.4-40,7.3\n		c-13.5,7.5-26.8,7.5-40.3,0.1c-13.6-7.5-28.2-9.4-43.4-6.9c-7.6,1.2-14.6,4-21.4,7.5c0.4-2.1,0.7-4.2,1.2-6.2\n		c4.1-15.5,9.9-30.3,17.3-44.6c8.1-15.7,17.4-30.6,28.3-44.5c8.5-10.9,17.4-21.4,28.2-30C192.8,17.3,196.3,14.4,201,14.2z\n		 M352.3,229.6c2.7-1.4,5.1-2.5,7.3-3.8c16.9-10.8,25.6-31,21.8-50.8c-1.7-8.8-5.3-16.7-12.8-22.1c-7.8-5.6-16.4-7.1-25.7-3.9\n		c0.2,1,0.3,1.8,0.5,2.6c2.7,10.5,4.3,21.3,4.2,32.1c-0.1,11.4,0.6,22.8,2.5,34.1C350.7,221.5,351.5,225.3,352.3,229.6z"
}), /* @__PURE__ */ React15.createElement("path", {
  fill: "#8F6355",
  d: "M201,14.2c-4.7,0.2-8.2,3.1-11.6,5.8c-10.8,8.6-19.7,19.1-28.2,30c-10.9,13.9-20.2,28.8-28.3,44.5\n		c-7.4,14.3-13.2,29.1-17.3,44.6c-0.5,2-0.8,4.1-1.2,6.2c-0.2,0.3-0.4,0.5-0.7,0.8c-7.2,3.6-13,9-17.9,15.3\n		c-9.4,12.3-13.9,26.2-12.5,41.8c0.8,9,3.3,17.3,8.1,24.9c7.4,11.8,9.1,24,4.5,37.4c-2.2,6.3-3.8,13-4.4,19.7\n		c-0.9,9.5,0.9,18.9,4,27.9c6.4,18.4,17.8,33.1,33.5,44.4c3.9,2.8,8.3,5.1,12.4,7.7c1,0.7,1.9,1.4,2.9,2c0.3,0.2,0.6,0.3,0.9,0.5\n		l0,0c1.4,1.6,2.5,3.3,4.1,4.7c7.7,6.6,15.4,13.1,24.3,18.1c0.6,0.3,1,1,1.5,1.5c-7.6-1.4-15.3-2.4-22.8-4.3\n		c-32-8.1-60-23.3-82.1-48.3c-17.6-20-27.9-43.2-29.3-70c-0.5-8.9,0.3-17.8,2.1-26.6c0.2-1.1,0.9-2.2-1-2.9\n		c-19.6-8.1-31.5-22.8-36.9-43.1c-0.7-2.7-1.2-5.5-1.7-8.2c0-3.8,0-7.5,0-11.3c0.5-2.8,0.9-5.6,1.5-8.3c2.4-10.5,6.8-20,15.6-26.4\n		c11.9-8.7,24.7-9.9,37.8-3.4c3.7-8,6.9-16.2,11.1-23.9c19.3-35.3,46.8-61.8,84.4-77c4.3-1.7,7.3-3.9,9.9-7.8\n		c6.8-10.5,16.2-17.8,28.9-20.2c1.4-0.3,2.9-0.4,4.4-0.6c0.9-0.1,1.8,0,3,0C200.3,11,200.7,12.6,201,14.2z M46.1,229.2\n		c0.3-0.6,0.4-0.8,0.5-1.1c2.5-11.7,4.3-23.5,4.4-35.5c0.1-9.2-0.1-18.4,1.5-27.6c1-5.3,2.1-10.7,3.1-16c-8.8-3.7-21-1.3-28.1,5.9\n		c-10,10.2-12.3,22.8-10.6,36.4c1.2,9.6,5.3,18.1,11.7,25.4C33.5,222.1,39,226.5,46.1,229.2z"
}), /* @__PURE__ */ React15.createElement("path", {
  fill: "#D0AFA3",
  d: "M189.5,393.6c0.1-0.2,0-0.3,0-0.5c5.3,0,10.6,0,15.9,0c0.4,0,0.9,0.3,1.3,0.5\n		C200.9,393.6,195.2,393.6,189.5,393.6z"
}), /* @__PURE__ */ React15.createElement("path", {
  fill: "#F5DFBB",
  d: "M113.7,146.1c0.2-0.3,0.4-0.5,0.7-0.8c6.8-3.5,13.8-6.3,21.4-7.5c15.2-2.4,29.8-0.5,43.4,6.9\n		c13.5,7.4,26.8,7.4,40.3-0.1c12.5-6.9,25.9-9,40-7.3c14.5,1.7,27.2,7.7,37.6,17.8c10.6,10.3,16.8,22.9,18.1,37.8\n		c1.2,13.5-2.2,25.7-9.1,37.1c-6.5,10.6-7.9,21.7-3.9,33.6c3.1,9.2,5.7,18.6,5,28.5c-1.2,16.7-6.8,31.7-16.9,45\n		c-16.3,21.4-38.2,33.9-64.2,39.8c-9.8,2.2-19.8,3.2-29.9,2.9c-17.2-0.5-33.6-4.1-49.2-11.5c-0.6-0.3-1.2-0.4-1.8-0.6c0,0,0,0,0,0\n		c-0.3-0.2-0.6-0.3-0.9-0.5c-1-0.7-1.9-1.4-2.9-2c-0.3-0.5-0.5-1-0.8-1.4c-2.8-3.2-5.7-6.2-8.4-9.5c-8.8-10.7-16.1-22.3-20.6-35.6\n		c-5.9-17.2-8.6-35.1-9.2-53.2c-0.5-13.4,0.1-26.8,0.4-40.1c0.1-4.4,0.5-8.8,1-13.1c0.7-6.8,1.5-13.5,2.4-20.3\n		c1-7.1,2-14.1,3.2-21.2C110.7,162.5,112.2,154.3,113.7,146.1z M162.3,205.2c0.1-2,0.2-4.1,0.1-6.1c-0.1-9.9-8.8-18-18.7-17.4\n		c-5.8-0.2-10.3,2.2-14.4,6.2c-5.8,5.5-5.3,22-1.1,27.2c5,6.2,13,9,20.8,6.8C155.6,220.1,162.2,214.2,162.3,205.2z M273.3,204.2\n		c0-1.6,0-3.3,0.1-4.9c0.5-11.2-10.8-18.7-18.7-17.6c-8.3-0.3-16.6,5.7-18,13.7c-0.7,3.9-0.4,8-0.3,11.9c0.2,3.7,2,6.9,4.6,9.5\n		c5.3,5.6,14,7.4,21.3,4.3C269.5,218.1,273.7,211.6,273.3,204.2z M235.1,344.1c13.4-8.7,22.3-20.6,25.2-36.6\n		c1.1-5.8-1.4-8.7-7.3-8.7c-7.2,0-14.4,0-21.6,0c-28.8,0-57.5,0-86.3,0c-5,0-7.8,3.2-7,7.7c2.8,16.3,11.6,28.6,25.4,37.6\n		c2.4,1.4,4.7,3,7.1,4.1c13.4,6.2,27.4,7.9,41.8,5C220.6,351.7,228.3,349,235.1,344.1z M188.4,265.6c3.3,0,5.3-1.4,5.9-3.9\n		c0.6-2.3-0.5-4.8-2.8-5.9c-3.8-1.8-7.7-3.6-11.6-5.3c-3.3-1.5-6.3-0.5-7.6,2.5c-1.2,2.9,0,5.6,3.3,7.1c3.5,1.7,7.1,3.3,10.7,4.9\n		C187.1,265.3,188.1,265.5,188.4,265.6z M209.4,265.5c0.4,0,0.9,0.1,1.2,0c4.7-2.1,9.6-4.1,14.1-6.6c2.3-1.2,2.6-4.3,1.4-6.5\n		c-1.2-2.2-3.9-3.4-6.3-2.4c-4.4,1.8-8.7,3.8-12.9,5.9c-2.2,1.1-3.1,3.6-2.5,5.8C205,264.1,206.9,265.6,209.4,265.5z"
}), /* @__PURE__ */ React15.createElement("path", {
  fill: "#F5DFBB",
  d: "M352.3,229.6c-0.8-4.3-1.6-8.1-2.3-11.9c-1.9-11.3-2.6-22.6-2.5-34.1c0.1-10.9-1.5-21.6-4.2-32.1\n		c-0.2-0.8-0.3-1.6-0.5-2.6c9.3-3.2,17.9-1.7,25.7,3.9c7.5,5.4,11.1,13.3,12.8,22.1c3.9,19.8-4.9,40.1-21.8,50.8\n		C357.4,227.1,355,228.1,352.3,229.6z"
}), /* @__PURE__ */ React15.createElement("path", {
  fill: "#C2AD95",
  d: "M113.7,146.1c-1.5,8.2-3.1,16.4-4.4,24.6c-1.2,7-2.2,14.1-3.2,21.2c-0.9,6.7-1.7,13.5-2.4,20.3\n		c-0.5,4.4-0.9,8.7-1,13.1c-0.3,13.4-0.9,26.8-0.4,40.1c0.7,18.1,3.3,35.9,9.2,53.2c4.6,13.2,11.8,24.9,20.6,35.6\n		c2.7,3.3,5.6,6.3,8.4,9.5c0.4,0.4,0.6,1,0.8,1.4c-4.2-2.5-8.5-4.8-12.4-7.7c-15.7-11.3-27.1-26.1-33.5-44.4c-3.1-9-4.9-18.4-4-27.9\n		c0.6-6.7,2.2-13.4,4.4-19.7c4.7-13.3,3-25.6-4.5-37.4c-4.8-7.6-7.3-15.9-8.1-24.9c-1.4-15.6,3-29.5,12.5-41.8\n		C100.7,155.1,106.5,149.7,113.7,146.1z"
}), /* @__PURE__ */ React15.createElement("path", {
  fill: "#C2AD95",
  d: "M46.1,229.2c-7.1-2.7-12.7-7.1-17.5-12.6c-6.4-7.3-10.5-15.8-11.7-25.4c-1.7-13.6,0.6-26.2,10.6-36.4\n		c7.1-7.2,19.3-9.6,28.1-5.9c-1,5.3-2.2,10.6-3.1,16c-1.6,9.1-1.4,18.3-1.5,27.6c-0.1,12-1.9,23.8-4.4,35.5\n		C46.6,228.4,46.4,228.6,46.1,229.2z"
}), /* @__PURE__ */ React15.createElement("path", {
  fill: "#AB705C",
  d: "M144.3,367.1c0.3,0.2,0.6,0.3,0.9,0.5C145,367.5,144.6,367.3,144.3,367.1z"
}), /* @__PURE__ */ React15.createElement("path", {
  fill: "#584848",
  d: "M163.5,344.1c-13.8-8.9-22.6-21.2-25.4-37.6c-0.8-4.6,2.1-7.7,7-7.7c28.8,0,57.5,0,86.3,0c7.2,0,14.4,0,21.6,0\n		c5.9,0,8.3,2.9,7.3,8.7c-2.9,16-11.7,27.9-25.2,36.6c-1.3-3.2-2.6-6.3-5.5-8.5c-4.1-3.1-8.9-3.7-13.7-3.7\n		c-7.4-0.1-14.9,0.2-22.3,0.3c-5.3,0.1-10.6-0.2-15.9,0.1c-5,0.3-9.3,2.4-12,6.9C164.9,340.8,164.3,342.5,163.5,344.1z"
}), /* @__PURE__ */ React15.createElement("path", {
  fill: "#E76F78",
  d: "M163.5,344.1c0.7-1.6,1.3-3.3,2.2-4.9c2.7-4.5,7-6.6,12-6.9c5.3-0.3,10.6-0.1,15.9-0.1\n		c7.4-0.1,14.9-0.4,22.3-0.3c4.8,0,9.6,0.6,13.7,3.7c2.9,2.2,4.2,5.4,5.5,8.5c-6.8,4.9-14.5,7.6-22.6,9.2c-14.5,2.8-28.4,1.1-41.8-5\n		C168.2,347.1,165.9,345.5,163.5,344.1z"
}), /* @__PURE__ */ React15.createElement("path", {
  fill: "#594949",
  d: "M273.3,204.2c0.4,7.4-3.9,13.9-11,16.9c-7.2,3.1-15.9,1.3-21.3-4.3c-2.6-2.7-4.4-5.8-4.6-9.5\n		c-0.2-4-0.4-8.1,0.3-11.9c1.4-8,9.7-14,18-13.7c0,1.9,0,3.7,0,5.6c-2.7,0.4-4.9,1.4-5.8,4.1c-1.3,3.8,1.1,7,5.8,7.9\n		c-0.4,4.3,0.6,7.9,4.5,10.3C264.7,212.8,270.4,210.5,273.3,204.2z"
}), /* @__PURE__ */ React15.createElement("path", {
  fill: "#594949",
  d: "M162.3,205.2c-0.2,9.1-6.8,14.9-13.1,16.7c-7.8,2.2-15.8-0.6-20.8-6.8c-4.3-5.2-4.7-21.7,1.1-27.2\n		c4.1-3.9,8.6-6.3,14.4-6.2c0,1.9,0,3.7,0,5.6c-3.9,0.7-6,2.5-6.3,5.4c-0.4,3.5,1.9,5.9,6.3,6.6c0,0.7,0,1.3,0,2\n		c-0.3,5.2,2.6,7.9,6.4,9.2c4.3,1.4,9-0.6,10.9-4.2C161.5,205.9,162,205.5,162.3,205.2z"
}), /* @__PURE__ */ React15.createElement("path", {
  fill: "#695E6B",
  d: "M162.3,205.2c-0.4,0.4-0.9,0.7-1.1,1.1c-1.9,3.6-6.7,5.5-10.9,4.2c-3.8-1.2-6.7-4-6.4-9.2c0-0.6,0-1.3,0-2\n		c4.9-0.9,7.3-4.4,5.8-8.2c-1-2.6-3.2-3.6-5.8-3.9c0-1.9,0-3.7,0-5.6c9.9-0.5,18.5,7.5,18.7,17.4\n		C162.5,201.1,162.4,203.1,162.3,205.2z"
}), /* @__PURE__ */ React15.createElement("path", {
  fill: "#685E6B",
  d: "M273.3,204.2c-2.9,6.3-8.7,8.6-14,5.4c-3.9-2.3-5-6-4.5-10.3c3-0.3,5.3-1.5,6.1-4.6c0.6-2.3,0-4.4-2-5.8\n		c-1.2-0.8-2.8-1.1-4.2-1.7c0-1.9,0-3.7,0-5.6c7.9-1,19.1,6.4,18.7,17.6C273.4,200.9,273.4,202.6,273.3,204.2z"
}), /* @__PURE__ */ React15.createElement("path", {
  fill: "#5A4A49",
  d: "M188.4,265.6c-0.3-0.1-1.3-0.3-2.1-0.7c-3.6-1.6-7.1-3.2-10.7-4.9c-3.3-1.5-4.5-4.3-3.3-7.1\n		c1.3-2.9,4.3-4,7.6-2.5c3.9,1.7,7.7,3.5,11.6,5.3c2.3,1.1,3.4,3.6,2.8,5.9C193.6,264.2,191.7,265.6,188.4,265.6z"
}), /* @__PURE__ */ React15.createElement("path", {
  fill: "#5A4A49",
  d: "M209.4,265.5c-2.5,0-4.4-1.4-5-3.8c-0.6-2.2,0.3-4.8,2.5-5.8c4.2-2.1,8.5-4.1,12.9-5.9c2.4-1,5.1,0.2,6.3,2.4\n		c1.2,2.2,0.9,5.3-1.4,6.5c-4.6,2.4-9.4,4.4-14.1,6.6C210.3,265.7,209.8,265.5,209.4,265.5z"
}), /* @__PURE__ */ React15.createElement("path", {
  fill: "#FBFAFA",
  d: "M254.8,187.3c1.4,0.5,3,0.8,4.2,1.7c2,1.4,2.6,3.5,2,5.8c-0.8,3.1-3.2,4.3-6.1,4.6c-4.8-0.9-7.2-4.1-5.8-7.9\n		C249.9,188.7,252.1,187.6,254.8,187.3z"
}), /* @__PURE__ */ React15.createElement("path", {
  fill: "#FBFAFB",
  d: "M143.8,187.3c2.6,0.3,4.7,1.3,5.8,3.9c1.6,3.8-0.9,7.3-5.8,8.2c-4.4-0.7-6.6-3.2-6.3-6.6\n		C137.8,189.7,139.9,188,143.8,187.3z"
})));
var apeswap_default = ApeSwapIcon;

// src/searchbar/icons/babyswap.tsx
import React16 from "react";
var BabySwapIcon = ({ height, width }) => /* @__PURE__ */ React16.createElement(abstract_default, {
  height: height != null ? height : 16,
  width: width != null ? width : 16,
  viewBox: "0 0 400 400"
}, /* @__PURE__ */ React16.createElement("g", {
  transform: "translate(0)"
}, /* @__PURE__ */ React16.createElement("path", {
  fill: "#572E06",
  d: "M311.8,12.7c28.7,10.2,48.9,27.7,50.6,60.3c1.3,25.8-10.1,45-32.2,58.1c-17.2,10.2-19.8,19.2-8.9,35.3\n        c18.7,27.6,27.4,58.1,25.3,91.2c-0.7,11.8,2.5,18.4,13.6,24c27.6,13.8,36.9,46.3,22.2,72.4c-14.3,25.5-45.8,34.2-72.6,19.7\n        c-15.5-8.4-30.6-17.4-45.8-26.1c-48.7,42.8-92.5,50.8-137.2,25.2c-43.9-25.1-59.2-67.3-46.7-130.6c-14.3-8.3-29.1-16.7-43.7-25.4\n        c-28-16.7-36.4-47.5-20.3-74.1c15.6-25.8,48.9-32.9,75.7-15.1c8.9,5.9,15.2,5.6,23.8-0.2c28.9-19.7,61-27.9,96.1-24.8\n        c14.2,1.3,24-5.7,23.7-19.2c-0.7-37.5,18.1-59.7,52.8-70.6C296.1,12.7,304,12.7,311.8,12.7z M299.6,173.8c-0.8-1.2-1.6-2.3-2.3-3.5\n        c-8.2-27.6-2.2-42.5,23.3-58.1c18.2-11.1,24.7-29.3,17.9-49.8c-4.9-5.9-9.8-11.8-14.6-17.8c-3.6-2.8-6.7-6.8-10.7-8.3\n        c-27.4-9.6-56.1,9.5-55.8,39.1c0.2,20.2-7.4,34.2-23,45.3c-9.4,1-18.9,2.1-28.3,3.1c-29.7-2.7-56.6,4.4-80.2,22.9\n        c-18.7,12.3-35.6,5.9-52-5.1c-16.8-5.9-31.6-1.5-39.5,11.8c-9.1,15.2-6.1,28.7,9.1,42.4c26.6,15.1,53.2,30.1,79.8,45.2\n        c16.7,9.6,33.4,19.3,50.1,28.9c9.8,5.8,19.6,11.7,29.4,17.5c9.4,5.1,18.8,10.3,28.2,15.4c15.1,8.7,30.3,17.3,45.4,26\n        c10.7,6.2,21.4,12.4,32,18.5c4.5,2.9,8.7,6.2,13.5,8.5c16.7,7.6,34.6,1.5,42.5-14.2c7.6-15.1,2.2-32.4-13.2-41.4\n        c-4.2-2.4-8.8-4.2-13.2-6.3c-4.7-10.8-9.4-21.6-14-32.3c4.9-32.8-4-61.9-24.3-87.8C299.9,173.9,299.6,173.8,299.6,173.8z\n        M100.8,254.8c-14.2,29-1.7,76.3,33.6,98c36.3,22.3,81.8,15.7,108.5-16.4c-11.5-10-20.8-14.3-37.4-4.3c-35.6,21.6-84-6.9-82.6-48.5\n        C123.7,264.6,114.4,259.8,100.8,254.8z M208.2,315.4c-22.6-13-44.5-25.7-66.4-38.2c-1.6-0.9-3.6-0.9-6.4-1.5\n        c-0.8,19.7,5.9,35.1,22.9,44.4C175.1,329.4,191.7,327.8,208.2,315.4z"
}), /* @__PURE__ */ React16.createElement("path", {
  fill: "#EDB646",
  d: "M202.8,287.6c-9.8-5.8-19.6-11.7-29.4-17.5c10.5-18.5,21.5-36.8,31.3-55.6c7.9-15.3,14.5-31.3,21.6-47\n        c0-1,0.4-1.8,1.1-2.5c15.3-9.4,22.1-24,25.6-40.6c15.1-3.4,19.3-13.8,19.7-27.9c1-36.1,15.9-50.8,51.2-51.8\n        c4.9,5.9,9.8,11.8,14.6,17.8c-2.3,1.5-5.4,2.6-6.7,4.7c-21.8,35.9-43.3,71.9-64.8,107.9c-15.2,25.2-30.7,50.2-45.4,75.7\n        C214.5,262.6,209,275.3,202.8,287.6z"
}), /* @__PURE__ */ React16.createElement("path", {
  fill: "#EBB143",
  d: "M202.8,287.6c6.2-12.3,11.7-25,18.6-36.9c14.8-25.4,30.3-50.5,45.4-75.7c21.6-36,43.1-72,64.8-107.9\n        c1.3-2.1,4.4-3.2,6.7-4.7c6.9,20.5,0.4,38.7-17.9,49.8c-25.5,15.5-31.5,30.5-23.3,58.1c0.8,1.2,1.6,2.3,2.3,3.5c0,0,0.3,0.1,0.3,0.1\n        c0,6.8,0.1,13.5,0.1,20.3c-2.4,4.6-4.6,9.4-7.3,13.9c-15,25.9-29.8,52-45.4,77.6c-4,6.6-10.8,11.6-16.3,17.3\n        C221.6,297.9,212.2,292.8,202.8,287.6z"
}), /* @__PURE__ */ React16.createElement("path", {
  fill: "#EDC34A",
  d: "M73.8,141.8c16.4,10.9,33.3,17.4,52,5.1c8.8,8.1,17.2,7.6,26.9,0.5c8-5.8,17.6-9.3,26.6-13.9\n        c0.2,5.1,0.3,10.3,0.5,15.4c-14.3,7.1-29,13.6-42.7,21.8c-3.7,2.2-4.4,9.5-6.5,14.5c5.4,1.9,10.7,3.7,16.1,5.6\n        c-1.3,5-1.7,10.4-3.9,14.9c-6.1,12.1-13,23.7-19.5,35.6C96.7,226.1,70.1,211,43.4,196C43.3,172.2,54.7,154.9,73.8,141.8z"
}), /* @__PURE__ */ React16.createElement("path", {
  fill: "#EBB947",
  d: "M123.3,241.2c6.6-11.8,13.4-23.5,19.5-35.6c2.3-4.5,2.7-9.9,3.9-14.9c16.4-18.8,37.8-23.3,61.5-21.6\n        c5.9,0.4,12-1,18-1.6c-7.1,15.7-13.7,31.7-21.6,47c-9.8,18.9-20.8,37.1-31.3,55.6C156.7,260.4,140,250.8,123.3,241.2z"
}), /* @__PURE__ */ React16.createElement("path", {
  fill: "#EFE0CE",
  d: "M100.8,254.8c13.6,4.9,22.9,9.8,22.2,28.9c-1.4,41.6,46.9,70.1,82.6,48.5c16.6-10.1,25.9-5.8,37.4,4.3\n        c-26.7,32-72.2,38.6-108.5,16.3C99.1,331.2,86.7,283.8,100.8,254.8z"
}), /* @__PURE__ */ React16.createElement("path", {
  fill: "#EAAD42",
  d: "M231,303c5.5-5.7,12.2-10.7,16.3-17.3c15.6-25.6,30.4-51.7,45.4-77.6c2.6-4.5,4.8-9.2,7.3-13.9\n        c-1.7,10.5-3.5,20.9-5.1,31.4c-1.7,11.1-2.4,21.6,12.3,25.3c3,0.8,5.2,5,7.7,7.6c-12.8,23.5-25.7,46.9-38.5,70.4\n        C261.3,320.4,246.2,311.7,231,303z"
}), /* @__PURE__ */ React16.createElement("path", {
  fill: "#E8A740",
  d: "M276.5,329c12.8-23.5,25.7-46.9,38.5-70.4c3.1,1,6.2,2.1,9.2,3.1c4.7,10.8,9.4,21.6,14,32.3\n        c-2.1,22.1-11.1,40.4-29.7,53.4C297.8,341.4,287.1,335.2,276.5,329z"
}), /* @__PURE__ */ React16.createElement("path", {
  fill: "#F7F4F0",
  d: "M323.8,44.7c-35.2,0.9-50.1,15.7-51.2,51.8c-0.4,14.1-4.6,24.5-19.7,27.9c-6.2-1.2-12.4-2.3-18.6-3.5\n        c15.6-11.1,23.2-25.1,23-45.3C257,46,285.7,26.8,313.1,36.4C317.1,37.9,320.2,41.9,323.8,44.7z"
}), /* @__PURE__ */ React16.createElement("path", {
  fill: "#E28D38",
  d: "M308.5,347.5c18.6-13,27.6-31.4,29.7-53.4c4.4,2.1,9,3.8,13.2,6.3c15.4,9,20.8,26.3,13.2,41.4\n        c-7.9,15.7-25.9,21.8-42.5,14.2C317.2,353.8,313,350.4,308.5,347.5z"
}), /* @__PURE__ */ React16.createElement("path", {
  fill: "#EBB947",
  d: "M234.3,120.8c6.2,1.2,12.4,2.3,18.6,3.5c-3.6,16.6-10.3,31.3-25.6,40.6c1.6-10.7-4.1-15.7-13.9-16.2\n        c-11.2-0.5-22.4,0.1-33.7,0.2c-0.2-5.1-0.3-10.3-0.5-15.4c8.9-3.2,17.8-6.4,26.7-9.6C215.4,122.9,224.8,121.9,234.3,120.8z"
}), /* @__PURE__ */ React16.createElement("path", {
  fill: "#F7F5F3",
  d: "M208.2,315.4c-16.5,12.4-33.1,14-49.9,4.8c-16.9-9.3-23.6-24.7-22.9-44.4c2.8,0.6,4.8,0.6,6.4,1.5\n        C163.8,289.7,185.6,302.4,208.2,315.4z"
}), /* @__PURE__ */ React16.createElement("path", {
  fill: "#E18C37",
  d: "M324.2,261.8c-3.1-1-6.2-2.1-9.2-3.1c-2.6-2.6-4.7-6.8-7.7-7.6c-14.7-3.7-14-14.2-12.3-25.3\n        c1.6-10.5,3.4-20.9,5.1-31.4c0-6.8-0.1-13.5-0.1-20.3C320.2,199.9,329,228.9,324.2,261.8z"
}), /* @__PURE__ */ React16.createElement("path", {
  fill: "#F7F4F1",
  d: "M73.8,141.8c-19.1,13.1-30.5,30.4-30.4,54.2c-15.3-13.6-18.2-27.2-9.1-42.4C42.2,140.4,57,135.9,73.8,141.8z"
}), /* @__PURE__ */ React16.createElement("path", {
  fill: "#F9F6EF",
  d: "M206,124c-8.9,3.2-17.8,6.4-26.7,9.6c-8.9,4.5-18.6,8.1-26.6,13.9c-9.8,7.1-18.1,7.6-26.9-0.5\n        C149.4,128.4,176.3,121.2,206,124z"
}), /* @__PURE__ */ React16.createElement("path", {
  fill: "#EAAD42",
  d: "M299.6,173.8c-0.8-1.2-1.6-2.3-2.3-3.5C298,171.5,298.8,172.6,299.6,173.8z"
}), /* @__PURE__ */ React16.createElement("path", {
  fill: "#582E02",
  d: "M179.8,148.9c11.2-0.1,22.5-0.7,33.7-0.2c9.8,0.5,15.5,5.6,13.9,16.2c-0.7,0.7-1,1.5-1.1,2.5\n        c-6,0.6-12.1,2-18,1.6c-23.8-1.6-45.1,2.8-61.5,21.6c-5.4-1.9-10.7-3.7-16.1-5.6c2.1-5,2.8-12.2,6.5-14.5\n        C150.8,162.5,165.5,156,179.8,148.9z"
})));
var babyswap_default = BabySwapIcon;

// src/searchbar/icons/biswap.tsx
import React17 from "react";
var BiSwapIcon = ({ height, width }) => /* @__PURE__ */ React17.createElement(abstract_default, {
  height: height != null ? height : 16,
  width: width != null ? width : 16,
  viewBox: "0 0 400 400"
}, /* @__PURE__ */ React17.createElement("g", {
  transform: "translate(0)"
}, /* @__PURE__ */ React17.createElement("linearGradient", {
  id: "Path_8498_00000101084967787936522230000005471291386862759615_",
  gradientUnits: "userSpaceOnUse",
  x1: "209.2924",
  y1: "179.5424",
  x2: "205.455",
  y2: "200.4263",
  gradientTransform: "matrix(11.8706 0 0 -12.0939 -2239.6458 2467.4377)"
}, /* @__PURE__ */ React17.createElement("stop", {
  offset: "0",
  style: { stopColor: "#FF496A" }
}), /* @__PURE__ */ React17.createElement("stop", {
  offset: "1",
  style: { stopColor: "#E42648" }
})), /* @__PURE__ */ React17.createElement("path", {
  id: "Path_8498_00000105421685609756502360000015408336945959859841_",
  style: { fill: `url(#Path_8498_00000101084967787936522230000005471291386862759615_)` },
  d: "\n	M349.8,79.1c-13.7,2.9-26.6,6.5-36.5,8.6c-27.8,6-48.7,29.1-51.7,57.4c-4.3,30.2,5.7,43.1,1.4,78.3c-7.8,61.8-66.8,82.6-94,95.5\n	c-15.8,7.2-54.6,24.4-84,37.3c86.7,63.6,208.5,45,272.1-41.7c51.9-70.7,50.1-167.5-4.4-236.2C351.8,78.9,350.8,79.2,349.8,79.1z"
}), /* @__PURE__ */ React17.createElement("linearGradient", {
  id: "Path_8499_00000069368988579689677870000016304176058613289127_",
  gradientUnits: "userSpaceOnUse",
  x1: "199.8008",
  y1: "196.9113",
  x2: "207.4495",
  y2: "174.6699",
  gradientTransform: "matrix(13.259 0 0 -12.8711 -2492.6223 2635.6416)"
}, /* @__PURE__ */ React17.createElement("stop", {
  offset: "2",
  style: { stopColor: "#1158F1" }
}), /* @__PURE__ */ React17.createElement("stop", {
  offset: "1",
  style: { stopColor: "#119BED" }
})), /* @__PURE__ */ React17.createElement("path", {
  id: "Path_8499_00000173119227639985226190000005075093812782462395_",
  style: { fill: `url(#Path_8499_00000069368988579689677870000016304176058613289127_)` },
  d: "\n	M177.4,171.8c8.4-20.6,15.3-41.7,20.9-63.2c14.4-38.8,58.9-27.3,71.1-25.8c20.1,2.9,25.8-4.3,68.2-11.5c2.2,0,4.3-0.7,6.5-0.7\n	c-71.7-80-194.7-86.7-274.7-14.9c-19.1,17.1-34.6,37.8-45.6,60.9C88.4,132.3,157.4,166.8,177.4,171.8z M135.1,39.7\n	c5.8,0.7,33,35.2,38.1,122.9c0,0-35.2-8.6-43.1-26.6C124.3,120.8,132.2,100.7,135.1,39.7z M5.1,200.5c0.2-15.2,1.9-30.4,5-45.2\n	c7.8,6.3,15.2,13,22.3,20.1c51,46.7,132.8,84,163,49.5l0,0c-15.8,19.7-41.5,28.6-66.1,23l-62.5,94C27.4,305.5,5,254.2,5.1,200.5z"
})));
var biswap_default = BiSwapIcon;

// src/searchbar/icons/ellipsis.finance.tsx
import React18 from "react";
var EllipsisFinanceIcon = ({ height, width }) => /* @__PURE__ */ React18.createElement(abstract_default, {
  height: height != null ? height : 16,
  width: width != null ? width : 16,
  viewBox: "0 0 400 400"
}, /* @__PURE__ */ React18.createElement("g", {
  transform: "translate(0)"
}, /* @__PURE__ */ React18.createElement("linearGradient", {
  id: "SVGID_1_",
  gradientUnits: "userSpaceOnUse",
  x1: "22.0047",
  y1: "316.8269",
  x2: "348.5401",
  y2: "42.8311"
}, /* @__PURE__ */ React18.createElement("stop", {
  offset: "0",
  style: { stopColor: "#56AFE7" }
}), /* @__PURE__ */ React18.createElement("stop", {
  offset: "1",
  style: { stopColor: "#3772D6" }
})), /* @__PURE__ */ React18.createElement("path", {
  style: { fill: `url(#SVGID_1_)` },
  d: "M128.5,331.5c30.3-5.8,56.5-16.5,73.2-24.5c7.5-3.7,15-7.6,22.3-11.8c0.6-0.4,0.9-0.6,1-0.6\n          c45.8-27.3,71.1-59.6,75.4-96c2.5-22.5-3.8-41.5-8.5-51.9c-3.3,18.7-15.2,59.6-56.7,92.1c-0.7,0.5-17.3,13.9-41.2,23.5\n          c-32,12.9-61.4,12.6-85.1-0.9c0,0,0,0,0,0c-0.2-0.1-0.3-0.2-0.5-0.4c0,0-0.1-0.1-0.1-0.1c-0.1-0.1-0.3-0.3-0.4-0.5c0,0,0,0,0,0\n          c-0.5-0.8-12.7-19.3-14.4-46.7c0-0.1,0-0.2,0-0.2c0-0.2,0-0.4,0-0.6c0-0.2,0-0.4,0-0.6l0-0.2c0,0,0,0,0,0l0-0.8c0,0,0,0,0,0l0,0\n          c-1.2-27,8.3-66.9,59.8-103.7c0.3-0.2,7.4-5.5,19.9-12.7c3-1.8,14.2-8.5,31.1-16c14.5-6.5,29.2-11.9,43.5-15.8c0,0,0,0,0,0\n          c0,0,0,0,0,0c0,0,0,0,0,0c0.8-0.2,1.6-0.4,2.5-0.7c3.8-1,7.5-1.9,11.2-2.7c0.8-0.2,5.5-1.1,12.8-2.2c9.4-1.5,58-8.3,91.5,5.3\n          C316,13.7,211.3,21.1,121.3,83.2c-46.8,32.3-82.7,75-100.9,120.2c-17.9,44.3-16.6,85.4,3.6,115.8c1.9,1.4,4,2.7,6.5,4.2\n          c28.8,16.4,69.6,12.9,91.5,9.4c4-0.7,6.3-1.2,6.4-1.2C128.4,331.5,128.5,331.5,128.5,331.5z"
}), /* @__PURE__ */ React18.createElement("linearGradient", {
  id: "SVGID_00000144307283947220045560000006145373274111585195_",
  gradientUnits: "userSpaceOnUse",
  x1: "35.2763",
  y1: "212.8306",
  x2: "392.4906",
  y2: "212.8306"
}, /* @__PURE__ */ React18.createElement("stop", {
  offset: "0",
  style: { stopColor: "#6063D9" }
}), /* @__PURE__ */ React18.createElement("stop", {
  offset: "1",
  style: { stopColor: "#DB7ACE" }
})), /* @__PURE__ */ React18.createElement("path", {
  style: { fill: `url(#SVGID_00000144307283947220045560000006145373274111585195_)` },
  d: "M165.2,156.5c0.7-0.5,17.3-13.9,41.2-23.5\n          c32-12.9,61.4-12.6,85.1,0.9c0,0,0,0,0,0c0.2,0.1,0.4,0.2,0.5,0.4c0,0,0.1,0.1,0.1,0.1c0.1,0.1,0.3,0.3,0.4,0.5c0,0,0,0,0,0\n          c0,0,0,0,0,0c0,0,0,0,0,0c0,0,0,0,0,0c1,1.5,18.2,28.1,13.9,64.5c-3.7,33.2-23.6,62.9-59.2,88.3c-0.3,0.2-7.6,5.6-20.3,12.9\n          c-2.8,1.7-10.8,6.4-22.7,12.1c-22,10.7-44.1,18.4-65.5,23c-2.5,0.7-33.6,8.5-66.7,5.7c-0.2,0-0.4,0-0.6,0c-1-0.1-1.9-0.2-2.9-0.3\n          c-0.6-0.1-1.2-0.1-1.8-0.2c-0.2,0-0.4,0-0.6-0.1c-10.6-1.3-21.3-3.8-31.1-8.1c49.6,48.9,154,41.3,243.7-20.6\n          c46.8-32.3,82.7-75,100.9-120.1c17.9-44.3,16.6-85.4-3.6-115.7C349.6,55.8,296,60.8,273.1,64.1c-1.3,0.2-2.6,0.5-4,0.8\n          c-5.8,1.1-12.2,2.3-17.6,3.6c-0.8,0.2-1.6,0.4-2.4,0.6c-14.2,4-28.6,9.2-42.7,15.5c-10.4,4.7-20.6,10-30.5,15.7\n          c-0.3,0.2-0.5,0.3-0.5,0.3c-61.9,36.9-75.9,77.5-76.1,106.4c0,0.7,0,1.3,0,2c0,0.7,0,1.3,0.1,2c0,0,0,0.1,0,0.1l0,0.5l0,0.2\n          c0,0.3,0,0.5,0,0.8c0,0.2,0,0.3,0,0.5c0,0,0,0.1,0,0.1c1,15.2,5.5,27.7,9,35.4C111.8,230,123.6,189,165.2,156.5z"
})));
var ellipsis_finance_default = EllipsisFinanceIcon;

// src/searchbar/icons/safeswap.tsx
import React19 from "react";
var SafeSwapIcon = ({ height, width }) => /* @__PURE__ */ React19.createElement(abstract_default, {
  height: height != null ? height : 16,
  width: width != null ? width : 16,
  viewBox: "0 0 400 400"
}, /* @__PURE__ */ React19.createElement("g", {
  transform: "translate(0)"
}, /* @__PURE__ */ React19.createElement("path", {
  fill: "#5B3DD7",
  d: "M378.5,237.9v-111c0-16.6-10.8-35.3-25.2-43.6L226,9.8c-14.4-8.3-36-8.3-50.3,0L48.3,83.3\n          c-9.4,5.4-14.8,13.9-14.8,23.3s5.4,17.9,14.9,23.3l19.1,11l-3.2,5.6c-1,1.7-0.9,3.9,0.2,5.5c1,1.4,2.5,2.1,4.1,2.1\n          c0.3,0,0.6,0,0.9-0.1l31.4-5.9c1.5-0.3,2.7-1.2,3.5-2.5c0.7-1.3,0.9-2.8,0.4-4.2l-10.7-29.7c-0.7-1.9-2.3-3.2-4.3-3.3\n          c-2-0.2-3.9,0.8-4.8,2.5l-2.2,3.7l-13.9-8.1l122.1-70.5c4.9-2.9,15-2.9,19.9,0l127.3,73.5c4.9,2.9,10,11.6,10,17.2v96.8l30.1,17.4\n          C378.4,240,378.5,239,378.5,237.9z"
}), /* @__PURE__ */ React19.createElement("path", {
  fill: "#5B3DD7",
  d: "M353.7,272.2c-0.1-0.1-0.2-0.2-0.3-0.2L327.6,257l2.4-4.1c1-1.7,0.9-3.9-0.2-5.5c-1.1-1.6-3.1-2.4-5.1-2.1\n          l-13.1,2.4l-18.3,3.4c-1.5,0.3-2.7,1.2-3.5,2.5c-0.7,1.3-0.9,2.8-0.4,4.2l10.7,29.7c0.7,1.9,2.3,3.2,4.3,3.3c0.2,0,0.3,0,0.5,0\n          c1.8,0,3.5-1,4.4-2.5l3-5.2l20.3,11.8l-122.6,68.8c-5,2.8-15,2.7-19.9-0.2L63.6,288.6c-5-2.9-10-11.8-10-17.6l0-93l-30.4-17.6\n          l0,110.6c0,16.5,10.7,35.3,24.9,43.7l126.4,75.1c7.3,4.3,16.6,6.5,25.8,6.5c8.8,0,17.5-2,24.5-5.9l128.2-72\n          c9.5-5.4,15-13.8,15.1-23.2C368.2,286.1,362.9,277.7,353.7,272.2z"
}), /* @__PURE__ */ React19.createElement("path", {
  fill: "#5B3DD7",
  d: "M245.3,209.6l-92.2-55.3l45-26l59.7,34.5v13.4l30.4,17.6V154c0-5.4-2.9-10.5-7.6-13.2l-75-43.3\n          c-4.7-2.7-10.5-2.7-15.2,0l-75,43.3c-4.7,2.7-7.6,7.7-7.6,13c0,4.1,1.6,8,4.4,10.8l63.2,36.5v2l67.1,40.2l-45,25l-59.3-35.6v-14.4\n          l-30.4-17.6v40.6c0,5.3,2.8,10.3,7.4,13l74.2,44.5c2.4,1.4,5.1,2.2,7.8,2.2c2.5,0,5.1-0.6,7.4-1.9l75.7-42c3.7-2,6.4-5.6,7.4-9.6\n          c1.6-6.5-1.2-13.3-6.9-16.7l-13.4-8.1l-22.1-12.7V209.6z"
}), /* @__PURE__ */ React19.createElement("polygon", {
  fill: "#5B3DD7",
  points: "245.3,210.1 267.4,222.8 245.3,209.6 	"
}), /* @__PURE__ */ React19.createElement("path", {
  fill: "#5B3DD7",
  d: "M175.5,203.2v-2l-63.2-36.5c0.9,0.9,1.9,1.7,3,2.4L175.5,203.2z"
})));
var safeswap_default = SafeSwapIcon;

// src/searchbar/icons/baguette.tsx
import React20 from "react";
var BaquetteIcon = ({ height, width }) => /* @__PURE__ */ React20.createElement(abstract_default, {
  height: height != null ? height : 16,
  width: width != null ? width : 16,
  viewBox: "0 0 384 387"
}, /* @__PURE__ */ React20.createElement("g", {
  transform: "translate(0)"
}, /* @__PURE__ */ React20.createElement("path", {
  fill: "none",
  d: "M0,0"
}), /* @__PURE__ */ React20.createElement("path", {
  fill: "none",
  d: "M0,0"
}), /* @__PURE__ */ React20.createElement("path", {
  fill: "none",
  d: "M0,0"
}), /* @__PURE__ */ React20.createElement("path", {
  fill: "none",
  d: "M0,0"
}), /* @__PURE__ */ React20.createElement("path", {
  fill: "none",
  d: "M0,0"
}), /* @__PURE__ */ React20.createElement("g", null, /* @__PURE__ */ React20.createElement("path", {
  fill: "#EBC179",
  d: "M363.1,161.8c0,35.5-81.2,79.4-181.3,98.1C81.8,278.7,0.6,265.1,0.6,229.6c0-35.5,81.2-79.4,181.3-98.1\n            S363.1,126.3,363.1,161.8z"
}), /* @__PURE__ */ React20.createElement("path", {
  fill: "#E2AC59",
  d: "M190.5,241.5C90.4,260.2,9.3,246.7,9.3,211.2c0-1,0.1-2.1,0.2-3.1c-5.8,7.3-8.9,14.6-8.9,21.5\n            c0,35.5,81.2,49,181.3,30.3c97.2-18.2,176.5-60.1,181-95C339.3,195.1,271,226.4,190.5,241.5z"
}), /* @__PURE__ */ React20.createElement("g", null, /* @__PURE__ */ React20.createElement("path", {
  fill: "#FFFFFF",
  d: "M126.1,214c-0.8-0.8-1.6-1.8-2.5-2.8c-0.8-1-1.8-2-2.7-3.2c-0.9-1.1-1.8-2.3-2.8-3.5c-1-1.2-1.9-2.5-2.9-3.8\n              c-1-1.3-1.9-2.7-2.9-4.1c-0.5-0.7-1-1.4-1.5-2.2c-0.5-0.7-0.9-1.5-1.4-2.3c-0.5-0.8-1-1.5-1.4-2.3c-0.5-0.8-0.9-1.6-1.4-2.4\n              c-0.5-0.8-0.9-1.6-1.4-2.4c-0.4-0.8-0.9-1.6-1.3-2.5c-0.4-0.8-0.9-1.6-1.3-2.5c-0.4-0.8-0.8-1.7-1.3-2.5\n              c-0.9-1.7-1.6-3.4-2.4-5.1c-0.8-1.7-1.5-3.5-2.2-5.2c-0.7-1.8-1.4-3.5-2-5.2c-0.6-1.8-1.3-3.5-1.8-5.2c0-0.1-0.1-0.3-0.1-0.4\n              c-2.5,1-5,2-7.5,3c0.1,0.1,0.1,0.2,0.2,0.3c0.8,1.7,1.6,3.5,2.4,5.2c0.9,1.7,1.8,3.5,2.7,5.2c1,1.7,1.9,3.5,2.9,5.2\n              c1,1.7,2,3.4,3,5c0.5,0.8,1,1.7,1.6,2.5c0.5,0.8,1.1,1.6,1.6,2.4c0.5,0.8,1.1,1.6,1.6,2.4c0.6,0.8,1.1,1.5,1.7,2.3\n              c0.6,0.8,1.1,1.5,1.7,2.3c0.6,0.7,1.1,1.5,1.7,2.2c0.6,0.7,1.1,1.4,1.7,2.1c0.6,0.7,1.1,1.4,1.7,2c1.1,1.4,2.2,2.7,3.4,3.9\n              c1.1,1.2,2.2,2.5,3.3,3.6c1.1,1.1,2.2,2.2,3.2,3.3c1,1,2.1,2,3,2.9c1,0.9,1.9,1.8,2.8,2.6c1.8,1.5,3.3,3,4.6,4\n              c2.6,2.1,4.1,3.4,4.1,3.4s-1.4-1.4-3.8-3.7C129,217.3,127.7,215.7,126.1,214z M195.7,203.5c-0.8-0.8-1.6-1.8-2.5-2.8\n              c-0.8-1-1.8-2-2.7-3.2c-0.9-1.1-1.8-2.3-2.8-3.5c-1-1.2-1.9-2.5-2.9-3.8c-1-1.3-1.9-2.7-2.9-4.1c-0.5-0.7-1-1.4-1.5-2.2\n              c-0.5-0.7-0.9-1.5-1.4-2.3c-0.5-0.8-1-1.5-1.4-2.3c-0.5-0.8-0.9-1.6-1.4-2.4c-0.5-0.8-0.9-1.6-1.4-2.4c-0.4-0.8-0.9-1.6-1.3-2.5\n              c-0.4-0.8-0.9-1.6-1.3-2.5c-0.4-0.8-0.8-1.7-1.3-2.5c-0.9-1.7-1.6-3.4-2.4-5.1c-0.8-1.7-1.5-3.5-2.2-5.2c-0.7-1.8-1.4-3.5-2-5.2\n              c-0.6-1.8-1.3-3.5-1.8-5.2c-0.3-0.9-0.6-1.7-0.8-2.6c-0.3-0.9-0.5-1.7-0.8-2.6c-0.5-1.7-1-3.4-1.4-5.1c-3,0.7-6,1.4-9,2.1\n              c0.7,1.9,1.4,3.8,2.3,5.8c0.4,0.9,0.7,1.7,1.1,2.6c0.4,0.9,0.8,1.7,1.2,2.6c0.8,1.7,1.6,3.5,2.4,5.2c0.9,1.7,1.8,3.5,2.7,5.2\n              c1,1.7,1.9,3.5,2.9,5.2c1,1.7,2,3.4,3,5c0.5,0.8,1,1.7,1.6,2.5c0.5,0.8,1.1,1.6,1.6,2.4c0.5,0.8,1.1,1.6,1.6,2.4\n              c0.6,0.8,1.1,1.5,1.7,2.3c0.6,0.8,1.1,1.5,1.7,2.3c0.6,0.7,1.1,1.5,1.7,2.2c0.6,0.7,1.1,1.4,1.7,2.1c0.6,0.7,1.1,1.4,1.7,2\n              c1.1,1.4,2.2,2.7,3.4,3.9c1.1,1.2,2.2,2.5,3.3,3.6c1.1,1.1,2.2,2.2,3.2,3.3c1,1,2.1,2,3,2.9c1,0.9,1.9,1.8,2.8,2.6\n              c1.8,1.5,3.3,3,4.6,4c2.6,2.1,4.1,3.4,4.1,3.4s-1.4-1.4-3.8-3.7C198.7,206.8,197.3,205.2,195.7,203.5z M269.5,197.4\n              c-1.2-1.2-2.6-2.7-4.2-4.4c-0.8-0.8-1.6-1.8-2.5-2.8c-0.8-1-1.8-2-2.7-3.2c-0.9-1.1-1.8-2.3-2.8-3.5c-1-1.2-1.9-2.5-2.9-3.8\n              c-1-1.3-1.9-2.7-2.9-4.1c-0.5-0.7-1-1.4-1.5-2.2c-0.5-0.7-0.9-1.5-1.4-2.3c-0.5-0.8-1-1.5-1.4-2.3c-0.5-0.8-0.9-1.6-1.4-2.4\n              c-0.5-0.8-0.9-1.6-1.4-2.4c-0.4-0.8-0.9-1.6-1.3-2.5c-0.4-0.8-0.9-1.6-1.3-2.5c-0.4-0.8-0.8-1.7-1.3-2.5\n              c-0.9-1.7-1.6-3.4-2.4-5.1c-0.8-1.7-1.5-3.5-2.2-5.2c-0.7-1.8-1.4-3.5-2-5.2c-0.6-1.8-1.3-3.5-1.8-5.2c-0.3-0.9-0.6-1.7-0.8-2.6\n              c-0.3-0.9-0.5-1.7-0.8-2.6c-0.6-2-1.1-3.9-1.6-5.8c-3.1,0.3-6.3,0.6-9.5,1c0.9,2.5,1.9,5.1,3,7.7c0.4,0.9,0.7,1.7,1.1,2.6\n              c0.4,0.9,0.8,1.7,1.2,2.6c0.8,1.7,1.6,3.5,2.4,5.2c0.9,1.7,1.8,3.5,2.7,5.2c1,1.7,1.9,3.5,2.9,5.2c1,1.7,2,3.4,3,5\n              c0.5,0.8,1,1.7,1.6,2.5c0.5,0.8,1.1,1.6,1.6,2.4c0.5,0.8,1.1,1.6,1.6,2.4c0.6,0.8,1.1,1.5,1.7,2.3c0.6,0.8,1.1,1.5,1.7,2.3\n              c0.6,0.7,1.1,1.5,1.7,2.2c0.6,0.7,1.1,1.4,1.7,2.1c0.6,0.7,1.1,1.4,1.7,2c1.1,1.4,2.2,2.7,3.4,3.9c1.1,1.2,2.2,2.5,3.3,3.6\n              c1.1,1.1,2.2,2.2,3.2,3.3c1,1,2.1,2,3,2.9c1,0.9,1.9,1.8,2.8,2.6c1.8,1.5,3.3,3,4.6,4c2.6,2.1,4.1,3.4,4.1,3.4\n              S271.9,199.8,269.5,197.4z"
}))), /* @__PURE__ */ React20.createElement("g", null, /* @__PURE__ */ React20.createElement("path", {
  fill: "#EBC179",
  d: "M377.6,279.1c-23.5,26.5-113.4,5.5-200.7-47S38,115.6,61.5,89.1c23.5-26.5,113.4-5.5,200.7,47\n            C349.5,188.5,401.2,252.5,377.6,279.1z"
}), /* @__PURE__ */ React20.createElement("path", {
  fill: "#E2AC59",
  d: "M195.7,224.1c-87.3-52.5-139-116.5-115.4-143c0.7-0.8,1.4-1.5,2.2-2.2c-9.2,1.7-16.3,5-20.9,10.2\n            c-23.5,26.5,28.1,90.5,115.4,143c84.8,50.9,171.9,72.2,198.5,49.2C337.7,288.1,265.9,266.3,195.7,224.1z"
}), /* @__PURE__ */ React20.createElement("g", null, /* @__PURE__ */ React20.createElement("path", {
  fill: "#FFFFFF",
  d: "M165.7,160.7c0-1.2,0-2.4,0-3.7c0-1.3,0-2.7,0.1-4.1c0.1-1.4,0.2-2.9,0.3-4.5c0.1-1.5,0.3-3.1,0.4-4.8\n              c0.1-1.6,0.4-3.3,0.6-5c0.1-0.9,0.2-1.7,0.3-2.6c0.1-0.9,0.3-1.7,0.4-2.6c0.1-0.9,0.3-1.8,0.4-2.7c0.2-0.9,0.4-1.8,0.5-2.7\n              c0.2-0.9,0.4-1.8,0.6-2.7c0.2-0.9,0.4-1.8,0.6-2.7c0.2-0.9,0.4-1.8,0.7-2.7c0.2-0.9,0.5-1.8,0.7-2.7c0.5-1.8,1.1-3.6,1.6-5.4\n              c0.5-1.8,1.2-3.6,1.8-5.4c0.6-1.8,1.3-3.5,2-5.3c0.7-1.7,1.4-3.4,2.1-5.1c0.1-0.1,0.1-0.3,0.2-0.4c-2.6-1-5.1-1.9-7.6-2.7\n              c0,0.1-0.1,0.2-0.1,0.4c-0.6,1.8-1.1,3.7-1.6,5.5c-0.5,1.9-1,3.8-1.5,5.7c-0.4,1.9-0.9,3.8-1.3,5.8c-0.4,1.9-0.8,3.9-1.1,5.8\n              c-0.2,1-0.3,1.9-0.5,2.9c-0.1,1-0.3,1.9-0.4,2.9c-0.1,1-0.3,1.9-0.4,2.9c-0.1,1-0.2,1.9-0.3,2.8c-0.1,0.9-0.2,1.9-0.3,2.8\n              c-0.1,0.9-0.1,1.9-0.2,2.8c-0.1,0.9-0.1,1.8-0.2,2.7c0,0.9-0.1,1.8-0.1,2.7c-0.1,1.8-0.1,3.5-0.1,5.2c0,1.7,0,3.3,0.1,4.9\n              c0.1,1.6,0.1,3.1,0.2,4.5c0.1,1.5,0.2,2.8,0.3,4.2c0.1,1.3,0.2,2.6,0.4,3.7c0.3,2.3,0.5,4.4,0.8,6.1c0.5,3.3,0.9,5.2,0.9,5.2\n              s-0.1-1.9-0.3-5.3C165.7,165.1,165.8,163.1,165.7,160.7z M224.8,199.1c0-1.2,0-2.4,0-3.7c0-1.3,0-2.7,0.1-4.1\n              c0.1-1.4,0.2-2.9,0.3-4.5c0.1-1.5,0.3-3.1,0.4-4.8c0.1-1.6,0.4-3.3,0.6-5c0.1-0.9,0.2-1.7,0.3-2.6c0.1-0.9,0.3-1.7,0.4-2.6\n              c0.1-0.9,0.3-1.8,0.4-2.7c0.2-0.9,0.4-1.8,0.5-2.7c0.2-0.9,0.4-1.8,0.6-2.7c0.2-0.9,0.4-1.8,0.6-2.7c0.2-0.9,0.4-1.8,0.7-2.7\n              c0.2-0.9,0.5-1.8,0.7-2.7c0.5-1.8,1.1-3.6,1.6-5.4c0.5-1.8,1.2-3.6,1.8-5.4c0.6-1.8,1.3-3.5,2-5.3c0.7-1.7,1.4-3.4,2.1-5.1\n              c0.4-0.8,0.7-1.7,1.1-2.5c0.4-0.8,0.8-1.6,1.1-2.4c0.8-1.6,1.5-3.2,2.3-4.7c-2.7-1.5-5.4-2.9-8.1-4.3c-0.7,1.9-1.5,3.8-2.2,5.8\n              c-0.3,0.9-0.6,1.8-0.9,2.6c-0.3,0.9-0.6,1.8-0.9,2.7c-0.6,1.8-1.1,3.7-1.6,5.5c-0.5,1.9-1,3.8-1.5,5.7c-0.4,1.9-0.9,3.8-1.3,5.8\n              c-0.4,1.9-0.8,3.9-1.1,5.8c-0.2,1-0.3,1.9-0.5,2.9c-0.1,1-0.3,1.9-0.4,2.9c-0.1,1-0.3,1.9-0.4,2.9c-0.1,1-0.2,1.9-0.3,2.8\n              c-0.1,0.9-0.2,1.9-0.3,2.8c-0.1,0.9-0.1,1.9-0.2,2.8c-0.1,0.9-0.1,1.8-0.2,2.7c0,0.9-0.1,1.8-0.1,2.7c-0.1,1.8-0.1,3.5-0.1,5.2\n              c0,1.7,0,3.3,0.1,4.9c0.1,1.6,0.1,3.1,0.2,4.5c0.1,1.5,0.2,2.8,0.3,4.2c0.1,1.3,0.2,2.6,0.4,3.7c0.3,2.3,0.5,4.4,0.8,6.1\n              c0.5,3.3,0.9,5.2,0.9,5.2s-0.1-1.9-0.3-5.3C224.8,203.5,224.8,201.5,224.8,199.1z M284,243.6c-0.1-1.7-0.1-3.7-0.2-6.1\n              c0-1.2,0-2.4,0-3.7c0-1.3,0-2.7,0.1-4.1c0.1-1.4,0.2-2.9,0.3-4.5c0.1-1.5,0.3-3.1,0.4-4.8c0.1-1.6,0.4-3.3,0.6-5\n              c0.1-0.9,0.2-1.7,0.3-2.6c0.1-0.9,0.3-1.7,0.4-2.6c0.1-0.9,0.3-1.8,0.4-2.7c0.2-0.9,0.4-1.8,0.5-2.7c0.2-0.9,0.4-1.8,0.6-2.7\n              c0.2-0.9,0.4-1.8,0.6-2.7c0.2-0.9,0.4-1.8,0.7-2.7c0.2-0.9,0.5-1.8,0.7-2.7c0.5-1.8,1.1-3.6,1.6-5.4c0.5-1.8,1.2-3.6,1.8-5.4\n              c0.6-1.8,1.3-3.5,2-5.3c0.7-1.7,1.4-3.4,2.1-5.1c0.4-0.8,0.7-1.7,1.1-2.5c0.4-0.8,0.8-1.6,1.1-2.4c0.9-1.9,1.8-3.7,2.7-5.4\n              c-2.5-1.9-5.1-3.7-7.7-5.6c-1,2.5-2,5.1-2.9,7.7c-0.3,0.9-0.6,1.8-0.9,2.6c-0.3,0.9-0.6,1.8-0.9,2.7c-0.6,1.8-1.1,3.7-1.6,5.5\n              c-0.5,1.9-1,3.8-1.5,5.7c-0.4,1.9-0.9,3.8-1.3,5.8c-0.4,1.9-0.8,3.9-1.1,5.8c-0.2,1-0.3,1.9-0.5,2.9c-0.1,1-0.3,1.9-0.4,2.9\n              c-0.1,1-0.3,1.9-0.4,2.9c-0.1,1-0.2,1.9-0.3,2.8c-0.1,0.9-0.2,1.9-0.3,2.8c-0.1,0.9-0.1,1.9-0.2,2.8c-0.1,0.9-0.1,1.8-0.2,2.7\n              c0,0.9-0.1,1.8-0.1,2.7c-0.1,1.8-0.1,3.5-0.1,5.2c0,1.7,0,3.3,0.1,4.9c0.1,1.6,0.1,3.1,0.2,4.5c0.1,1.5,0.2,2.8,0.3,4.2\n              c0.1,1.3,0.2,2.6,0.4,3.7c0.3,2.3,0.5,4.4,0.8,6.1c0.5,3.3,0.9,5.2,0.9,5.2S284.2,247,284,243.6z"
})))));
var baguette_default = BaquetteIcon;

// src/searchbar/icons/pancake.tsx
import React21 from "react";
var PancakeSwapIcon = ({ height, width }) => /* @__PURE__ */ React21.createElement(abstract_default, {
  height: height != null ? height : 16,
  width: width != null ? width : 16,
  viewBox: "0 0 12 12"
}, /* @__PURE__ */ React21.createElement("g", {
  transform: "translate(0)"
}, /* @__PURE__ */ React21.createElement("g", {
  clipPath: "url(#clip0_1021_1592)"
}, /* @__PURE__ */ React21.createElement("path", {
  d: "M11.76 7.39C11.74 6.11 10.57 4.99 8.88 4.35L9.41 1.43C9.52 0.77 9.07 0.14 8.41 0.03C8.35 0.03 8.3 0.02 8.24 0.01C7.59 0.01 7.06 0.54 7.06 1.19V3.86C6.65 3.82 6.25 3.78 5.84 3.78C5.42 3.78 5 3.81 4.58 3.86V1.18C4.59 0.54 4.07 0 3.42 0C2.77 0 2.25 0.51 2.24 1.16C2.24 1.25 2.24 1.34 2.27 1.43L2.84 4.35C1.15 4.99 0.02 6.11 0 7.39V8.32C0 10.31 2.64 11.93 5.88 11.93C9.12 11.93 11.76 10.31 11.76 8.32V7.39ZM3.57 8.12C3.21 8.12 2.92 7.67 2.92 7.15C2.92 6.63 3.2 6.18 3.57 6.18C3.94 6.18 4.22 6.63 4.22 7.15C4.22 7.67 3.94 8.12 3.57 8.12ZM8.07 8.12C7.71 8.12 7.42 7.67 7.42 7.15C7.42 6.63 7.7 6.18 8.07 6.18C8.44 6.18 8.72 6.63 8.72 7.15C8.72 7.67 8.44 8.12 8.07 8.12Z",
  fill: "#7A808A"
})), /* @__PURE__ */ React21.createElement("defs", null, /* @__PURE__ */ React21.createElement("clipPath", {
  id: "clip0_1021_1592"
}, /* @__PURE__ */ React21.createElement("rect", {
  width: "11.76",
  height: "11.93",
  fill: "white"
})))));
var pancake_default = PancakeSwapIcon;

// src/searchbar/icons/canary.tsx
import React22 from "react";
var CanaryIcon = ({ height, width }) => /* @__PURE__ */ React22.createElement(abstract_default, {
  height: height != null ? height : 16,
  width: width != null ? width : 16,
  viewBox: "0 0 584 587"
}, /* @__PURE__ */ React22.createElement("g", {
  transform: "translate(0)"
}, /* @__PURE__ */ React22.createElement("path", {
  fill: "none",
  d: "M0,0"
}), /* @__PURE__ */ React22.createElement("path", {
  fill: "none",
  d: "M0,0"
}), /* @__PURE__ */ React22.createElement("path", {
  fill: "none",
  d: "M0,0"
}), /* @__PURE__ */ React22.createElement("path", {
  fill: "none",
  d: "M0,0"
}), /* @__PURE__ */ React22.createElement("path", {
  fill: "none",
  d: "M0,0"
}), /* @__PURE__ */ React22.createElement("g", {
  transform: "translate(-200.000000,800.000000) scale(0.100000,-0.100000)",
  fill: "#F5E132",
  stroke: "none"
}, /* @__PURE__ */ React22.createElement("path", {
  d: "M4565 7600 c-268 -41 -459 -101 -700 -220 -269 -133 -466 -272 -684\n        -484 -221 -217 -387 -446 -521 -721 -167 -341 -225 -557 -264 -985 -37 -393\n        30 -795 200 -1208 151 -366 402 -708 719 -980 172 -148 555 -392 555 -353 0 4\n        -41 59 -91 122 -322 405 -494 804 -576 1339 -25 164 -25 606 0 773 74 488 246\n        905 516 1246 99 127 286 300 414 385 270 180 547 267 857 269 228 1 389 -26\n        626 -104 l122 -41 109 35 c89 29 434 107 472 107 26 0 7 -17 -52 -48 -168 -87\n        -330 -273 -401 -463 -44 -118 -59 -218 -53 -358 6 -152 28 -237 97 -376 118\n        -236 311 -391 577 -462 84 -23 118 -26 243 -26 129 0 155 3 235 27 275 82 498\n        257 615 483 34 67 15 70 -51 9 -113 -105 -215 -161 -358 -197 -122 -31 -312\n        -24 -426 15 -265 90 -448 295 -520 581 -33 128 -31 263 4 298 11 11 12 6 30\n        -112 43 -283 354 -483 653 -420 122 26 278 121 343 209 59 81 78 141 78 245\n        -1 190 -99 370 -325 593 -274 270 -584 456 -1081 646 -428 164 -975 235 -1362\n        176z"
}), /* @__PURE__ */ React22.createElement("path", {
  d: "M5149 6508 c-59 -33 -86 -96 -81 -180 3 -41 77 -114 125 -123 120\n        -23 227 86 196 200 -29 105 -148 157 -240 103z"
}), /* @__PURE__ */ React22.createElement("path", {
  d: "M7528 4429 c-120 -185 -238 -331 -392 -484 -475 -473 -1087 -787\n        -1684 -865 -124 -17 -420 -14 -546 5 -477 71 -873 312 -1178 716 -36 47 -73\n        100 -84 117 -10 18 -22 32 -28 32 -23 0 36 -277 100 -463 254 -738 894 -1154\n        1692 -1098 916 65 1763 743 2087 1672 43 125 127 453 123 482 -2 15 -28 -18\n        -90 -114z"
}))));
var canary_default = CanaryIcon;

// src/searchbar/icons/complus.network.tsx
import React23 from "react";
var ComplusNetworkIcon = ({ height, width }) => /* @__PURE__ */ React23.createElement(abstract_default, {
  height: height != null ? height : 16,
  width: width != null ? width : 16,
  viewBox: "0 0 400 400"
}, /* @__PURE__ */ React23.createElement("g", {
  transform: "translate(0)"
}, /* @__PURE__ */ React23.createElement("polygon", {
  fill: "#BB263B",
  points: "312.6,13.1 87.4,13.1 87.4,160.6 161.8,160.6 161.8,86.8 238.2,86.8 238.2,160.6 312.6,160.6 "
}), /* @__PURE__ */ React23.createElement("polygon", {
  fill: "#BB263B",
  points: "87.4,386.9 312.6,386.9 312.6,239.4 238.2,239.4 238.2,313.2 161.8,313.2 161.8,239.4 87.4,239.4 "
})));
var complus_network_default = ComplusNetworkIcon;

// src/searchbar/icons/elk.finance.tsx
import React24 from "react";
var ElkFinanceIcon = ({ height, width }) => /* @__PURE__ */ React24.createElement(abstract_default, {
  height: height != null ? height : 16,
  width: width != null ? width : 16,
  viewBox: "0 0 400 400"
}, /* @__PURE__ */ React24.createElement("g", {
  transform: "translate(0)"
}, /* @__PURE__ */ React24.createElement("path", {
  d: "M255.957 507.599C394.935 507.599 507.599 394.935 507.599 255.957C507.599 116.979 394.935 4.31494 255.957 4.31494C116.979 4.31494 4.31494 116.979 4.31494 255.957C4.31494 394.935 116.979 507.599 255.957 507.599Z",
  fill: "white"
}), /* @__PURE__ */ React24.createElement("path", {
  fillRule: "evenodd",
  clipRule: "evenodd",
  d: "M255.957 8.62982C119.362 8.62982 8.6297 119.362 8.6297 255.957C8.6297 392.552 119.362 503.284 255.957 503.284C392.552 503.284 503.284 392.552 503.284 255.957C503.284 119.362 392.552 8.62982 255.957 8.62982ZM0 255.957C0 114.596 114.596 0.00012207 255.957 0.00012207C397.318 0.00012207 511.914 114.596 511.914 255.957C511.914 397.318 397.318 511.914 255.957 511.914C114.596 511.914 0 397.318 0 255.957Z",
  fill: "#231F20"
}), /* @__PURE__ */ React24.createElement("path", {
  d: "M255.957 473.684C376.204 473.684 473.684 376.204 473.684 255.957C473.684 135.709 376.204 38.2295 255.957 38.2295C135.709 38.2295 38.2295 135.709 38.2295 255.957C38.2295 376.204 135.709 473.684 255.957 473.684Z",
  fill: "#009F55"
}), /* @__PURE__ */ React24.createElement("path", {
  fillRule: "evenodd",
  clipRule: "evenodd",
  d: "M255.957 46.8592C140.475 46.8592 46.8593 140.475 46.8593 255.957C46.8593 371.438 140.475 465.054 255.957 465.054C371.438 465.054 465.054 371.438 465.054 255.957C465.054 140.475 371.438 46.8592 255.957 46.8592ZM29.5999 255.957C29.5999 130.943 130.943 29.5998 255.957 29.5998C380.97 29.5998 482.314 130.943 482.314 255.957C482.314 380.97 380.97 482.314 255.957 482.314C130.943 482.314 29.5999 380.97 29.5999 255.957Z",
  fill: "#231F20"
}), /* @__PURE__ */ React24.createElement("path", {
  d: "M350.205 353.957C347.866 355.594 344.65 356.705 340.556 357.29C336.696 357.875 333.89 357.758 332.135 356.939C331.667 356.705 331.199 355.887 330.732 354.483C330.381 352.963 329.913 351.91 329.328 351.325C329.094 351.091 328.802 350.916 328.451 350.799C323.773 348.226 318.744 346.004 313.364 344.133C300.732 339.454 287.691 336.589 274.241 335.536C267.341 319.045 263.598 310.039 263.013 308.519C258.92 298.11 257.633 292.145 259.154 290.625L391.082 158.697C391.9 157.878 394.415 158.054 398.625 159.223C402.953 160.51 405.701 161.855 406.871 163.258C408.157 164.779 410.029 168.521 412.485 174.486C415.058 180.334 417.689 184.603 420.379 187.293C423.888 190.802 430.028 193.784 438.8 196.24C446.987 198.345 451.49 200.275 452.309 202.029C454.18 205.772 455.233 213.023 455.467 223.783C455.934 234.544 455.291 241.269 453.537 243.959C452.718 245.245 449.794 245.947 444.765 246.064C439.853 246.298 436.636 245.654 435.116 244.134C433.829 242.848 433.069 241.736 432.835 240.801C432.601 239.865 432.309 239.339 431.958 239.222C426.812 235.947 421.783 233.14 416.871 230.801C405.292 225.07 395.526 222.088 387.573 221.854L358.977 250.45C365.176 252.438 372.661 255.596 381.433 259.923C383.538 261.561 384.824 268.11 385.292 279.572C385.994 291.034 385.292 297.817 383.187 299.923C381.9 301.209 379.561 301.911 376.17 302.028C372.778 302.145 370.088 301.677 368.1 300.624C366.93 299.455 364.766 297.525 361.608 294.835C356.345 291.209 344.767 287.116 326.872 282.555L308.451 300.975C314.065 302.379 321.258 304.659 330.03 307.817C339.036 310.975 344.24 313.256 345.644 314.659C347.281 316.297 348.802 322.963 350.205 334.659C351.842 346.355 351.842 352.787 350.205 353.957Z",
  fill: "white"
}), /* @__PURE__ */ React24.createElement("path", {
  fillRule: "evenodd",
  clipRule: "evenodd",
  d: "M393.356 162.524L262.855 293.026C262.874 293.502 262.964 294.249 263.196 295.329C263.766 297.968 265.01 301.805 267.029 306.94L267.035 306.955L267.041 306.97C267.568 308.342 270.94 316.461 277.215 331.464C290.117 332.7 302.656 335.569 314.822 340.071C320.299 341.979 325.449 344.244 330.265 346.873C331.017 347.183 331.744 347.639 332.379 348.274C333.778 349.673 334.47 351.595 334.876 353.258C335.807 353.385 337.399 353.404 339.91 353.024L339.928 353.021L339.946 353.019C343.097 352.569 345.371 351.811 346.96 350.908C347.049 350.356 347.118 349.497 347.118 348.255C347.118 345.34 346.742 341.041 345.932 335.257L345.926 335.215L345.921 335.173C345.226 329.385 344.517 324.965 343.805 321.847C343.449 320.283 343.113 319.144 342.817 318.364C342.674 317.988 342.566 317.768 342.508 317.657C342.391 317.575 342.162 317.426 341.777 317.211C341.115 316.842 340.187 316.388 338.956 315.848C336.498 314.771 333.061 313.453 328.602 311.889L328.585 311.883L328.569 311.877C319.862 308.743 312.82 306.515 307.405 305.161L300.012 303.313L325.558 277.767L327.938 278.373C336.955 280.672 344.459 282.872 350.415 284.978C356.298 287.057 360.944 289.138 364.056 291.282L364.238 291.407L364.407 291.55C367.155 293.892 369.243 295.735 370.599 297.034C371.709 297.486 373.437 297.805 376.021 297.716C377.479 297.665 378.52 297.493 379.228 297.281C379.749 297.125 379.997 296.975 380.09 296.908C380.134 296.83 380.248 296.611 380.388 296.167C380.621 295.43 380.843 294.338 381 292.812C381.316 289.76 381.33 285.467 380.986 279.836L380.983 279.792L380.981 279.748C380.751 274.105 380.324 269.854 379.743 266.895C379.451 265.413 379.146 264.386 378.872 263.724C378.817 263.591 378.768 263.484 378.727 263.401C370.411 259.33 363.399 256.4 357.659 254.558L350.926 252.399L385.839 217.486L387.7 217.541C396.536 217.801 406.938 221.074 418.755 226.919C423.76 229.304 428.855 232.145 434.041 235.433C435.251 236.066 435.908 237.061 436.213 237.609C436.6 238.306 436.839 239.043 436.999 239.667C437.018 239.703 437.061 239.78 437.142 239.899C437.328 240.171 437.646 240.56 438.153 241.069C438.155 241.067 438.469 241.317 439.515 241.526C440.651 241.753 442.3 241.862 444.56 241.754L444.612 241.751L444.665 241.75C447.048 241.695 448.69 241.502 449.723 241.254C449.895 241.213 450.035 241.173 450.147 241.139C450.427 240.425 450.8 238.995 451.04 236.486C451.335 233.404 451.386 229.254 451.156 223.971L451.154 223.924L451.153 223.877C451.038 218.6 450.724 214.286 450.232 210.895C449.767 207.696 449.177 205.56 448.592 204.259C448.578 204.249 448.564 204.239 448.548 204.228C448.208 203.993 447.599 203.653 446.618 203.232C444.663 202.395 441.735 201.45 437.726 200.419L437.681 200.408L437.637 200.395C428.657 197.881 421.637 194.653 417.328 190.344C414.088 187.104 411.198 182.274 408.535 176.224L408.515 176.177L408.495 176.129C407.288 173.198 406.251 170.877 405.38 169.135C404.468 167.312 403.867 166.388 403.577 166.045L403.567 166.033L403.558 166.022C403.557 166.022 403.47 165.924 403.22 165.749C402.957 165.565 402.573 165.335 402.036 165.072C400.958 164.545 399.446 163.97 397.433 163.37C395.515 162.839 394.189 162.591 393.356 162.524ZM448.752 204.387C448.752 204.387 448.744 204.38 448.731 204.367C448.746 204.38 448.753 204.387 448.752 204.387ZM450.504 241.003C450.504 241.004 450.503 241.004 450.503 241.004C450.511 240.999 450.512 240.999 450.504 241.003ZM346.822 351.49C346.82 351.487 346.83 351.456 346.853 351.404C346.835 351.466 346.823 351.492 346.822 351.49ZM262.872 292.521C262.873 292.522 262.871 292.546 262.861 292.589C262.866 292.541 262.871 292.519 262.872 292.521ZM393.882 153.91C395.564 154.027 397.567 154.451 399.78 155.066L399.818 155.076L399.855 155.087C402.151 155.77 404.165 156.507 405.829 157.321C407.424 158.101 409.024 159.108 410.174 160.482C411.167 161.659 412.142 163.363 413.099 165.276C414.094 167.266 415.214 169.782 416.455 172.795C418.931 178.414 421.296 182.108 423.431 184.242C426.135 186.946 431.382 189.678 439.92 192.073C444.077 193.143 447.479 194.212 450.017 195.3C451.288 195.845 452.47 196.447 453.46 197.133C454.366 197.76 455.507 198.724 456.189 200.141C457.418 202.617 458.224 205.883 458.772 209.655C459.331 213.504 459.659 218.18 459.78 223.643C460.015 229.1 459.978 233.676 459.63 237.308C459.301 240.751 458.645 244.014 457.162 246.299C455.784 248.443 453.361 249.256 451.737 249.646C449.858 250.096 447.542 250.313 444.918 250.376C442.286 250.499 439.889 250.401 437.823 249.988C435.788 249.581 433.667 248.787 432.065 247.185C430.746 245.866 429.398 244.227 428.785 242.32C424.071 239.362 419.481 236.823 415.016 234.697L414.986 234.683L414.957 234.668C404.574 229.529 396.047 226.843 389.258 226.271L366.848 248.681C371.788 250.605 377.29 253.068 383.342 256.054L383.735 256.248L384.082 256.517C385.468 257.596 386.302 259.112 386.844 260.421C387.418 261.805 387.858 263.44 388.211 265.232C388.914 268.814 389.364 273.554 389.602 279.353C389.956 285.164 389.969 289.978 389.584 293.7C389.391 295.566 389.086 297.281 388.617 298.766C388.164 300.201 387.455 301.757 386.238 302.974C383.74 305.472 379.962 306.215 376.318 306.34C372.527 306.471 368.991 305.979 366.081 304.438L365.507 304.134L365.049 303.675C364.035 302.661 362.049 300.882 358.988 298.271C356.811 296.813 353.086 295.075 347.539 293.114C342.426 291.306 335.982 289.383 328.181 287.348L316.722 298.806C321.056 300.121 325.976 301.772 331.475 303.752C336.014 305.343 339.677 306.742 342.42 307.944C343.791 308.545 344.99 309.122 345.98 309.674C346.9 310.186 347.912 310.825 348.695 311.608C349.771 312.684 350.434 314.117 350.883 315.297C351.376 316.593 351.815 318.158 352.219 319.928C353.026 323.467 353.777 328.215 354.484 334.103C355.308 339.995 355.748 344.746 355.748 348.255C355.748 349.998 355.641 351.622 355.344 353.001C355.097 354.149 354.513 356.183 352.713 357.468L352.696 357.48L352.68 357.492C349.597 359.649 345.662 360.918 341.184 361.559C337.194 362.162 333.29 362.24 330.311 360.849L330.258 360.825L330.206 360.799C328.812 360.102 328.049 358.924 327.687 358.291C327.256 357.537 326.918 356.685 326.638 355.848L326.574 355.653L326.527 355.453C326.432 355.038 326.338 354.733 326.26 354.518C321.839 352.095 317.07 349.99 311.946 348.208L311.905 348.194L311.865 348.179C299.608 343.639 286.958 340.859 273.905 339.838L271.278 339.632L270.261 337.202C263.406 320.819 259.626 311.727 258.993 310.084C256.921 304.816 255.477 300.471 254.761 297.148C254.405 295.5 254.182 293.899 254.227 292.463C254.267 291.178 254.543 289.133 256.103 287.574L388.031 155.646C389.068 154.609 390.307 154.204 391.196 154.032C392.112 153.856 393.042 153.851 393.882 153.91Z",
  fill: "#231F20"
}), /* @__PURE__ */ React24.createElement("path", {
  d: "M165.451 354.206C167.8 355.85 171.03 356.965 175.14 357.553C179.015 358.14 181.834 358.022 183.595 357.2C184.065 356.965 184.535 356.143 185.004 354.734C185.357 353.207 185.827 352.15 186.414 351.563C186.649 351.328 186.942 351.152 187.294 351.035C191.992 348.451 197.042 346.22 202.444 344.341C215.127 339.644 228.221 336.766 241.726 335.709C248.655 319.151 252.413 310.108 253 308.582C257.11 298.13 258.402 292.141 256.875 290.614L124.408 158.147C123.586 157.324 121.061 157.501 116.833 158.675C112.488 159.967 109.728 161.317 108.554 162.727C107.262 164.253 105.383 168.011 102.917 174C100.333 179.872 97.691 184.159 94.9899 186.86C91.4669 190.383 85.3015 193.377 76.4938 195.843C68.2733 197.957 63.752 199.895 62.9299 201.657C61.051 205.414 59.9941 212.695 59.7592 223.5C59.2894 234.304 59.9353 241.056 61.6969 243.757C62.5189 245.049 65.4548 245.754 70.5046 245.871C75.4369 246.106 78.6664 245.46 80.193 243.933C81.4848 242.642 82.2481 241.526 82.483 240.586C82.7179 239.647 83.0115 239.119 83.3638 239.001C88.531 235.713 93.5807 232.894 98.513 230.546C110.139 224.791 119.945 221.797 127.931 221.562L156.644 250.275C150.42 252.271 142.904 255.442 134.096 259.787C131.982 261.431 130.69 268.008 130.221 279.516C129.516 291.025 130.221 297.836 132.335 299.95C133.626 301.242 135.975 301.947 139.381 302.064C142.786 302.182 145.487 301.712 147.484 300.655C148.658 299.481 150.831 297.543 154.001 294.842C159.286 291.201 170.912 287.091 188.88 282.511L207.376 301.007C201.739 302.416 194.517 304.706 185.709 307.877C176.667 311.048 171.441 313.338 170.031 314.747C168.387 316.391 166.861 323.085 165.451 334.829C163.807 346.572 163.807 353.031 165.451 354.206Z",
  fill: "white"
}), /* @__PURE__ */ React24.createElement("path", {
  fillRule: "evenodd",
  clipRule: "evenodd",
  d: "M124.293 153.463C125.185 153.635 126.43 154.042 127.471 155.083L259.939 287.551C261.505 289.116 261.782 291.17 261.822 292.461C261.867 293.902 261.643 295.509 261.286 297.164C260.567 300.501 259.117 304.864 257.037 310.154C256.4 311.805 252.605 320.934 245.723 337.382L244.701 339.822L242.064 340.029C228.957 341.055 216.256 343.846 203.948 348.404L203.908 348.419L203.867 348.433C198.723 350.222 193.934 352.336 189.495 354.769C189.416 354.985 189.322 355.291 189.226 355.708L189.18 355.909L189.115 356.104C188.834 356.945 188.494 357.8 188.062 358.557C187.698 359.193 186.932 360.376 185.533 361.075L185.48 361.102L185.427 361.126C182.436 362.522 178.516 362.444 174.508 361.839C170.013 361.195 166.062 359.921 162.967 357.755L162.95 357.743L162.933 357.731C161.126 356.441 160.539 354.398 160.291 353.246C159.993 351.862 159.886 350.231 159.886 348.481C159.886 344.957 160.328 340.187 161.155 334.27C161.865 328.358 162.619 323.591 163.429 320.037C163.835 318.26 164.276 316.689 164.771 315.387C165.221 314.203 165.888 312.764 166.968 311.684C167.754 310.897 168.771 310.256 169.694 309.741C170.688 309.187 171.892 308.608 173.269 308.005C176.023 306.798 179.701 305.393 184.258 303.795C189.779 301.807 194.72 300.15 199.071 298.829L187.566 287.324C179.733 289.368 173.262 291.299 168.129 293.113C162.559 295.083 158.819 296.828 156.632 298.292C153.559 300.913 151.565 302.7 150.547 303.718L150.087 304.179L149.511 304.484C146.589 306.031 143.038 306.525 139.231 306.394C135.573 306.268 131.78 305.522 129.271 303.014C128.049 301.792 127.337 300.229 126.882 298.789C126.411 297.298 126.105 295.576 125.911 293.702C125.525 289.964 125.538 285.13 125.894 279.296C126.133 273.473 126.584 268.714 127.291 265.118C127.644 263.318 128.086 261.677 128.662 260.287C129.207 258.973 130.044 257.45 131.436 256.367L131.784 256.097L132.179 255.902C138.256 252.904 143.78 250.431 148.741 248.499L126.239 225.997C119.422 226.572 110.86 229.269 100.435 234.429L100.405 234.443L100.376 234.457C95.892 236.592 91.2836 239.142 86.5504 242.112C85.9349 244.027 84.581 245.672 83.2566 246.997C81.648 248.605 79.5183 249.403 77.4756 249.811C75.401 250.226 72.9934 250.324 70.3513 250.201C67.7166 250.138 65.3905 249.92 63.5042 249.467C61.8732 249.076 59.441 248.26 58.0569 246.107C56.5684 243.813 55.9092 240.537 55.5785 237.08C55.2297 233.433 55.1919 228.837 55.4287 223.358C55.5493 217.873 55.8794 213.178 56.4405 209.313C56.9904 205.525 57.8005 202.246 59.0347 199.759C59.7191 198.337 60.8644 197.37 61.774 196.74C62.7685 196.052 63.9549 195.447 65.2308 194.9C67.7799 193.807 71.1952 192.734 75.3692 191.659C83.9424 189.254 89.2112 186.511 91.9264 183.796C94.0692 181.653 96.4442 177.944 98.9308 172.302C100.177 169.277 101.301 166.751 102.301 164.752C103.261 162.832 104.24 161.121 105.237 159.939C106.392 158.559 107.999 157.549 109.6 156.765C111.271 155.948 113.293 155.207 115.598 154.522L115.636 154.511L115.673 154.501C117.896 153.883 119.907 153.458 121.596 153.34C122.44 153.281 123.373 153.286 124.293 153.463ZM118.03 162.839C116.009 163.441 114.491 164.019 113.409 164.548C112.869 164.812 112.484 165.042 112.22 165.227C111.969 165.404 111.881 165.502 111.881 165.502L111.872 165.513L111.861 165.525C111.57 165.87 110.966 166.797 110.051 168.628C109.176 170.376 108.135 172.707 106.923 175.65L106.903 175.698L106.882 175.745C104.209 181.821 101.307 186.67 98.0535 189.923C93.7271 194.25 86.6784 197.491 77.662 200.015L77.6175 200.028L77.5728 200.039C73.547 201.075 70.607 202.023 68.6441 202.864C67.6594 203.286 67.0475 203.628 66.7062 203.864C66.6906 203.875 66.676 203.886 66.6623 203.895C66.0747 205.202 65.4818 207.346 65.0156 210.558C64.5213 213.963 64.2059 218.295 64.0907 223.594L64.0896 223.641L64.0876 223.688C63.857 228.992 63.908 233.159 64.2041 236.254C64.4451 238.774 64.8198 240.209 65.1011 240.926C65.2129 240.961 65.3534 241 65.5264 241.042C66.5636 241.291 68.2119 241.484 70.6053 241.54L70.658 241.541L70.7106 241.543C72.9802 241.652 74.6351 241.543 75.7762 241.314C76.821 241.105 77.1385 240.856 77.1437 240.856C77.6531 240.345 77.9721 239.954 78.1587 239.681C78.2406 239.562 78.2833 239.485 78.302 239.448C78.4633 238.821 78.7031 238.082 79.0921 237.381C79.3977 236.831 80.0574 235.832 81.2721 235.197C86.4798 231.895 91.5961 229.042 96.6209 226.648C108.486 220.778 118.932 217.492 127.803 217.231L129.672 217.176L164.728 252.232L157.967 254.4C152.203 256.249 145.163 259.192 136.813 263.279C136.772 263.363 136.723 263.47 136.667 263.603C136.392 264.268 136.085 265.299 135.793 266.788C135.21 269.759 134.781 274.027 134.55 279.693L134.548 279.737L134.545 279.781C134.199 285.435 134.213 289.746 134.53 292.811C134.689 294.343 134.911 295.439 135.145 296.179C135.285 296.625 135.4 296.845 135.444 296.923C135.538 296.99 135.787 297.141 136.31 297.298C137.02 297.511 138.066 297.684 139.53 297.734C142.125 297.824 143.86 297.504 144.974 297.05C146.335 295.745 148.432 293.895 151.192 291.544L151.361 291.4L151.544 291.274C154.668 289.121 159.334 287.032 165.24 284.944C171.221 282.83 178.756 280.621 187.81 278.313L190.2 277.704L215.85 303.354L208.427 305.21C202.989 306.57 195.919 308.806 187.177 311.954L187.16 311.96L187.143 311.966C182.666 313.536 179.215 314.859 176.747 315.941C175.511 316.483 174.579 316.938 173.914 317.309C173.527 317.525 173.298 317.675 173.18 317.757C173.121 317.868 173.013 318.09 172.87 318.467C172.572 319.25 172.235 320.394 171.877 321.964C171.163 325.095 170.451 329.533 169.753 335.345L169.748 335.387L169.742 335.429C168.929 341.237 168.551 345.553 168.551 348.481C168.551 349.728 168.621 350.59 168.71 351.144C170.305 352.051 172.588 352.812 175.753 353.264L175.771 353.266L175.789 353.269C178.31 353.651 179.909 353.632 180.844 353.503C181.251 351.834 181.946 349.904 183.35 348.5C183.988 347.862 184.718 347.404 185.473 347.092C190.309 344.453 195.48 342.178 200.979 340.263C213.195 335.743 225.785 332.861 238.74 331.621C245.041 316.556 248.426 308.404 248.956 307.027L248.962 307.011L248.968 306.996C250.995 301.841 252.245 297.988 252.816 295.338C253.05 294.254 253.14 293.504 253.159 293.025L122.124 161.99C121.287 162.057 119.956 162.306 118.03 162.839ZM253.142 292.518C253.143 292.517 253.148 292.538 253.153 292.586C253.143 292.543 253.141 292.519 253.142 292.518ZM168.849 351.728C168.847 351.731 168.836 351.705 168.817 351.642C168.841 351.694 168.85 351.726 168.849 351.728ZM66.501 204.023C66.5005 204.023 66.507 204.017 66.522 204.004C66.5089 204.017 66.5015 204.023 66.501 204.023Z",
  fill: "#231F20"
})));
var elk_finance_default = ElkFinanceIcon;

// src/searchbar/icons/lydia.finance.tsx
import React25 from "react";
var LydiaFinanceIcon = ({ height, width }) => /* @__PURE__ */ React25.createElement(abstract_default, {
  height: height != null ? height : 16,
  width: width != null ? width : 16,
  viewBox: "0 0 400 400"
}, /* @__PURE__ */ React25.createElement("g", {
  transform: "translate(0)"
}, /* @__PURE__ */ React25.createElement("path", {
  fill: "#070931",
  d: "M26.9,147.2c-5.7,7.9-11.4,15.7-17.3,23.9c-0.8-16.7,5.1-31.3,12-45.6c6.9-14.4,16.2-27.2,28.6-37.4\n        c-0.2-0.3-0.4-0.7-0.5-1c-4.5,1.5-9.1,2.7-13.5,4.4c-4.5,1.8-8.8,4.2-14.2,5.8c1.7-3.4,3-7.1,5.3-10.1\n        c10.2-13.1,24-21.3,39.1-27.4c14.9-5.9,30-11.6,45-17.3c0.3-0.1,0.6-0.4,1.5-1c-11.1-0.9-20.5,4.2-30.6,4.8\n        c-0.2-0.5-0.4-1-0.6-1.5c6.1-3,12-6.5,18.3-8.8c12.1-4.5,24.4-8.7,36.7-12.5c10.2-3.1,20.5-2.3,30.6,1.3c0.9,0.3,1.8,0.5,2.8,0.7\n        c0.2,0,0.5-0.2,1.1-0.4c-4.9-7.4-9.8-14.7-10.5-23.9c11.9,8.1,22.2,18.1,36.5,22.8c-4.3-6.5-8.4-12.7-12.5-18.8\n        c0.4-0.3,0.7-0.6,1.1-0.8c1.4,1,2.7,2,4.1,3c0.1,0.8-0.2,1.8,0.3,2.2c6.6,6.5,13.3,12.9,20,19.4c0.6,0.3,1.1,0.6,1.7,0.8l0,0\n        c4.8,3,9.4,6.4,14.4,9.1c9.8,5.4,18.5,12.1,25.3,21c3.6,4.8,7.5,9.4,11.1,14.2c6.6,9,14.3,16.3,26.3,17.4c-1.5-3-3-6.1-4.5-9.2\n        c-0.3-0.3-0.6-0.6-0.9-0.9c0,0,0.1,0,0.1,0C279.7,68,270.6,58,260.3,48.9c-0.9-1.1-1.6-2.4-2.6-3.4c-12.7-11.9-28-19.1-44.1-24.7\n        c-5.8-2.1-11.4-4.8-17.1-7.3c-1.6-1.6-3.3-3.3-4.9-4.9c0.9,0.1,1.9,0,2.8,0.3c11.7,4.4,23.5,8.6,35,13.5\n        c25.6,11,45.7,28,57.5,53.8c1.4,3.1,2.9,6.2,4.2,9.3c2.8,6.5,7.2,11.6,13.1,15.4c8.5,5.6,13.7,13.2,14.7,23.4\n        c0.8,8.4,4.9,14.7,11.3,20.1c14.3,11.9,28.9,23.3,45.1,32.6c1.9,1.1,3.7,2.4,5.4,3.7c9.2,7.1,10.8,16.5,8.1,27.1\n        c-0.7,2.7-1.4,5.1-0.3,8.2c2.3,6.4,0.2,12.7-2.2,18.7c-4.1,10.2-9.3,19.8-17.3,27.6c-4.5,4.4-6.4,10-6.5,16.2\n        c-0.5,18.4-7.6,33.9-20.6,46.8c-2.7,2.7-5.4,5.4-8.3,7.9c-9.5,8.2-17,18-23.2,28.9c-3.2,5.6-7.8,10.5-12,15.5\n        c-1.6,1.9-3.9,3.2-6.4,5.3c-0.3-3.2-0.5-5.5-0.7-7.9c-4.2,7.8-8.9,15-15.9,20.7c-0.4-8.2-0.7-16-1.1-24.2\n        c-3.3,4.3-6.4,8.3-10.2,13.1c-2.2-7.9-4-14.4-5.8-20.9c-0.4,0-0.8,0.1-1.2,0.1c0.3,10.8,0,21.4-7,30.9c-3.5-7.5-6.7-14.4-9.9-21.3\n        c-0.3,0.1-0.6,0.2-0.9,0.3c0.2,3.4,0.4,6.9,0.6,10.3c-0.3,0.1-0.5,0.2-0.8,0.3c-2.9-3.9-5.8-7.9-9.4-12.8\n        c0.6,9.5-2.9,16.5-7.6,22.8c-2.4-7.6-4.8-15.1-7.5-23.6c-1.5,3.9-2.2,6.8-3.6,9.2c-0.8,1.4-2.8,3-4.2,2.9c-1.2,0-2.8-2.1-3.4-3.6\n        c-3.5-8.4-6.7-16.9-10-25.3c-0.4,0.1-0.7,0.3-1.1,0.4c-1.3,6.1-2.4,12.3-3.9,18.4c-0.9,3.7-2.1,7.3-3.4,10.9\n        c-0.3,0.9-1.3,2.1-2,2.2c-0.8,0-2-1-2.4-1.8c-0.9-2.1-1.1-4.5-2-6.6c-2.3-5.7-4.8-11.3-7.2-16.9c-3.5-8.2-7.1-16.3-10.7-24.6\n        c-0.1,0.7-0.4,1.5-0.4,2.3c-0.1,11.4-0.1,22.7-0.2,34.1c0,0.8,0.2,1.7-0.1,2.4c-0.4,1-1,2.2-1.8,2.5c-0.6,0.2-1.9-0.8-2.4-1.6\n        c-5.6-8.9-11.2-17.8-16.6-26.7c-1.3-2.2-2.4-4.5-4.2-7.9c0,9.1,0.2,17.1-5.5,24.4c-7.6-12-9.9-25.4-14.9-37.7\n        c-1.7,3.5-3.4,7.3-5.4,10.8c-0.7,1.3-2.2,2.1-3.4,3.1c-0.9-1.3-2.4-2.5-2.5-3.8c-0.5-4.9-0.6-9.8-0.8-15.1c-2,2.9-3.8,5.9-6,8.4\n        c-1.3,1.5-3.4,2.2-5.2,3.3c-0.8-1.8-2-3.5-2.3-5.3c-0.9-5.5-1.5-11-2.3-17.2c-3.8,3.8-4.5,9.8-10.8,11.2\n        c4.9-19.6,0.1-37.7-5.8-55.8c-2.4,12.4-4.6,24.8-13.3,36.1c-0.6-2.4-1.4-3.7-1.2-4.8c1.8-15.8-3.1-30.3-8.3-44.7\n        c-4.8-13.2-10.3-26.2-12.1-40.6c-2.6,16.6-5.3,33.1-7.9,49.7c-0.5,0.1-1,0.2-1.4,0.3c-1.3-3.4-2.9-6.8-3.8-10.3\n        c-5.3-19.4-8.5-39-6.4-59.2c1.7-16,5.7-31.4,12.2-46.1c0-0.3,0-0.7,0-1C27.4,146.9,27.2,147.1,26.9,147.2z M179.9,27.5\n        C179.9,27.5,179.9,27.5,179.9,27.5c0.3,0.3,0.5,0.5,0.8,0.8l0,0c0.3,0.3,0.6,0.6,0.9,0.8c0,0,0,0,0,0c0.6,0.5,1.1,1.1,1.7,1.6\n        c0,0,0,0,0,0c0.5,0.3,1,0.7,1.5,1c0,0,0,0,0,0c0.6,0.5,1.2,1,1.8,1.5l0,0c0.3,0.3,0.6,0.5,0.9,0.8c0,0,0,0,0,0\n        c4.4,3.3,8.6,7.2,13.4,9.8c10.3,5.5,19.9,11.9,27.8,20.5c4.2,4.6,8,9.5,12.1,14.3c2.7,3.9,5.7,7.2,10.9,7.2\n        c5.2,0.3,10.5,0.6,16.8,0.9c-3.1-2.7-5.5-4.7-7.8-6.7c-0.3-0.3-0.5-0.6-0.8-0.8l0.1,0c-0.4-0.9-0.5-1.9-1.1-2.6\n        c-7.8-9.5-15.2-19.3-23.7-28.1c-3.4-3.5-9.2-4.8-13.9-7.1c0,0,0,0,0,0c-0.6-0.3-1.2-0.6-1.8-0.9c-5.9-3.4-11.5-7.5-17.6-10.2\n        c-12.6-5.5-24.7-11.5-34.3-21.6c-0.6-0.7-1.7-0.9-3.6-1.8c2,3.3,3.3,5.5,4.7,7.6c1,1.5,2.3,2.7,3.4,4.1c1.8,2.2,3.6,4.3,5.4,6.5\n        c0.6,0.5,1.2,1,1.8,1.6c0,0,0,0,0,0C179.3,27,179.6,27.3,179.9,27.5z M95.3,99.8c-0.2,0.3-0.5,0.6-0.7,0.9l0,0\n        c-0.4,0.5-0.7,1-1.1,1.5c-3.7,6.6-7.9,13.1-11.2,20c-7.4,15.7-10.1,32.8-14,49.5c-0.2,1.1,0,2.2,0,3.7c7.8-15.3,15.4-30.2,23-45.1\n        c0.3-0.6,0.5-1.1,0.8-1.7c0,0,0,0.1,0,0.1c0.9-1,1.8-2,2.6-3.1c11.5-15.9,26.2-27.5,45.1-33.1C154,88.3,168.3,85,181,76.9\n        c4.4-2.8,9.8-3.9,14.9-5.8c-0.2-0.2-0.4-0.4-0.6-0.5c-0.7-0.4-1.4-0.8-2.1-1.2c-10.9-6.1-22.7-6.3-34.7-5.8\n        c-17.5,0.7-33.8,5.2-46.9,17.6c-5.7,5.4-10.3,11.8-15.5,17.8l0,0C95.9,99.2,95.6,99.5,95.3,99.8L95.3,99.8z M36.1,85\n        c0.6-0.3,1.1-0.5,1.7-0.8c0,0,0,0,0,0c11.8-3.1,23.5-7,35.5-9.2c12.7-2.4,25.6-3.2,38.5-4.7l0,0c0,0.3,0,0.5-0.1,0.8\n        c-2.2,0.6-4.4,1.2-6.7,1.7c-6.8,1.5-13.7,3-20.5,4.5c-8,4-15.9,7.9-23.9,11.9C53.8,94.5,47,100,40.2,105.4\n        c-3.3,4.7-6.5,9.4-9.8,14c0,0,0,0,0,0c-0.4,0.6-0.8,1.1-1.2,1.7c-1,1.9-2,3.8-2.9,5.6c-3.1,7.2-6.2,14.4-9.3,21.6\n        c-0.4,1.3-0.8,2.5-1.2,3.8c0.2,0.1,0.5,0.2,0.7,0.3c5.7-6.7,11.3-13.4,17-20c1.7-0.8,3.4-1.6,5.1-2.4c-1.4,3.7-2.8,7.5-4,11.2\n        c-1,2.8-1.8,5.7-2.6,8.6c-15.5,33.4-14.8,67.9-6.6,102.8c0.5-5,1.1-10,1.6-14.9c0.6-4.5,1.2-9.1,2-13.6\n        c2.2-12.4,4.9-24.6,11.5-35.5c0.7-0.6,1.4-1.2,2.2-2c-0.9,4.9-2,9.4-2.4,14c-1,12.2,1.6,23.8,5.3,35.3c6,18.8,15,37,13.2,57.7\n        c3.6-7.7,6.3-15.6,6.9-24c1.2-7.1,2-14.1-0.6-21.1c-0.8-2.1-0.7-4.5-1-6.7c0.2-7.2,0.3-14.3,0.5-21.5c0.1,0,0.3,0.1,0.4,0.1\n        c1.1,6.3,2.1,12.6,3.2,18.9c0.3,1.9,0.6,3.8,0.8,5.8c1.5,6.1,2.9,12.2,4.6,18.3c3.8,14,7.8,27.9,7,42.7c-0.2,3.3-0.5,6.5-0.8,9.8\n        c-0.1,0.1-0.3,0.2-0.4,0.3c0.1,0,0.2,0,0.2-0.1c0.1-0.1,0.1-0.2,0.1-0.3c2.1-4.4,4.3-8.8,6.4-13.2c4.6-12.5,7.5-25.4,6.8-38.8\n        c-0.7-12.5-2.2-24.9-3.4-37.4c0.5-6.1,1.1-12.1,1.6-18.2c-0.2,0-0.4-0.1-0.6-0.1c-2.9,7.6-5.8,15.3-8.9,23.3\n        c-4.2-4-4.3-8.4-4.7-12.7c-0.1-1.8-0.2-3.6-0.2-5.4c0.1-0.3,0.1-0.6,0.2-0.8c0.1-5.5,0.2-11,0.3-16.5c0.7-6.1,1.1-12.3,2.1-18.3\n        c1.1-6,2.6-12,4.3-17.9c1.6-5.7,3.8-11.2,5.7-16.8c-0.5-0.2-1-0.4-1.5-0.6c-8.1,17.3-16.3,34.6-24.4,51.9\n        c-0.4-0.2-0.8-0.4-1.1-0.5c4.8-30.5,8.3-61.3,23.7-89c1.5-2.4,3-4.9,4.5-7.3c7.1-9.4,14.7-18.3,24.4-25.2c0.2-0.2,0.2-0.7,0.3-1\n        c0,0,0,0,0,0c0.5-0.1,1-0.2,1.5-0.3c3.3-1.6,6.4-3.7,9.9-4.8c13.3-4.2,27.1-5.8,41.1-5.9c10.9,0,20.6,3,30,8.3\n        c5.8,3.3,11.7,6.6,17.9,9c7.8,3.1,15.9,5.3,23.9,8c0.2-0.3,0.4-0.7,0.5-1c-2.6-3.1-5.2-6.2-7.8-9.3c-10.2-17.6-27.6-26-44.8-34.5\n        l0,0c-4.6-4.5-9.2-9.3-16.4-9.1l0,0c-0.8-0.3-1.7-0.6-2.5-0.8l0,0c-0.6-0.3-1.2-0.7-1.9-1c-12.2-4.2-24.3-4.4-36.4,0.2\n        c-2.8,0.6-5.7,1.3-8.5,1.9c-5.4,1.6-10.7,3.2-16.1,4.8c0.1,0.4,0.1,0.7,0.2,1.1c11.4-1.7,22.9-3.1,34.3-0.7\n        c15.5,3.2,29.1,9.4,30.5,13.9c-0.1,0.1-0.2,0.2-0.3,0.2c-0.6-0.2-1.2-0.5-1.9-0.7c-7.6-2.5-15.1-6.1-22.9-7.2\n        c-19.4-2.6-37,4.7-54.5,12c-2.2,1.1-4.4,2.2-6.5,3.3c-1.7,0.3-3.6,0.4-5.1,1.1c-11.4,4.9-22.7,9.9-34.1,14.9\n        c-1,0.8-2.1,1.6-3.1,2.4c-3.9,3.2-7.9,6.4-11.8,9.6c0.3,0.4,0.6,0.8,0.8,1.2c1.1-0.6,2.2-1.2,3.3-1.8C35,85.6,35.6,85.3,36.1,85\n        L36.1,85z M274.4,243.6c-0.2-0.3-0.4-0.7-0.6-1c-5.2-7.3-10.3-14.5-15.5-21.8c0.3-0.3,0.7-0.5,1-0.8c2.8,2.1,5.6,4.2,8.5,6.3\n        c6.6,5.3,12.1,6.7,16.1,2.8c3.3-3.3,5.2-7.8,7.7-11.8c2.5-3.9,4.7-8,7.4-11.7c6.3-8.6,16.8-11.3,27-7.3c-0.5,0.1-1,0.2-1.6,0.3\n        c-0.9,0.2-1.8,0.3-2.7,0.5c-3.2,0.6-6.4,1.2-9.7,1.9c-0.6,0.2-1.2,0.4-1.8,0.6l0,0c-1,0.4-2,0.8-3,1.2c-0.1,0.5-0.2,1-0.4,1.5\n        c6.6,3.9,13.2,7.9,19.8,11.8c-0.1,0.2-0.2,0.3-0.3,0.5c-3.8-1.2-7.6-2.3-11.4-3.5c-3.7-2.1-7.4-4.2-11.5-6.5\n        c-1.8,2.9-3.6,5.6-5,8.5c-0.4,0.8,0,2.9,0.7,3.3c3.6,2.3,7.4,4.3,11.2,6.3l0,0c0.5,0.2,1.1,0.5,1.6,0.7c5.2,2.2,10.4,4.5,15.6,6.7\n        c-0.8,0.4-1.8,1.5-2.4,1.3c-10-3-20.7-4.2-29.9-11.5c-0.6,4.8-1.2,9-1.6,13.1c-0.1,0.8,0.6,1.9,1.3,2.3c2.6,1.7,5.4,3.2,8.1,4.7\n        c3.6,1.3,7.1,2.6,10.7,3.9c5.7,0.9,11.4,1.8,17.1,2.7c0.4,0.1,0.9,0.1,1.3,0.2l0.3,0.2l0.4,0c-0.6,0.4-1.2,1-1.8,1\n        c-10.3,0.7-20.5,0.4-30.3-3c-1.9-0.6-3.7-1.4-5.6-2c-0.3,0.3-0.6,0.5-0.9,0.8c1.5,2.6,3,5.2,4.5,7.7c2.2,2,4.5,3.9,6.7,5.9\n        c0.8,0.4,1.5,0.9,2.3,1.3c2.5,0.8,5,2.3,7.6,2.3c8.7,0.1,17.4-0.1,26.1-0.5c8.3-0.4,14.7-4.3,19.5-11.2c4.7-6.8,7.6-14.2,8.2-22.4\n        c0.2-3.1-0.8-6.3-1.2-9.5c-0.8-1.7-1.6-3.4-2.5-5.1c-5.4-9.4-10.9-18.7-16.3-28c0.2-0.3,0.4-0.7,0.6-1c7.2,5.2,14.9,9,23.9,8.9\n        c1.5,0.8,3.1,1.7,4.6,2.5c2.3,1.3,4.7,3.9,7.2,1.6c2.8-2.6,0.6-5.5-0.9-8c-0.3-0.4-0.7-0.8-1.1-1.2c-3.4-3.1-6.3-6.8-10.1-9.2\n        c-17.4-10.9-34.3-22.5-48.5-37.6c-5.5-5.9-9.8-12.1-10.8-20.6c-1.1-9.3-6.9-15.7-15.4-19.6c-1.6-1.2-2.9-2.8-4.7-3.7\n        c-4.8-2.3-9.8-4.3-14.7-6.4c-7.8-2.9-15.6-5.1-24-3.2c-6.6,0.7-13.1,1.4-19.7,2.1c0.1,0.2,0.2,0.4,0.2,0.6c5,1.2,9.9,2.4,15.6,3.8\n        c-7.2,3-13.6,5.3-19.8,8.2c-7.8,3.6-15.6,7.6-20.7,14.9c-9,12.6-11.6,26.8-9.8,41.6c3.5-5.4,7.1-11,10.7-16.5\n        c0.3,0.2,0.6,0.5,0.9,0.7c0,1.5,0,3,0,4.5c-0.5,4-1.2,8.1-1.4,12.1c-0.3,8.7,1.9,16.8,5.8,24.8c3.2-6.5,6.2-12.6,9.2-18.7\n        c0.4,0.1,0.9,0.3,1.3,0.4c-1.6,10.9-1.6,21.8,1.7,32.4c6,14.5,12,29,17.9,43.2c-0.2-13.1-2.8-26.3-6.8-39.2\n        c4.8,7.1,9.1,14.4,14.5,20.8c5.5,6.6,12,12.2,18.1,18.2C273.6,243.3,274,243.4,274.4,243.6C274.6,243.9,274.7,244.3,274.4,243.6\n        C275,244.1,274.7,243.9,274.4,243.6z M115,206.5C115,206.5,115,206.6,115,206.5c3.9-5.1,7.8-10.3,11.8-15.5c2.4-3,4.8-6.1,7.3-9.1\n        c2.4-3.8,4.8-7.7,7.2-11.5c0.7-1.1,1.3-2.1,2-3.2c0,0,0,0,0,0c1-1.4,2.2-2.7,2.9-4.3c3.3-6.8,6.5-13.7,9.8-20.6\n        c3.4-6.2,6.8-12.5,10.2-18.7c0.8-1.1,1.6-2.2,2.3-3.4c9-15.6,21.2-27.7,37.8-35c2.3-1,4.7-1.9,8.1-3.2c-3.7-1.1-6.4-2-9.1-2.6\n        c-10.5-2.2-20.7-1.3-29.5,4.9c-10.8,7.6-19.2,17.8-27,28.4c-4.2,6.5-8.4,13.1-12.6,19.6c-6,10.3-12,20.7-18,31\n        c-3.2,5.3-6.5,10.6-9.7,15.9c-10.1,17.9-12.1,36.3-6.1,61.6c0.4-3,0.9-6,1.3-9c1.3-3.9,2.6-7.7,4-11.6c1.9-3.7,3.9-7.4,5.8-11.2\n        C113.9,208.4,114.5,207.5,115,206.5z M250.8,358.5c0-0.5-0.1-1-0.1-1.5c0.2-1,0.7-2.1,0.6-3c-1-5.8-2.1-11.6-3.2-17.4\n        c-1.6-7.7-3.1-15.3-4.4-21.7c-1,5.3-2.4,11.9-3.6,18.5c-0.9,4.6-2.4,9.3-2.4,14c0.1,9.7,2.9,19,8,27.3c1.3,2.1,2.7,4.2,4,6.2\n        c0.1,1.3,0.1,2.6,0.3,4.9c0.8-5.8,1.9-10.7,2.1-15.6C252.2,366.2,251.3,362.3,250.8,358.5z M185.3,360.2\n        c-0.4-3.8-0.8-7.6-1.2-11.5c1.5,0.9,2.6,1.1,2.3-1.2c-0.3-2.4-0.7-4.7-1.1-7c-0.5-2.3-0.9-4.5-1.4-6.8c-0.2-0.8-0.4-1.5-0.7-2.3\n        c0,0,0,0.1,0,0.1c0.2-9,0.5-18,0.7-26.9c1.1-9.6,2.3-19.3,3.4-28.9c0.2-0.5,0.6-1,0.6-1.5c0.8-20.1,0.4-40.1-6.8-59.4\n        c-2-5.4-4-10.8-6-16.1c-0.6,0-1.2,0.1-1.9,0.1c-14.2,33.9-16,69.4-11.5,105.5c-0.1,3.3-0.1,6.6-0.4,9.9c-1,11,2.4,21,7.4,30.4\n        c6.4,12,12.1,24.1,13.8,38.9c0.7-6.6,1.3-12.1,2-17.6c0.1-1.5,0.2-3.1,0.3-4.6C185.1,360.9,185.2,360.5,185.3,360.2z M87.9,161.3\n        c-0.2,0.3-0.4,0.6-0.6,0.8c-0.6,2.2-1.2,4.4-1.8,6.7c-4.7,17.2-5,34.8-4.2,52.5c1.4-4.9,2.9-9.7,4.3-14.6c1.3-3,2.6-6,4-9.1\n        c1.5-3,2.9-6,4.4-9.1c3.1-3.1,6.4-6.1,6.2-11c0.3-0.8,0.7-1.5,1-2.3c1.5-0.7,3.5-1.1,4.3-2.3c7.4-10.6,14.5-21.4,21.8-32.1\n        c5-9,10-18,15-26.9c7-8.5,14-16.9,21.6-26.2c-5.5,2-10.2,3.7-14.9,5.3c-13.9,4.6-27.3,10.1-37.9,20.8c-3.7,5.7-7.3,11.4-11,17.1\n        c-4.1,10.1-8.2,20.3-12.3,30.4L87.9,161.3z M283.5,378.2c1.7-4.4,3.3-8.7,5-13.1c0.3-0.6,0.6-1.2,0.8-1.8c1.7-7.1,1.1-14.1-1-21\n        c-0.8-3.4-1.5-6.8-2.3-10.3c-3.1,9.5-6.5,18.6-7.8,28.1c-1.2,9.3-0.3,18.9-0.3,28.4c0.2,0.1,0.5,0.1,0.7,0.2\n        c1.3-2.6,2.6-5.3,3.8-7.9C282.8,379.8,283.2,379,283.5,378.2z M246.5,267.3L246.5,267.3c-0.6-3.7-1.1-7.4-1.7-11.1\n        c-0.1-1.2,0-2.5-0.2-3.7c-2.7-14.3-9-26.8-17.9-38.2c-7.8-10-15.6-20-23.5-29.9c-0.3-0.3-0.8-0.5-1.4-0.9\n        c-1.3,17.8,2,33.9,12.7,48.2c16.2,21.5,25.4,46.1,32.4,72.2c0.3-4.5,0.6-9,0.9-13.5c-0.2-6.8-0.5-13.6-0.7-20.4\n        C247,269.2,246.7,268.2,246.5,267.3z M369.9,255.9L369.9,255.9c7.8-9.8,12.9-20.9,15-33.4c0-1.7,0-3.3,0-4.6\n        c-3.9,1-7.3,1.8-10.6,2.7c1.8,11.8-1.3,22.7-8.1,32.7c-2.3,3.4-3.5,6.8-2.8,11.9c2.4-3.3,4.3-5.9,6.2-8.5\n        C369.8,256.5,369.9,256.2,369.9,255.9z M280.2,295.3C280.2,295.3,280.2,295.3,280.2,295.3c-0.7-3.1-1.2-6.3-2.2-9.4\n        c-5.8-17.9-16.8-33.3-25.1-50c-0.3-0.6-1.1-0.9-1.9-1.5c0,6.6,0,12.9,0,19.1c0,0.8-0.1,1.7,0.1,2.4c2.3,9.2,5.3,18,9.9,26.3\n        c5.2,9.4,10.3,19,13.9,29.1c3,8.7,3.8,18.3,5.4,27.1c0.8-5.7,1.6-12,2.4-18.4c-0.3-6-0.5-11.9-0.8-17.9c-0.3-1.3-0.5-2.6-0.8-4\n        C280.8,297.2,280.5,296.3,280.2,295.3z M160.1,213.2c2.2-7.1,4.4-14.3,6.6-21.4c1.7-5.6,3.4-11.3,5.1-16.9\n        c4.7-13.2,9.3-26.5,14-39.7c4.5-7.5,8.9-15,13.4-22.4c5.2-8.4,12-15.2,20.9-19.7c3.4-1.7,7-3,10.9-4.7c-0.8-0.4-1.1-0.7-1.5-0.7\n        c-1.5-0.1-3-0.1-4.5-0.1c-4.4,0.7-8.8,1.4-13.2,2.1c-1.4,0.4-2.9,0.6-4.3,1.2c-21.6,8.9-34.4,25.9-43.2,46.7\n        c-3.6,7.4-7.1,14.8-10.7,22.2c-6.1,11.2-7.7,23.6-10.1,35.9c-1,6.7-2.1,13.3-3.1,20c-0.6,4.3-1.3,8.6-1.6,13\n        c-0.9,11.4-1.7,22.8-2.4,34.2c-0.1,1.5,0,3,0,4.5c0.5,0.1,0.9,0.1,1.4,0.2c3.4-6.9,6.7-13.9,10.1-20.8c0.6-1,1.5-2,1.8-3.1\n        C153.2,233.5,156.6,223.3,160.1,213.2z M199.5,237.7c0.3-1.4,0.9-2.8,0.9-4.2c-0.2-4.6-0.6-9.1-0.9-13.7c-0.6-5-1.2-10.1-1.7-15.1\n        c0-0.8,0-1.6,0-2.5c-1.5-16.6-3.2-33.3-4.6-49.9c-0.4-5.4-0.1-10.9-0.1-17.4c-2,5.1-3.8,9.1-5.1,13.3c-3,9.8-6.1,19.5-8.5,29.5\n        c-2.4,9.8,1.8,18.9,5,27.8c6.6,18.4,11.7,37,10,56.8c-0.1,1.7-0.2,3.5-0.3,5.2c0.4,0.1,0.9,0.1,1.3,0.2c0.9-5,1.7-10.1,2.6-15.1\n        C198.6,247.7,199.1,242.7,199.5,237.7z M358.8,278.9c0-1.3,0.1-2.7,0.1-4c0-4.5,0-9,0-14.3c-13,9.2-27,7.1-41.2,8.9\n        c9.8,2.6,18.6,3.9,27.7,2.2c5.3-1,7.3,0.4,6,5.9c-1.5,6.6-3.9,12.9-5.9,19.4c-0.5,0-1,0-1.4-0.1c-0.2-7-1-13.8-8.7-16.3\n        c1.6,3.1,3.2,6.1,4.7,9.2c-0.4,0.3-0.8,0.6-1.2,0.9c-5-7-12.6-9.3-20-12c-2.3-0.8-4.8-1.4-6.8-2.7c-12.6-7.9-25.1-15.9-37.6-23.9\n        c-1.1-0.7-2.3-1.3-3.4-1.9c-0.2,0.2-0.4,0.5-0.6,0.7c4.3,7.2,8.7,14.5,13,21.7c3.4,4.2,6.6,8.6,10.4,12.5\n        c4.6,4.9,9.6,9.3,14.4,13.9c5.4,5.2,10.9,10.3,16.3,15.4c1.4,0.8,2.8,1.6,4.2,2.4c2.5,0.5,5,1,7.4,1.6c0.5,0,1.1,0,1.6-0.1\n        c2.2-0.9,5.2-1.1,6.5-2.7c8.2-9.8,13.2-21.1,14.2-34C358.5,280.6,358.6,279.8,358.8,278.9z M97.8,320.4c0.6-1.2,1.3-2.3,1.8-3.6\n        c2.8-7.1,2.3-14.2,0.5-21.4c-1.1-5.6-2.2-11.1-3.2-16.6c-6,16.6-5.3,33.8-4,50.9C94.4,326.8,96.1,323.6,97.8,320.4z M129.9,341.3\n        c-0.8-5.2-1.7-10.5-2.5-15.7c-2.3-7.1-4.5-14.2-6.8-21.3c-0.4,0-0.8,0.1-1.2,0.1c-0.3,6.5-1.9,13.2-0.5,19.3\n        c2.6,11.8,7,23.2,10.6,34.8c0.1,0,0.3,0,0.4,0C129.9,352.8,129.9,347.1,129.9,341.3z M302.9,362c1.8-6,3.6-12,5.4-18\n        c0.5-5.8,0.9-11.7,1.4-17.5c-1.2-5.5-1.7-11.4-3.9-16.5c-4.8-11-14.7-17.6-23.8-25c4.1,11.4,5.3,23.1,4.8,35\n        c-0.1,1.1,0.6,2.3,1,3.5c4.7,13.7,8.2,27.7,8,42.3c0,3.6-1,7.1-1.5,10.7c0.2,0.1,0.4,0.2,0.5,0.2c1.4-2.7,2.8-5.5,4.2-8.2\n        C300.4,366.4,301.6,364.2,302.9,362z M134.6,283.9c-0.5-5.8-1.3-11.6-1.3-17.5c-0.1-16.9,0.1-33.8,0.2-50.8\n        c1.3-8.9,2.6-17.8,3.9-26.9c-0.8,0.7-1.5,1.3-2.1,2c-0.9,0.9-1.8,1.7-2.5,2.7c-12.7,18-17,38.4-16.3,60c0.1,4.5,1.4,8.9,1.6,13.4\n        c0.8,14.6,3.3,29,7.7,42.9c4.2,13.4,9.8,26.2,17.2,38.2c-2.2-9.4-4.5-18.7-6.7-28.1C135.8,307.9,135.2,295.9,134.6,283.9z\n        M210.5,352.9c0.5-1.3,1.3-2.5,1.3-3.8c0.3-16.3-5.2-31.1-12.2-45.6c-1.8-7.5-3.6-15-5.5-23.1c-0.8,1.5-1.4,2.2-1.8,3.1\n        c-5.1,13-4.5,26.7-4.7,40.2c-0.2,10.4,5.5,18.8,9.8,27.7c3.6,7.4,6,15.4,9,23.1c0.2,0.5,0.6,0.9,1.2,2c0.1-1.4,0.1-1.9,0.2-2.5\n        c0.5-3.3,1-6.6,1.5-9.9C209.7,360.5,210.1,356.7,210.5,352.9z M272.9,318.2L272.9,318.2c-2.4-6.5-4.2-13.3-7.3-19.4\n        c-3.8-7.5-8.6-14.5-13.2-22.1c-0.3,5.5-0.4,10.4-0.9,15.3c-0.7,7.2-2.2,14.3-2.5,21.5c-0.6,12.8,3.9,24.6,8.6,36.3\n        c3.3,8.2,8.3,15.9,7.8,25.3c0.3,0,0.7,0.1,1,0.1c0.6-2.3,1.2-4.5,1.8-6.8c4.1-7.8,6-16.2,6.2-25c2.3-8.2,1.4-16.2-1.1-24.2\n        C273.3,318.9,273.1,318.5,272.9,318.2z M111.8,320.1c0.5-0.9,1.4-1.8,1.4-2.8c0.8-11,2.4-22,1.9-32.9c-0.6-15.2-2.8-30.3-4.3-45.5\n        c0.6-5.6,1.1-11.1,1.7-16.7c-0.4-0.1-0.8-0.2-1.2-0.3c-3.2,8.5-6.4,17-9.8,26c-1.9-6.8-3.6-13-5.3-19.2\n        c-1.3,15.4,0.2,30.4,3.8,45.3c3.6,15,6.8,30.1,6.8,45.6c0,5.4,0,10.7,0,16.1c0.2,0.1,0.3,0.2,0.5,0.3\n        C108.8,330.7,110.3,325.4,111.8,320.1z M155.5,344.7c-0.1-10.8-0.1-21.6-0.2-32.4c-0.1-17.9-0.1-35.8-0.2-53.7\n        c0.8-4.6,1.6-9.3,2.4-13.9c-0.5-0.1-0.9-0.2-1.4-0.3c-1.5,3.4-2.9,6.9-4.5,10.3c-2.6,5.6-6.3,11-7.8,16.9\n        c-2,7.4-3.2,15.3-3.1,22.9c0.2,8.2,2.3,16.4,3.8,24.5c2.3,12.6,4.8,25.1,7.4,37.6c0.8,3.7,2.3,7.3,3.5,10.9\n        c0.4-0.1,0.9-0.2,1.3-0.3c-0.3-2.9-0.6-5.8-0.8-8.6C155.9,353.9,155.7,349.3,155.5,344.7z M233.4,344c1-5.3,2.1-10.6,3.1-15.9\n        c1.9-7.8,3.5-15.7,1.8-23.8c-0.8-5.9-1.1-12-2.3-17.8c-3.5-16.4-11.7-30.8-20.5-44.9c-2.7-4.3-5.7-8.5-8.9-13.2\n        c-0.4,1.4-0.6,1.9-0.7,2.4c-1.8,11.6-3.8,23.2-5.2,34.8c-1.6,13.7-1,27.2,4.5,40.2c6,14.3,11.7,28.8,17.8,43.2\n        c2.9,7,6.4,13.7,9.7,20.5c0.2-0.1,0.4-0.2,0.6-0.3c0-6.1,0-12.2,0-18.2C233.3,348.8,233.3,346.4,233.4,344z M223.1,388.2\n        c5.5-13.9,2.1-35-6.6-43.1C213.4,360,221.1,373.6,223.1,388.2z M374.7,215.5c6.2,2.5,10.7-2.3,11.8-12c-3.1-0.9-6.1-2.1-9.2-2.4\n        c-1.8-0.2-4.9,0.3-5.5,1.5c-1.2,2.5-0.8,5.4,2.8,6.4c1.9,0.5,3.8,1,6.6,1.8C378.5,212.6,376.6,214,374.7,215.5z M320,335.5\n        c9.5-5.1,7.8-12.4-2.1-17.7C318.6,323.5,319.3,329.4,320,335.5z M291.1,373.8l0.2,0.2l0-0.3L291.1,373.8z"
}), /* @__PURE__ */ React25.createElement("path", {
  fill: "#D1058C",
  d: "M191.5,8.6c1.6,1.6,3.3,3.3,4.9,4.9c1,1.1,1.7,2.5,2.9,3.2c6.2,3.7,12.3,7.8,18.9,10.6\n        C229.5,32,241,36,251.1,43c3,2.1,6.1,3.9,9.2,5.9c10.3,9.1,19.4,19.1,23.2,32.8c-1-0.9-2.2-1.6-3.1-2.6\n        c-5.7-6.4-11.5-12.8-16.8-19.5c-8.9-11.2-21.1-17.5-33.8-23c-5.8-2.5-11.9-4.4-17.9-6.6c0,0,0,0,0,0c-0.6-0.3-1.1-0.6-1.7-0.8\n        c-6.7-6.4-13.4-12.9-20-19.4c-0.4-0.4-0.2-1.5-0.3-2.2C190.5,7.9,191,8.3,191.5,8.6z"
}), /* @__PURE__ */ React25.createElement("path", {
  fill: "#3151C6",
  d: "M26.9,237.8c-0.5,5-1.1,10-1.6,14.9c-8.2-35-8.9-69.4,6.6-102.8c5.5-6.9,10.9-13.8,16.4-20.6c0,0,0.1,0,0.1,0\n        c0.3-0.5,0.6-1,1-1.5l0,0c0.5-0.3,1-0.6,1.5-0.9c0,0,0,0,0,0c0.3-0.5,0.6-1,1-1.5l0,0c0.5-0.3,1-0.6,1.5-1\n        c6.6-4.7,13.2-9.4,19.8-14.2c4.3-1.8,8.5-3.7,12.8-5.5c-15.5,27.7-18.9,58.5-23.7,89c0.4,0.2,0.8,0.4,1.1,0.5\n        c8.1-17.3,16.3-34.6,24.4-51.9c0.5,0.2,1,0.4,1.5,0.6c-1.9,5.6-4.1,11.2-5.7,16.8c-1.7,5.9-3.2,11.9-4.3,17.9\n        c-1.1,6-1.4,12.2-2.1,18.3c-0.5,0.9-1.2,1.8-1.4,2.8c-1.5,6.4-2.9,12.9-4.2,19.3c-0.5,2.4-0.6,4.9-0.9,7.4c0,0.2,0,0.5,0,0.7\n        c-0.5,0.8-1.4,1.6-1.5,2.4c-0.4,3.6-0.6,7.2-0.9,10.9c-1.1-6.3-2.1-12.6-3.2-18.9c-0.1,0-0.3-0.1-0.4-0.1\n        c-0.2,7.2-0.3,14.3-0.5,21.5c-2.2-13.1-5.1-26.1-6.3-39.3c-0.9-10,0-20.2,0.7-30.3c0.8-12.6,3.4-24.8,7.8-36.6\n        c1.9-5,3.9-10,5.9-15c-1.6,0.4-2.7,1.2-3.5,2.2c-6.9,8.1-14,16-20.5,24.5c-5.3,6.9-10.2,14.2-14.3,21.8c-7,13.1-5.9,27.7-6.5,42\n        c0,1.4-0.1,2.8-0.1,4.2c-0.2,1.2-0.5,2.4-0.5,3.6C26.7,225.2,26.9,231.5,26.9,237.8z"
}), /* @__PURE__ */ React25.createElement("path", {
  fill: "#7A129E",
  d: "M232.1,75.1c2.6,3.1,5.2,6.2,7.8,9.3c-0.2,0.3-0.4,0.7-0.5,1c-8-2.6-16.1-4.9-23.9-8c-6.2-2.5-12-5.8-17.9-9\n        c-9.4-5.2-19.1-8.3-30-8.3c-14,0-27.7,1.7-41.1,5.9c-3.5,1.1-6.6,3.2-9.9,4.8c-0.5,0.1-1,0.2-1.5,0.3c0,0,0,0,0,0\n        c-1.2,0-2.3-0.1-3.5-0.1c0.1-0.3,0.1-0.5,0.1-0.8c0.4-0.1,0.8-0.2,0.1,0c0.5-0.5,0.2-0.2-0.1,0c-12.8,1.5-25.8,2.3-38.5,4.7\n        c-12,2.2-23.7,6.1-35.5,9.2c0.5-0.6,0.8-1.4,1.4-1.9c7.3-6.2,16.1-9,25.2-11.2c11.9-2.9,23.9-5.3,35.8-8.3c9-2.2,17.8-5,26.7-7.5\n        c3.5-1,7-2.1,10.5-3.1c-0.1-0.4-0.1-0.7-0.2-1.1c-5.3,0-10.6-0.3-15.8,0.1c-5.4,0.3-10.8,1.2-16.2,1.9c-4.7,0.7-9.4,1.5-14.1,2.3\n        c17.4-7.3,35.1-14.5,54.5-12c7.8,1,15.3,4.7,22.9,7.2c0.6,0.2,1.2,0.5,1.9,0.7c0.1,0,0.2-0.1,0.3-0.2c-1.4-4.5-15-10.7-30.5-13.9\n        c-11.4-2.3-22.9-1-34.3,0.7c-0.1-0.4-0.1-0.7-0.2-1.1c5.4-1.6,10.7-3.2,16.1-4.8c4,0.5,8,1,12.1,1.4c16.4,1.6,32.3,5.5,46.9,12.9\n        c12.5,6.3,24.1,14.2,36.2,21.3C221.8,70.2,227,72.6,232.1,75.1z"
}), /* @__PURE__ */ React25.createElement("path", {
  fill: "#EE7636",
  d: "M279.6,92.2c4.9,2.1,9.9,4.1,14.7,6.4c1.7,0.8,3.1,2.4,4.7,3.7c0.6,1.1,1.3,2.1,1.9,3.2c-0.9,1-1.8,2-2.9,2.8\n        c-3.8,3-5,9.3-11.4,9c-0.5,0-1,1.4-1.5,2.1c-5.4,0-10.9,0-16.6,0c3.3,1.2,6.3,2.2,9.2,3.3c-3.3,0.2-6.6,0.5-10.5,0.8\n        c1.9,0.3,3.3,0.7,4.8,0.9c3.6,0.6,7.1,1.2,10.7,1.7c-8,0.2-16.1,1.3-23.7-2.4c-0.5,0.4-1.1,0.8-1.4,1.3\n        c-3.8,7.1-3.6,14.3-0.6,21.6c-4.3,3.4-8.5,6.8-12.9,10.1c-1,0.7-2.3,0.9-3.5,1.4c0.9-2,1.8-4.1,2.7-6.1c-0.3-0.3-0.6-0.7-0.9-1\n        c-4.7,4-9.3,7.9-14,11.9c-0.3-0.1-0.6-0.2-0.9-0.3c3.2-7.7,6.4-15.5,9.9-23.9c-4.5,2.3-8.7,4.5-13.6,7.1c1.7-3.5,3.1-6.3,4.5-9\n        c3.3-4.3,6.5-8.7,9.8-13.1c-8.4,0-14.9,4.1-20.9,9.5c4.6-9.7,14.1-13.7,21.9-20.4c-5.7,0-11.4,0-17.6,0c5.3-4.2,10.8-7.2,17.1-7.9\n        c6.1-0.6,12.4-0.1,18.8-0.1c-0.8-1.2-1.6-2.4-2.3-3.4c3.7,0,7.3,0,11,0c8.9-0.1,17.8,0.2,26.7,5.2c-3.5-6.8-8.6-9.7-14.4-11.7\n        C278.9,94,279.2,93.1,279.6,92.2z M237.3,151.7c5.9-3.9,8.3-10.1,12.2-15C241.6,139.6,236.4,145.9,237.3,151.7z M252.4,124.5\n        c-9.6,1.9-16.1,7-15.9,12.9C241.9,133,246.8,129.1,252.4,124.5z"
}), /* @__PURE__ */ React25.createElement("path", {
  fill: "#4A1EB0",
  d: "M233.2,351.1c0,6.1,0,12.2,0,18.2c-0.2,0.1-0.4,0.2-0.6,0.3c-3.2-6.8-6.7-13.6-9.7-20.5\n        c-6.1-14.3-11.7-28.8-17.8-43.2c-5.5-13-6.1-26.5-4.5-40.2c1.4-11.6,3.4-23.2,5.2-34.8c0.1-0.5,0.3-1,0.7-2.4\n        c3.2,4.7,6.2,8.9,8.9,13.2c8.8,14,16.9,28.5,20.5,44.9c1.3,5.8,1.6,11.9,2.3,17.8c-0.5-0.9-1.3-1.8-1.6-2.8\n        c-4.7-13.1-11.3-25.1-19.8-36c-0.6-0.8-0.8-1.9-1.3-2.9c-0.6,0.4-1.2,0.7-1.7,1.1c-0.4,2.2-1.3,4.5-1,6.7c1,8.9,1.7,17.9,3.8,26.6\n        c4.4,17.4,9.7,34.6,14.7,51.8C231.6,349.7,232.6,350.4,233.2,351.1z"
}), /* @__PURE__ */ React25.createElement("path", {
  fill: "#4A1EB0",
  d: "M161.9,304.4c-4.5-36.2-2.8-71.6,11.5-105.5c0.6,0,1.2-0.1,1.9-0.1c2,5.4,3.9,10.8,6,16.1\n        c7.2,19.2,7.6,39.2,6.8,59.4c0,0.5-0.4,1-0.6,1.5c-2.5-9.6-4.9-19.2-7.4-28.7c-0.8-3.2-1.9-6.4-6.2-8.8\n        c-1.3,12.3-2.8,23.7-3.7,35.2c-1.4,18.7,2.5,36.6,9.1,54c1.7,4.5,4,8.8,6.1,13.2c0.4,2.3,0.8,4.7,1.1,7c0.2,2.3-0.9,2.1-2.3,1.2\n        c0,0,0.1,0,0.1,0c-0.4,0-0.7,0-1.1,0c-1.4-1.4-2.7-2.8-4.1-4.2c-0.7-2.1-1.3-4.4-2.3-6.4c-2.7-5.5-5.9-10.7-8.4-16.3\n        C165.8,316.2,164,310.2,161.9,304.4z"
}), /* @__PURE__ */ React25.createElement("path", {
  fill: "#CA6F25",
  d: "M326.1,198.2c-10.2-4-20.7-1.2-27,7.3c-2.7,3.7-5,7.8-7.4,11.7c-3.1,1.7-6,3.8-9.3,5\n        c-4.7,1.7-9.7,2.8-14.6,4.1c-2.8-2.1-5.6-4.2-8.5-6.3c-0.3,0.3-0.7,0.5-1,0.8c5.2,7.3,10.3,14.5,15.5,21.8\n        c-0.2,0.2-0.4,0.4-0.6,0.6c-6.1-6-12.6-11.7-18.1-18.2c-5.4-6.4-9.6-13.8-14.5-20.8c4,12.9,6.5,26.1,6.8,39.2\n        c-5.9-14.2-11.9-28.7-17.9-43.2c1.7-1.3,3.3-2.7,5-3.9c1.6-1.2,3.5-3.3,4.9-3.1c4.4,0.7,4.4-2.4,5.4-4.9c0.4-1,0.6-2,0.9-3\n        c0.3,0.9,0.6,1.7,0.8,2.6c2,7.2,4.5,13.9,13.1,15.6c3.2,0.6,6.7,2.3,9.6,1.6c11-2.8,21.9-6.1,32.7-9.8c8.3-2.9,16.5-4.2,25.1-1.8\n        c3.7,1.8,7.3,3.7,11,5.5c-0.2,0.4-0.4,0.8-0.5,1.2C333.7,199.5,329.9,198.8,326.1,198.2z"
}), /* @__PURE__ */ React25.createElement("path", {
  fill: "#18ADF3",
  d: "M27.3,211.2c0.6-14.3-0.5-28.9,6.5-42c4.1-7.7,9.1-14.9,14.3-21.8c6.4-8.5,13.6-16.4,20.5-24.5\n        c0.8-1,1.9-1.8,3.5-2.2c-2,5-4.1,10-5.9,15c-4.3,11.8-7,24.1-7.8,36.6c-0.6,10.1-1.6,20.3-0.7,30.3c1.2,13.2,4.1,26.2,6.3,39.3\n        c0.3,2.2,0.2,4.6,1,6.7c2.6,7,1.8,14,0.6,21.1c-3-8.4-5.9-16.9-8.9-25.3c0.3-1,0.8-2,0.7-2.9c-0.5-5.4-1.1-10.8-1.7-16.2\n        c-1.2-10.5-2.4-21.1-3.7-32.8c-1.2,8.1-2.8,14.9-1.3,22.2c1.2,5.7,1.1,11.6,1.6,17.5c-0.5-1.1-1.2-2.2-1.4-3.3\n        c-1.2-6.4-2.8-12.8-3.1-19.3c-0.4-8.1,0.1-16.3,0.6-24.5c0.4-6.3,1.4-12.6,2.2-19c-5.3,6.7-9.4,13.9-10.3,22.6\n        c-6.6,10.9-9.3,23.2-11.5,35.5c-0.8,4.5-1.3,9.1-2,13.6c-0.1-6.3-0.2-12.5-0.2-18.8c0-1.2,0.3-2.4,0.5-3.6\n        c0.6-0.9,1.6-1.8,1.9-2.8c2.2-8.4,4.2-16.9,6.3-25.3c0.9-3.5,1.7-7,2.6-10.5c-1.4,1-2.2,2.1-2.6,3.4\n        C32.7,190.5,30,200.9,27.3,211.2z"
}), /* @__PURE__ */ React25.createElement("path", {
  fill: "#CB8A22",
  d: "M283.3,272.5c-4.3-7.2-8.7-14.5-13-21.7c0.2-0.2,0.4-0.5,0.6-0.7c1.1,0.6,2.3,1.2,3.4,1.9\n        c12.5,8,25,16,37.6,23.9c2,1.3,4.5,1.9,6.8,2.7c7.4,2.7,15.1,5,20,12c0.4-0.3,0.8-0.6,1.2-0.9c-1.6-3-3.1-6.1-4.7-9.2\n        c7.7,2.5,8.4,9.3,8.7,16.3c0.5,0,1,0,1.4,0.1c2-6.4,4.4-12.8,5.9-19.4c1.3-5.5-0.7-6.9-6-5.9c-9,1.8-17.9,0.4-27.7-2.2\n        c14.2-1.9,28.3,0.3,41.2-8.9c0,5.3,0,9.8,0,14.3c-0.9,1.7-1.9,3.3-2.7,5c-5,10.2-10,20.5-15,30.7c-1.2,2.5-2.3,5.1-3.5,7.7\n        c-0.5,0-1.1,0-1.6,0.1c0.3-4.5,0.7-8.9,0.7-13.4c0.2-7.2-1.7-13.7-7.3-18.6c-0.1-0.1-0.3-0.2-0.4-0.3c0.1,0.1,0.2,0.2,0.4,0.4\n        c0.8,5,2.4,10.1,2.3,15.1c-0.2,5.1-2,10.2-3.1,15.4c-1.4-0.8-2.8-1.6-4.2-2.4c0.3-1,1-2,0.8-2.9c-1.8-11.1-6.3-20.1-17.2-25.4\n        c-7.8-3.8-14.9-8.8-22.3-13.3C285.1,272.4,284.2,272.6,283.3,272.5z"
}), /* @__PURE__ */ React25.createElement("path", {
  fill: "#7A129E",
  d: "M96.1,98.9c5.1-6,9.8-12.4,15.5-17.8c13-12.4,29.3-16.9,46.9-17.6c11.9-0.5,23.8-0.3,34.7,5.8\n        c0.7,0.4,1.4,0.8,2.1,1.2c0.2,0.1,0.4,0.3,0.6,0.5c-5,1.9-10.5,3-14.9,5.8C168.3,85,154,88.3,139.8,92.5\n        c-19,5.6-33.6,17.2-45.1,33.1c-0.8,1.1-1.7,2-2.6,3.1c0.2-0.9,0.1-2,0.6-2.7c4.8-7.1,9.1-14.6,14.7-21.1\n        c9.3-10.9,22.1-16.5,35.3-21.5c10.3-3.9,20.5-7.9,30.7-11.9c-6.6-0.3-13-0.1-19.5,0.4c-16,1.3-30.4,7.3-43.4,16.5\n        C105.6,91.8,100.9,95.4,96.1,98.9z"
}), /* @__PURE__ */ React25.createElement("path", {
  fill: "#F4CA30",
  d: "M331,248.6c-5.7-0.9-11.4-1.8-17.1-2.7c0.3-1.2,0.6-2.3,0.9-3.5c9.9,2.8,19.7,2.8,30.1,0.2\n        c-8.6-0.6-16.5-1.2-24.5-1.8c0-0.7,0-1.4,0-2.2c7.3,0.1,14.7,0.1,22.4-3.4c-4.8-1.3-8.7-2.3-12.6-3.3c0.4-1.1,0.8-2.3,1.2-3.4\n        c4.6,0,9.1,0,13.7,0c0-0.3,0-0.6,0.1-0.9c-4.5-0.8-8.9-1.6-13.4-2.4c1.9-1.3,3.9-2.6,5.8-3.9c4.1-0.4,8.3-0.7,12.4-1.1\n        c0-0.2,0-0.5-0.1-0.7c-3.3-1.1-6.6-2.2-9.9-3.3c0.3-1.7,0.5-3.3,0.8-5c2.4,0,4.7,0,7.5,0c-1.1-0.6-1.8-1-2.6-1.4\n        c0.3-3.6,2.5-4.7,5.7-4.2c8.2,17.2,8.8,34-3,50.1c12.7-8.8,19.3-20.9,19.6-36.4c0.4,3.2,1.4,6.4,1.2,9.5\n        c-0.6,8.2-3.5,15.6-8.2,22.4c-4.8,6.9-11.2,10.7-19.5,11.2c-8.7,0.4-17.4,0.6-26.1,0.5c-2.5,0-5.1-1.5-7.6-2.3\n        c1.3,0.1,2.7,0.2,4,0.4c8.4,1.8,16.6,1.6,23.6-1.2c-6.9,0-14.9,0-22.9,0c-2.3,0-4.6-0.4-6.9-0.6c-2.2-2-4.5-3.9-6.7-5.9\n        c1,0,2.1-0.4,2.9-0.1c7.5,3.1,15.3,3.9,23.2,3.2c8.3-0.8,16.1-2.9,23.6-9.3c-6,0.6-10.8,1.1-15.6,1.6c0,0-0.4,0-0.4,0\n        s-0.3-0.2-0.3-0.2C331.8,248.7,331.4,248.7,331,248.6z"
}), /* @__PURE__ */ React25.createElement("path", {
  fill: "#C64728",
  d: "M266.2,101.3c-3.6,0-7.3,0-11,0c0.7,1,1.6,2.3,2.3,3.4c-6.4,0-12.7-0.5-18.8,0.1c-6.3,0.6-11.8,3.7-17.1,7.9\n        c6.2,0,11.9,0,17.6,0c-7.8,6.6-17.3,10.7-21.9,20.4c6-5.4,12.5-9.5,20.9-9.5c-3.3,4.4-6.6,8.8-9.8,13.1c-1.5,0.8-3.1,1.4-4.4,2.4\n        c-3.8,3.2-7.4,6.6-11.1,9.9c0-1.5,0-3,0-4.5c-0.3-0.2-0.6-0.5-0.9-0.7c-3.6,5.5-7.2,11-10.7,16.5c-1.8-14.9,0.9-29,9.8-41.6\n        c5.2-7.3,12.9-11.3,20.7-14.9c6.2-2.9,12.6-5.2,19.8-8.2c-5.7-1.4-10.6-2.6-15.6-3.8c-0.1-0.2-0.2-0.4-0.2-0.6\n        c6.6-0.7,13.1-1.4,19.7-2.1c5.8,1.4,11.5,2.8,17.3,4.1c-1.2,1.2-2.4,2.4-3.5,3.8C268.2,98.4,267.2,99.9,266.2,101.3z"
}), /* @__PURE__ */ React25.createElement("path", {
  fill: "#7541D9",
  d: "M247.9,290.4c-0.3,4.5-0.6,9-0.9,13.5c-7-26-16.3-50.7-32.4-72.2c-10.7-14.3-14-30.4-12.7-48.2\n        c0.6,0.4,1.1,0.5,1.4,0.9c7.8,10,15.7,20,23.5,29.9c8.9,11.4,15.2,23.9,17.9,38.2c0.2,1.2,0.1,2.4,0.2,3.7\n        c-0.8-1.2-1.7-2.4-2.4-3.7c-4.1-7.7-7.7-15.6-12.2-23c-3.6-5.8-8.3-10.9-12.4-16.3c-0.1-0.4-0.2-0.8-0.2-1.1\n        c-0.2,0.1-0.3,0.2-0.5,0.2c0.2,0.3,0.5,0.6,0.7,1c0.8,3,1.3,6.2,2.6,9c4.2,9.3,8.8,18.4,12.9,27.7c4.4,10,8.4,20.2,12.6,30.3\n        C246.5,283.6,247.2,287,247.9,290.4z"
}), /* @__PURE__ */ React25.createElement("path", {
  fill: "#C95227",
  d: "M212.9,149.1c3.7-3.3,7.3-6.7,11.1-9.9c1.3-1.1,2.9-1.6,4.4-2.4c-1.4,2.8-2.7,5.5-4.5,9\n        c5-2.6,9.2-4.7,13.6-7.1c-3.5,8.4-6.7,16.1-9.9,23.9c0.3,0.1,0.6,0.2,0.9,0.3c4.7-4,9.3-7.9,14-11.9c0.3,0.3,0.6,0.7,0.9,1\n        c-0.9,2-1.8,4.1-2.7,6.1c-2.9,8.3-4.7,16.7-3.6,25.4c2.2-3.2,4.3-6.2,6.4-9.2c0.7,0.2,1.4,0.4,2.1,0.7c0,3.4,0,6.9,0,10.3\n        c-0.3,1-0.5,2-0.9,3c-1,2.5-1,5.6-5.4,4.9c-1.4-0.2-3.3,1.9-4.9,3.1c-1.7,1.2-3.3,2.6-5,3.9c-3.3-10.6-3.4-21.4-1.7-32.4\n        c-0.4-0.1-0.9-0.3-1.3-0.4c-3,6.1-6,12.2-9.2,18.7c-3.9-8-6.2-16.1-5.8-24.8C211.7,157.2,212.4,153.1,212.9,149.1z"
}), /* @__PURE__ */ React25.createElement("path", {
  fill: "#411DAA",
  d: "M136.4,319.9c2.2,9.4,4.5,18.7,6.7,28.1c-7.4-12-13.1-24.8-17.2-38.2c-4.4-14-6.9-28.3-7.7-42.9\n        c-0.2-4.5-1.5-8.9-1.6-13.4c-0.7-21.6,3.6-42,16.3-60c0.7-1,1.6-1.8,2.5-2.7c0.7-0.7,1.4-1.3,2.1-2c-1.3,9.1-2.6,18-3.9,26.9\n        c-1,1.1-2.5,2-2.9,3.2c-2.1,6.8-3.8,13.8-5.7,20.7c-0.3,3.3-0.7,6.5-0.8,9.8c-0.6,14,0.1,27.9,3.5,41.4\n        C130,300.6,133.4,310.2,136.4,319.9z"
}), /* @__PURE__ */ React25.createElement("path", {
  fill: "#D1058C",
  d: "M96.1,98.9c4.8-3.5,9.5-7.2,14.3-10.6c13-9.2,27.3-15.2,43.4-16.5c6.5-0.5,12.9-0.8,19.5-0.4\n        c-10.2,4-20.4,8-30.7,11.9c-13.1,5-25.9,10.6-35.3,21.5c-5.5,6.5-9.9,14-14.7,21.1c-0.5,0.7-0.4,1.8-0.6,2.7c0,0,0-0.1,0-0.1\n        c-0.3,0.6-0.5,1.1-0.8,1.7c-7.6,14.9-15.2,29.8-23,45.1c0-1.5-0.2-2.6,0-3.7c3.9-16.7,6.6-33.8,14-49.5c3.2-6.9,7.4-13.3,11.2-20\n        c0.4-0.5,0.7-1,1.1-1.5c0,0,0,0,0,0c0.2-0.3,0.5-0.6,0.7-0.9c0,0,0,0,0,0C95.6,99.5,95.9,99.2,96.1,98.9L96.1,98.9z M79.7,144.9\n        c3.6-8.1,6.3-16.1,10.6-23.2c4.4-7.1,10-13.6,15.8-19.7c5.7-6,12.2-11.1,18.9-17.1C102.8,91.1,78.1,123.8,79.7,144.9z"
}), /* @__PURE__ */ React25.createElement("path", {
  fill: "#AD15A3",
  d: "M148.8,112.9c7.8-10.6,16.2-20.8,27-28.4c8.7-6.2,19-7.2,29.5-4.9c2.7,0.6,5.4,1.5,9.1,2.6\n        c-3.4,1.3-5.8,2.2-8.1,3.2c-16.6,7.3-28.9,19.4-37.8,35c-0.7,1.2-1.5,2.3-2.3,3.4c0.1-3.5-1.9-4.7-5.1-4.4\n        c3.1-5.7,6.2-11.3,9.2-17c0.1-0.2,0.2-0.4,0.3-0.5c-0.2,0.1-0.4,0.2-0.5,0.3c-0.8,0.5-1.7,0.9-2.2,1.6c-3.6,4.4-7.1,8.9-10.7,13.3\n        C155.3,113.6,151.7,113.9,148.8,112.9z M172.4,99.7c-0.1-0.1-0.1-0.2-0.2-0.3c-0.1,0.1-0.2,0.2-0.3,0.2c0.1,0.1,0.2,0.2,0.3,0.3\n        C172.3,99.9,172.3,99.8,172.4,99.7z"
}), /* @__PURE__ */ React25.createElement("path", {
  fill: "#7541D9",
  d: "M198.1,252.6c-0.9,5-1.7,10.1-2.6,15.1c-0.4-0.1-0.9-0.1-1.3-0.2c0.1-1.7,0.1-3.5,0.3-5.2\n        c1.7-19.8-3.4-38.4-10-56.8c-3.2-9-7.4-18-5-27.8c2.4-9.9,5.5-19.7,8.5-29.5c1.3-4.2,3.2-8.2,5.1-13.3c0,6.6-0.4,12.1,0.1,17.4\n        c1.4,16.7,3,33.3,4.6,49.9c0.1,0.8,0,1.6,0,2.5c-3.7-9.7-7.3-19.3-11-29.2c0.9,6.4,1.4,12.9,2.7,19.3\n        C193.2,214,199,232.8,198.1,252.6z"
}), /* @__PURE__ */ React25.createElement("path", {
  fill: "#3151C6",
  d: "M56.8,244.4c3,8.4,5.9,16.9,8.9,25.3c-0.7,8.4-3.3,16.3-6.9,24c1.8-20.7-7.2-38.9-13.2-57.7\n        c-3.7-11.5-6.3-23.2-5.3-35.3c0.4-4.6,1.5-9.1,2.4-14c-0.8,0.7-1.5,1.4-2.2,2c0.9-8.6,5-15.8,10.3-22.6c-0.8,6.3-1.8,12.6-2.2,19\n        c-0.5,8.1-1,16.4-0.6,24.5c0.3,6.5,2,12.9,3.1,19.3c0.2,1.2,0.9,2.2,1.4,3.3C53.9,236.2,55.3,240.3,56.8,244.4z"
}), /* @__PURE__ */ React25.createElement("path", {
  fill: "#4A1EB0",
  d: "M268.4,368.4c-0.6,2.3-1.2,4.5-1.8,6.8c-0.3,0-0.7-0.1-1-0.1c0.5-9.5-4.5-17.1-7.8-25.3\n        c-4.7-11.6-9.2-23.5-8.6-36.3c0.3-7.2,1.8-14.3,2.5-21.5c0.5-4.9,0.6-9.8,0.9-15.3c4.6,7.6,9.4,14.6,13.2,22.1\n        c3.1,6.1,4.9,12.9,7.3,19.4c-0.7-0.6-1.4-1.1-2-1.9c-4-5.3-8-10.6-11.9-15.9c-0.4,0.1-0.8,0.2-1.2,0.3c-0.2,1.6-0.8,3.4-0.5,4.9\n        c3.4,17.5,7,34.9,10.6,52.4c-0.2,2.8-0.5,5.5-0.5,8.3C267.4,367,268,367.7,268.4,368.4z"
}), /* @__PURE__ */ React25.createElement("path", {
  fill: "#AD15A3",
  d: "M164.4,137.6c8.7-20.8,21.6-37.8,43.2-46.7c1.4-0.6,2.9-0.8,4.3-1.2c2.2,2.8,10.4,1.5,13.2-2.1\n        c1.5,0,3,0,4.5,0.1c0.3,0,0.7,0.3,1.5,0.7c-3.9,1.7-7.5,3-10.9,4.7c-8.9,4.5-15.7,11.2-20.9,19.7c-4.5,7.4-9,14.9-13.4,22.4\n        c-1.4-0.3-2.8-0.6-4.2-0.9c2.6-6.4,5.3-12.7,7.9-19.1c-2.8,2.5-5,5.3-7.1,8.3c-3.3,4.9-6.6,10-9.8,14.9\n        C169.9,138.1,167.2,137.9,164.4,137.6z"
}), /* @__PURE__ */ React25.createElement("path", {
  fill: "#8B27E0",
  d: "M185.3,340.5c-2-4.4-4.3-8.7-6.1-13.2c-6.6-17.4-10.4-35.3-9.1-54c0.8-11.5,2.4-22.9,3.7-35.2\n        c4.3,2.4,5.3,5.5,6.2,8.8c2.5,9.6,4.9,19.2,7.4,28.7c-1.1,9.6-2.3,19.3-3.4,28.9c-0.2-1.6-0.5-3.2-0.7-4.8\n        c-1.1-9.7-2.2-19.4-3.3-29.1c-0.8,15.4-1.2,30.6-0.6,45.9c0.2,5,2.5,9.9,3.9,14.9c0,0,0-0.1,0-0.1c0.2,0.8,0.4,1.5,0.7,2.3\n        C184.4,336,184.8,338.3,185.3,340.5z"
}), /* @__PURE__ */ React25.createElement("path", {
  fill: "#8B27E0",
  d: "M233.2,351.1c-0.6-0.8-1.5-1.4-1.8-2.3c-5-17.2-10.3-34.4-14.7-51.8c-2.2-8.6-2.8-17.7-3.8-26.6\n        c-0.2-2.1,0.7-4.4,1-6.7c0.6-0.4,1.2-0.7,1.7-1.1c0.4,1,0.6,2.1,1.3,2.9c8.5,10.9,15.1,22.9,19.8,36c0.4,1,1.1,1.8,1.6,2.8\n        c1.7,8.1,0.1,16-1.8,23.8c-0.2-0.5-0.5-1-0.6-1.5c-1.4-12.7-6-24.3-11.7-35.6c-0.6-1.2-1.5-2.2-2.5-3.5\n        c2.5,11.4,4.9,22.1,7.1,32.8c1.6,7.9,3,15.8,4.5,23.6C233.3,346.4,233.3,348.8,233.2,351.1z"
}), /* @__PURE__ */ React25.createElement("path", {
  fill: "#4A1EB0",
  d: "M70.6,226.2c0-0.2,0-0.5,0-0.7c3,0.6,3.5-1.5,4.2-3.6c0.4-1.2,1.4-2.1,2.1-3.2c0.4,4.3,0.5,8.7,4.7,12.7\n        c3.1-8,6-15.7,8.9-23.3c0.2,0,0.4,0.1,0.6,0.1c-0.5,6.1-1.1,12.1-1.6,18.2c-2.6,6.1-5.8,12-7.7,18.4c-1.3,4.5-1.6,9.7-0.7,14.3\n        c2.5,13.1,5.1,26.2,4.4,39.7c-0.1,1.3,0.4,2.6,0.6,3.9c-2.1,4.4-4.3,8.8-6.4,13.2c0,0,0.1,0.1,0.1,0.1c0.3-3.3,0.6-6.5,0.8-9.8\n        c0.8-14.7-3.2-28.7-7-42.7c-1.7-6-3-12.2-4.6-18.3C69.5,238.9,70.1,232.5,70.6,226.2z"
}), /* @__PURE__ */ React25.createElement("path", {
  fill: "#4A1EB0",
  d: "M299.1,368.6c-1.4,2.7-2.8,5.5-4.2,8.2c-0.2-0.1-0.4-0.2-0.5-0.2c0.5-3.6,1.4-7.1,1.5-10.7\n        c0.2-14.6-3.4-28.6-8-42.3c-0.4-1.1-1-2.3-1-3.5c0.5-11.9-0.7-23.6-4.8-35c9.1,7.4,19,13.9,23.8,25c2.2,5.1,2.6,11,3.9,16.5\n        c-1.4-2.8-2.5-5.7-4.1-8.3c-3-4.9-6.3-9.7-9.5-14.5c-0.4,0.2-0.8,0.4-1.3,0.7c0.8,5.5,1.2,11,2.3,16.5c2.1,10.4,5.6,20.5,4.5,31.3\n        C301,357.7,299.9,363.2,299.1,368.6z"
}), /* @__PURE__ */ React25.createElement("path", {
  fill: "#7541D9",
  d: "M282.7,320.1c-0.8,6.3-1.7,12.6-2.4,18.4c-1.7-8.8-2.4-18.4-5.4-27.1c-3.5-10.1-8.7-19.7-13.9-29.1\n        c-4.6-8.4-7.6-17.2-9.9-26.3c-0.2-0.8-0.1-1.6-0.1-2.4c0-6.2,0-12.4,0-19.1c0.8,0.6,1.6,0.9,1.9,1.5c8.3,16.7,19.3,32.1,25.1,50\n        c1,3.1,1.5,6.3,2.2,9.4c-0.4-0.7-0.9-1.3-1.2-2c-3.8-7.5-7.5-15.1-11.3-22.6c-0.6-1.2-1.5-2.2-2.3-3.3\n        c1.2,15.7,8.8,28.9,14.6,42.7C280.9,313.5,281.8,316.8,282.7,320.1z"
}), /* @__PURE__ */ React25.createElement("path", {
  fill: "#36157B",
  d: "M155.5,344.7c0.2,4.6,0.3,9.2,0.6,13.8c0.2,2.9,0.5,5.8,0.8,8.6c-0.4,0.1-0.9,0.2-1.3,0.3\n        c-1.2-3.6-2.7-7.2-3.5-10.9c-2.6-12.5-5.1-25-7.4-37.6c-1.5-8.1-3.6-16.3-3.8-24.5c-0.2-7.6,1.1-15.5,3.1-22.9\n        c1.6-5.9,5.2-11.2,7.8-16.9c1.6-3.4,3-6.9,4.5-10.3c0.5,0.1,0.9,0.2,1.4,0.3c-0.8,4.6-1.6,9.3-2.4,13.9\n        c-4.7,10.8-5.6,22.3-6.4,33.9c-0.9,14.7,1.4,29.1,4.5,43.4C153.9,338.8,154.8,341.7,155.5,344.7z"
}), /* @__PURE__ */ React25.createElement("path", {
  fill: "#171054",
  d: "M207.9,374.2c0,0.5-0.1,1.1-0.2,2.5c-0.7-1.1-1-1.5-1.2-2c-3-7.7-5.4-15.7-9-23.1c-4.3-8.9-10-17.4-9.8-27.7\n        c0.2-13.6-0.4-27.2,4.7-40.2c0.3-0.9,0.9-1.6,1.8-3.1c1.9,8.1,3.7,15.6,5.5,23.1c-0.3,3.8-0.6,7.6-0.8,11.3\n        c-0.6,11.8,2.4,23.1,4.5,34.6C204.8,357.7,206.4,365.9,207.9,374.2z"
}), /* @__PURE__ */ React25.createElement("path", {
  fill: "#CB8A22",
  d: "M368.2,219.5c-0.3,15.5-6.9,27.5-19.6,36.4c11.9-16.1,11.2-32.9,3.1-50.1c-1.8-2.5-3.4-5.2-5.5-7.4\n        c-2.6-2.7-5.6-5-8.5-7.4c2.4-2.3,4.6-5,7.4-6.7c2.2-1.3,2.7-2.7,2.4-4.8c5.9,3.2,11.8,6.4,17.7,9.6c2.9,1.6,5.7,3.5,8.6,5.2\n        c-9,0.2-16.7-3.7-23.9-8.9c-0.2,0.3-0.4,0.7-0.6,1c5.4,9.3,10.9,18.7,16.3,28C366.6,216.1,367.3,217.8,368.2,219.5z"
}), /* @__PURE__ */ React25.createElement("path", {
  fill: "#411DAA",
  d: "M111.8,320.1c-1.5,5.3-2.9,10.6-4.4,15.8c-0.2-0.1-0.3-0.2-0.5-0.3c0-5.4,0-10.7,0-16.1\n        c0-15.5-3.2-30.6-6.8-45.6c-3.6-14.9-5-29.9-3.8-45.3c1.7,6.2,3.4,12.4,5.3,19.2c3.4-9,6.6-17.5,9.8-26c0.4,0.1,0.8,0.2,1.2,0.3\n        c-0.6,5.6-1.1,11.1-1.7,16.7c-0.5,1.5-1.1,3-1.6,4.6c-2.6,9.5-4.3,19.2-3.1,29.1c1.6,13.4,3.5,26.8,5.1,40.1\n        C111.5,315.2,111.6,317.6,111.8,320.1z"
}), /* @__PURE__ */ React25.createElement("path", {
  fill: "#7A129E",
  d: "M211.9,30.1c6,2.2,12.1,4.1,17.9,6.6c12.7,5.5,24.9,11.8,33.8,23c5.3,6.7,11.2,13,16.8,19.5\n        c0.9,1,2.1,1.7,3.1,2.6c0,0-0.1,0-0.1,0c0.3,0.3,0.6,0.6,0.9,0.9c1.5,3.1,3,6.2,4.5,9.2c-12-1.1-19.7-8.4-26.3-17.4\n        c-3.5-4.8-7.5-9.4-11.1-14.2c-6.8-9-15.5-15.7-25.3-21C221.3,36.4,216.7,33.1,211.9,30.1z"
}), /* @__PURE__ */ React25.createElement("path", {
  fill: "#D1058C",
  d: "M232.1,75.1c-5.1-2.6-10.2-4.9-15.1-7.8c-12.1-7-23.8-14.9-36.2-21.3c-14.6-7.4-30.6-11.3-46.9-12.9\n        c-4-0.4-8-0.9-12.1-1.4c2.8-0.6,5.7-1.3,8.5-1.9c5,0.3,10,1,15,0.9c8.6-0.1,16.8,1.3,24.6,5c7.8,3.7,15.5,7.6,24,11.8\n        c-1.7-1.6-2.9-2.7-4-3.8c-0.9-1-1.7-2.1-2.5-3.1C204.5,49.2,221.9,57.5,232.1,75.1z"
}), /* @__PURE__ */ React25.createElement("path", {
  fill: "#F3D965",
  d: "M300.9,105.5c-0.6-1.1-1.3-2.1-1.9-3.2c8.5,3.9,14.3,10.3,15.4,19.6c1,8.5,5.3,14.8,10.8,20.6\n        c14.1,15.1,31,26.6,48.5,37.6c3.8,2.4,6.8,6.1,10.1,9.2c-2.4,3-5.2,3.2-8.3,1.3c-1.5-0.9-3-1.8-4.4-2.9\n        c-10.3-7.9-20.6-15.9-30.8-23.8c-8.5-9-16.9-18.1-25.4-27.1c-1.7-4.9-3.4-9.7-5-14.6C307.9,116,306.2,109.7,300.9,105.5z"
}), /* @__PURE__ */ React25.createElement("path", {
  fill: "#D1058C",
  d: "M177.2,25.2c-1.8-2.2-3.6-4.3-5.4-6.5c20.5,11.5,41,23,61.5,34.4c-0.3-1.1-1-2-1.8-2.7c-3.5-3-7-6-10.5-9\n        c4.7,2.3,10.5,3.5,13.9,7.1c8.5,8.8,15.9,18.6,23.7,28.1c0.6,0.7,0.7,1.7,1.1,2.6c-6.7-0.1-11.9-3.5-15.4-8.8\n        C237.5,60,228,52.9,217,47.7c-7.5-3.6-15.1-7-22.7-10.5c-2.3-1.1-4.6-2.1-7-3.1c0,0,0,0,0,0c-0.3-0.3-0.6-0.5-0.9-0.8c0,0,0,0,0,0\n        c-0.6-0.5-1.2-1-1.8-1.5c0,0,0,0,0,0c-0.5-0.3-1-0.7-1.5-1c0,0,0,0,0,0c-0.6-0.5-1.1-1.1-1.7-1.6c0,0,0,0,0,0\n        c-0.3-0.3-0.6-0.6-0.9-0.8c0,0,0,0,0,0c-0.3-0.3-0.6-0.6-0.9-0.8c0,0,0,0,0,0c-0.3-0.3-0.6-0.6-0.8-0.8c0,0,0,0,0,0\n        C178.5,26.2,177.9,25.7,177.2,25.2z"
}), /* @__PURE__ */ React25.createElement("path", {
  fill: "#7A129E",
  d: "M187.3,34.1c2.3,1,4.7,2,7,3.1c7.6,3.5,15.1,7,22.7,10.5c11.1,5.2,20.5,12.3,27.3,22.8\n        c3.5,5.3,8.7,8.7,15.4,8.8c0,0-0.1,0-0.1,0c0.3,0.3,0.5,0.6,0.8,0.8c2.3,2,4.7,4,7.8,6.7c-6.3-0.3-11.5-0.6-16.8-0.9\n        c-3.1-3.2-5.5-7.5-10.9-7.2c-4-4.8-7.8-9.8-12.1-14.3c-7.9-8.6-17.5-15-27.8-20.5C195.9,41.2,191.8,37.4,187.3,34.1z"
}), /* @__PURE__ */ React25.createElement("path", {
  fill: "#D1058C",
  d: "M91,55.3c4.7-0.8,9.4-1.6,14.1-2.3c5.4-0.8,10.8-1.6,16.2-1.9c5.3-0.3,10.6-0.1,15.8-0.1\n        c0.1,0.4,0.1,0.7,0.2,1.1c-3.5,1-7,2.1-10.5,3.1c-8.9,2.5-17.8,5.3-26.7,7.5c-11.9,3-23.9,5.4-35.8,8.3c-9,2.2-17.9,5-25.2,11.2\n        c-0.6,0.5-0.9,1.2-1.4,1.9c0,0,0,0,0,0c-0.6,0.3-1.1,0.5-1.7,0.8c0,0,0,0,0,0c-0.6,0.3-1.1,0.6-1.7,0.9c-1.1,0.6-2.2,1.2-3.3,1.8\n        c-0.3-0.4-0.6-0.8-0.8-1.2c3.9-3.2,7.9-6.4,11.8-9.6c1-0.8,2.1-1.6,3.1-2.4c1.4,0,2.9,0.3,4.1-0.2c5.4-2.1,10.7-4.7,16.2-6.7\n        c10.5-3.7,21-7.1,31.5-10.6c-0.6,0-1.3-0.2-2-0.1c-3.5,0.5-7,1-10.5,1.6C86.6,57.5,88.8,56.4,91,55.3z M100.7,56.6\n        C99.8,56.7,100,56.7,100.7,56.6C100,56.6,99.8,56.6,100.7,56.6z"
}), /* @__PURE__ */ React25.createElement("path", {
  fill: "#F4B731",
  d: "M337.7,191c2.8,2.4,5.9,4.7,8.5,7.4c2.1,2.2,3.7,4.9,5.5,7.4c-3.3-0.4-5.4,0.6-5.7,4.2c-4-1-7.9-2-11.9-3\n        c-4.4-1-8.8-1.9-13.1-2.8c-0.1,0.4-0.2,0.8-0.3,1.2c6.1,4.1,13.5,4.2,20.4,5.9c-0.3,1.7-0.5,3.3-0.8,5c-3.8-1-7.5-2.2-11.4-3\n        c-7.7-1.6-13.7-5.7-18.4-11.8c0,0,0,0,0,0c0.6-0.2,1.2-0.4,1.8-0.6c3.2-0.6,6.4-1.2,9.7-1.9c0.9-0.2,1.8-0.3,2.7-0.5\n        c0.5-0.1,1-0.2,1.6-0.3c3.8,0.6,7.6,1.2,11.4,1.9c0.2-0.4,0.4-0.8,0.5-1.2c-3.7-1.8-7.3-3.7-11-5.5c1.1-2,2.2-3.9,3.3-5.9\n        C332.8,188.7,335.2,189.8,337.7,191z"
}), /* @__PURE__ */ React25.createElement("path", {
  fill: "#171054",
  d: "M161.9,304.4c2.1,5.9,3.9,11.8,6.3,17.5c2.4,5.6,5.7,10.8,8.4,16.3c1,2,1.5,4.3,2.3,6.4\n        c1.4,5.4,2.7,10.7,4.2,16c0.5,1.8,1.1,3.4,1.7,5.2c-0.6,5.5-1.2,11-2,17.6c-1.8-14.8-7.4-26.9-13.8-38.9c-5-9.3-8.4-19.4-7.4-30.4\n        C161.8,310.9,161.8,307.6,161.9,304.4z"
}), /* @__PURE__ */ React25.createElement("path", {
  fill: "#AD15A3",
  d: "M111,113.8c10.6-10.7,24-16.2,37.9-20.8c4.7-1.5,9.4-3.3,14.9-5.3c-7.7,9.3-14.6,17.7-21.6,26.2\n        c-0.9-3.2-3.5-2.6-5.8-2.6c1.3-2,2.6-4,4-6c-0.3-0.3-0.5-0.6-0.8-0.8c-6.8,3.4-13.1,7.4-18.8,12.6\n        C117.6,116,114.3,114.9,111,113.8z"
}), /* @__PURE__ */ React25.createElement("path", {
  fill: "#6B4DDD",
  d: "M147.9,246.7c-3.4,6.9-6.7,13.9-10.1,20.8c-0.5-0.1-0.9-0.1-1.4-0.2c0-1.5-0.1-3,0-4.5\n        c0.8-11.4,1.5-22.8,2.4-34.2c0.3-4.3,1.1-8.6,1.6-13c2.8-1.1,5.3-1.4,6.3,0.9c2.2,0.3,3.6,0.5,5,0.7c-0.8,6.6-1.6,13.2-2.4,19.7\n        C149,240.2,148.4,243.5,147.9,246.7z"
}), /* @__PURE__ */ React25.createElement("path", {
  fill: "#18ADF3",
  d: "M111.8,320.1c-0.2-2.5-0.2-4.9-0.5-7.4c-1.7-13.4-3.5-26.8-5.1-40.1c-1.2-9.9,0.6-19.6,3.1-29.1\n        c0.4-1.6,1-3.1,1.6-4.6c1.5,15.2,3.7,30.3,4.3,45.5c0.5,10.9-1.1,22-1.9,32.9C113.1,318.3,112.3,319.2,111.8,320.1z"
}), /* @__PURE__ */ React25.createElement("path", {
  fill: "#F4CA30",
  d: "M283.3,272.5c0.8,0.1,1.8-0.1,2.4,0.3c7.4,4.4,14.5,9.5,22.3,13.3c10.9,5.3,15.4,14.3,17.2,25.4\n        c0.1,0.9-0.5,1.9-0.8,2.9c-5.4-5.1-10.9-10.3-16.3-15.4c-4.8-4.6-9.8-9.1-14.4-13.9C290,281.1,286.8,276.7,283.3,272.5z"
}), /* @__PURE__ */ React25.createElement("path", {
  fill: "#6B4DDD",
  d: "M103.6,232.1c-0.4,3-0.9,6-1.3,9.1c-6-25.4-4-43.7,6.1-61.6c2.7,1.4,5.4,2.7,8.1,4.1\n        c-0.3,0.8-0.5,1.6-0.8,2.4C108,200.4,104.6,215.9,103.6,232.1z"
}), /* @__PURE__ */ React25.createElement("path", {
  fill: "#AE4FDC",
  d: "M143.6,195.6c2.4-12.2,4-24.7,10.1-35.9c2.8,0,5.6,0.1,8.4,0.1c-0.1,1.3-0.2,2.7-0.4,4\n        c-1.9,7.9-3.8,15.9-5.8,23.8c-0.8,4.1-1.5,8.2-2.3,12.3c-2.5-0.5-5.1-0.8-7.4-1.7C145.2,198,144.5,196.6,143.6,195.6z"
}), /* @__PURE__ */ React25.createElement("path", {
  fill: "#8B27E0",
  d: "M155.5,344.7c-0.8-3-1.6-5.9-2.3-8.9c-3.1-14.3-5.4-28.7-4.5-43.4c0.7-11.5,1.7-23.1,6.4-33.9\n        c0.1,17.9,0.1,35.8,0.2,53.7C155.4,323,155.5,333.8,155.5,344.7z"
}), /* @__PURE__ */ React25.createElement("path", {
  fill: "#8B27E0",
  d: "M86.1,302.6c-0.2-1.3-0.7-2.6-0.6-3.9c0.7-13.5-1.9-26.5-4.4-39.7c-0.9-4.6-0.6-9.8,0.7-14.3\n        c1.8-6.3,5-12.3,7.7-18.4c1.2,12.5,2.7,24.9,3.4,37.4C93.7,277.2,90.8,290.1,86.1,302.6z M87.4,290c5.4-15.2,3.4-30.2-2.6-45\n        C85.6,260,86.5,275,87.4,290z"
}), /* @__PURE__ */ React25.createElement("path", {
  fill: "#8B27E0",
  d: "M267.9,358c-3.5-17.5-7.1-34.9-10.6-52.4c-0.3-1.5,0.3-3.3,0.5-4.9c0.4-0.1,0.8-0.2,1.2-0.3\n        c4,5.3,7.9,10.6,11.9,15.9c0.5,0.7,1.3,1.2,2,1.9c0,0,0,0,0,0c0.2,0.3,0.4,0.6,0.6,1c2.5,8,3.3,16,1.1,24.2\n        c-0.7-8.6-1.7-17.1-7.6-24c0.2,3.8,0.7,7.5,1.3,11.1C269.9,339.7,270,348.9,267.9,358z"
}), /* @__PURE__ */ React25.createElement("path", {
  fill: "#171054",
  d: "M249.7,380.8c-1.3-2.1-2.7-4.1-4-6.2c-5.1-8.4-7.9-17.6-8-27.3c-0.1-4.6,1.5-9.3,2.4-14\n        c1.3-6.6,2.6-13.2,3.6-18.5c1.3,6.4,2.8,14,4.4,21.7c-0.5,0.6-1.4,1.2-1.4,1.8c-0.4,6.5-1,13.1-0.7,19.6c0.2,3.8,1.8,7.6,2.8,11.4\n        c0.1,1.5,0.3,3.1,0.4,4.6C249.3,376.2,249.5,378.5,249.7,380.8z"
}), /* @__PURE__ */ React25.createElement("path", {
  fill: "#F4B731",
  d: "M340.2,163.8c10.3,8,20.5,15.9,30.8,23.8c1.4,1.1,2.9,2,4.4,2.9c3.1,1.9,5.9,1.8,8.3-1.3\n        c0.4,0.4,0.8,0.7,1.1,1.2c1.5,2.6,3.7,5.5,0.9,8c-2.6,2.3-5-0.3-7.2-1.6c-1.5-0.9-3-1.7-4.6-2.5c-2.9-1.7-5.7-3.6-8.6-5.2\n        c-5.9-3.3-11.8-6.4-17.7-9.6c-3-2.7-6.1-5.5-9.1-8.2c0,0,0.1-0.1,0.1-0.1c2.3,0.7,4.5,1.4,6.8,2.1c0.1-0.2,0.2-0.4,0.2-0.6\n        c-2.4-2.1-4.7-4.3-7.1-6.4C339.1,165.5,339.6,164.7,340.2,163.8z"
}), /* @__PURE__ */ React25.createElement("path", {
  fill: "#36157B",
  d: "M207.9,374.2c-1.5-8.2-3-16.5-4.5-24.7c-2.1-11.4-5-22.8-4.5-34.6c0.2-3.8,0.5-7.6,0.8-11.3\n        c7,14.4,12.5,29.2,12.2,45.6c0,1.3-0.9,2.6-1.3,3.8c-1.1-7.8-2.1-15.7-5.9-22.8c0.1,3.5,0.3,7,0.9,10.5c1.2,7.9,2.5,15.8,3.8,23.7\n        C208.9,367.6,208.4,370.9,207.9,374.2z"
}), /* @__PURE__ */ React25.createElement("path", {
  fill: "#4A1EB0",
  d: "M124.9,239.6c1.9-6.9,3.7-13.8,5.7-20.7c0.4-1.3,1.9-2.2,2.9-3.2c-0.1,16.9-0.3,33.8-0.2,50.8\n        c0,5.8,0.9,11.6,1.3,17.5c-5.4-9.1-6.6-19.4-8.1-29.5C125.8,249.4,125.5,244.5,124.9,239.6z"
}), /* @__PURE__ */ React25.createElement("path", {
  fill: "#CB8A22",
  d: "M330.3,232c3.9,1,7.8,2.1,12.6,3.3c-7.8,3.5-15.1,3.5-22.4,3.4c-7-1.6-14.1-3.2-21.6-4.9\n        c1.4,2.7,2.9,5.5,4.3,8.3c-2.7-1.6-5.4-3-8.1-4.7c-0.7-0.4-1.4-1.6-1.3-2.3c0.4-4.2,1-8.3,1.6-13.1c9.3,7.3,19.9,8.5,29.9,11.5\n        c0.6,0.2,1.6-0.8,2.4-1.3C328.6,232.1,329.5,232,330.3,232z"
}), /* @__PURE__ */ React25.createElement("path", {
  fill: "#AE4FDC",
  d: "M118.2,163.6c6-10.3,12-20.7,18-31c2.9,0.9,5.7,1.7,8.6,2.6c-1.1,2.4-2.3,4.9-3.4,7.3\n        c-3.3,5.2-6.6,10.4-9.8,15.7c-2.3,3.6-4.5,7.1-6.8,10.7C121.9,167.8,118.3,167.8,118.2,163.6z"
}), /* @__PURE__ */ React25.createElement("path", {
  fill: "#18ADF3",
  d: "M217.8,213.1c4.2,5.4,8.9,10.5,12.4,16.3c4.5,7.4,8.2,15.3,12.2,23c0.7,1.3,1.6,2.5,2.4,3.7\n        c0.6,3.7,1.2,7.5,1.8,11.2c-3.5-8.9-6.9-18-13.4-25.3c0.7,2.5,2,4.8,3,7.1c4.2,10,8.9,19.9,9.6,31c-4.2-10.1-8.2-20.3-12.6-30.3\n        c-4.1-9.3-8.7-18.4-12.9-27.7C219,219.3,218.5,216.2,217.8,213.1L217.8,213.1z"
}), /* @__PURE__ */ React25.createElement("path", {
  fill: "#ECACE3",
  d: "M221,41.5c3.5,3,7,5.9,10.5,9c0.8,0.7,1.5,1.6,1.8,2.7c-20.5-11.5-41-23-61.5-34.4c-1.2-1.4-2.4-2.6-3.4-4.1\n        c-1.4-2.1-2.7-4.3-4.7-7.6c1.9,1,3,1.2,3.6,1.8c9.6,10.1,21.7,16.1,34.3,21.6c6.2,2.7,11.8,6.7,17.6,10.2\n        C219.8,40.9,220.4,41.2,221,41.5C221,41.5,221,41.5,221,41.5z"
}), /* @__PURE__ */ React25.createElement("path", {
  fill: "#6B4DDD",
  d: "M85.6,206.7c-1.4,4.9-2.9,9.7-4.3,14.6c-0.7-17.7-0.4-35.3,4.2-52.5c2.7,0.3,5.4,0.5,8,0.8\n        c0,1.7,0.1,3.3,0.1,5c-0.8,2.1-1.6,4.3-2.4,6.4C89.4,189.6,87.5,198.2,85.6,206.7z"
}), /* @__PURE__ */ React25.createElement("path", {
  fill: "#AD15A3",
  d: "M111.6,71c1.2,0,2.3,0.1,3.5,0.1c-0.1,0.4-0.1,0.9-0.3,1c-9.7,6.9-17.3,15.8-24.4,25.2\n        c-1.3-2.2-2.7-4.5-4-6.7c1-0.9,2.2-1.6,3-2.7c1.2-1.6,2.1-3.3-0.5-4.6c-1.5-2.1-2.9-4.2-4.4-6.3c6.8-1.5,13.7-3,20.5-4.5\n        C107.2,72.1,109.4,71.5,111.6,71z"
}), /* @__PURE__ */ React25.createElement("path", {
  fill: "#CB8A22",
  d: "M333,249c4.8-0.5,9.6-1,15.6-1.6c-7.4,6.4-15.3,8.5-23.6,9.3c-7.9,0.7-15.7,0-23.2-3.2\n        c-0.8-0.3-1.9,0-2.9,0.1c-1.5-2.6-3-5.2-4.5-7.7c0.3-0.3,0.6-0.5,0.9-0.8c1.9,0.7,3.7,1.4,5.6,2c9.9,3.4,20.1,3.7,30.3,3\n        C331.8,250,332.4,249.3,333,249z"
}), /* @__PURE__ */ React25.createElement("path", {
  fill: "#ECACE3",
  d: "M156,187.7c1.9-7.9,3.8-15.9,5.8-23.8c3.6,0.5,7.3,1.1,10.9,1.6c-0.3,3.1-0.6,6.2-0.9,9.3\n        c-1.7,5.6-3.4,11.3-5.1,16.9c-1.3,0-2.6,0-3.9,0.1c0.7-6.4,1.3-12.8,2-19.2c-0.2-0.1-0.5-0.1-0.7-0.2c-1.4,5.6-2.7,11.2-4.1,16.8\n        C158.6,188.8,157.3,188.3,156,187.7z"
}), /* @__PURE__ */ React25.createElement("path", {
  fill: "#A4B2F4",
  d: "M124.7,168.8c2.3-3.6,4.5-7.1,6.8-10.7c3.8,2.2,7.7,4.4,11.5,6.6c0.1,0.9,0.1,1.8,0.2,2.6c0,0,0,0,0,0\n        c-0.7,1.1-1.3,2.1-2,3.2c-2.4,3.8-4.8,7.7-7.2,11.5c-1.5-0.3-2.9-0.7-4.3-1c1.5-3,3-6.1,4.4-9.1c-0.3-0.2-0.6-0.3-0.8-0.5\n        c-2.3,3-4.5,5.9-6.8,8.9c-2-1.4-3.9-2.8-5.9-4.2C122,173.7,123.4,171.3,124.7,168.8z"
}), /* @__PURE__ */ React25.createElement("path", {
  fill: "#8B27E0",
  d: "M299.1,368.6c0.8-5.5,1.9-10.9,2.4-16.4c1.1-10.8-2.4-21-4.5-31.3c-1.1-5.4-1.6-11-2.3-16.5\n        c0.4-0.2,0.8-0.4,1.3-0.7c3.2,4.8,6.5,9.6,9.5,14.5c1.6,2.6,2.8,5.6,4.1,8.3c-0.5,5.8-0.9,11.7-1.4,17.5\n        c-0.6-8.2-1.3-16.4-6.2-23.4c-0.4,1.3-0.2,2.5-0.2,3.7c0.4,8,1,15.9,1.2,23.9c0.1,4.6-0.2,9.2-0.3,13.7\n        C301.6,364.2,300.4,366.4,299.1,368.6z"
}), /* @__PURE__ */ React25.createElement("path", {
  fill: "#8B27E0",
  d: "M124.9,239.6c0.5,4.9,0.9,9.9,1.6,14.8c1.5,10.2,2.7,20.4,8.1,29.5c0.6,12,1.2,24.1,1.8,36.1\n        c-3-9.7-6.4-19.4-8.8-29.2c-3.4-13.6-4.1-27.5-3.5-41.4C124.3,246.1,124.6,242.8,124.9,239.6z M131.5,300.6\n        c0.6-0.1,1.2-0.1,1.8-0.2c-1.4-6.9-2.8-13.7-4.3-20.6c-0.6,0.1-1.1,0.2-1.7,0.4C128.8,286.9,130.1,293.7,131.5,300.6z"
}), /* @__PURE__ */ React25.createElement("path", {
  fill: "#AE4FDC",
  d: "M87.8,161.3c4.1-10.1,8.2-20.3,12.3-30.4c2.8,0.6,5.6,1.1,8.4,1.7c-0.5,1.1-1.1,2.3-1.6,3.4\n        c-2.5,5.7-5,11.4-7.5,17.1c-1.2,3.3-2.3,6.6-3.5,9.9c-1.3-0.2-2.7-0.3-4-0.5C90.5,162.2,89.2,161.7,87.8,161.3z"
}), /* @__PURE__ */ React25.createElement("path", {
  fill: "#171054",
  d: "M129.9,341.3c0,5.7,0,11.5,0,17.2c-0.1,0-0.3,0-0.4,0c-3.6-11.6-8-23-10.6-34.8c-1.4-6.1,0.3-12.9,0.5-19.3\n        c0.4,0,0.8-0.1,1.2-0.1c2.3,7.1,4.5,14.2,6.8,21.3c-0.4,0.7-1.1,1.4-1.1,2.1c0.5,3.3,1.1,6.7,1.8,10\n        C128.5,339,129.3,340.1,129.9,341.3z"
}), /* @__PURE__ */ React25.createElement("path", {
  fill: "#4A1EB0",
  d: "M282.5,380.7c-1.3,2.6-2.6,5.3-3.8,7.9c-0.2-0.1-0.5-0.1-0.7-0.2c0-9.5-1-19.1,0.3-28.4\n        c1.2-9.4,4.7-18.6,7.8-28.1c0.8,3.4,1.5,6.8,2.3,10.3c-0.4,2.2-0.7,4.5-1.2,6.7c-1.4,6.7-3,13.4-4.2,20.2\n        C282.3,372.9,282.6,376.8,282.5,380.7z"
}), /* @__PURE__ */ React25.createElement("path", {
  fill: "#4A1EB0",
  d: "M97.8,320.4c-1.7,3.2-3.4,6.4-5,9.4c-1.3-17.2-1.9-34.3,4-50.9c1.1,5.5,2.2,11,3.2,16.6\n        C99.3,303.8,98.6,312.1,97.8,320.4z"
}), /* @__PURE__ */ React25.createElement("path", {
  fill: "#ECACE3",
  d: "M260.3,48.9c-3.1-2-6.2-3.8-9.2-5.9c-10.1-7-21.6-11-32.8-15.7c-6.6-2.8-12.7-6.9-18.9-10.6\n        c-1.2-0.7-2-2.1-2.9-3.2c5.7,2.4,11.3,5.2,17.1,7.3c16.2,5.7,31.5,12.9,44.1,24.7C258.7,46.5,259.5,47.8,260.3,48.9z"
}), /* @__PURE__ */ React25.createElement("path", {
  fill: "#CB8A22",
  d: "M310.4,201.5c4.7,6.1,10.7,10.3,18.4,11.8c3.8,0.8,7.6,2,11.4,3c3.3,1.1,6.6,2.2,9.9,3.3c0,0.2,0,0.5,0.1,0.7\n        c-4.1,0.4-8.3,0.7-12.4,1.1c-3.9-0.3-7.9-0.3-11.8-1c-5.2-0.8-10.3-2.1-15.4-3.2c1.5-1.5,3-2.9,4.6-4.4c3.8,1.2,7.6,2.3,11.4,3.5\n        c0.1-0.2,0.2-0.3,0.3-0.5c-6.6-3.9-13.2-7.9-19.8-11.8c0.1-0.5,0.2-1,0.4-1.5C308.4,202.3,309.4,201.9,310.4,201.5z"
}), /* @__PURE__ */ React25.createElement("path", {
  fill: "#318DEF",
  d: "M233.4,344c-1.5-7.9-2.9-15.8-4.5-23.6c-2.2-10.7-4.6-21.4-7.1-32.8c1,1.4,1.9,2.4,2.5,3.5\n        c5.7,11.3,10.3,22.9,11.7,35.6c0.1,0.5,0.4,1,0.6,1.5C235.5,333.5,234.5,338.7,233.4,344z"
}), /* @__PURE__ */ React25.createElement("path", {
  fill: "#B22DBB",
  d: "M136.4,111.3c2.3,0.1,4.9-0.6,5.8,2.6c-5,9-10,18-15,26.9c-1.9-0.6-3.8-1.1-5.7-1.7\n        c1.9-4.9,3.9-9.9,5.8-14.8C130.4,120,133.4,115.7,136.4,111.3z"
}), /* @__PURE__ */ React25.createElement("path", {
  fill: "#F4CA30",
  d: "M337.7,318.3c1.1-2.6,2.2-5.1,3.5-7.7c5-10.3,10-20.5,15-30.7c0.8-1.7,1.8-3.3,2.7-5c0,1.3-0.1,2.7-0.1,4\n        c-0.1,0.9-0.3,1.7-0.4,2.6c-1,12.9-6,24.2-14.2,34C342.8,317.1,339.9,317.4,337.7,318.3z"
}), /* @__PURE__ */ React25.createElement("path", {
  fill: "#ECACE3",
  d: "M187.3,40.7c0.8,1,1.6,2.1,2.5,3.1c1.1,1.2,2.3,2.2,4,3.8c-8.6-4.2-16.3-8.1-24-11.8c-7.8-3.7-16-5.1-24.6-5\n        c-5,0.1-10-0.6-15-0.9c12.1-4.6,24.3-4.3,36.4-0.2c0.6,0.3,1.2,0.7,1.9,1c0,0,0,0,0,0c0.8,0.3,1.7,0.6,2.5,0.8c0,0,0,0,0,0\n        c4.4,2.7,8.8,5.5,13.2,8.1C185.1,40.2,186.3,40.4,187.3,40.7L187.3,40.7z"
}), /* @__PURE__ */ React25.createElement("path", {
  fill: "#171054",
  d: "M223.1,388.2c-2-14.7-9.6-28.2-6.6-43.1C225.2,353.2,228.6,374.3,223.1,388.2z"
}), /* @__PURE__ */ React25.createElement("path", {
  fill: "#F3D965",
  d: "M91.3,181c0.8-2.1,1.6-4.3,2.4-6.4c0.9-0.7,2-1.3,2.5-2.2c2.6-4.9,5-9.9,7.4-14.8\n        c3.6-5.4,7.2-10.7,10.9-16.1c0.2,0.1,0.4,0.2,0.6,0.4c-2.8,6.3-5.5,12.5-8.3,18.8c-1.6,4.2-3.3,8.4-4.9,12.6\n        c-0.3,0.7-0.5,1.5-0.8,2.2c-0.3,0.8-0.7,1.5-1,2.3c-2.1,3.7-4.1,7.3-6.2,11c-1.5,3-2.9,6-4.4,9.1c0.5-3.2,1-6.5,1.4-9.7\n        C91.2,185.6,91.2,183.3,91.3,181z"
}), /* @__PURE__ */ React25.createElement("path", {
  fill: "#B22DBB",
  d: "M144.7,135.1c-2.9-0.9-5.7-1.7-8.6-2.6c4.2-6.5,8.4-13.1,12.6-19.6c3,0.9,6.5,0.7,8.2,4.1\n        c-0.8,1.4-1.7,2.8-2.5,4.1c-1.1,1.7-2.2,3.4-3.3,5C149,129.2,146.9,132.2,144.7,135.1z"
}), /* @__PURE__ */ React25.createElement("path", {
  fill: "#18ADF3",
  d: "M198.1,252.6c0.9-19.8-4.9-38.6-8.6-57.7c-1.2-6.4-1.8-12.9-2.7-19.3c3.7,9.8,7.4,19.5,11,29.2\n        c0.6,5,1.2,10.1,1.7,15.1c-0.7-1.5-1.4-2.9-2.1-4.4c-0.3,0.1-0.6,0.3-1,0.4c0.3,2,0.5,3.9,0.8,5.9c0.8,5.3,1.5,10.6,2.3,15.9\n        C199.1,242.7,198.6,247.7,198.1,252.6z"
}), /* @__PURE__ */ React25.createElement("path", {
  fill: "#F3D965",
  d: "M160,189.3c1.4-5.6,2.7-11.2,4.1-16.8c0.2,0.1,0.5,0.1,0.7,0.2c-0.7,6.4-1.3,12.8-2,19.2\n        c-0.9,7.1-1.8,14.2-2.7,21.3c-3.4,10.1-6.8,20.3-10.3,30.4c-0.4,1.1-1.2,2.1-1.8,3.1c0.5-3.2,1.1-6.5,1.6-9.7\n        c1.8-6.9,3.7-13.8,5.5-20.6c0.4-2.4,0.9-4.8,1.3-7.3C157.5,202.5,158.8,195.9,160,189.3z"
}), /* @__PURE__ */ React25.createElement("path", {
  fill: "#318DEF",
  d: "M183.3,331.5c-1.4-5-3.7-9.9-3.9-14.9c-0.5-15.3-0.2-30.6,0.6-45.9c1.1,9.7,2.2,19.4,3.3,29.1\n        c0.2,1.6,0.5,3.2,0.7,4.8C183.7,313.5,183.5,322.5,183.3,331.5z"
}), /* @__PURE__ */ React25.createElement("path", {
  fill: "#B22DBB",
  d: "M162.1,159.9c-2.8,0-5.6-0.1-8.4-0.1c3.6-7.4,7.1-14.8,10.7-22.2c2.7,0.3,5.5,0.5,8.2,0.8\n        c-0.6,1.6-1.2,3.2-1.8,4.7c-1.1,2-2.3,4-3.3,6C165.7,152.7,163.9,156.3,162.1,159.9z"
}), /* @__PURE__ */ React25.createElement("path", {
  fill: "#318DEF",
  d: "M267.9,358c2.1-9.1,2-18.3,0.4-27.4c-0.6-3.7-1.2-7.4-1.3-11.1c6,6.9,7,15.4,7.6,24\n        c-0.3,8.8-2.2,17.2-6.2,25c-0.3-0.7-1-1.4-1-2.1C267.5,363.5,267.7,360.8,267.9,358z"
}), /* @__PURE__ */ React25.createElement("path", {
  fill: "#B22DBB",
  d: "M84.5,77.1c1.5,2.1,2.9,4.2,4.4,6.3c-3.1,1.6-6.2,3.2-9.2,4.8c-4.9,1.4-9.8,2.9-14.7,4.3\n        c-1.4-1.2-2.9-2.3-4.3-3.5C68.6,85.1,76.5,81.1,84.5,77.1z"
}), /* @__PURE__ */ React25.createElement("path", {
  fill: "#7541D9",
  d: "M143.6,195.6c0.9,0.9,1.6,2.3,2.6,2.7c2.4,0.8,4.9,1.1,7.4,1.7c-0.3,2.8-0.6,5.5-0.9,8.3\n        c-0.2,2.4-0.5,4.9-0.7,7.3c-0.1,0.5-0.2,1.1-0.2,1.6c-1.4-0.2-2.8-0.4-5-0.7c-1-2.3-3.6-2-6.3-0.9\n        C141.5,209,142.6,202.3,143.6,195.6z"
}), /* @__PURE__ */ React25.createElement("path", {
  fill: "#B22DBB",
  d: "M86.3,90.7c1.3,2.2,2.7,4.5,4,6.7c-1.5,2.4-3,4.9-4.5,7.3c-4.3,1.8-8.5,3.7-12.8,5.5c1.9-3.5-1.7-5.3-2.4-8\n        c4.2-3.2,8.3-6.5,12.5-9.7C84.2,91.9,85.3,91.3,86.3,90.7z"
}), /* @__PURE__ */ React25.createElement("path", {
  fill: "#B22DBB",
  d: "M108.5,132.6c-2.8-0.6-5.6-1.1-8.4-1.7c3.7-5.7,7.3-11.4,11-17.1c3.3,1.1,6.5,2.2,9.8,3.2\n        c-0.9,1-1.7,2.1-2.6,3.1C115,124.3,111.7,128.5,108.5,132.6z"
}), /* @__PURE__ */ React25.createElement("path", {
  fill: "#F3D965",
  d: "M33.5,132.5c-5.7,6.7-11.3,13.4-17,20c-0.2-0.1-0.5-0.2-0.7-0.3c0.4-1.3,0.8-2.5,1.2-3.8\n        c3.7-5.6,7.3-11.1,11-16.7c2.2-2.7,4.3-5.4,6.5-8.1c4.4-4.1,8.8-8.2,13.2-12.3c1.7-1.1,3.4-2.2,5.1-3.3c0.2,0.2,0.4,0.5,0.6,0.7\n        c-1.4,1.7-2.8,3.3-4.2,5c-3.7,4.1-7.5,8.1-11.1,12.3C36.3,128,35,130.3,33.5,132.5z"
}), /* @__PURE__ */ React25.createElement("path", {
  fill: "#18ADF3",
  d: "M280,310.2c-5.8-13.8-13.4-27-14.6-42.7c0.8,1.1,1.7,2.1,2.3,3.3c3.8,7.5,7.5,15.1,11.3,22.6\n        c0.3,0.7,0.8,1.3,1.2,2c0,0,0,0,0,0c0.3,1,0.6,1.9,0.9,2.9c0.3,1.3,0.5,2.6,0.8,4c-1.8-3.1-3.7-6.2-5.5-9.3\n        C277.6,298.8,278.8,304.5,280,310.2z"
}), /* @__PURE__ */ React25.createElement("path", {
  fill: "#F4B731",
  d: "M310.6,217.3c5.1,1.1,10.2,2.4,15.4,3.2c3.9,0.6,7.8,0.7,11.8,1c-1.9,1.3-3.9,2.6-5.8,3.9\n        c-5.8-1.3-11.6-2.6-17.4-3.9c4.8,4.8,11.1,5.5,17,7.2c-0.4,1.1-0.8,2.3-1.2,3.4c-0.8,0-1.7,0.1-2.5,0.1\n        c-5.2-2.2-10.4-4.5-15.6-6.7c-0.5-0.2-1.1-0.5-1.6-0.7c0,0,0,0,0,0c-1-2.5-2.1-5-3.2-7.7C308.7,217.1,309.6,217.2,310.6,217.3z"
}), /* @__PURE__ */ React25.createElement("path", {
  fill: "#AE4FDC",
  d: "M101.1,175.4c0.3-0.7,0.5-1.5,0.8-2.2c1-0.5,2.5-0.8,3-1.6c1.9-3.3,3.5-6.7,5.2-10.1\n        c3.3-6.5,6.5-13.1,9.8-19.6c0.6-0.9,1.1-1.7,1.7-2.6c1.9,0.6,3.8,1.1,5.7,1.7c-7.2,10.7-14.4,21.5-21.8,32.1\n        C104.6,174.2,102.6,174.6,101.1,175.4z"
}), /* @__PURE__ */ React25.createElement("path", {
  fill: "#CB8A22",
  d: "M369.6,256.7c-1.9,2.6-3.8,5.2-6.2,8.5c-0.7-5.1,0.5-8.5,2.8-11.9c6.7-10,9.8-20.9,8.1-32.7\n        c3.4-0.9,6.8-1.7,10.6-2.7c0,1.3,0,3,0,4.6c-0.6-0.3-1.6-1-1.8-0.9c-1.6,1.6-3.8,3.2-4.5,5.2c-3.2,9.6-5.9,19.4-8.8,29.1\n        c0,0,0.1-0.1,0.1-0.1C369.8,256.2,369.7,256.4,369.6,256.7z"
}), /* @__PURE__ */ React25.createElement("path", {
  fill: "#F3D965",
  d: "M126.5,180.3c2.3-3,4.5-5.9,6.8-8.9c0.3,0.2,0.6,0.3,0.8,0.5c-1.5,3-3,6.1-4.4,9.1c-2,3.3-4,6.5-5.9,9.8\n        c-1.4,2.1-3,4.2-4.2,6.4c-1.7,3.1-3.1,6.3-4.6,9.4c0,0,0-0.1,0-0.1c-0.5,0.9-1.1,1.8-1.6,2.8c-1.9,3.7-3.9,7.4-5.8,11.2\n        c-2.6-2.4-0.5-4.9,0.3-6.8c3.8-8.2,8.1-16.2,12.2-24.2C122.2,186.4,124.4,183.4,126.5,180.3z"
}), /* @__PURE__ */ React25.createElement("path", {
  fill: "#F4CA30",
  d: "M369.8,256c2.9-9.7,5.6-19.5,8.8-29.1c0.7-2,2.9-3.6,4.5-5.2c0.1-0.1,1.2,0.6,1.8,0.9\n        C382.8,235,377.7,246.1,369.8,256z"
}), /* @__PURE__ */ React25.createElement("path", {
  fill: "#CA6F25",
  d: "M310.6,217.3c-0.9-0.1-1.8-0.2-3.1-0.3c1.1,2.7,2.1,5.2,3.2,7.7c-3.8-2.1-7.6-4-11.2-6.3\n        c-0.7-0.5-1.1-2.5-0.7-3.3c1.4-2.9,3.2-5.6,5-8.5c4.1,2.3,7.8,4.4,11.5,6.5C313.6,214.4,312.1,215.8,310.6,217.3z"
}), /* @__PURE__ */ React25.createElement("path", {
  fill: "#18ADF3",
  d: "M120.1,189.5c-4.1,8-8.4,16-12.2,24.2c-0.8,1.8-3,4.4-0.3,6.8c-1.3,3.9-2.6,7.7-4,11.6\n        c1-16.2,4.3-31.7,12.1-46.1C117.5,186.8,119.9,186.8,120.1,189.5z"
}), /* @__PURE__ */ React25.createElement("path", {
  fill: "#F4CA30",
  d: "M329.5,286.3c5.6,5,7.5,11.4,7.3,18.6c-0.1,4.5-0.5,8.9-0.7,13.4c-2.5-0.5-5-1-7.4-1.6\n        c1.1-5.1,3-10.2,3.1-15.4C331.9,296.4,330.3,291.3,329.5,286.3L329.5,286.3z"
}), /* @__PURE__ */ React25.createElement("path", {
  fill: "#171054",
  d: "M374.7,215.5c2-1.5,3.9-2.8,6.5-4.8c-2.9-0.8-4.8-1.3-6.6-1.8c-3.6-1-4-3.9-2.8-6.4c0.5-1.1,3.6-1.7,5.5-1.5\n        c3.1,0.4,6.1,1.6,9.2,2.4C385.3,213.2,380.8,218,374.7,215.5z"
}), /* @__PURE__ */ React25.createElement("path", {
  fill: "#7541D9",
  d: "M124.7,168.8c-1.3,2.4-2.7,4.9-4,7.3c-1.4,2.5-2.8,4.9-4.2,7.4c-2.7-1.4-5.4-2.7-8.1-4.1\n        c3.2-5.3,6.5-10.6,9.7-15.9C118.3,167.8,121.9,167.8,124.7,168.8z"
}), /* @__PURE__ */ React25.createElement("path", {
  fill: "#B22DBB",
  d: "M161,119.4c3.2-0.3,5.2,0.9,5.1,4.4c-3.4,6.2-6.8,12.5-10.2,18.7c-1.2-0.6-2.5-1.1-3.7-1.7\n        c2.2-6,4.4-12,6.6-18C159.5,121.7,160.2,120.5,161,119.4z"
}), /* @__PURE__ */ React25.createElement("path", {
  fill: "#318DEF",
  d: "M302.9,362c0.1-4.6,0.5-9.2,0.3-13.7c-0.2-8-0.8-15.9-1.2-23.9c-0.1-1.2-0.3-2.4,0.2-3.7\n        c4.9,7,5.5,15.2,6.2,23.4C306.5,350.1,304.7,356,302.9,362z"
}), /* @__PURE__ */ React25.createElement("path", {
  fill: "#F3D965",
  d: "M84.5,58.6c3.5-0.5,7-1.1,10.5-1.6c0.7-0.1,1.5,0.1,2,0.1c-10.4,3.5-21,6.9-31.5,10.6\n        c-5.5,1.9-10.8,4.5-16.2,6.7c-1.2,0.5-2.7,0.2-4.1,0.2c11.4-5,22.7-10,34.1-14.9C80.9,59,82.7,58.9,84.5,58.6z"
}), /* @__PURE__ */ React25.createElement("path", {
  fill: "#F29F32",
  d: "M267.8,226.3c4.9-1.3,9.9-2.4,14.6-4.1c3.3-1.2,6.2-3.3,9.3-5c-2.5,4-4.5,8.6-7.7,11.8\n        C280,233.1,274.4,231.7,267.8,226.3z"
}), /* @__PURE__ */ React25.createElement("path", {
  fill: "#B22DBB",
  d: "M171.8,174.8c0.3-3.1,0.6-6.2,0.9-9.3c1.6-7.1,3.3-14.2,4.9-21.3c1.3-3.3,2.6-6.7,4-10\n        c1.4,0.3,2.8,0.6,4.2,0.9C181.2,148.4,176.5,161.6,171.8,174.8z"
}), /* @__PURE__ */ React25.createElement("path", {
  fill: "#F4B731",
  d: "M303.2,242c-1.4-2.8-2.9-5.5-4.3-8.3c7.6,1.7,14.6,3.3,21.6,4.9c0,0.7,0,1.4,0,2.2c-2.3,0.2-4.6,0.3-7.2,0.5\n        c0.7,0.5,1.1,0.8,1.6,1.1c-0.3,1.2-0.6,2.3-0.9,3.5C310.3,244.6,306.7,243.3,303.2,242z"
}), /* @__PURE__ */ React25.createElement("path", {
  fill: "#ECACE3",
  d: "M245.8,280.2c-0.7-11.1-5.4-21-9.6-31c-1-2.4-2.3-4.6-3-7.1c6.4,7.4,9.8,16.4,13.4,25.3c0,0,0-0.1,0-0.1\n        c0.2,0.9,0.5,1.8,0.7,2.7c0.2,6.8,0.5,13.6,0.7,20.4C247.2,287,246.5,283.6,245.8,280.2z"
}), /* @__PURE__ */ React25.createElement("path", {
  fill: "#36157B",
  d: "M248.7,369.3c-1-3.8-2.7-7.6-2.8-11.4c-0.3-6.5,0.4-13.1,0.7-19.6c0-0.6,0.9-1.2,1.4-1.8\n        c1.1,5.8,2.2,11.6,3.2,17.4c0.2,1-0.4,2-0.6,3c-0.8-1.6-1.5-3.3-2-4.2C248.7,357.8,248.7,363.6,248.7,369.3z"
}), /* @__PURE__ */ React25.createElement("path", {
  fill: "#AE4FDC",
  d: "M60.6,89c1.4,1.2,2.9,2.3,4.3,3.5c-1.9,1-3.9,2-5.8,2.9c-4.6,3.1-9.3,6.2-13.9,9.3c-1.6,1.4-3.3,2.8-4.9,4.3\n        c0-1.2,0-2.3-0.1-3.5C47,100,53.8,94.5,60.6,89z"
}), /* @__PURE__ */ React25.createElement("path", {
  fill: "#8B27E0",
  d: "M282.5,380.7c0.1-3.8-0.2-7.8,0.4-11.5c1.1-6.8,2.8-13.5,4.2-20.2c0.5-2.2,0.8-4.4,1.2-6.7\n        c2,6.9,2.6,13.9,1,21c-0.1,0.6-0.5,1.2-0.8,1.8c-0.1-1.7-0.2-3.4-0.3-5c-0.4-0.1-0.8-0.1-1.2-0.2c-1.2,6.1-2.3,12.2-3.5,18.3\n        C283.2,379,282.8,379.8,282.5,380.7z"
}), /* @__PURE__ */ React25.createElement("path", {
  fill: "#411DAA",
  d: "M76.9,218.7c-0.7,1.1-1.7,2-2.1,3.2c-0.7,2.1-1.2,4.2-4.2,3.6c0.3-2.5,0.4-5,0.9-7.4\n        c1.3-6.5,2.7-12.9,4.2-19.3c0.2-1,0.9-1.9,1.4-2.8c-0.1,5.5-0.2,11-0.3,16.5c-0.1,0.3-0.1,0.6-0.2,0.8\n        C76.7,215.1,76.8,216.9,76.9,218.7z"
}), /* @__PURE__ */ React25.createElement("path", {
  fill: "#6B4DDD",
  d: "M48.3,129.2c-5.5,6.9-10.9,13.8-16.4,20.6c0.9-2.9,1.7-5.7,2.6-8.6c1.3-3.8,2.7-7.5,4-11.2\n        c0,0-0.1,0.1-0.1,0.1c0.3-0.4,0.6-0.8,0.9-1.2c0.3-0.3,0.6-0.6,0.9-0.8c0.4,1.4,0.9,2.9,1.3,4.3c1.2-0.7,2.4-1.4,3.7-2\n        C46.3,130,47.3,129.6,48.3,129.2z"
}), /* @__PURE__ */ React25.createElement("path", {
  fill: "#8B27E0",
  d: "M209.3,364.3c-1.3-7.9-2.6-15.8-3.8-23.7c-0.5-3.5-0.8-6.9-0.9-10.5c3.7,7.1,4.7,15,5.9,22.8\n        C210.1,356.7,209.7,360.5,209.3,364.3z"
}), /* @__PURE__ */ React25.createElement("path", {
  fill: "#F4CA30",
  d: "M320,335.5c-0.7-6.1-1.4-12-2.1-17.7C327.8,323,329.4,330.3,320,335.5z"
}), /* @__PURE__ */ React25.createElement("path", {
  fill: "#AE4FDC",
  d: "M152.1,140.8c1.2,0.6,2.5,1.1,3.7,1.7c-3.2,6.9-6.4,13.8-9.8,20.6c-0.7,1.5-1.9,2.9-2.9,4.3\n        c-0.1-0.9-0.1-1.8-0.2-2.6c2.2-5.8,4.3-11.5,6.5-17.3C150.3,145.2,151.2,143,152.1,140.8z"
}), /* @__PURE__ */ React25.createElement("path", {
  fill: "#A4B2F4",
  d: "M40.4,128.1c-0.3,0.3-0.6,0.6-0.9,0.8c-0.3,0.4-0.6,0.8-0.9,1.2c0,0,0.1-0.1,0.1-0.1\n        c-1.7,0.8-3.4,1.6-5.1,2.4c1.5-2.2,2.8-4.5,4.6-6.5c3.6-4.2,7.4-8.2,11.1-12.3c0.9,0.6,1.8,1.2,2.7,1.8\n        C48,119.7,44.2,123.9,40.4,128.1z"
}), /* @__PURE__ */ React25.createElement("path", {
  fill: "#ECACE3",
  d: "M280,310.2c-1.2-5.7-2.4-11.4-3.6-17.3c1.8,3.1,3.7,6.2,5.5,9.3c0.3,6,0.5,12,0.8,17.9\n        C281.8,316.8,280.9,313.5,280,310.2z"
}), /* @__PURE__ */ React25.createElement("path", {
  fill: "#7541D9",
  d: "M87.8,161.3c1.4,0.4,2.7,0.9,4.1,1.2c1.3,0.3,2.7,0.4,4,0.5c-0.8,2.2-1.6,4.4-2.3,6.5\n        c-2.7-0.3-5.4-0.5-8-0.8c0.6-2.2,1.2-4.4,1.8-6.7c0.2-0.3,0.4-0.6,0.6-0.8C87.9,161.3,87.8,161.3,87.8,161.3z"
}), /* @__PURE__ */ React25.createElement("path", {
  fill: "#CA6F25",
  d: "M272.8,93.2c-5.8-1.4-11.5-2.8-17.3-4.1c8.4-1.9,16.3,0.2,24,3.2c-0.3,0.9-0.7,1.7-1,2.6\n        C276.6,94.3,274.7,93.8,272.8,93.2z"
}), /* @__PURE__ */ React25.createElement("path", {
  fill: "#8B27E0",
  d: "M184.8,365.8c-0.6-1.7-1.3-3.4-1.7-5.2c-1.4-5.3-2.8-10.7-4.2-16c1.4,1.4,2.7,2.8,4.1,4.2c0.4,0,0.7,0,1.1,0\n        c0,0-0.1,0-0.1,0c0.4,3.8,0.8,7.6,1.2,11.5c-0.1,0.3-0.1,0.7-0.2,1C185,362.8,184.9,364.3,184.8,365.8z"
}), /* @__PURE__ */ React25.createElement("path", {
  fill: "#318DEF",
  d: "M34.5,123.6c-2.2,2.7-4.3,5.4-6.5,8.1c-0.6-1.6-1.1-3.3-1.7-4.9c1-1.9,2-3.8,2.9-5.6\n        c0.4-0.6,0.8-1.1,1.2-1.7c0,0,0,0,0,0c0.5,0,1,0,1.5,0C32.7,120.8,33.6,122.2,34.5,123.6z"
}), /* @__PURE__ */ React25.createElement("path", {
  fill: "#A4B2F4",
  d: "M160.1,213.2c0.9-7.1,1.8-14.2,2.7-21.3c1.3,0,2.6,0,3.9-0.1C164.5,198.9,162.3,206,160.1,213.2z"
}), /* @__PURE__ */ React25.createElement("path", {
  fill: "#18ADF3",
  d: "M26.3,126.8c0.6,1.6,1.1,3.3,1.7,4.9c-3.7,5.6-7.3,11.1-11,16.7C20.1,141.2,23.2,134,26.3,126.8z"
}), /* @__PURE__ */ React25.createElement("path", {
  fill: "#8B27E0",
  d: "M97.8,320.4c0.8-8.3,1.5-16.6,2.3-24.9c1.7,7.2,2.2,14.3-0.5,21.4C99.1,318.1,98.4,319.2,97.8,320.4z"
}), /* @__PURE__ */ React25.createElement("path", {
  fill: "#ECACE3",
  d: "M199.5,237.7c-0.8-5.3-1.5-10.6-2.3-15.9c-0.3-2-0.5-3.9-0.8-5.9c0.3-0.1,0.6-0.3,1-0.4\n        c0.7,1.5,1.4,2.9,2.1,4.4c0.3,4.6,0.7,9.1,0.9,13.7C200.5,234.9,199.8,236.3,199.5,237.7z"
}), /* @__PURE__ */ React25.createElement("path", {
  fill: "#18ADF3",
  d: "M91.3,181c-0.1,2.3-0.1,4.6-0.4,6.9c-0.4,3.3-0.9,6.5-1.4,9.7c-1.3,3-2.6,6-4,9.1\n        C87.5,198.2,89.4,189.6,91.3,181z"
}), /* @__PURE__ */ React25.createElement("path", {
  fill: "#318DEF",
  d: "M123.8,190.8c2-3.3,4-6.5,5.9-9.8c1.4,0.3,2.9,0.7,4.3,1c-2.4,3-4.8,6.1-7.3,9.1\n        C125.8,191,124.8,190.9,123.8,190.8z"
}), /* @__PURE__ */ React25.createElement("path", {
  fill: "#36157B",
  d: "M249.7,380.8c-0.2-2.3-0.4-4.6-0.6-6.9c0.5-1.6,1.3-3.2,1.5-4.9c0.3-3.5,0.2-7,0.3-10.6\n        c0.4,3.9,1.3,7.7,1.2,11.6c-0.2,4.9-1.2,9.8-2.1,15.6C249.8,383.5,249.8,382.1,249.7,380.8z"
}), /* @__PURE__ */ React25.createElement("path", {
  fill: "#7541D9",
  d: "M31.8,119.5c-0.5,0-1,0-1.5,0c3.3-4.7,6.5-9.4,9.8-14c0,1.2,0,2.3,0.1,3.5C37.4,112.5,34.6,116,31.8,119.5z"
}), /* @__PURE__ */ React25.createElement("path", {
  fill: "#18ADF3",
  d: "M123.8,190.8c1,0.1,2,0.2,3,0.3c-3.9,5.2-7.9,10.4-11.8,15.5c1.5-3.1,2.9-6.3,4.6-9.4\n        C120.8,195,122.4,192.9,123.8,190.8z"
}), /* @__PURE__ */ React25.createElement("path", {
  fill: "#318DEF",
  d: "M283.5,378.2c1.2-6.1,2.3-12.2,3.5-18.3c0.4,0.1,0.8,0.1,1.2,0.2c0.1,1.7,0.2,3.4,0.3,5\n        C286.8,369.5,285.2,373.8,283.5,378.2z"
}), /* @__PURE__ */ React25.createElement("path", {
  fill: "#B22DBB",
  d: "M225.1,87.6c-2.9,3.6-11,4.9-13.2,2.1C216.3,89,220.7,88.3,225.1,87.6z"
}), /* @__PURE__ */ React25.createElement("path", {
  fill: "#8B27E0",
  d: "M250.8,358.5c-0.1,3.5,0,7.1-0.3,10.6c-0.1,1.7-1,3.3-1.5,4.9c-0.1-1.5-0.3-3.1-0.4-4.6c0-5.7,0-11.5,0-16.6\n        c0.5,1,1.2,2.6,2,4.2C250.8,357.5,250.8,358,250.8,358.5z"
}), /* @__PURE__ */ React25.createElement("path", {
  fill: "#D1058C",
  d: "M187.3,40.7c-1.1-0.3-2.2-0.4-3.2-1c-4.5-2.6-8.8-5.4-13.2-8.1C178.2,31.4,182.7,36.1,187.3,40.7z"
}), /* @__PURE__ */ React25.createElement("path", {
  fill: "#8B27E0",
  d: "M129.9,341.3c-0.6-1.2-1.4-2.4-1.7-3.7c-0.8-3.3-1.4-6.6-1.8-10c-0.1-0.6,0.7-1.4,1.1-2.1\n        C128.2,330.9,129.1,336.1,129.9,341.3z"
}), /* @__PURE__ */ React25.createElement("path", {
  fill: "#411DAA",
  d: "M70.6,226.2c-0.5,6.3-1.1,12.7-1.6,19c-0.3-1.9-0.6-3.8-0.8-5.8c0.3-3.6,0.5-7.3,0.9-10.9\n        C69.2,227.8,70.1,227,70.6,226.2z"
}), /* @__PURE__ */ React25.createElement("path", {
  fill: "#411DAA",
  d: "M240.6,78.6c5.4-0.3,7.8,3.9,10.9,7.2C246.3,85.8,243.2,82.5,240.6,78.6z"
}), /* @__PURE__ */ React25.createElement("path", {
  fill: "#318DEF",
  d: "M93.9,188.6c2.1-3.7,4.1-7.3,6.2-11C100.3,182.6,97.1,185.5,93.9,188.6z"
}), /* @__PURE__ */ React25.createElement("path", {
  fill: "#18ADF3",
  d: "M113.4,209.3c0.5-0.9,1.1-1.8,1.6-2.8C114.5,207.5,113.9,208.4,113.4,209.3z"
}), /* @__PURE__ */ React25.createElement("path", {
  fill: "#AE4FDC",
  d: "M141.3,170.5c0.7-1.1,1.3-2.1,2-3.2C142.6,168.4,141.9,169.4,141.3,170.5z"
}), /* @__PURE__ */ React25.createElement("path", {
  fill: "#7A129E",
  d: "M177.2,25.2c0.6,0.5,1.2,1,1.8,1.6C178.5,26.2,177.9,25.7,177.2,25.2z"
}), /* @__PURE__ */ React25.createElement("path", {
  fill: "#7A129E",
  d: "M184.7,31.8c0.6,0.5,1.2,1,1.8,1.5C185.9,32.8,185.3,32.3,184.7,31.8z"
}), /* @__PURE__ */ React25.createElement("path", {
  fill: "#7541D9",
  d: "M281.1,298.2c-0.3-1-0.6-1.9-0.9-2.9C280.5,296.3,280.8,297.2,281.1,298.2z"
}), /* @__PURE__ */ React25.createElement("path", {
  fill: "#18ADF3",
  d: "M247.2,270.1c-0.2-0.9-0.5-1.8-0.7-2.7C246.7,268.2,247,269.2,247.2,270.1z"
}), /* @__PURE__ */ React25.createElement("path", {
  fill: "#CA6F25",
  d: "M324.6,198.5c-0.9,0.2-1.8,0.3-2.7,0.5C322.8,198.9,323.7,198.7,324.6,198.5z"
}), /* @__PURE__ */ React25.createElement("path", {
  fill: "#CB8A22",
  d: "M358.4,281.5c0.1-0.9,0.3-1.7,0.4-2.6C358.6,279.8,358.5,280.6,358.4,281.5z"
}), /* @__PURE__ */ React25.createElement("path", {
  fill: "#318DEF",
  d: "M183.9,333.7c-0.2-0.8-0.4-1.5-0.7-2.3C183.5,332.2,183.7,333,183.9,333.7z"
}), /* @__PURE__ */ React25.createElement("path", {
  fill: "#7A129E",
  d: "M181.6,29.1c0.6,0.5,1.1,1.1,1.7,1.6C182.7,30.2,182.1,29.7,181.6,29.1z"
}), /* @__PURE__ */ React25.createElement("path", {
  fill: "#D1058C",
  d: "M170.9,31.6c-0.8-0.3-1.7-0.6-2.5-0.8C169.3,31,170.1,31.3,170.9,31.6z"
}), /* @__PURE__ */ React25.createElement("path", {
  fill: "#CA6F25",
  d: "M274.4,243.6C274.7,243.9,275,244.1,274.4,243.6C274.7,244.3,274.6,243.9,274.4,243.6L274.4,243.6z"
}), /* @__PURE__ */ React25.createElement("path", {
  fill: "#CA6F25",
  d: "M310.6,224.7c0.5,0.2,1.1,0.5,1.6,0.7C311.7,225.2,311.1,224.9,310.6,224.7z"
}), /* @__PURE__ */ React25.createElement("path", {
  fill: "#D1058C",
  d: "M168.5,30.7c-0.6-0.3-1.2-0.7-1.9-1C167.2,30.1,167.9,30.4,168.5,30.7z"
}), /* @__PURE__ */ React25.createElement("path", {
  fill: "#7541D9",
  d: "M30.4,119.5c-0.4,0.6-0.8,1.1-1.2,1.7C29.6,120.6,30,120,30.4,119.5z"
}), /* @__PURE__ */ React25.createElement("path", {
  fill: "#7A129E",
  d: "M183.2,30.7c0.5,0.3,1,0.7,1.5,1C184.3,31.4,183.7,31.1,183.2,30.7z"
}), /* @__PURE__ */ React25.createElement("path", {
  fill: "#7A129E",
  d: "M210.2,29.2c0.6,0.3,1.1,0.6,1.7,0.8C211.3,29.8,210.8,29.5,210.2,29.2z"
}), /* @__PURE__ */ React25.createElement("path", {
  fill: "#7A129E",
  d: "M94.6,100.7c-0.4,0.5-0.7,1-1.1,1.5C93.9,101.7,94.2,101.2,94.6,100.7z"
}), /* @__PURE__ */ React25.createElement("path", {
  fill: "#7A129E",
  d: "M34.5,85.9c0.6-0.3,1.1-0.6,1.7-0.9C35.6,85.3,35,85.6,34.5,85.9z"
}), /* @__PURE__ */ React25.createElement("path", {
  fill: "#7A129E",
  d: "M36.1,85c0.6-0.3,1.1-0.5,1.7-0.8C37.2,84.4,36.7,84.7,36.1,85z"
}), /* @__PURE__ */ React25.createElement("path", {
  fill: "#CB8A22",
  d: "M312.2,200.9c-0.6,0.2-1.2,0.4-1.8,0.6C311,201.3,311.6,201.1,312.2,200.9z"
}), /* @__PURE__ */ React25.createElement("path", {
  fill: "#D1058C",
  d: "M221,41.5c-0.6-0.3-1.2-0.6-1.8-0.9C219.8,40.9,220.4,41.2,221,41.5z"
}), /* @__PURE__ */ React25.createElement("path", {
  fill: "#7A129E",
  d: "M91.3,130.2c0.3-0.6,0.5-1.1,0.8-1.7C91.8,129.1,91.6,129.7,91.3,130.2z"
}), /* @__PURE__ */ React25.createElement("path", {
  fill: "#AD15A3",
  d: "M115.1,71.1c0.5-0.1,1-0.2,1.5-0.3C116.1,70.9,115.6,71,115.1,71.1z"
}), /* @__PURE__ */ React25.createElement("path", {
  fill: "#D1058C",
  d: "M260.4,80c-0.3-0.3-0.5-0.6-0.8-0.8C259.9,79.5,260.1,79.8,260.4,80z"
}), /* @__PURE__ */ React25.createElement("path", {
  fill: "#D1058C",
  d: "M284.4,82.6c-0.3-0.3-0.6-0.6-0.9-0.9C283.8,82,284.1,82.3,284.4,82.6z"
}), /* @__PURE__ */ React25.createElement("path", {
  fill: "#7A129E",
  d: "M186.5,33.3c0.3,0.3,0.6,0.5,0.9,0.8C187,33.8,186.7,33.5,186.5,33.3z"
}), /* @__PURE__ */ React25.createElement("path", {
  fill: "#7A129E",
  d: "M96.1,98.9c-0.3,0.3-0.5,0.6-0.8,0.9C95.6,99.5,95.9,99.2,96.1,98.9z"
}), /* @__PURE__ */ React25.createElement("path", {
  fill: "#7A129E",
  d: "M95.3,99.8c-0.2,0.3-0.5,0.6-0.7,0.9C94.8,100.4,95.1,100.1,95.3,99.8z"
}), /* @__PURE__ */ React25.createElement("path", {
  fill: "#4A1EB0",
  d: "M79.7,315.8c0,0.1-0.1,0.2-0.1,0.3c0,0-0.1,0-0.2,0.1C79.5,316.1,79.6,316,79.7,315.8\n        C79.7,315.9,79.7,315.8,79.7,315.8z"
}), /* @__PURE__ */ React25.createElement("path", {
  fill: "#4A1EB0",
  d: "M273.5,319.2c-0.2-0.3-0.4-0.6-0.6-1C273.1,318.5,273.3,318.9,273.5,319.2z"
}), /* @__PURE__ */ React25.createElement("path", {
  fill: "#F4CA30",
  d: "M369.6,256.7c0.1-0.2,0.2-0.5,0.3-0.7C369.9,256.2,369.8,256.5,369.6,256.7z"
}), /* @__PURE__ */ React25.createElement("path", {
  fill: "#CB8A22",
  d: "M331,248.6c0.4,0.1,0.9,0.1,1.3,0.2C331.8,248.7,331.4,248.7,331,248.6z"
}), /* @__PURE__ */ React25.createElement("path", {
  fill: "#CA6F25",
  d: "M274.5,243.5c-0.4-0.1-0.8-0.2-1.3-0.4c0.2-0.2,0.4-0.4,0.6-0.6C274,242.9,274.2,243.2,274.5,243.5\n        C274.4,243.6,274.5,243.5,274.5,243.5z"
}), /* @__PURE__ */ React25.createElement("path", {
  fill: "#7A129E",
  d: "M180.7,28.3c0.3,0.3,0.6,0.6,0.9,0.8C181.3,28.9,181,28.6,180.7,28.3z"
}), /* @__PURE__ */ React25.createElement("path", {
  fill: "#7A129E",
  d: "M179.9,27.5c0.3,0.3,0.6,0.6,0.9,0.8C180.5,28.1,180.2,27.8,179.9,27.5z"
}), /* @__PURE__ */ React25.createElement("path", {
  fill: "#7A129E",
  d: "M179.1,26.7c0.3,0.3,0.6,0.6,0.8,0.8C179.6,27.3,179.3,27,179.1,26.7z"
}), /* @__PURE__ */ React25.createElement("path", {
  fill: "#4A1EB0",
  d: "M76.6,213.3c0.1-0.3,0.1-0.6,0.2-0.8C76.8,212.7,76.7,213,76.6,213.3z"
}), /* @__PURE__ */ React25.createElement("path", {
  fill: "#4A1EB0",
  d: "M185.1,361.2c0.1-0.3,0.1-0.7,0.2-1C185.2,360.5,185.1,360.9,185.1,361.2z"
}), /* @__PURE__ */ React25.createElement("path", {
  fill: "#AE4FDC",
  d: "M87.9,161.3c-0.2,0.3-0.4,0.6-0.6,0.8C87.5,161.9,87.7,161.6,87.9,161.3z"
}), /* @__PURE__ */ React25.createElement("path", {
  fill: "#AE4FDC",
  d: "M40.4,128.1c3.8-4.2,7.7-8.4,11.5-12.7c4.2-3.3,8.3-6.6,12.5-9.8c2.1-1.2,4.2-2.3,6.3-3.5\n        c0.7,2.7,4.3,4.5,2.4,8c-6.6,4.7-13.2,9.4-19.8,14.2c-0.5,0.3-1,0.6-1.5,1c0,0,0,0,0,0c-0.3,0.5-0.6,1-1,1.5c0,0,0,0,0,0\n        c-0.5,0.3-1,0.6-1.5,0.9c0,0,0,0,0,0c-0.3,0.5-0.6,1-1,1.5c0,0-0.1,0-0.1,0c-1,0.4-2,0.7-2.9,1.2c-1.3,0.6-2.5,1.3-3.7,2\n        C41.3,131,40.8,129.6,40.4,128.1z"
}), /* @__PURE__ */ React25.createElement("path", {
  fill: "#F3D965",
  d: "M27.3,211.2c2.7-10.4,5.3-20.7,8-31.1c0.3-1.3,1.1-2.4,2.6-3.4c-0.9,3.5-1.7,7-2.6,10.5\n        c-2.1,8.4-4.1,16.9-6.3,25.3c-0.3,1-1.2,1.9-1.9,2.8C27.3,214,27.3,212.6,27.3,211.2z"
}), /* @__PURE__ */ React25.createElement("path", {
  fill: "#6B4DDD",
  d: "M49.3,127.8c0.5-0.3,1-0.6,1.5-0.9C50.3,127.1,49.8,127.4,49.3,127.8z"
}), /* @__PURE__ */ React25.createElement("path", {
  fill: "#6B4DDD",
  d: "M51.8,125.3c0.5-0.3,1-0.6,1.5-1C52.8,124.7,52.3,125,51.8,125.3z"
}), /* @__PURE__ */ React25.createElement("path", {
  fill: "#6B4DDD",
  d: "M50.9,126.8c0.3-0.5,0.6-1,1-1.5C51.5,125.8,51.2,126.3,50.9,126.8z"
}), /* @__PURE__ */ React25.createElement("path", {
  fill: "#6B4DDD",
  d: "M48.4,129.2c0.3-0.5,0.6-1,1-1.5C49,128.2,48.7,128.7,48.4,129.2z"
}), /* @__PURE__ */ React25.createElement("path", {
  fill: "#070931",
  d: "M111.8,70.2C112,70,112.3,69.7,111.8,70.2C112.5,70,112.1,70.1,111.8,70.2C111.7,70.2,111.8,70.2,111.8,70.2z\n        "
}), /* @__PURE__ */ React25.createElement("path", {
  fill: "#F08734",
  d: "M245.7,185.2c0-3.4,0-6.9,0-10.3c-0.7-0.2-1.4-0.4-2.1-0.7c-2.1,3-4.2,6-6.4,9.2c-1.1-8.6,0.6-17.1,3.6-25.4\n        c1.2-0.4,2.5-0.6,3.5-1.4c4.3-3.3,8.6-6.7,12.9-10.1c3,6.5,7.6,11.5,14,14.8c5.7,2.7,11.4,5.3,17.2,8c-7.6,0.8-14.9,0.2-21.5-4.5\n        c4.2,6.1,10.7,8.2,16.7,11.3c-2.7,3-5.5,6.1-8.2,9.1c-6.9,0.6-11.7-2.3-15-8.4c-1.3-2.4-3.4-4.4-5.3-6.7c-6,9-2.7,22.4,6.2,27.4\n        c-0.6,1.9-1.1,3.8-1.7,5.8c-8.6-1.6-11.1-8.4-13.1-15.6C246.3,186.9,246,186.1,245.7,185.2z M252.4,153.3\n        c-7.5,3.8-11.2,11.6-9,18.9C246.4,165.8,249.3,159.8,252.4,153.3z"
}), /* @__PURE__ */ React25.createElement("path", {
  fill: "#070931",
  d: "M259.1,123.7c7.6,3.7,15.7,2.6,23.7,2.4c2.8,1.9,5.6,3.8,8.5,5.7c1.2,1.6,2.4,3.3,3.6,4.9l0,0\n        c0.3,0.6,0.6,1.1,0.9,1.7l0,0c0.5,0.8,1.1,1.7,1.6,2.5c0,0,0,0,0,0c4.1,4.8,8.2,9.5,12.4,14.3c4.4,4.8,8.9,9.6,13.3,14.4\n        c-6.1-2-11.4-4.8-17-6.7c-9-3-18.3-5.4-27.4-8.1c-2.2-1.3-4.5-2.4-6.5-3.8c-1.8-1.3-3.3-3-5-4.5c0.3-0.1,0.6-0.1,0.9-0.2\n        c0.2,0.2,0.5,0.3,0.7,0.3c0.6,0.3,1.1,0.6,1.7,0.9c4.7,1.8,9.5,3.6,14.2,5.4c0.1-0.3,0.2-0.6,0.2-1c-7-5.6-14-11.2-21-16.8\n        c-0.8-1.2-1.6-2.5-2.6-3.6C259.3,129.2,257.8,126.9,259.1,123.7z M265.2,130.4c2.8,3,5.3,5.6,7.6,8.1c1.5-3.1,2.8-5.6,4.1-8.1\n        C273.2,130.4,269.5,130.4,265.2,130.4z M289.1,146.7c2.9,0.6,5.2,1.1,7.5,1.6c-0.9-2-1.8-3.9-2.8-6.1\n        C292.1,143.8,290.9,145,289.1,146.7z M288.5,140.8c-0.4-2.8,0.2-5.9-4.1-4.7C283.9,139,284.4,141,288.5,140.8z"
}), /* @__PURE__ */ React25.createElement("path", {
  fill: "#F08734",
  d: "M300.9,105.5c5.4,4.2,7,10.5,8.9,16.6c1.5,4.9,3.3,9.8,5,14.6c-0.6,0.6-1.1,1.1-1.7,1.7\n        c-2.2-2.2-4.4-4.4-6.6-6.6c-1-1.1-2-2.2-3.1-3.2c-5.1-4.9-11.2-8-18.2-9.2c0.5-0.7,1-2.1,1.5-2.1c6.5,0.3,7.6-6,11.4-9\n        C299.1,107.5,299.9,106.5,300.9,105.5z"
}), /* @__PURE__ */ React25.createElement("path", {
  fill: "#C95227",
  d: "M267,146.6c1.7,1.5,3.2,3.2,5,4.5c2,1.5,4.3,2.6,6.5,3.8c-2.5,2.2-4.9,4.4-7.4,6.6c-6.4-3.2-11-8.3-14-14.8\n        c-3-7.3-3.2-14.5,0.6-21.5c0.3-0.5,0.9-0.9,1.4-1.3c-1.3,3.1,0.3,5.4,2.1,7.7c0.9,1.1,1.7,2.4,2.6,3.6c0,1.5-0.3,3.1,0.2,4.4\n        c0.8,2.1,2.1,4.1,3.2,6.1c0,0-0.2,0.2-0.2,0.2c-0.4,0.1-0.9,0.2-1.3,0.3C266.1,146.3,266.6,146.5,267,146.6L267,146.6z"
}), /* @__PURE__ */ React25.createElement("path", {
  fill: "#C95227",
  d: "M285.1,119.5c7,1.2,13.1,4.2,18.2,9.2c1.1,1,2.1,2.1,3.1,3.2c-1.9,1.4-3.8,2.7-5.7,4.1\n        c-1.1-0.8-2.1-1.7-3.2-2.5c0,0,0,0,0,0c-0.3-0.5-0.6-1-1-1.6c-5.1-5.5-11.4-8.3-18.8-9.1c-3-1.1-5.9-2.1-9.2-3.3\n        C274.2,119.5,279.7,119.5,285.1,119.5z"
}), /* @__PURE__ */ React25.createElement("path", {
  fill: "#C95227",
  d: "M272.8,93.2c1.9,0.5,3.8,1.1,5.7,1.6c5.8,2,10.9,4.9,14.4,11.7c-8.9-5-17.8-5.3-26.7-5.2c1-1.4,2-3,3.1-4.3\n        C270.4,95.7,271.6,94.5,272.8,93.2z"
}), /* @__PURE__ */ React25.createElement("path", {
  fill: "#F3D965",
  d: "M277.8,122.8c7.3,0.8,13.7,3.6,18.8,9.1c0.3,0.5,0.6,1,1,1.6c0,0,0,0,0,0c0.4,1.2,1.3,2.5,1.2,3.7\n        c0,1.3-0.9,2.6-1.4,3.8c0,0,0,0,0,0c-0.5-0.8-1.1-1.7-1.6-2.5c0,0,0,0,0,0c-0.3-0.6-0.6-1.1-0.9-1.7c0,0,0,0,0,0\n        c-1.2-1.6-2.4-3.3-3.6-4.9c-2.8-1.9-5.7-3.8-8.5-5.7c-3.6-0.6-7.1-1.1-10.7-1.7c-1.5-0.2-3-0.6-4.8-0.9\n        C271.1,123.2,274.4,123,277.8,122.8z"
}), /* @__PURE__ */ React25.createElement("path", {
  fill: "#F3D965",
  d: "M237.3,151.7c-0.9-5.8,4.3-12.1,12.2-15C245.6,141.6,243.2,147.9,237.3,151.7z"
}), /* @__PURE__ */ React25.createElement("path", {
  fill: "#F3D965",
  d: "M252.4,124.5c-5.6,4.6-10.5,8.5-15.9,12.9C236.3,131.5,242.8,126.4,252.4,124.5z"
}), /* @__PURE__ */ React25.createElement("path", {
  fill: "#070931",
  d: "M184.1,348.8c-0.4,0-0.7,0-1.1,0C183.4,348.8,183.7,348.8,184.1,348.8z"
}), /* @__PURE__ */ React25.createElement("path", {
  fill: "#F29F32",
  d: "M275.2,185.3c2.7-3,5.5-6.1,8.2-9.1c8,2.7,16.2,3.1,24.5,3.4c8.1,0.3,15.5,3.6,22.3,7.9\n        c-1.1,2-2.2,3.9-3.3,5.9c-8.6-2.5-16.8-1.1-25.1,1.8c-10.8,3.7-21.7,7-32.7,9.8c-2.9,0.7-6.4-1-9.6-1.6c0.6-1.9,1.1-3.8,1.7-5.8\n        c11,4.4,23,0,30.8-8.4c-7.9,1.1-15.6,2.2-23.2,3.2c0-0.2,0-0.5-0.1-0.7c4.5-1.5,8.9-3,13.4-4.5c-0.1-0.2-0.2-0.5-0.3-0.7\n        C279.7,186.1,277.4,185.7,275.2,185.3z M294.4,189c-0.1-0.1-0.2-0.2-0.3-0.2c-0.1,0-0.2,0.1-0.3,0.1c0.1,0.1,0.2,0.2,0.3,0.2\n        C294.2,189.1,294.3,189,294.4,189z"
}), /* @__PURE__ */ React25.createElement("path", {
  fill: "#F3D965",
  d: "M56.8,244.4c-1.4-4.1-2.9-8.2-4.3-12.2c-0.5-5.8-0.4-11.8-1.6-17.5c-1.5-7.3,0-14.1,1.3-22.2\n        c1.3,11.7,2.5,22.3,3.7,32.8c0.6,5.4,1.2,10.8,1.7,16.2C57.6,242.4,57.1,243.4,56.8,244.4z"
}), /* @__PURE__ */ React25.createElement("path", {
  fill: "#F4CA30",
  d: "M329.5,286.3c-0.1-0.1-0.2-0.2-0.4-0.4C329.2,286,329.4,286.2,329.5,286.3\n        C329.5,286.3,329.5,286.3,329.5,286.3z"
}), /* @__PURE__ */ React25.createElement("path", {
  fill: "#18ADF3",
  d: "M217.7,213.2c-0.2-0.3-0.5-0.6-0.7-1c0.2-0.1,0.3-0.2,0.5-0.2C217.6,212.4,217.7,212.8,217.7,213.2\n        C217.8,213.1,217.7,213.2,217.7,213.2z"
}), /* @__PURE__ */ React25.createElement("path", {
  fill: "#F3D965",
  d: "M79.7,144.9c-1.6-21.1,23-53.8,45.4-60c-6.7,6-13.3,11.1-18.9,17.1c-5.8,6.1-11.4,12.6-15.8,19.7\n        C86,128.8,83.3,136.8,79.7,144.9z"
}), /* @__PURE__ */ React25.createElement("path", {
  fill: "#D1058C",
  d: "M161,119.4c-0.8,1.1-1.5,2.3-2.3,3.4c-1.4-0.6-2.8-1.1-4.2-1.7c0.8-1.4,1.7-2.8,2.5-4.1\n        c3.6-4.4,7.1-8.9,10.7-13.3c0.6-0.7,1.5-1.1,2.2-1.6c0,0,0.3,0.3,0.3,0.3C167.1,108,164.1,113.7,161,119.4z"
}), /* @__PURE__ */ React25.createElement("path", {
  fill: "#D1058C",
  d: "M172.4,99.7c0,0.1-0.1,0.2-0.1,0.3c-0.1-0.1-0.2-0.2-0.3-0.3c0.1-0.1,0.2-0.2,0.3-0.2\n        C172.2,99.5,172.3,99.6,172.4,99.7z"
}), /* @__PURE__ */ React25.createElement("path", {
  fill: "#D1058C",
  d: "M170,102.1c0.2-0.1,0.4-0.2,0.5-0.3c-0.1,0.2-0.2,0.4-0.3,0.5C170.2,102.4,170,102.1,170,102.1z"
}), /* @__PURE__ */ React25.createElement("path", {
  fill: "#D1058C",
  d: "M181.6,134.2c-1.3,3.3-2.6,6.7-4,10c-2.3-0.4-4.5-0.7-6.8-1.1c0.6-1.6,1.2-3.2,1.8-4.7c3.3-5,6.5-10,9.8-14.9\n        c2-3,4.3-5.9,7.1-8.3C186.9,121.5,184.2,127.9,181.6,134.2z"
}), /* @__PURE__ */ React25.createElement("path", {
  fill: "#CA6F25",
  d: "M330.3,187.5c-6.8-4.4-14.2-7.6-22.3-7.9c-8.3-0.3-16.6-0.6-24.5-3.4c-5.9-3.1-12.5-5.2-16.7-11.3\n        c6.6,4.7,13.9,5.3,21.5,4.5c-5.7-2.7-11.4-5.3-17.2-8c2.5-2.2,4.9-4.4,7.4-6.6c9.2,2.7,18.4,5.1,27.4,8.1c5.6,1.9,11,4.7,17,6.7\n        c-4.4-4.8-8.9-9.6-13.3-14.4c-3-6.4-6-12.9-9-19.3c1.9-1.4,3.8-2.7,5.7-4.1c2.2,2.2,4.4,4.4,6.6,6.6c1.4,1.7,2.7,3.4,4.1,5\n        c7.1,7.7,14.2,15.3,21.3,22.9c2.4,2.1,4.7,4.3,7.1,6.4c-0.1,0.2-0.2,0.4-0.2,0.6c-2.3-0.7-4.5-1.4-6.8-2.1c-0.3-0.2-0.6-0.4-1-0.6\n        c0,0-0.1,0.2-0.2,0.3c0.4,0.1,0.7,0.3,1.1,0.4c3,2.7,6.1,5.5,9.1,8.2c0.2,2.1-0.3,3.5-2.4,4.8c-2.8,1.7-5,4.4-7.4,6.7\n        C335.2,189.8,332.8,188.7,330.3,187.5z"
}), /* @__PURE__ */ React25.createElement("path", {
  fill: "#F29F32",
  d: "M338.5,166.4c-7.1-7.6-14.2-15.3-21.3-22.9c-1.5-1.6-2.8-3.3-4.1-5c0.6-0.6,1.1-1.1,1.7-1.7\n        c8.5,9,16.9,18.1,25.4,27.1C339.6,164.7,339.1,165.5,338.5,166.4z"
}), /* @__PURE__ */ React25.createElement("path", {
  fill: "#F3D965",
  d: "M100.7,56.6C99.8,56.6,100,56.6,100.7,56.6C100,56.7,99.8,56.7,100.7,56.6z"
}), /* @__PURE__ */ React25.createElement("path", {
  fill: "#D1058C",
  d: "M118.2,120.2c0.9-1,1.7-2.1,2.6-3.1c5.6-5.2,12-9.2,18.8-12.6c0.3,0.3,0.5,0.6,0.8,0.8c-1.3,2-2.6,4-4,6\n        c-3,4.4-6,8.7-9,13.1C124.3,123,121.3,121.6,118.2,120.2z"
}), /* @__PURE__ */ React25.createElement("path", {
  fill: "#18ADF3",
  d: "M151.9,217.3c0.1-0.5,0.2-1.1,0.2-1.6c0.5-0.5,1.1-1,1.7-1.5c0.5,0.9,0.9,1.6,1.2,2.3\n        c-1.8,6.9-3.7,13.8-5.5,20.6C150.3,230.4,151.1,223.8,151.9,217.3z"
}), /* @__PURE__ */ React25.createElement("path", {
  fill: "#318DEF",
  d: "M116.5,183.6c1.4-2.5,2.8-4.9,4.2-7.4c2,1.4,3.9,2.8,5.9,4.2c-2.2,3.1-4.3,6.1-6.5,9.2\n        c-0.2-2.7-2.6-2.7-4.3-3.5C116,185.2,116.3,184.4,116.5,183.6z"
}), /* @__PURE__ */ React25.createElement("path", {
  fill: "#F36CB1",
  d: "M170.8,143.2c2.3,0.4,4.5,0.7,6.8,1.1c-1.6,7.1-3.3,14.2-4.9,21.3c-3.6-0.5-7.3-1.1-10.9-1.6\n        c0.1-1.3,0.2-2.7,0.4-4c1.8-3.6,3.6-7.2,5.4-10.7C168.6,147.1,169.7,145.2,170.8,143.2z"
}), /* @__PURE__ */ React25.createElement("path", {
  fill: "#A4B2F4",
  d: "M152.8,208.3c0.3-2.8,0.6-5.5,0.9-8.3c0.8-4.1,1.5-8.2,2.3-12.3c1.3,0.5,2.6,1.1,4,1.6\n        c-1.2,6.6-2.4,13.2-3.6,19.8C155.2,208.8,154,208.6,152.8,208.3z"
}), /* @__PURE__ */ React25.createElement("path", {
  fill: "#318DEF",
  d: "M87.4,290c-0.9-15-1.7-30-2.6-45C90.8,259.8,92.7,274.8,87.4,290z"
}), /* @__PURE__ */ React25.createElement("path", {
  fill: "#ECACE3",
  d: "M149.5,147.4c-2.2,5.8-4.3,11.5-6.5,17.3c-3.8-2.2-7.7-4.4-11.5-6.6c3.3-5.2,6.6-10.4,9.8-15.7\n        C145.3,142.1,147,145.4,149.5,147.4z"
}), /* @__PURE__ */ React25.createElement("path", {
  fill: "#F36CB1",
  d: "M149.5,147.4c-2.5-2.1-4.2-5.4-8.2-5c1.1-2.4,2.3-4.9,3.4-7.3c2.2-3,4.3-5.9,6.5-8.9c1.2-1.6,2.2-3.4,3.3-5\n        c1.4,0.6,2.8,1.1,4.2,1.7c-2.2,6-4.4,12-6.6,18C151.2,143,150.3,145.2,149.5,147.4z"
}), /* @__PURE__ */ React25.createElement("path", {
  fill: "#A4B2F4",
  d: "M93.6,169.6c0.8-2.2,1.6-4.4,2.3-6.5c1.2-3.3,2.3-6.6,3.5-9.9c1.4,1.4,2.8,2.9,4.2,4.3\n        c-2.5,5-4.8,9.9-7.4,14.8c-0.5,0.9-1.7,1.5-2.5,2.2C93.7,172.9,93.6,171.3,93.6,169.6z"
}), /* @__PURE__ */ React25.createElement("path", {
  fill: "#D1058C",
  d: "M86.3,90.7c-1.1,0.6-2.1,1.2-3.2,1.8c-1.2-1.4-2.3-2.9-3.5-4.3c3.1-1.6,6.2-3.2,9.2-4.8\n        c2.6,1.3,1.7,3,0.5,4.6C88.6,89,87.4,89.8,86.3,90.7z"
}), /* @__PURE__ */ React25.createElement("path", {
  fill: "#318DEF",
  d: "M131.5,300.6c-1.4-6.8-2.8-13.7-4.2-20.5c0.6-0.1,1.1-0.2,1.7-0.4c1.4,6.9,2.8,13.7,4.3,20.6\n        C132.7,300.4,132.1,300.5,131.5,300.6z"
}), /* @__PURE__ */ React25.createElement("path", {
  fill: "#ECACE3",
  d: "M103.6,157.5c-1.4-1.4-2.8-2.9-4.2-4.3c2.5-5.7,5-11.4,7.5-17.1c5,0.4,9.6,1.8,13.1,5.7\n        c-3.3,6.5-6.5,13.1-9.8,19.6c-1.1-0.3-2.2-0.6-3.3-0.8c2.8-6.3,5.5-12.5,8.3-18.8c-0.2-0.1-0.4-0.2-0.6-0.4\n        C110.9,146.7,107.2,152.1,103.6,157.5z"
}), /* @__PURE__ */ React25.createElement("path", {
  fill: "#F36CB1",
  d: "M119.9,141.8c-3.5-3.9-8.1-5.3-13.1-5.7c0.5-1.1,1.1-2.3,1.6-3.4c3.3-4.2,6.5-8.3,9.8-12.5\n        c3,1.4,6.1,2.8,9.1,4.2c-1.9,4.9-3.9,9.9-5.8,14.8C121,140.1,120.5,140.9,119.9,141.8z"
}), /* @__PURE__ */ React25.createElement("path", {
  fill: "#A4B2F4",
  d: "M106.8,160.5c1.1,0.3,2.2,0.6,3.3,0.8c-1.7,3.4-3.3,6.9-5.2,10.1c-0.5,0.8-2,1.1-3,1.6\n        C103.5,168.9,105.2,164.7,106.8,160.5z"
}), /* @__PURE__ */ React25.createElement("path", {
  fill: "#318DEF",
  d: "M152.8,208.3c1.2,0.3,2.3,0.5,3.5,0.8c-0.4,2.4-0.9,4.8-1.3,7.3c-0.4-0.7-0.7-1.4-1.2-2.3\n        c-0.6,0.6-1.1,1-1.7,1.5C152.4,213.2,152.6,210.7,152.8,208.3z"
}), /* @__PURE__ */ React25.createElement("path", {
  fill: "#F36CB1",
  d: "M79.6,88.2c1.2,1.4,2.3,2.9,3.5,4.3c-4.2,3.2-8.3,6.5-12.5,9.7c-2.1,1.2-4.2,2.3-6.3,3.5\n        c-1.7-3.4-3.5-6.8-5.2-10.2c1.9-1,3.9-2,5.8-2.9C69.9,91,74.8,89.6,79.6,88.2z"
}), /* @__PURE__ */ React25.createElement("path", {
  fill: "#ECACE3",
  d: "M59.1,95.4c1.7,3.4,3.5,6.8,5.2,10.2c-4.2,3.3-8.3,6.6-12.5,9.8c-0.9-0.6-1.8-1.2-2.7-1.8\n        c1.4-1.7,2.8-3.3,4.2-5c-0.2-0.2-0.4-0.5-0.6-0.7c-1.7,1.1-3.4,2.2-5.1,3.3c-0.8-2.2-1.7-4.4-2.5-6.6\n        C49.8,101.6,54.5,98.5,59.1,95.4z"
}), /* @__PURE__ */ React25.createElement("path", {
  fill: "#A4B2F4",
  d: "M45.2,104.7c0.8,2.2,1.7,4.4,2.5,6.6c-4.4,4.1-8.8,8.2-13.2,12.3c-0.9-1.4-1.8-2.7-2.6-4.1\n        c2.8-3.5,5.6-7,8.4-10.5C41.9,107.5,43.5,106.1,45.2,104.7z"
}), /* @__PURE__ */ React25.createElement("path", {
  fill: "#070931",
  d: "M38.6,130.2c0.3-0.4,0.6-0.8,0.9-1.2C39.1,129.4,38.9,129.8,38.6,130.2z"
}), /* @__PURE__ */ React25.createElement("path", {
  fill: "#F3D965",
  d: "M275.2,185.3c2.2,0.4,4.4,0.8,6.6,1.1c0.1,0.2,0.2,0.5,0.3,0.7c-4.5,1.5-8.9,3-13.4,4.5c0,0.2,0,0.5,0.1,0.7\n        c7.6-1.1,15.2-2.1,23.2-3.2c-7.8,8.4-19.8,12.8-30.8,8.4c-8.9-5-12.2-18.4-6.2-27.4c1.9,2.3,4,4.3,5.3,6.7\n        C263.5,183,268.3,185.9,275.2,185.3z"
}), /* @__PURE__ */ React25.createElement("path", {
  fill: "#F3D965",
  d: "M252.4,153.3c-3.1,6.5-6,12.5-9,18.9C241.1,164.9,244.9,157.1,252.4,153.3z"
}), /* @__PURE__ */ React25.createElement("path", {
  fill: "#EE7636",
  d: "M267.2,145.6c-1.1-2-2.4-4-3.2-6.1c-0.5-1.3-0.2-2.9-0.2-4.4c7,5.6,14,11.2,21,16.8c-0.1,0.3-0.2,0.6-0.2,1\n        c-4.7-1.8-9.5-3.6-14.2-5.4c-0.6-0.3-1.1-0.6-1.7-0.9c-0.3,0-0.5-0.1-0.7-0.3C267.7,146.1,267.4,145.9,267.2,145.6z"
}), /* @__PURE__ */ React25.createElement("path", {
  fill: "#F08734",
  d: "M300.7,135.9c3,6.4,6,12.9,9,19.3c-4.1-4.8-8.2-9.5-12.4-14.3c0.5-1.3,1.4-2.5,1.4-3.8\n        c0-1.2-0.8-2.5-1.2-3.7C298.6,134.2,299.6,135.1,300.7,135.9z"
}), /* @__PURE__ */ React25.createElement("path", {
  fill: "#F3D965",
  d: "M265.2,130.4c4.3,0,8,0,11.7,0c-1.2,2.5-2.5,5-4.1,8.1C270.5,136,268,133.4,265.2,130.4z"
}), /* @__PURE__ */ React25.createElement("path", {
  fill: "#ECACE3",
  d: "M289.1,146.7c1.8-1.7,3.1-2.9,4.8-4.5c1,2.1,1.9,4.1,2.8,6.1C294.3,147.8,292,147.3,289.1,146.7z"
}), /* @__PURE__ */ React25.createElement("path", {
  fill: "#F08734",
  d: "M291.3,131.9c1.2,1.6,2.4,3.3,3.6,4.9C293.7,135.2,292.5,133.5,291.3,131.9z"
}), /* @__PURE__ */ React25.createElement("path", {
  fill: "#F08734",
  d: "M295.7,138.4c0.5,0.8,1.1,1.7,1.6,2.5C296.8,140.1,296.3,139.3,295.7,138.4z"
}), /* @__PURE__ */ React25.createElement("path", {
  fill: "#F08734",
  d: "M294.9,136.8c0.3,0.6,0.6,1.1,0.9,1.7C295.5,137.9,295.2,137.3,294.9,136.8z"
}), /* @__PURE__ */ React25.createElement("path", {
  fill: "#C95227",
  d: "M268.6,146.7c0.6,0.3,1.1,0.6,1.7,0.9C269.7,147.2,269.2,146.9,268.6,146.7z"
}), /* @__PURE__ */ React25.createElement("path", {
  fill: "#C95227",
  d: "M267.2,145.6c0.2,0.3,0.4,0.5,0.7,0.8c-0.3,0.1-0.6,0.1-0.9,0.2c0,0,0.1,0,0.1,0c0-0.3,0-0.5-0.1-0.8\n        L267.2,145.6z"
}), /* @__PURE__ */ React25.createElement("path", {
  fill: "#070931",
  d: "M267,145.8c0.1,0.3,0.1,0.5,0.1,0.8c-0.5-0.2-0.9-0.3-1.4-0.5C266.1,146.1,266.6,145.9,267,145.8z"
}), /* @__PURE__ */ React25.createElement("path", {
  fill: "#F08734",
  d: "M297.5,133.4c-0.3-0.5-0.6-1-1-1.6C296.8,132.4,297.2,132.9,297.5,133.4z"
}), /* @__PURE__ */ React25.createElement("path", {
  fill: "#F3D965",
  d: "M294.4,189c-0.1,0.1-0.2,0.2-0.3,0.1c-0.1,0-0.2-0.1-0.3-0.2c0.1-0.1,0.2-0.1,0.3-0.1\n        C294.2,188.8,294.3,188.9,294.4,189z"
}), /* @__PURE__ */ React25.createElement("path", {
  fill: "#F4B731",
  d: "M338.5,171.3c-0.4-0.1-0.7-0.3-1.1-0.4c0.1-0.1,0.2-0.3,0.2-0.3C337.9,170.8,338.2,171,338.5,171.3\n        C338.5,171.2,338.5,171.3,338.5,171.3z"
})));
var lydia_finance_default = LydiaFinanceIcon;

// src/searchbar/icons/oliveswap.tsx
import React26 from "react";
var OliveSwapIcon = ({ height, width }) => /* @__PURE__ */ React26.createElement(abstract_default, {
  height: height != null ? height : 16,
  width: width != null ? width : 16,
  viewBox: "0 0 384 384"
}, /* @__PURE__ */ React26.createElement("g", {
  transform: "translate(0)"
}, /* @__PURE__ */ React26.createElement("circle", {
  cx: "192",
  cy: "192",
  r: "192",
  fill: "#B18856"
}), /* @__PURE__ */ React26.createElement("path", {
  d: "M309.715 205.053C305.937 173.745 290.134 142.934 265.486 118.185C240.737 93.4365 209.926 77.7325 178.618 73.9562C146.911 70.1799 118.486 78.9263 98.6073 98.7051C78.7284 118.484 69.982 146.909 73.8584 178.716C77.6347 210.023 93.4388 240.834 118.088 265.583C142.837 290.33 173.648 306.034 204.955 309.813C209.825 310.408 214.696 310.706 219.367 310.706C245.21 310.706 268.168 301.861 284.866 285.064C304.845 265.185 313.589 236.76 309.715 205.053V205.053Z",
  fill: "#8BC34A"
}), /* @__PURE__ */ React26.createElement("path", {
  d: "M166.093 102.78C160.229 97.0145 151.384 95.2256 141.146 97.7116C131.704 100.096 122.064 105.761 113.913 113.912C96.2212 131.704 91.3512 154.564 102.782 166.093C106.955 170.266 112.721 172.255 119.081 172.255C130.213 172.255 143.632 166.191 154.862 154.86C163.012 146.811 168.777 137.169 171.163 127.727C173.647 117.49 171.858 108.644 166.093 102.78V102.78Z",
  fill: "#558B2F"
}), /* @__PURE__ */ React26.createElement("path", {
  d: "M219.468 310.608C214.796 310.608 209.926 310.31 205.056 309.713C173.748 305.936 142.935 290.233 118.188 265.484C93.4392 240.735 77.7352 209.924 73.9589 178.616C70.0825 146.909 78.9273 118.484 98.706 98.6054C118.487 78.7283 147.012 69.9818 178.716 73.8583C210.024 77.6346 240.837 93.3385 265.584 118.086C290.333 142.835 306.037 173.646 309.813 204.955C313.69 236.66 304.845 265.087 285.065 284.964C268.169 301.762 245.309 310.608 219.468 310.608ZM164.305 83.0015C141.048 83.0015 120.572 90.8526 105.764 105.761C88.1706 123.354 80.3195 148.899 83.7974 177.522C87.3771 206.644 102.086 235.368 125.244 258.526C148.402 281.684 177.126 296.395 206.248 299.973C234.873 303.551 260.317 295.7 278.009 278.006C295.7 260.315 303.453 234.871 299.973 206.247C296.395 177.125 281.687 148.402 258.528 125.243C235.37 102.085 206.647 87.3747 177.524 83.7968C172.953 83.1998 168.58 83.0015 164.305 83.0015V83.0015Z",
  fill: "black"
}), /* @__PURE__ */ React26.createElement("path", {
  d: "M286.356 221.851C283.674 221.851 281.486 219.764 281.388 217.079C280.194 190.641 266.976 162.811 244.912 140.847C242.922 138.86 242.922 135.778 244.912 133.789C246.899 131.802 249.98 131.802 251.967 133.789C275.723 157.545 290.034 187.66 291.326 216.582C291.427 219.365 289.339 221.653 286.556 221.751C286.456 221.851 286.456 221.851 286.356 221.851V221.851Z",
  fill: "black"
}), /* @__PURE__ */ React26.createElement("path", {
  d: "M119.181 172.255C112.72 172.255 107.055 170.266 102.88 166.093C91.3511 154.564 96.2211 131.704 113.912 113.912C122.064 105.761 131.704 99.9974 141.047 97.7116C151.284 95.2256 160.229 97.0145 165.995 102.78C171.758 108.545 173.647 117.49 171.063 127.727C168.777 137.169 163.012 146.811 154.962 154.96C143.632 166.191 130.312 172.255 119.181 172.255H119.181ZM149.794 106.556C147.408 106.556 145.122 106.955 143.431 107.352C135.879 109.241 127.827 114.111 120.97 120.968C107.652 134.286 102.582 151.779 109.838 159.035C117.094 166.291 134.587 161.223 147.905 147.903C154.762 141.045 159.632 132.994 161.521 125.341C162.515 121.465 163.41 114.211 159.037 109.838C156.551 107.352 153.073 106.556 149.794 106.556V106.556Z",
  fill: "black"
})));
var oliveswap_default = OliveSwapIcon;

// src/searchbar/icons/pandaswap.tsx
import React27 from "react";
var PandaSwapIcon = ({ height, width }) => /* @__PURE__ */ React27.createElement(abstract_default, {
  height: height != null ? height : 16,
  width: width != null ? width : 16,
  viewBox: "0 0 400 400"
}, /* @__PURE__ */ React27.createElement("g", {
  transform: "translate(0)"
}, /* @__PURE__ */ React27.createElement("path", {
  fill: "#010101",
  d: "M77.2,39c1.7,0,3.4,0,5.1,0c1,0.2,2,0.3,2.9,0.5c8,1.5,14.5,5.7,19.6,12c2.4,3,4.3,6.3,5.7,9.9\n    c0.3-0.1,0.5-0.2,0.7-0.4c11-6.7,22.8-11.5,35.2-14.9c16.2-4.5,32.8-6.5,49.5-7c2.7,0,5.3,0,8,0c3.5,0.2,6.9,0.3,10.4,0.6\n    c10.1,0.7,20.1,2,30,4.2c13.2,2.9,25.9,7.1,37.8,13.4c2.4,1.3,4.8,2.7,7.2,4c0.8-1.6,1.5-3.3,2.4-4.9c5-8.6,12.1-14.6,22-16.8\n    c1.2-0.3,2.4-0.4,3.7-0.7c1.7,0,3.4,0,5.1,0c0.1,0.1,0.2,0.2,0.3,0.2c4.8,0.4,9.3,1.9,13.4,4.3c10.9,6.4,18.6,15.6,23.7,27.1\n    c3.2,7.3,4,15,2,22.9c-2.3,8.9-7.6,15.7-15,20.9c-2.8,1.9-5.8,3.5-8.8,5.3c0-0.1,0,0.1,0.1,0.2c4.4,10.6,7.7,21.5,10.1,32.7\n    c1.5,7,0.5,5.4,5.1,12.2c1.9,2.8,3.1,5.8,3.7,9.1c1,4.7,0.6,9.4,0.3,14.1c-0.2,3-0.5,6.1,0.1,9.1c0.4,2,0.7,4,0.9,6.1\n    c0.9,8.2,1.8,16.5,2.5,24.7c0.7,8.7,1.3,17.5,1.9,26.2c0.7,11.4,1.5,22.7,2.9,34.1c0.9,7.3,2.1,14.6,4,21.7c0.3,1.2,0.7,2.3,2.1,2.4\n    c0.2,0,0.5,0.2,0.7,0.3c3.4,1.4,6,3.8,8.4,6.6c4,4.7,6.8,10,7.6,16.1c0.2,1.1,0.3,2.3,0.5,3.4c0,2.1,0,4.2,0,6.2\n    c-0.1,0.2-0.2,0.3-0.2,0.5c-0.9,7.1-4.8,11.5-11.7,13.2c-1,0.3-2,0.4-3.1,0.6c-1.5,0-3,0-4.5,0c-0.9-0.2-1.8-0.4-2.7-0.6\n    c-8.8-2.3-16-10-16.7-21.1c-0.2-2.9-0.4-5.7-1.3-8.4c-0.4-1.2-0.7-2.4-1-3.6c-2.3-9.1-4.2-18.4-5.5-27.7c-0.8-5.5-1.4-11-2.1-16.5\n    c-0.1-1.3-0.3-2.6-0.3-3.9c-0.3-4-0.5-8-0.8-12c0-0.9-0.1-1.9-0.1-2.8c-0.4-11.3-0.8-22.6-1.2-33.8c-0.1-2.2-0.2-4.4-0.3-6.6\n    c0-0.3,0-0.5,0-0.8c-0.2-4.5-0.3-9-0.7-13.5c-0.4-6-1.1-12-1.6-18.1c-0.2-2.6-1.4-4.5-3.8-5.5c-2-0.8-4.1-1.6-6.3-1.9\n    c-5.3-0.8-10.7-1.3-16.1-1.9c-4.8-0.6-9.6-1.5-14.1-3.5c-5-2.3-10.1-4.5-15.1-7c-10.2-5.1-20.9-8.4-32.2-9.6c-0.3,0-0.7,0-1,0.2\n    c-4.8,2.6-9.9,4.4-15,6c-7.1,2.2-14.1,2.1-21-0.7c-4.1-1.7-7.5-4.2-10.3-7.6c-0.1,0.1-0.2,0.1-0.3,0.2c-7.2,8.2-16.4,10.9-26.9,9.1\n    c-6-1-11.8-3.2-17.2-6c-2-1-3.8-1.3-5.8-0.8c-0.2,0.1-0.5,0.1-0.7,0.1c-7.4,1-14.6,2.7-21.4,5.8c-5.9,2.7-11.7,5.3-17.5,8.1\n    c-6.7,3.3-13.8,5.3-21.3,6c-4.7,0.4-9.4,1-14,1.7c-2.5,0.3-4.9,1-7,2.3c-1.6,0.9-2.7,2.2-2.9,4.2c-0.2,2.1-0.5,4.1-0.7,6.2\n    c-0.4,5.2-0.9,10.5-1.2,15.7c-0.2,3.5-0.3,7-0.5,10.6c0,0.3,0,0.6,0,0.9c0,1-0.1,1.9-0.1,2.9c0,0.7,0,1.4-0.1,2.1\n    c0,0.8-0.1,1.5-0.1,2.3c0,1.2-0.1,2.4-0.1,3.6c0,0.4,0,0.9-0.1,1.3c0,0.6,0,1.3,0,1.9c0,0.3,0,0.6,0,0.9c0,0.6,0,1.3-0.1,1.9\n    c0,0.3,0,0.6-0.1,1c0,0.6,0,1.3-0.1,1.9c0,0.4,0,0.8,0,1.1c0,0.7,0,1.4-0.1,2.1c0,0.4,0,0.8-0.1,1.2c0,1.5-0.1,3-0.1,4.5\n    c0,0.5-0.1,1-0.1,1.5c0,1.1-0.1,2.3-0.1,3.4c0,0.7-0.1,1.4-0.1,2.1c0,0.7-0.1,1.5-0.1,2.2c0,0.9-0.1,1.8-0.1,2.7\n    c0,0.4,0,0.7-0.1,1.1c0,0.5-0.1,1-0.1,1.5c-0.1,1.4-0.1,2.9-0.2,4.3c-0.1,1.1-0.2,2.1-0.2,3.2c-0.2,2.8-0.5,5.6-0.7,8.4\n    c-0.7,5.5-1.3,11.1-2.1,16.6c-1.6,11.4-4,22.7-7.2,33.8c-0.3,1.2-0.4,2.5-0.5,3.8c-0.2,2-0.2,4-0.7,5.9c-2.1,8.8-7.4,14.7-16.2,17.3\n    c-1,0.3-2,0.4-3.1,0.7c-1.5,0-3,0-4.5,0c-0.8-0.2-1.6-0.4-2.4-0.6c-6.4-1.5-10.8-5.9-11.7-12c-0.7-4.2-0.5-8.5,0.3-12.7\n    c1.2-6.6,4.6-12.1,9.2-16.8c2.4-2.4,5.1-4.3,8.4-5.3c0.3-0.1,0.5-0.5,0.6-0.8c2-6.9,3.3-13.9,4.1-21c0.8-7.3,1.6-14.6,2.1-22\n    c0.7-9.3,1.2-18.6,1.9-27.9c0.4-5,0.8-10,1.2-15.1c0.4-4.2,0.8-8.5,1.3-12.7c0.4-3.8,0.7-7.6,1.3-11.4c0.6-4,1.1-8,0.7-12\n    c-0.2-2.4-0.4-4.9-0.4-7.3c-0.1-4.1,0.4-8,1.8-11.9c1.1-2.9,2.9-5.4,4.6-8c1.1-1.5,1.8-3.1,2.2-5c2-10.1,4.6-19.9,8.1-29.6\n    c1-2.6,2-5.2,3-7.8c-0.3-0.1-0.5-0.3-0.8-0.4c-3.9-1.7-7.4-3.9-10.7-6.6C37.9,102,33.8,86.9,39.4,71.8c3.5-9.3,9.5-16.9,16.9-23.4\n    c4.8-4.1,10.2-7.2,16.4-8.6C74.2,39.5,75.7,39.2,77.2,39z M199.9,150.3c0.1,0.1,0.2,0.3,0.3,0.4c1.6,4.5,4.7,7.7,8.8,10.1\n    c5.7,3.4,11.8,4.1,18.1,2.8c5.2-1.1,10.1-2.9,14.9-5.2c4.5-2.1,8.6-4.6,11.8-8.5c3.9-4.7,4.3-10.2,1-15.3c-1.8-2.8-4.2-5.2-6.8-7.3\n    c-6.1-4.9-12.6-9.2-19.2-13.3c-4.3-2.7-8.8-5-13.6-6.8c-0.6-0.2-1-0.2-1.5,0.2c-0.5,0.4-1.1,0.8-1.7,1.2c-1.7,1-3.4,2.1-5.2,3\n    c-4.5,2.3-9,2.3-13.5,0c-1.8-0.9-3.7-1.9-5.2-3.2c-1.8-1.5-3.3-1.4-5.3-0.5c-12,5.4-22.7,12.8-32.8,21.2c-2.1,1.8-3.9,3.9-5.3,6.4\n    c-2.4,4.4-2.3,8.7,0.5,12.8c0.9,1.3,2,2.6,3.2,3.7c4.7,4.3,10.5,6.9,16.4,9c4.3,1.5,8.5,3,13.2,3c6.2,0,11.8-1.7,16.5-5.8\n    C197,156.1,199,153.6,199.9,150.3z M200.3,43.7c-0.4,0-0.8,0-1.1,0c-11.2,0.3-22.3,1.1-33.3,3c-11.5,1.9-22.7,4.8-33.6,9.1\n    C106.1,66.2,86,83.6,72.4,108.3c-7.9,14.4-13,29.8-16.3,45.8c-0.9,4.6-2.4,8.8-5.3,12.5c-1.2,1.6-2,3.5-2.7,5.3\n    c-1.6,4.5-1.5,9.1-1.1,13.7c0.4,5,0.6,9.9,0,14.9c-0.8,6.8-1.9,13.5-2.6,20.3c-0.8,7-1.3,14.1-1.8,21.2c-0.5,6.2-0.8,12.3-1.2,18.5\n    c-0.6,7.4-1.1,14.9-1.8,22.3c-0.6,5.8-1.4,11.5-2.4,17.3c-0.6,3.8-1.6,7.5-2.3,11.2c6.6,1.5,10.3,6.3,13,12.2\n    c0.1-0.4,0.2-0.7,0.3-0.9c4.4-17.3,6.8-34.9,7.9-52.6c0.6-10.3,1-20.6,1.3-30.9c0.5-16.4,1.1-32.8,2.8-49.2\n    c0.6-5.4,3.2-8.9,8.3-10.6c1.8-0.6,3.7-1.2,5.6-1.5c5.7-0.8,11.5-1.4,17.2-2.1c4.2-0.5,8.3-1.3,12.2-3.1c5.4-2.5,10.9-5,16.3-7.5\n    c6.3-2.9,12.7-5.7,19.5-7.2c2.6-0.6,5.3-1,7.7-1.5c-1-1.1-2-2.2-3-3.4c-4.2-5-5.9-10.5-3.5-16.8c1.5-4,4.3-7.1,7.3-9.9\n    c4.3-3.9,9.1-7.1,13.9-10.3c6.5-4.4,13.2-8.6,20.6-11.6c0.1,0,0.1-0.1,0.2-0.2c-1.8-2.8-1.5-4.9,1.1-6.9c1-0.8,2.2-1.5,3.4-1.9\n    c8.1-3.2,16.4-3.3,24.6-0.6c2.1,0.7,4.1,1.6,5.7,3.2c1.9,1.8,2,3.8,0.5,5.9c-0.1,0.1-0.1,0.2-0.2,0.4c1.4,0.6,2.8,1.2,4.1,1.8\n    c9.9,4.9,19,11.1,27.7,17.7c3.3,2.5,6.3,5.5,8.5,9c2.8,4.5,3.7,9.2,1.8,14.2c-1.3,3.5-3.6,6.2-6.3,8.6c-0.2,0.2-0.5,0.4-0.9,0.7\n    c5.8,0.8,11.4,1.9,16.7,4.1c7,2.9,14,6,20.8,9.3c7.6,3.7,15.4,5.9,23.8,6.5c4.7,0.4,9.3,1,13.9,1.9c4.1,0.7,7.9,2.3,10.3,5.9\n    c0.5,1.4,1.1,2.9,1.3,4.4c0.6,5.2,1.1,10.4,1.5,15.6c0.4,5.6,0.7,11.2,1,16.8c0.3,6.6,0.4,13.1,0.6,19.7c0.1,2.4,0.1,4.7,0.2,7.1\n    c0.2,5.2,0.4,10.4,0.7,15.6c0.2,3.5,0.3,6.9,0.6,10.4c0.4,4.4,0.8,8.8,1.3,13.1c0.5,4,0.9,8.1,1.6,12.1c1.1,6.2,2.3,12.4,3.5,18.6\n    c0.4,2.1,1,4.2,1.5,6.4c2.8-6,6.4-10.9,13-12.3c-1.1-5.5-2.3-10.9-3.1-16.3c-1-6.6-1.6-13.3-2.3-20c-0.5-5.1-0.8-10.3-1.2-15.4\n    c-0.4-5.7-0.7-11.5-1.1-17.2c-0.4-5.5-0.8-11-1.3-16.5c-0.4-4.2-0.8-8.5-1.4-12.7c-0.6-5-1.5-10-1.8-15c-0.3-3.9,0-7.9,0.1-11.9\n    c0-3.3,0.3-6.5,0-9.8c-0.3-4.1-2-7.8-4.6-11.1c-1.7-2.2-3.1-4.6-3.6-7.4c-0.7-3.3-1.3-6.5-2.1-9.8c-3.2-13.3-7.7-26.1-14.1-38.3\n    c-7.9-14.8-18.3-27.6-31.7-37.8c-17-13-36.4-20.3-57.1-24.4c-4.4-0.9-8.8-1.5-13.2-2.1c-3.6-0.5-7.2-0.8-10.8-1.1\n    c-2.3-0.2-4.6-0.4-6.9-0.5C205.9,43.8,203.1,43.8,200.3,43.7z M66,110.4c0.9-1.7,1.8-3.3,2.7-4.9C73.4,97,79,89.1,85.6,81.9\n    c4.9-5.3,10.1-10.1,15.9-14.4c0.5-0.4,0.6-0.7,0.4-1.2c-1.2-2.2-2.1-4.5-3.6-6.5c-4.5-6.3-10.5-10-18.3-10.6\n    c-4.7-0.3-9.1,0.9-13.2,3.1c-4.1,2.2-7.5,5.1-10.5,8.6c-3.2,3.7-6,7.7-7.8,12.3c-3.2,8-3.1,15.8,1.2,23.4c2.8,5,6.9,8.8,11.9,11.5\n    C63,108.9,64.5,109.6,66,110.4z M333.8,110.2c0.3-0.1,0.6-0.2,0.9-0.3c4.8-2.1,9-4.9,12.4-9c6.3-7.6,8-16.1,5.1-25.5\n    c-1.5-4.8-4.1-9-7.3-12.9c-3.9-4.7-8.3-8.8-14-11.2c-5.8-2.5-11.7-3-17.6-0.7c-7.6,2.8-12.4,8.4-15.4,15.8c-0.2,0.5-0.1,0.8,0.4,1.2\n    c6.1,4.5,11.7,9.7,16.8,15.3c5.3,5.8,9.9,12.1,13.9,18.9C330.6,104.5,332.2,107.3,333.8,110.2z"
}), /* @__PURE__ */ React27.createElement("path", {
  fill: "#8F8F8F",
  d: "M195.9,39.1c0-0.1,0-0.1,0-0.2c2.6,0,5.3,0,7.9,0c0,0.1,0,0.1,0,0.2C201.3,39.1,198.6,39.1,195.9,39.1z"
}), /* @__PURE__ */ React27.createElement("path", {
  fill: "#FEFBF5",
  d: "M61.5,255.5c0-1.1,0.1-2.3,0.1-3.4c0.6-0.5,0.4-1,0.1-1.5c0-1.5,0.1-3,0.1-4.5c0-0.4,0-0.8,0.1-1.2\n    c0-0.7,0-1.4,0.1-2.1c0-0.4,0-0.8,0-1.1c0-0.6,0-1.3,0.1-1.9c0-0.3,0-0.6,0.1-1c0-0.6,0-1.3,0.1-1.9c0-0.3,0-0.6,0-0.9\n    c0-0.6,0-1.3,0-1.9c0-0.4,0-0.9,0.1-1.3c0-1.2,0.1-2.4,0.1-3.6c0.6-0.7,0.4-1.5,0.1-2.3c0-0.7,0-1.4,0.1-2.1\n    c0.6-0.9,0.4-1.9,0.1-2.9c0-0.3,0-0.6,0-0.9c0.1-0.2,0.3-0.3,0.3-0.5c0.2-3.2,0.4-6.4,0.6-9.6c0.1-1.9,0.2-3.8,0.4-5.7\n    c0.3-2.9,0.6-5.8,0.9-8.7c0.2-2.3,1.1-4.1,3.2-5.1c1.4-0.7,2.8-1.3,4.3-1.6c3.2-0.6,6.5-1.1,9.7-1.5c3.3-0.4,6.7-0.6,10-1.2\n    c3.2-0.5,6.5-1,9.5-2c3.9-1.3,7.7-3.1,11.5-4.9c4-1.8,7.9-3.7,11.9-5.5c5.8-2.7,11.8-4.9,18.1-6c3.2-0.6,6.4-1.1,9.6-1.6\n    c0.4-0.1,0.8,0.1,1.2,0.2c4.6,2.4,9.4,4.2,14.3,5.7c3.3,1,6.6,1.7,9.9,1.7c1.9,0,3.9-0.2,5.8-0.5c4.2-0.7,8.1-2.3,11.6-5\n    c1.6-1.3,3.1-2.8,4.8-4.2c0.7,0.7,1.4,1.6,2.2,2.3c0.9,0.9,1.9,1.7,3,2.4c3.5,2.5,7.4,3.9,11.6,4.6c2.7,0.4,5.5,0.6,8.1,0.2\n    c3.2-0.6,6.3-1.3,9.4-2.3c3.9-1.4,7.7-3.2,11.6-4.8c0.4-0.2,1-0.4,1.4-0.3c2.6,0.4,5.2,0.9,7.8,1.3c5,0.7,9.8,2.1,14.4,4\n    c6.5,2.8,13,5.9,19.5,8.8c2.7,1.2,5.5,2.5,8.3,3.5c4.7,1.8,9.7,2.3,14.6,2.9c4,0.5,8.1,0.8,12.1,1.4c2.6,0.4,5.2,1,7.5,2.3\n    c1.5,0.8,2.7,2,3.1,3.7c0.2,0.9,0.3,1.9,0.4,2.9c0.4,3.9,0.8,7.8,1.1,11.8c0.3,3.5,0.4,6.9,0.6,10.4c0,0.3,0.2,0.6,0.4,0.8\n    c0,0.3,0,0.5,0,0.8c-0.1,0.2-0.3,0.4-0.4,0.6c-0.5,2-0.9,4-1.3,6c-2,8.3-4.8,16.4-8.5,24.1c-2.5,5.2-5.5,10.2-8.8,15\n    c-3,4.2-6.3,8.2-9.9,11.9c-2.4,2.4-4.9,4.8-7.5,7c-3.3,2.7-6.7,5.3-10.2,7.7c-6,4.1-12.5,7.5-19.2,10.4c-7.2,3.1-14.6,5.7-22.2,7.5\n    c-5.6,1.4-11.2,2.5-16.8,3.4c-4.6,0.8-9.3,1.3-13.9,1.9c-3.2,0.4-6.4,0.6-9.6,0.8c-3.6,0.2-7.2,0.3-10.8,0.4c-3.5,0-7-0.1-10.6-0.2\n    c-2.1,0-4.3-0.1-6.4-0.2c-2.4-0.1-4.8-0.2-7.2-0.4c-3.6-0.3-7.2-0.6-10.8-1.2c-4.6-0.7-9.1-1.6-13.6-2.6c-6.9-1.5-13.6-3.7-20.3-6.1\n    c-7.6-2.7-15-5.9-22.3-9.4c-5.6-2.8-11.2-5.7-16.6-8.8c-6.5-3.7-12.9-7.8-19.3-11.7c-0.7-0.4-1.4-0.8-2.1-1.1\n    c-0.3-0.4-0.7-0.8-0.9-1.2c-2.3-3.6-4.6-7.1-6.8-10.7c0-0.5,0-1,0-1.5c0-0.4,0-0.7,0.1-1.1c0.7-0.9,0.4-1.8,0.1-2.7\n    c0-0.7,0.1-1.5,0.1-2.2C62,256.9,61.7,256.2,61.5,255.5z M163.4,260.7c-0.1-0.1-0.2-0.2-0.2-0.2c0,0-0.1,0-0.1,0.1\n    c0.1,0.1,0.1,0.2,0.2,0.3c0.4,0.6,0.7,1.3,1.1,1.9c1.6,2.2,3.7,3.9,6.1,5.3c3.2,1.7,6.5,2.7,9.8,2.7c0.9,1.6,1.6,3.1,2.6,4.3\n    c1.2,1.7,3,2.9,4.9,3.8c8.1,3.7,16.3,3.7,24.4,0c3.5-1.6,6.1-4.1,7.1-8.1c0.2,0,0.3,0,0.5,0c4.7-0.1,8.8-1.7,12.5-4.5\n    c1.8-1.4,3.4-3.1,4.3-5.2c0.1-0.1,0.1-0.2,0.2-0.3c0,0-0.1,0-0.1-0.1c-0.1,0.1-0.1,0.2-0.2,0.2c-0.6,0.6-1.2,1.2-1.8,1.8\n    c-1.8,1.8-3.8,3.3-6.2,4.2c-5.1,1.9-10.1,1.4-15.1-0.5c-4.7-1.8-8.8-4.5-12.8-7.4c-0.5-0.4-0.8-0.4-1.3,0c-1.3,1-2.7,1.9-4,2.8\n    c-4.5,2.9-9.3,5.5-14.8,6.1c-5.5,0.6-10.4-0.6-14.5-4.4C165.1,262.4,164.3,261.5,163.4,260.7z M263,201.9\n    c-10.9,0-19.8,8.8-19.9,19.7c-0.1,11,8.8,19.9,19.6,20c11,0,20-8.8,20-19.7C282.9,210.9,274,201.9,263,201.9z M136.9,201.9\n    c-10.9,0-19.8,8.8-19.9,19.6c-0.1,11,8.7,19.9,19.6,20c11,0.1,20-8.7,20-19.7C156.7,210.9,147.9,201.9,136.9,201.9z M200,236.2\n    C200,236.2,200,236.2,200,236.2c-0.4,0-0.8,0-1.2,0c-0.4,0-0.9-0.1-1.3-0.1c-0.8,0.1-1.6,0.1-2.3,0.3c-1.4,0.5-1.6,1.6-0.3,2.4\n    c1.3,0.8,2.8,1.5,4.3,1.8c2.5,0.5,4.6-0.7,6.4-2.2c0.6-0.5,0.5-1.4-0.3-1.7c-0.7-0.3-1.4-0.5-2.1-0.5C202.1,236,201,236.2,200,236.2\n    z"
}), /* @__PURE__ */ React27.createElement("path", {
  fill: "#FAFAFA",
  d: "M338.1,184c-2.5-3.7-6.3-5.2-10.3-5.9c-4.6-0.8-9.3-1.5-13.9-1.9c-8.4-0.6-16.2-2.8-23.8-6.5\n    c-6.8-3.4-13.8-6.4-20.8-9.3c-5.3-2.2-10.9-3.3-16.7-4.1c0.4-0.3,0.6-0.5,0.9-0.7c2.7-2.4,5-5.1,6.3-8.6c1.8-5,1-9.8-1.8-14.2\n    c-2.2-3.6-5.2-6.5-8.5-9c-8.8-6.6-17.8-12.9-27.7-17.7c-1.3-0.6-2.7-1.2-4.1-1.8c0.1-0.1,0.2-0.3,0.2-0.4c1.5-2.2,1.3-4.1-0.5-5.9\n    c-1.6-1.6-3.6-2.5-5.7-3.2c-8.3-2.7-16.5-2.6-24.6,0.6c-1.2,0.5-2.4,1.2-3.4,1.9c-2.6,2-2.9,4.1-1.1,6.9c-0.1,0.1-0.1,0.2-0.2,0.2\n    c-7.4,2.9-14,7.2-20.6,11.6c-4.8,3.2-9.7,6.4-13.9,10.3c-3.1,2.8-5.8,5.9-7.3,9.9c-2.4,6.3-0.8,11.8,3.5,16.8c1,1.2,2.1,2.3,3,3.4\n    c-2.4,0.5-5.1,0.9-7.7,1.5c-6.8,1.5-13.2,4.3-19.5,7.2c-5.4,2.5-10.9,5-16.3,7.5c-3.9,1.8-8,2.6-12.2,3.1\n    c-5.7,0.7-11.5,1.3-17.2,2.1c-1.9,0.3-3.8,0.9-5.6,1.5c-5.1,1.7-7.7,5.2-8.3,10.6c-1.7,16.4-2.3,32.8-2.8,49.2\n    c-0.3,10.3-0.7,20.6-1.3,30.9c-1.1,17.8-3.5,35.3-7.9,52.6c-0.1,0.3-0.1,0.5-0.3,0.9c-2.7-5.9-6.4-10.7-13-12.2\n    c0.8-3.8,1.7-7.5,2.3-11.2c0.9-5.7,1.8-11.5,2.4-17.3c0.8-7.4,1.3-14.9,1.8-22.3c0.5-6.2,0.8-12.3,1.2-18.5\n    c0.5-7.1,1.1-14.1,1.8-21.2c0.7-6.8,1.8-13.5,2.6-20.3c0.6-5,0.4-9.9,0-14.9c-0.4-4.6-0.5-9.3,1.1-13.7c0.7-1.9,1.5-3.8,2.7-5.3\n    c2.9-3.7,4.3-7.9,5.3-12.5c3.3-16,8.4-31.4,16.3-45.8c13.6-24.8,33.7-42.1,59.9-52.5c10.8-4.3,22.1-7.2,33.6-9.1\n    c11-1.8,22.2-2.7,33.3-3c0.4,0,0.8,0,1.1,0c0.1,0.1,0.2,0.3,0.4,0.3c5.1,1.3,10.2,2.5,15.3,3.8c9.2,2.4,18.3,5.3,27.2,8.7\n    c9.1,3.5,18,7.4,26.5,12.1c5.8,3.2,11.4,6.7,16.7,10.5c5.1,3.7,9.9,7.7,14.5,12.1c2.5,2.4,4.9,5,7.1,7.7c2.6,3.2,5.2,6.4,7.6,9.8\n    c4.3,6.1,7.7,12.6,10.7,19.4c2.9,6.6,5.1,13.4,6.8,20.3c1.1,4.5,2,9.1,2.8,13.7c0.5,2.9,0.8,5.9,1.2,8.9c0.2,1.9,0.5,3.8,0.6,5.7\n    C337.8,179.2,338,181.6,338.1,184z M155.4,75.9c-4.4,0.4-8.4,0.7-12.4,1.2c-7.8,1.1-15.2,3.4-22,7.3c-6.5,3.7-11.7,8.9-16.4,14.6\n    c-1.2,1.5-2.3,3.2-3.3,4.9c-0.8,1.3-0.9,2.8-0.3,4.3c0.4,1,0.6,2,1,3c1,3,2.1,5.9,3.9,8.5c3,4.4,7.2,6,12.3,5.3\n    c3.8-0.5,7.2-1.9,10.6-3.6c8.8-4.3,16.7-10.1,23.9-16.6c4.5-4,8.8-8.1,12.6-12.7c1.8-2.2,3.4-4.7,4.1-7.5c0.8-3.3-0.4-5.9-3.5-7.3\n    c-0.7-0.3-1.5-0.7-2.2-0.7C161,76.4,158.1,76.2,155.4,75.9z M244.8,76.2c-1.7,0-3.4-0.1-5.1,0c-2.3,0.1-4.6,0.5-6.7,1.7\n    c-2.3,1.3-3.3,3.4-2.9,5.9c0.4,2.9,1.9,5.3,3.6,7.6c3.2,4.2,7.1,7.9,10.9,11.5c7.4,6.9,15.3,13.1,24.4,17.8c4,2.1,8.1,4,12.6,4.6\n    c4.9,0.6,9-0.8,12-4.9c0.7-1,1.5-2.1,1.9-3.3c1.2-2.9,2.1-5.8,3.2-8.7c0.5-1.3,0.4-2.6-0.2-3.8c-0.5-1-0.9-2-1.6-2.9\n    c-1.4-1.9-2.9-3.7-4.4-5.4c-6.3-7.3-13.9-12.7-23.1-15.9C261.5,77.4,253.2,76.4,244.8,76.2z"
}), /* @__PURE__ */ React27.createElement("path", {
  fill: "#E7E7E7",
  d: "M338.1,184c-0.2-2.4-0.3-4.8-0.5-7.2c-0.2-1.9-0.4-3.8-0.6-5.7c-0.4-3-0.6-6-1.2-8.9c-0.8-4.6-1.7-9.2-2.8-13.7\n    c-1.7-7-4-13.7-6.8-20.3c-3-6.8-6.4-13.3-10.7-19.4c-2.4-3.4-4.9-6.6-7.6-9.8c-2.2-2.7-4.6-5.2-7.1-7.7c-4.5-4.4-9.3-8.5-14.5-12.1\n    c-5.3-3.9-10.9-7.3-16.7-10.5c-8.5-4.7-17.4-8.7-26.5-12.1c-8.9-3.4-18-6.3-27.2-8.7c-5.1-1.3-10.2-2.5-15.3-3.8\n    c-0.1,0-0.3-0.2-0.4-0.3c2.8,0.1,5.6,0.1,8.4,0.2c2.3,0.1,4.6,0.3,6.9,0.5c3.6,0.3,7.2,0.6,10.8,1.1c4.4,0.6,8.9,1.2,13.2,2.1\n    c20.8,4.1,40.1,11.5,57.1,24.4c13.4,10.2,23.8,22.9,31.7,37.8c6.5,12.1,10.9,25,14.1,38.3c0.8,3.2,1.4,6.5,2.1,9.8\n    c0.6,2.8,1.9,5.2,3.6,7.4c2.6,3.3,4.2,7,4.6,11.1c0.3,3.2,0,6.5,0,9.8c0,4-0.4,7.9-0.1,11.9c0.4,5,1.3,10,1.8,15\n    c0.5,4.2,1,8.5,1.4,12.7c0.5,5.5,0.9,11,1.3,16.5c0.4,5.7,0.7,11.5,1.1,17.2c0.4,5.1,0.6,10.3,1.2,15.4c0.7,6.7,1.3,13.4,2.3,20\n    c0.8,5.5,2.1,10.9,3.1,16.3c-6.5,1.4-10.2,6.2-13,12.3c-0.5-2.3-1.1-4.3-1.5-6.4c-1.2-6.2-2.5-12.4-3.5-18.6\n    c-0.7-4-1.1-8.1-1.6-12.1c-0.5-4.4-0.9-8.7-1.3-13.1c-0.3-3.4-0.5-6.9-0.6-10.4c-0.3-5.2-0.5-10.4-0.7-15.6\n    c-0.1-2.4-0.2-4.7-0.2-7.1c-0.2-6.6-0.3-13.2-0.6-19.7c-0.2-5.6-0.5-11.2-1-16.8c-0.4-5.2-0.9-10.4-1.5-15.6\n    C339.3,186.9,338.6,185.5,338.1,184z"
}), /* @__PURE__ */ React27.createElement("path", {
  fill: "#FAFAFA",
  d: "M164.8,161.1c-5.9-2.1-11.7-4.6-16.4-9c-1.2-1.1-2.3-2.4-3.2-3.7c-2.8-4.1-2.9-8.4-0.5-12.8\n    c1.4-2.5,3.1-4.6,5.3-6.4c10.1-8.4,20.8-15.8,32.8-21.2c2-0.9,3.5-1,5.3,0.5c1.5,1.3,3.4,2.2,5.2,3.2c4.5,2.3,9,2.2,13.5,0\n    c1.8-0.9,3.5-2,5.2-3c1.4,1.2,2.8,2.5,4.2,3.7c3.3,2.9,6.8,5.6,10,8.6c3.7,3.4,7,7.1,9.6,11.4c1.6,2.7,2.8,5.5,3,8.6\n    c0.2,3.7-1,7-3.7,9.6c-1.6,1.5-3.6,2.8-5.4,4c-3.3,2.2-6.9,3.8-10.8,4.8c-2.9,0.7-5.8,1.1-8.7,1.1c-0.4,0-0.7,0.2-1.1,0.3\n    c-4-2.4-7.2-5.6-8.8-10.1c-0.1-0.1-0.2-0.3-0.3-0.4c-1.2,0.9-2.3,1.9-3.5,2.8c-2.7,2.2-5.6,4-8.8,5.3c-3.5,1.5-7.2,2.5-11,2.8\n    c-3.3,0.2-6.6,0.3-9.8-0.2C166.1,161,165.4,161.1,164.8,161.1z"
}), /* @__PURE__ */ React27.createElement("path", {
  fill: "#F1E5DA",
  d: "M68.9,277c0.7,0.4,1.4,0.7,2.1,1.1c6.4,3.9,12.8,7.9,19.3,11.7c5.4,3.1,11,6,16.6,8.8\n    c7.2,3.6,14.7,6.7,22.3,9.4c6.6,2.4,13.4,4.6,20.3,6.1c4.5,1,9.1,1.9,13.6,2.6c3.6,0.6,7.2,0.8,10.8,1.2c2.4,0.2,4.8,0.3,7.2,0.4\n    c2.1,0.1,4.3,0.1,6.4,0.2c3.5,0.1,7,0.2,10.6,0.2c3.6,0,7.2-0.2,10.8-0.4c3.2-0.2,6.4-0.4,9.6-0.8c4.7-0.5,9.3-1.1,13.9-1.9\n    c5.6-1,11.3-2.1,16.8-3.4c7.6-1.9,15-4.4,22.2-7.5c6.7-2.9,13.1-6.3,19.2-10.4c3.5-2.4,6.9-5,10.2-7.7c2.6-2.2,5.1-4.5,7.5-7\n    c3.6-3.7,6.9-7.7,9.9-11.9c3.4-4.8,6.3-9.8,8.8-15c3.7-7.7,6.5-15.8,8.5-24.1c0.5-2,0.9-4,1.3-6c0.1-0.2,0.3-0.4,0.4-0.6\n    c0.1,2.2,0.2,4.4,0.3,6.6c0.4,11.3,0.8,22.6,1.2,33.8c0,0.9,0.1,1.9,0.1,2.8c-0.1,0.1-0.1,0.2-0.2,0.3c-4.2,7.5-9.3,14.3-15.3,20.4\n    c-9.8,10.1-21.2,18-33.8,24.2c-21.6,10.8-44.7,16.5-68.7,18.7c-5.3,0.5-10.7,0.8-16.1,0.9c-10,0.3-19.9-0.2-29.8-1.3\n    c-5.4-0.6-10.7-1.5-16.1-2.4c-10.9-1.9-21.6-4.8-32-8.7c-17.5-6.5-33.5-15.4-47.2-28.2C75.8,285.3,72.1,281.4,68.9,277z"
}), /* @__PURE__ */ React27.createElement("path", {
  fill: "#642B1E",
  d: "M68.9,277c3.2,4.4,6.9,8.3,10.9,12c13.7,12.8,29.7,21.7,47.2,28.2c10.4,3.9,21.1,6.8,32,8.7\n    c5.3,0.9,10.7,1.8,16.1,2.4c9.9,1.1,19.9,1.6,29.8,1.3c5.4-0.2,10.7-0.4,16.1-0.9c24-2.3,47.1-7.9,68.7-18.7\n    c12.5-6.3,24-14.1,33.8-24.2c6-6.1,11.1-12.9,15.3-20.4c0.1-0.1,0.1-0.2,0.2-0.3c0.3,4,0.5,8,0.8,12c0.1,1.3,0.2,2.6,0.3,3.9\n    c-2.1,2.6-4.1,5.2-6.3,7.7c-9.7,11.1-21.3,19.8-34.1,26.9c-14.7,8.1-30.3,13.7-46.6,17.6c-12.1,2.9-24.3,4.7-36.7,5.5\n    c-12.1,0.9-24.3,0.8-36.4-0.3c-20.4-1.8-40.3-5.9-59.5-13.4c-14.5-5.6-28.1-13-40.3-22.8c-7.4-6-14.1-12.8-19.8-20.4\n    c-0.2-0.3-0.4-0.5-0.7-0.8c0.2-2.8,0.5-5.6,0.7-8.4c0.1-1.1,0.2-2.1,0.2-3.2c0.1-1.4,0.2-2.9,0.2-4.3c0.1,0,0.1,0,0.2,0\n    c2.3,3.6,4.6,7.1,6.8,10.7C68.2,276.3,68.6,276.6,68.9,277z"
}), /* @__PURE__ */ React27.createElement("path", {
  fill: "#565656",
  d: "M66,110.4c-1.5-0.7-3-1.4-4.5-2.2c-5-2.8-9.1-6.5-11.9-11.5c-4.3-7.6-4.4-15.4-1.2-23.4\n    c1.8-4.6,4.6-8.6,7.8-12.3c3-3.5,6.5-6.4,10.5-8.6c4.1-2.2,8.5-3.5,13.2-3.1c7.8,0.6,13.8,4.3,18.3,10.6c1.4,2,2.4,4.3,3.6,6.5\n    c0.3,0.5,0.2,0.9-0.4,1.2c-5.8,4.3-11.1,9.1-15.9,14.4c-6.6,7.2-12.2,15-16.9,23.6C67.8,107,67,108.6,66,110.4z"
}), /* @__PURE__ */ React27.createElement("path", {
  fill: "#565656",
  d: "M333.8,110.2c-1.6-2.9-3.2-5.7-4.8-8.5c-4-6.7-8.6-13.1-13.9-18.9c-5.1-5.6-10.6-10.8-16.8-15.3\n    c-0.5-0.3-0.6-0.6-0.4-1.2c3-7.4,7.8-12.9,15.4-15.8c5.9-2.2,11.8-1.8,17.6,0.7c5.7,2.5,10.1,6.5,14,11.2c3.2,3.9,5.8,8.1,7.3,12.9\n    c3,9.4,1.3,17.9-5.1,25.5c-3.4,4-7.6,6.9-12.4,9C334.5,110,334.2,110.1,333.8,110.2z"
}), /* @__PURE__ */ React27.createElement("path", {
  fill: "#F1E5DA",
  d: "M337.2,221.1c-0.1-0.3-0.3-0.6-0.4-0.8c-0.2-3.5-0.3-6.9-0.6-10.4c-0.3-3.9-0.7-7.8-1.1-11.8\n    c-0.1-1-0.2-1.9-0.4-2.9c-0.4-1.8-1.5-2.9-3.1-3.7c-2.3-1.3-4.9-1.9-7.5-2.3c-4-0.5-8.1-0.9-12.1-1.4c-4.9-0.6-9.9-1.1-14.6-2.9\n    c-2.8-1.1-5.6-2.3-8.3-3.5c-6.5-2.9-12.9-6-19.5-8.8c-4.6-2-9.5-3.3-14.4-4c-2.6-0.4-5.2-0.9-7.8-1.3c-0.5-0.1-1,0.1-1.4,0.3\n    c-3.9,1.6-7.6,3.4-11.6,4.8c-3,1.1-6.2,1.8-9.4,2.3c-2.7,0.5-5.4,0.3-8.1-0.2c-4.2-0.7-8.1-2.1-11.6-4.6c-1-0.7-2-1.6-3-2.4\n    c-0.8-0.7-1.5-1.6-2.2-2.3c-1.7,1.5-3.2,3-4.8,4.2c-3.4,2.7-7.3,4.3-11.6,5c-1.9,0.3-3.9,0.6-5.8,0.5c-3.4,0-6.7-0.7-9.9-1.7\n    c-4.9-1.5-9.7-3.3-14.3-5.7c-0.3-0.2-0.8-0.3-1.2-0.2c-3.2,0.5-6.4,1-9.6,1.6c-6.3,1.1-12.3,3.3-18.1,6c-4,1.8-7.9,3.8-11.9,5.5\n    c-3.8,1.7-7.6,3.5-11.5,4.9c-3.1,1-6.3,1.5-9.5,2c-3.3,0.5-6.6,0.7-10,1.2c-3.2,0.4-6.5,0.9-9.7,1.5c-1.5,0.3-2.9,1-4.3,1.6\n    c-2.1,1-2.9,2.8-3.2,5.1c-0.3,2.9-0.6,5.8-0.9,8.7c-0.2,1.9-0.3,3.8-0.4,5.7c-0.2,3.2-0.4,6.4-0.6,9.6c0,0.2-0.2,0.3-0.3,0.5\n    c0.2-3.5,0.2-7,0.5-10.6c0.4-5.2,0.8-10.5,1.2-15.7c0.2-2.1,0.5-4.1,0.7-6.2c0.2-1.9,1.3-3.2,2.9-4.2c2.2-1.2,4.6-1.9,7-2.3\n    c4.7-0.6,9.3-1.3,14-1.7c7.5-0.7,14.5-2.7,21.3-6c5.8-2.8,11.6-5.5,17.5-8.1c6.8-3.1,14-4.8,21.4-5.8c0.2,0,0.5-0.1,0.7-0.1\n    c2-0.5,3.9-0.2,5.8,0.8c5.4,2.8,11.2,5,17.2,6c10.5,1.8,19.7-0.9,26.9-9.1c0.1-0.1,0.1-0.1,0.3-0.2c2.8,3.4,6.2,6,10.3,7.6\n    c6.9,2.8,13.9,2.9,21,0.7c5.2-1.6,10.2-3.4,15-6c0.3-0.2,0.7-0.2,1-0.2c11.3,1.2,22,4.5,32.2,9.6c5,2.5,10.1,4.7,15.1,7\n    c4.5,2.1,9.3,2.9,14.1,3.5c5.4,0.7,10.8,1.2,16.1,1.9c2.1,0.3,4.2,1.1,6.3,1.9c2.4,0.9,3.6,2.8,3.8,5.5c0.5,6,1.1,12,1.6,18.1\n    C336.9,212.1,337,216.6,337.2,221.1z"
}), /* @__PURE__ */ React27.createElement("path", {
  fill: "#E8E8E8",
  d: "M209,160.7c0.4-0.1,0.7-0.3,1.1-0.3c3,0,5.9-0.3,8.7-1.1c3.9-1,7.5-2.6,10.8-4.8c1.9-1.2,3.8-2.4,5.4-4\n    c2.7-2.6,3.9-5.9,3.7-9.6c-0.2-3.1-1.3-6-3-8.6c-2.6-4.3-5.9-8-9.6-11.4c-3.2-3-6.7-5.7-10-8.6c-1.4-1.2-2.8-2.5-4.2-3.7\n    c0.6-0.4,1.1-0.8,1.7-1.2c0.5-0.4,1-0.4,1.5-0.2c4.8,1.8,9.3,4.1,13.6,6.8c6.6,4.2,13.2,8.4,19.2,13.3c2.6,2.1,5,4.4,6.8,7.3\n    c3.3,5.1,2.9,10.6-1,15.3c-3.2,3.9-7.4,6.4-11.8,8.5c-4.8,2.3-9.7,4.1-14.9,5.2C220.8,164.8,214.6,164.1,209,160.7z"
}), /* @__PURE__ */ React27.createElement("path", {
  fill: "#E6E6E6",
  d: "M164.8,161.1c0.7,0,1.3-0.1,2,0c3.3,0.5,6.6,0.4,9.8,0.2c3.9-0.3,7.5-1.3,11-2.8c3.2-1.4,6.1-3.2,8.8-5.3\n    c1.2-0.9,2.3-1.9,3.5-2.8c-0.9,3.3-2.9,5.9-5.4,8.1c-4.8,4.1-10.3,5.8-16.5,5.8C173.3,164.1,169.1,162.6,164.8,161.1z"
}), /* @__PURE__ */ React27.createElement("path", {
  fill: "#F1E5DA",
  d: "M62.6,222c0.3,1,0.5,1.9-0.1,2.9C62.5,223.9,62.6,223,62.6,222z"
}), /* @__PURE__ */ React27.createElement("path", {
  fill: "#F1E5DA",
  d: "M61.3,259.8c0.3,0.9,0.5,1.8-0.1,2.7C61.2,261.6,61.2,260.7,61.3,259.8z"
}), /* @__PURE__ */ React27.createElement("path", {
  fill: "#F1E5DA",
  d: "M62.4,227c0.3,0.8,0.5,1.6-0.1,2.3C62.3,228.5,62.4,227.7,62.4,227z"
}), /* @__PURE__ */ React27.createElement("path", {
  fill: "#F1E5DA",
  d: "M61.5,255.5c0.3,0.7,0.5,1.4-0.1,2.1C61.4,256.9,61.4,256.2,61.5,255.5z"
}), /* @__PURE__ */ React27.createElement("path", {
  fill: "#F1E5DA",
  d: "M61.7,250.6c0.3,0.5,0.5,1.1-0.1,1.5C61.6,251.6,61.6,251.1,61.7,250.6z"
}), /* @__PURE__ */ React27.createElement("path", {
  fill: "#F1E5DA",
  d: "M61.1,265.1c-0.1,0-0.1,0-0.2,0c0-0.5,0.1-1,0.1-1.5C61.1,264.1,61.1,264.6,61.1,265.1z"
}), /* @__PURE__ */ React27.createElement("path", {
  fill: "#F1E5DA",
  d: "M62.2,232.8c0,0.4,0,0.9-0.1,1.3C62.2,233.7,62.2,233.3,62.2,232.8z"
}), /* @__PURE__ */ React27.createElement("path", {
  fill: "#F1E5DA",
  d: "M61.8,244.9c0,0.4,0,0.8-0.1,1.2C61.8,245.7,61.8,245.3,61.8,244.9z"
}), /* @__PURE__ */ React27.createElement("path", {
  fill: "#F1E5DA",
  d: "M62,238.9c0,0.3,0,0.6-0.1,1C62,239.5,62,239.2,62,238.9z"
}), /* @__PURE__ */ React27.createElement("path", {
  fill: "#F1E5DA",
  d: "M61.9,241.7c0,0.4,0,0.8,0,1.1C61.9,242.5,61.9,242.1,61.9,241.7z"
}), /* @__PURE__ */ React27.createElement("path", {
  fill: "#F1E5DA",
  d: "M62.1,236c0,0.3,0,0.6,0,0.9C62.1,236.7,62.1,236.3,62.1,236z"
}), /* @__PURE__ */ React27.createElement("path", {
  fill: "#642B1E",
  d: "M263,201.9c11,0,19.8,9,19.8,19.9c0,10.9-9,19.7-20,19.7c-10.9,0-19.7-9-19.6-20\n    C243.2,210.7,252.2,201.9,263,201.9z M257.2,206.4c-5,0-9.1,4.1-9.1,9.1c0,5,4.1,9.1,9.1,9.2c5,0,9.2-4.1,9.2-9.2\n    C266.4,210.5,262.3,206.4,257.2,206.4z"
}), /* @__PURE__ */ React27.createElement("path", {
  fill: "#642B1E",
  d: "M136.9,201.9c11,0,19.8,9,19.8,20c0,10.9-9,19.7-20,19.7c-10.9-0.1-19.7-9-19.6-20\n    C117.1,210.7,126.1,201.8,136.9,201.9z M133.5,215.5c0,5,4.1,9.1,9.1,9.2c5,0,9.1-4.1,9.2-9.1c0-5.1-4.1-9.2-9.1-9.2\n    C137.6,206.4,133.5,210.5,133.5,215.5z"
}), /* @__PURE__ */ React27.createElement("path", {
  fill: "#672D21",
  d: "M236.6,260.8c-0.9,2.2-2.5,3.8-4.3,5.2c-3.7,2.9-7.8,4.5-12.5,4.5c-0.2,0-0.3,0-0.5,0c-1,3.9-3.6,6.5-7.1,8.1\n    c-8.1,3.8-16.3,3.7-24.4,0c-1.9-0.9-3.6-2.1-4.9-3.8c-1-1.3-1.6-2.8-2.6-4.3c-3.3,0-6.7-0.9-9.8-2.7c-2.4-1.3-4.5-3-6.1-5.3\n    c-0.4-0.6-0.7-1.2-1.1-1.9c0.1-0.1,0.1-0.1,0.2-0.2c0.9,0.9,1.7,1.8,2.6,2.6c4.1,3.8,9,5,14.5,4.4c5.5-0.6,10.2-3.2,14.8-6.1\n    c1.4-0.9,2.7-1.8,4-2.8c0.5-0.4,0.8-0.4,1.3,0c4,2.9,8.1,5.6,12.8,7.4c5,1.9,10,2.3,15.1,0.5c2.4-0.9,4.4-2.4,6.2-4.2\n    c0.6-0.6,1.2-1.2,1.8-1.8C236.5,260.7,236.5,260.8,236.6,260.8z M216.8,270.3c-0.9-0.2-1.7-0.5-2.6-0.7c-4.9-1.6-9.3-4.2-13.5-7.1\n    c-0.6-0.4-0.9-0.4-1.5,0c-3.3,2.3-6.8,4.5-10.5,6c-1.8,0.7-3.7,1.3-5.7,2c0.4,0.7,0.7,1.6,1.2,2.3c1.4,2,3.4,3.3,5.6,4.3\n    c4.7,2,9.6,2.4,14.6,1.6c3.2-0.5,6.2-1.5,8.9-3.4C214.9,274,216.3,272.5,216.8,270.3z"
}), /* @__PURE__ */ React27.createElement("path", {
  fill: "#662D20",
  d: "M200,236.2c1-0.1,2.1-0.2,3.1-0.1c0.7,0,1.5,0.2,2.1,0.5c0.8,0.4,0.9,1.2,0.3,1.7c-1.8,1.6-4,2.7-6.4,2.2\n    c-1.5-0.3-3-1-4.3-1.8c-1.3-0.8-1.1-1.9,0.3-2.4c0.7-0.2,1.5-0.2,2.3-0.3c0.4,0,0.9,0.1,1.3,0.1C199.2,236.2,199.6,236.2,200,236.2\n    C200,236.2,200,236.2,200,236.2z"
}), /* @__PURE__ */ React27.createElement("path", {
  fill: "#672D21",
  d: "M163.3,260.8c-0.1-0.1-0.1-0.2-0.2-0.3c0,0,0.1,0,0.1-0.1c0.1,0.1,0.2,0.2,0.2,0.2\n    C163.4,260.7,163.3,260.8,163.3,260.8z"
}), /* @__PURE__ */ React27.createElement("path", {
  fill: "#672D21",
  d: "M236.4,260.7c0.1-0.1,0.1-0.2,0.2-0.2c0,0,0.1,0,0.1,0.1c-0.1,0.1-0.1,0.2-0.2,0.3\n    C236.5,260.8,236.5,260.7,236.4,260.7z"
}), /* @__PURE__ */ React27.createElement("path", {
  fill: "#010101",
  d: "M155.4,75.9c2.6,0.2,5.5,0.5,8.5,0.8c0.8,0.1,1.5,0.4,2.2,0.7c3.1,1.4,4.3,4,3.5,7.3c-0.7,2.9-2.3,5.3-4.1,7.5\n    c-3.8,4.6-8.1,8.8-12.6,12.7c-7.3,6.5-15.1,12.3-23.9,16.6c-3.4,1.6-6.8,3.1-10.6,3.6c-5.2,0.7-9.4-0.9-12.3-5.3\n    c-1.8-2.6-2.9-5.6-3.9-8.5c-0.3-1-0.6-2.1-1-3c-0.6-1.5-0.5-3,0.3-4.3c1-1.7,2-3.4,3.3-4.9c4.6-5.8,9.9-10.9,16.4-14.6\n    c6.8-3.9,14.2-6.3,22-7.3C147.1,76.6,151.1,76.4,155.4,75.9z M146.8,86.8c0,3.7,2.9,6.7,6.6,6.6c3.6,0,6.6-2.9,6.6-6.6\n    c0-3.7-2.9-6.7-6.6-6.7C149.8,80.2,146.8,83.1,146.8,86.8z M138.9,82.5c0,1.7,1.3,3.1,3,3.2c1.7,0.1,3.1-1.3,3.1-3\n    c0-1.7-1.3-3.1-3-3.1C140.4,79.4,138.9,80.8,138.9,82.5z"
}), /* @__PURE__ */ React27.createElement("path", {
  fill: "#010101",
  d: "M244.8,76.2c8.4,0.2,16.7,1.2,24.7,4c9.1,3.2,16.8,8.6,23.1,15.9c1.5,1.8,3,3.6,4.4,5.4\n    c0.7,0.9,1.1,1.9,1.6,2.9c0.6,1.2,0.7,2.5,0.2,3.8c-1.1,2.9-2.1,5.9-3.2,8.7c-0.5,1.2-1.2,2.3-1.9,3.3c-2.9,4.1-7.1,5.5-12,4.9\n    c-4.5-0.6-8.6-2.5-12.6-4.6c-9-4.7-17-10.9-24.4-17.8c-3.9-3.6-7.7-7.2-10.9-11.5c-1.7-2.3-3.2-4.7-3.6-7.6\n    c-0.4-2.6,0.6-4.6,2.9-5.9c2.1-1.2,4.4-1.6,6.7-1.7C241.3,76.1,243.1,76.2,244.8,76.2z M253,86.8c0-3.7-3-6.7-6.6-6.7\n    c-3.6,0-6.6,3-6.6,6.6c0,3.7,2.9,6.7,6.6,6.7C250,93.5,253,90.5,253,86.8z M254.9,82.5c0,1.7,1.4,3.1,3,3.1c1.7,0,3-1.4,3-3.1\n    c0-1.7-1.4-3.1-3-3.1C256.2,79.4,254.9,80.8,254.9,82.5z"
}), /* @__PURE__ */ React27.createElement("path", {
  fill: "#FDFDFD",
  d: "M257.2,206.4c5,0,9.1,4.1,9.1,9.1c0,5-4.1,9.2-9.2,9.2c-5,0-9.1-4.2-9.1-9.2\n    C248.1,210.5,252.2,206.4,257.2,206.4z"
}), /* @__PURE__ */ React27.createElement("path", {
  fill: "#FDFDFD",
  d: "M133.5,215.5c0-5,4.1-9.1,9.1-9.1c5,0,9.2,4.2,9.1,9.2c0,5-4.2,9.1-9.2,9.1\n    C137.6,224.6,133.5,220.5,133.5,215.5z"
}), /* @__PURE__ */ React27.createElement("path", {
  fill: "#FD928E",
  d: "M216.8,270.3c-0.5,2.2-1.9,3.7-3.5,4.9c-2.6,2-5.7,3-8.9,3.4c-5,0.7-9.9,0.4-14.6-1.6c-2.2-1-4.2-2.3-5.6-4.3\n    c-0.5-0.7-0.8-1.5-1.2-2.3c2-0.7,3.9-1.2,5.7-2c3.8-1.5,7.2-3.7,10.5-6c0.6-0.4,0.9-0.4,1.5,0c4.2,2.9,8.6,5.6,13.5,7.1\n    C215,269.8,215.9,270.1,216.8,270.3z"
}), /* @__PURE__ */ React27.createElement("path", {
  fill: "#FCFCFC",
  d: "M146.8,86.8c0-3.7,3-6.7,6.7-6.6c3.7,0,6.6,3,6.6,6.7c0,3.6-3,6.6-6.6,6.6C149.8,93.5,146.8,90.5,146.8,86.8z"
}), /* @__PURE__ */ React27.createElement("path", {
  fill: "#FAFAFA",
  d: "M138.9,82.5c0-1.7,1.5-3.1,3.1-3c1.7,0.1,3,1.4,3,3.1c0,1.7-1.5,3.1-3.1,3C140.2,85.6,138.9,84.2,138.9,82.5z"
}), /* @__PURE__ */ React27.createElement("path", {
  fill: "#FCFCFC",
  d: "M253,86.8c0,3.7-3,6.6-6.7,6.6c-3.7,0-6.6-3-6.6-6.7c0-3.6,3-6.6,6.6-6.6C250.1,80.2,253,83.2,253,86.8z"
}), /* @__PURE__ */ React27.createElement("path", {
  fill: "#FAFAFA",
  d: "M254.9,82.5c0-1.7,1.4-3.1,3.1-3.1c1.7,0,3,1.4,3,3.1c0,1.7-1.4,3.1-3,3.1C256.2,85.6,254.9,84.2,254.9,82.5z"
})));
var pandaswap_default = PandaSwapIcon;

// src/searchbar/icons/yetiswap.tsx
import React28 from "react";
var YetiSwapIcon = ({ height, width }) => /* @__PURE__ */ React28.createElement(abstract_default, {
  height: height != null ? height : 16,
  width: width != null ? width : 16,
  viewBox: "0 0 400 400"
}, /* @__PURE__ */ React28.createElement("g", {
  transform: "translate(0)"
}, /* @__PURE__ */ React28.createElement("path", {
  fill: "#48668C",
  d: "M215.5,275.6c-0.3-0.9-0.6-2.7-0.9-2.7c-2.8,0.2-6-0.1-8.3,1.2c-2,1.1-2.9,4.1-4.8,7c0-7.8,0-14.5,0-21.2\n        c0-2.5,5.2-10,7.8-12c1-0.7,1.6-2.2,2-3.4c1.8-6,4.9-12.1,4.7-18.1c-0.1-5.1-4.1-10-6.3-15c-0.6,0.1-1.1,0.2-1.7,0.3\n        c1.5-1.3,2.9-2.6,4.4-4c1.4,3.8,2.6,7.3,4,11.1c1.2-1.1,1.7-1.6,2.6-2.4c0.9,2.2,1.5,3.9,2.1,5.3c2.7-0.8,5.3-1.6,8-2.4\n        c0.2,1.3,0.4,2.5,0.6,4.3c1.5-1.7,2.8-3,4.3-4.7c0.6,0.9,1.1,1.6,1.3,2c2.7-0.9,5.6-1.3,7.6-2.9c1.4-1.2,1.6-4,2.3-6.1\n        c1.6-4.9,3.1-9.8,4.6-14.7l-0.1,0.1c3.9-1.4,4.3-4.6,3.5-7.9c-1.6-6.1-3.6-12.2-5.6-19c-0.7,1.6-1.1,2.5-1.5,3.3\n        c-2.7-4-5.4-8.1-8.7-13.1c-1,2.7-1.4,4-1.8,4.9c-7.9-1.3-15.6-2.6-24.2-4c1.6,1.9,2.6,3.2,3.5,4.3c-8.3,6.9-16.7,13.7-25,20.6\n        c-0.4-0.3-0.8-0.6-1.1-0.8c1.2-2.9,2.4-5.7,3.7-8.6c2.1-4.5,1.5-8.1-2.4-11.6c-4.1-3.7-7.6-8.1-11.3-12.2c0.4-0.4,0.8-0.8,1.1-1.3\n        c1.7,0.9,3.5,1.8,5.2,2.7c0.5,0.1,0.9,0.2,1.4,0.3c-0.2-0.4-0.4-0.8-0.5-1.2c-8.2-13.1-6.9-28.6-10.9-43c-4.4,2.1-8.6,4.1-13.2,6.2\n        c-0.7-2.4-1.2-4.2-1.6-5.8c-5.2-0.2-5.8,9.4-13.1,5c-0.5,8.4-1,16.4-1.5,24.6c1.1,0.1,2.1,0.1,2.8,0.2c-1.4,5.2-3.1,10.1-3.9,15.1\n        c-1,6.2-1.4,12.4-2.1,19.7c2.2-1.5,3.6-2.5,4.3-3c2.6,11.2,5.3,22.4,8,34.2c4.2-1.7,6.9-2.8,9.6-3.9c0.5,0.4,0.9,0.7,1.4,1.1\n        c-9,13.6-17.4,27.5-27.2,40.5c-6.1,8.1-11,16.1-10.4,26.4c0.5,8.2,0.7,16.5,2.7,24.3c1.8,6.9,5.7,13.3,8.9,19.8\n        c0.3,0.7,2.1,0.7,2.7,0.9c7,8.5,13.8,17,21.1,25.2c2.5,2.8,2.3,4.4,0.8,7.7c-4.3,9.2-10.8,11.4-20.7,11.3\n        c-38.4-0.6-76.7-0.3-115.1-0.2c-8,0-16,0.5-24,0.8c0-0.8,0-1.5,0-2.3c7.9-14.9,17.2-29.3,23.2-45c5.7-15.1,15.1-26.5,26.4-37.1\n        c2.9-2.7,5.4-6.5,6.4-10.3c2.4-9,6.2-16.7,13.4-23.1c12.9-11.7,21.2-26,19.1-44.3c-0.5-4.2,0.8-7.2,4.3-9.1\n        c11.4-6.1,17.2-16.5,22.7-27.5c2.9-5.8,6.1-11.4,9.7-16.8c7.3-10.8,13.8-21.8,14.1-35.4c0-0.5,0.4-1,0.7-1.5c1.6,0.5,3.1,1,5.6,1.7\n        c0.8-6.1,1.1-11.8,2.3-17.2c1.8-8.7,7.8-14.9,15.3-18.7c3.5-1.7,8.8,0.3,13.3,0.4c1.9,0,4.9,0.1,5.7-1.1c4.9-6.9,9.2-14.2,13.8-21.4\n        c0.8,0,1.5,0,2.3,0c4.7,11.2,7.5,23.8,14.5,33.3c6.9,9.3,8.8,19.7,12.5,29.8c2,5.3,5.1,7.5,10,8.7c2.7,0.7,5.7,2,7.6,3.9\n        c6.6,6.6,12.9,13.3,22.6,15.7c1.5,0.4,2.9,3.1,3.4,5c1.3,4.9,1.7,10.2,3.2,15c3,9.3,6.9,18.1,17,22.2c5,2,7.4,6.2,7.7,11.6\n        c0.5,10.6,7.1,18.6,11.5,27.6c8.7,17.8,18.5,34.9,31.5,50c0.8,1,1.6,2.3,1.7,3.5c1.1,10.4,7.3,18.1,13.5,25.9\n        c12.4,15.5,23.7,31.7,30.2,50.8c0.6,1.7,1.3,3.5,2.2,5.7c-2.8,0-4.8,0-6.9,0c-51.7,0-103.4,0.1-155.2-0.2c-5.7,0-9,1.3-10.2,6.9\n        c-0.4,1.7-1.5,3.1-2.3,4.7c-0.6-0.1-1.2-0.3-1.7-0.4c0-2-0.1-3.9,0-5.9c1-12.5-2.5-24.1-6.7-35.6c-1.1-3.1-0.4-5,1.4-7.6\n        c4.2-5.8,8.8-9.3,16.6-10c10.2-0.9,20.4-3.2,26.4-13.6c0.3,0.4,0.6,0.8,0.9,1.3c-0.8,2.4-1.5,4.8-2.6,8.2c4-0.6,7.1-1,10.2-1.4\n        c0.2,0.4,0.4,0.8,0.5,1.1c-3.6,1.8-7.3,3.6-12,6c3.1,2.2,5.8,4.6,8.9,6.4c6.4,3.7,14.3,4.6,18.4,12.3c2,3.8,6.5,3.6,9.7-0.1\n        c1.4-1.6,2.2-3.6,3.7-5.1c4.7-4.5,9.7-8.9,14.6-13.3c0.6-0.5,1.3-0.7,1.9-1.2c12.1-8.7,11.9-7.5,3.4-20.3c-1.4,0.5-2.9,1-5,1.8\n        c0.3-1.8,0.5-3,0.8-4.3c-5.7-0.8-19.1,10.5-21.1,18.6c-2.3-3.4-4.3-6.2-6.3-9.1c-1.9-2.8-3.9-5.5-6.5-9.1c-0.2,3.1-0.3,5.1-0.5,8.6\n        c-1.3-4.1-2.4-6.8-3-9.7c-1.7-8.6-7.2-12.5-15.6-13.2c-2.5-0.2-4.9-0.5-7.4-0.8c-2.3-0.7-4.6-1.2-6.9-2.1c-2-0.7-3.9-1.7-5.9-2.6\n        c5.2-6.7,10.3-13.4,16.2-21.1c4.5,6,8.5,11.2,13,17.3c0.9-8.5-1.1-15.5-5.4-22c-0.9-1.3-2.2-3.6-1.7-4.3c3.3-4.8-0.5-5.8-3.4-6.5\n        c-3.3,1-6.5,1.1-9.6,1.2c-5.2,0.2-10.3,0.5-15.5,0.7c-0.1,0.7-0.2,1.4-0.2,2.1c7.8,0.5,14.3,3.2,18.4,8.6c-2.6,1.9-5.4,3.1-7.2,5.2\n        c-6.6,7.8-12.9,15.9-19.3,23.8C217.8,275.9,216.6,275.7,215.5,275.6z M112.5,283c-0.2-0.2-0.4-0.4-0.6-0.6c0.9-3.1,1.7-6.2,2.8-9.3\n        c4.6-13,3.6-26.4,3.4-40.5c-6.6,5.4-12.5,10.3-18.2,15c5.7-14.1,12.3-27.5,16.4-41.5c2.4-8.1,5.5-14.5,12-19.6\n        c6-4.8,5.5-12.1,6.7-18.7c0.7-4.1,1.6-8.2,2.6-12.3c1.1-4.2,2.4-8.2,3.7-12.4c-0.8-0.5-1.6-0.9-2.3-1.4c-0.5,1-0.9,2-1.4,3\n        c-4.2,8.2-9.2,16.2-12.5,24.8c-2.7,7-5.5,13.1-12.4,16.7c-8.6,4.5-11.6,12.5-13.2,21.4c-0.4,2.3-0.5,3.4,2.2,2.7\n        c0.2,0.2,0.5,0.4,0.7,0.6c-8,12.2-15,25.3-24.3,36.3c-6.3,7.4-4.3,16.3-10.2,24.5c10.8-3.9,19.6-7.1,29.5-10.6\n        c0.1,13.6,1.4,25.8,7.2,37.1c0.5,1.1-0.5,2.9-0.7,4.4c-0.6,4.4-1.2,8.9-2,14.9c3-3.1,4.6-4.8,6.1-6.5c2.4,4.1,4.5,7.7,6.7,11.4\n        c0.3-0.2,0.6-0.4,0.9-0.6c0-13.3,0-26.5,0-39.9C114.3,282.4,113.4,282.7,112.5,283z M88.6,272.6c-12.8,2.9-23.7,6.4-33.4,15.6\n        c-9.1,8.5-14,17.5-16.4,29.3c-1.8,8.4-6.2,16.2-9.5,24.3c0.4,0.4,0.8,0.8,1.1,1.3c5.7,8.3,14.5,5.1,22.3,5.8c0.8,0.1,2-1.5,2.7-2.5\n        c6.9-10.9,13.6-22,20.7-32.8c3.7-5.7,7.3-11.1,7.7-18.5C84.1,287.8,86.7,280.7,88.6,272.6z M200.2,64.3c-3.9,6.2-7.2,11.3-10.5,16.7\n        c3.9,1.2,6.8,2.2,11.5,3.7c-3.8,3.9-6.6,6.7-9.5,9.5c-3,3-8.1,5.6-8.8,9.1c-1.6,7.6,0.5,15.4,3.8,24.6c6.7-11,12.5-20.5,18.3-30\n        c1.9-3,4-6,6.3-9.5C208.1,81.4,204.5,73.5,200.2,64.3z M164,111.1c0.5,0.4,0.9,0.8,1.4,1.2c10.1-8.5,20.2-17.1,30.3-25.6\n        c-0.2-0.4-0.4-0.8-0.6-1.2c-4.9,0-9.9,0-15.4,0c1.3-2.2,2.3-3.8,3.4-5.7c-7.9-0.4-15.1-3.3-21,5c-5,7-5,14.1-5.6,22.1\n        c3-0.7,5.1-1.1,7.6-1.7C164,107.4,164,109.3,164,111.1z M213.8,143c0.6-0.1,1.2-0.1,1.8-0.2c0-16,0-32,0-48.3\n        c-8.4,6.1-9.4,15.8-12.6,24.3c-0.2,0.4,0.1,1.1,0.3,1.6C206.8,127.9,210.3,135.5,213.8,143z M274.4,208.7c0.4,0.1,0.9,0.2,1.3,0.3\n        c5.9-4.5,11.8-9.1,18.4-14.1c-4.2-2.7-7.8-5-12.1-7.7C279.3,195,276.9,201.8,274.4,208.7z M340.1,277.5c-6-7.3-11-13.4-16.7-20.3\n        C322.2,272,324.2,274.6,340.1,277.5z"
}), /* @__PURE__ */ React28.createElement("path", {
  fill: "#4F6C90",
  d: "M233.6,271.1c2,0.9,3.9,1.9,5.9,2.6c2.2,0.8,4.6,1.4,6.9,2.1c-9.7-2.5-15.4,2.8-20.4,10.2\n        c-4.2,6.1-9.5,11.4-14,17.3c-1.1,1.5-2,4.8-1.2,6c2.2,3.1,0.8,5-0.8,7.5c-4.3,6.6-9.9,11.4-16.9,14.9c-1.9,1-3.5,2.8-5.1,4.4\n        c-0.9,0.9-1.5,2.2-2.3,3.3c-3.4,5-8.5,9.7-9.8,15.2c-1.2,5.2,1.8,11.3,3.1,17.7c-4.1-4.5-7.9-8.8-12.1-13.5\n        c5.7-8.1,11.6-16.6,17.6-25.3c-6.4-5.3-8.9,1.6-13.9,4.6c1.5-3.3,2.5-5.5,3.6-8c-2.5-1.7-5-3.4-7.8-5.3c-1,1.5-1.9,2.9-2.8,4.3\n        c-1.9-6-3.8-11.9-5.8-18.3c-1.5,1.1-2.1,1.6-3.3,2.5c-2-15.2-15.1-27.6-8.9-45.3c1.2,6.2,2.1,11.2,3.2,16.2c0.5,2.4,1.3,4.9,2.5,6.9\n        c6.8,11.3,13.7,22.5,20,32.6c2.3,0.3,4,0.1,5.2,0.7c13.8,6.8,22.9,4.3,30.7-8.9c0.8-1.3,0.4-3.3,0.6-5.1\n        c-11.1,0.9-12.8-0.2-13.6-8.5c-3.1,0.4-6.2,0.9-9.1,1.3c-2.5-8-5-16.1-7.6-24.3c0.9,0.4,2.2,1,4.7,2.1c-3.8-7.3-3.2-16.3-12.9-17.6\n        c7.1-5.3,14.2-10.6,21.4-16c0.3,0.3,0.6,0.6,0.9,0.9c-3.2,3.6-6.5,7.1-9.5,10.9c-1.1,1.4-2.3,3.8-1.9,5.3\n        c2.7,11.4,5.8,22.6,8.9,34.5c5.5-0.5,11.2-1.7,15-8.3c3.1-5.4,7.5-10,11.3-15c1.2,0.1,2.3,0.3,3.5,0.4c-6.3,8.1-12.7,16.1-18.8,24.3\n        c-0.9,1.2-0.4,3.5-0.5,5.3c2.2-0.1,4.5,0.1,6.6-0.5c1-0.3,1.7-2,2.5-3C217,291.8,225.3,281.4,233.6,271.1z"
}), /* @__PURE__ */ React28.createElement("path", {
  fill: "#4A7D92",
  d: "M249.8,197.1c-7.4-2.4-14.8-4.8-21.4-6.9C234.6,186.1,246.9,189.5,249.8,197.1\n        C249.8,197.2,249.8,197.1,249.8,197.1z"
}), /* @__PURE__ */ React28.createElement("path", {
  fill: "#A0C5DB",
  d: "M101.6,210.5c-2.7,0.6-2.6-0.5-2.2-2.7c1.6-8.9,4.6-16.9,13.2-21.4c6.9-3.6,9.8-9.7,12.4-16.7\n        c3.3-8.6,8.3-16.5,12.5-24.8c0.5-1,0.9-2,1.4-3c0.8,0.5,1.6,0.9,2.3,1.4c-1.2,4.1-2.6,8.2-3.7,12.4c-1,4.1-1.9,8.2-2.6,12.3\n        c-1.2,6.6-0.7,13.9-6.7,18.7c-6.5,5.1-9.6,11.6-12,19.6c-4.1,14.1-10.7,27.4-16.4,41.5c5.7-4.7,11.7-9.6,18.2-15\n        c0.2,14.1,1.2,27.5-3.4,40.5c-1.1,3-1.9,6.2-2.8,9.3c-0.1,0.4-0.1,0.8-0.2,1.3c0.2-0.2,0.5-0.5,0.7-0.7c0.9-0.3,1.8-0.6,2.8-0.9\n        c0,13.4,0,26.7,0,39.9c-0.3,0.2-0.6,0.4-0.9,0.6c-2.1-3.6-4.2-7.2-6.7-11.4c-1.6,1.7-3.2,3.3-6.1,6.5c0.8-6,1.4-10.5,2-14.9\n        c0.2-1.5,1.2-3.3,0.7-4.4c-5.7-11.3-7.1-23.4-7.2-37.1c-9.9,3.5-18.7,6.7-29.5,10.6c5.9-8.2,3.9-17.1,10.2-24.5\n        c9.4-11,16.3-24.1,24.3-36.3c0.1-0.6,0.3-1.2,0.4-1.8C102.3,209.7,102,210.1,101.6,210.5z"
}), /* @__PURE__ */ React28.createElement("path", {
  fill: "#A0C6DC",
  d: "M88.6,272.6c-1.9,8.1-4.5,15.2-4.9,22.4c-0.5,7.4-4,12.7-7.7,18.5c-7,10.8-13.7,21.9-20.7,32.8\n        c-0.6,1-1.8,2.6-2.7,2.5c-7.7-0.7-16.5,2.5-22.3-5.8c-0.3-0.5-0.8-0.8-1.1-1.3c3.3-8.1,7.8-15.9,9.5-24.3\n        c2.5-11.8,7.4-20.8,16.4-29.3C64.9,279,75.8,275.5,88.6,272.6z"
}), /* @__PURE__ */ React28.createElement("path", {
  fill: "#F6F7F9",
  d: "M233.6,271.1c-8.3,10.4-16.6,20.7-24.9,31.1c-0.8,1-1.5,2.7-2.5,3c-2.1,0.6-4.4,0.4-6.6,0.5\n        c0.1-1.8-0.4-4.1,0.5-5.3c6.1-8.2,12.5-16.3,18.8-24.3c6.4-8,12.7-16,19.3-23.8c1.8-2.1,4.6-3.4,7.2-5.2c-4-5.3-10.6-8.1-18.4-8.6\n        c0.1-0.7,0.2-1.4,0.2-2.1c5.2-0.2,10.3-0.5,15.5-0.7c3.2-0.1,6.3-0.2,9.6-1.2c2.9,0.7,6.7,1.7,3.4,6.5c-0.5,0.7,0.8,3,1.7,4.3\n        c4.3,6.5,6.2,13.5,5.4,22c-4.6-6-8.5-11.3-13-17.3C243.9,257.6,238.8,264.3,233.6,271.1z"
}), /* @__PURE__ */ React28.createElement("path", {
  fill: "#9FC5DB",
  d: "M200.2,64.3c4.2,9.2,7.9,17.1,11.1,24.2c-2.4,3.5-4.5,6.4-6.3,9.5c-5.8,9.5-11.6,19-18.3,30\n        c-3.4-9.2-5.5-17-3.8-24.6c0.7-3.5,5.8-6.1,8.8-9.1c2.8-2.8,5.7-5.7,9.5-9.5c-4.7-1.5-7.6-2.5-11.5-3.7\n        C193.1,75.7,196.3,70.5,200.2,64.3z"
}), /* @__PURE__ */ React28.createElement("path", {
  fill: "#F9FAFB",
  d: "M164,111.1c0-1.8,0-3.6,0-5.9c-2.6,0.6-4.7,1-7.6,1.7c0.6-8,0.6-15.1,5.6-22.1c5.9-8.3,13.1-5.4,21-5\n        c-1.1,1.9-2.1,3.5-3.4,5.7c5.5,0,10.4,0,15.4,0c0.2,0.4,0.4,0.8,0.6,1.2c-10.1,8.5-20.2,17.1-30.3,25.6\n        C164.9,111.9,164.5,111.5,164,111.1z"
}), /* @__PURE__ */ React28.createElement("path", {
  fill: "#9EC3DA",
  d: "M213.8,143c-3.5-7.5-7-15.1-10.5-22.6c-0.2-0.5-0.5-1.2-0.3-1.6c3.2-8.5,4.2-18.2,12.6-24.3\n        c0,16.3,0,32.3,0,48.3C215,142.9,214.4,142.9,213.8,143z"
}), /* @__PURE__ */ React28.createElement("path", {
  fill: "#9FC4DA",
  d: "M274.4,208.7c2.4-6.8,4.8-13.7,7.6-21.4c4.3,2.7,7.8,5,12.1,7.7c-6.5,5-12.4,9.5-18.4,14.1\n        C275.3,208.9,274.9,208.8,274.4,208.7z"
}), /* @__PURE__ */ React28.createElement("path", {
  fill: "#9EC3D9",
  d: "M340.1,277.5c-15.9-2.9-17.9-5.4-16.7-20.3C329.1,264.1,334.1,270.2,340.1,277.5z"
}), /* @__PURE__ */ React28.createElement("path", {
  fill: "#FDFDFE",
  d: "M186,153.4c0.2,0.4,0.4,0.8,0.5,1.2c-0.5-0.1-0.9-0.2-1.4-0.3C185.5,154,185.8,153.7,186,153.4z"
}), /* @__PURE__ */ React28.createElement("path", {
  fill: "#48668C",
  d: "M101.6,210.5c0.4-0.4,0.7-0.8,1.1-1.2c-0.1,0.6-0.3,1.2-0.4,1.8C102.1,210.9,101.9,210.7,101.6,210.5z"
}), /* @__PURE__ */ React28.createElement("path", {
  fill: "#48668C",
  d: "M112.5,283c-0.2,0.2-0.5,0.5-0.7,0.7c0.1-0.4,0.1-0.8,0.2-1.3C112.2,282.6,112.4,282.8,112.5,283z"
})));
var yetiswap_default = YetiSwapIcon;

// src/searchbar/icons/zero.exchange.tsx
import React29 from "react";
var ZeroExchangeIcon = ({ height, width }) => /* @__PURE__ */ React29.createElement(abstract_default, {
  height: height != null ? height : 16,
  width: width != null ? width : 16,
  viewBox: "0 0 400 400"
}, /* @__PURE__ */ React29.createElement("g", {
  transform: "translate(0)"
}, /* @__PURE__ */ React29.createElement("path", {
  fill: "#725CF7",
  d: "M381.3,378.8c-87.3,0-174.6,0-261.9,0c-0.9-0.3-1.7-0.9-2.6-1c-22.7-3.9-42.5-13.3-58.6-30.2\n        c10.4-10.7,20.7-21.5,31.1-32c5.1-5.2,10.5-10,15.8-15c8.5,7.6,18.7,10.8,29.9,11c36.3,0,72.5,0,108.8,0c2,0.1,4,0.2,6,0.2\n        c41.8,0,83.6,0.1,125.4,0.1c1.9,0,3.9,0,6.1,0C381.3,334.6,381.3,356.7,381.3,378.8z"
}), /* @__PURE__ */ React29.createElement("path", {
  fill: "#BA73FB",
  d: "M105.2,300.6c-5.3,5-10.7,9.8-15.8,15c-10.5,10.6-20.8,21.4-31.1,32.1c-14.4-14-23.6-31-28.5-50.4\n        c-0.9-3.8-2-7.6-2.9-11.4c0-8.3,0-16.7,0-25c0.3-0.9,0.8-1.8,1-2.7c3.4-24.3,14.1-44.8,31.3-62c35.7-35.9,71.4-71.7,107.2-107.5\n        c37.6,0,75.2,0,112.7,0c-12.6-0.6-22.7,4.3-31.5,13.2c-46.6,47-93.3,93.8-140,140.6C89.6,260.3,88.8,281.5,105.2,300.6z"
}), /* @__PURE__ */ React29.createElement("path", {
  fill: "#21F7E9",
  d: "M279,88.6c-37.6,0-75.2,0-112.7,0c-2.1-0.1-4.3-0.3-6.4-0.3c-41.5,0-83,0-124.4,0c-2.1,0-4.1,0-6.4,0\n        c0-22.6,0-44.4,0-66.2C47.5,22,66,22,84.6,21.9c20.6,0,41.2,0,61.7,0c22.6,0,45.1,0,67.7,0c16.3,0,32.7,0.1,49,0\n        c1.6,0,3.2-0.6,4.8-0.9c7.3,0,14.6,0,21.9,0c2.6,0.7,5.2,1.4,7.9,2c21.2,4.5,39.7,13.9,54.8,29.8c-14.1,14.1-28.3,28.2-42.4,42.3\n        c-1.5,1.5-3.3,2.7-5,4C297.4,92.9,289,88.6,279,88.6z"
}), /* @__PURE__ */ React29.createElement("path", {
  fill: "#59FAEF",
  d: "M214,21.9c-22.6,0-45.1,0-67.7,0c0-0.3,0-0.6,0-0.9c22.6,0,45.1,0,67.7,0C214.1,21.3,214,21.6,214,21.9z"
}), /* @__PURE__ */ React29.createElement("path", {
  fill: "#67FAF0",
  d: "M146.4,21c0,0.3,0,0.6,0,0.9c-20.6,0-41.2,0-61.7,0c0-0.3,0-0.6,0-0.9C105.2,21,125.8,21,146.4,21z"
}), /* @__PURE__ */ React29.createElement("path", {
  fill: "#74FAF1",
  d: "M84.6,21c0,0.3,0,0.6,0,0.9C66,22,47.5,22,29,22.1c0-0.4-0.1-0.7-0.1-1.1C47.4,21,66,21,84.6,21z"
}), /* @__PURE__ */ React29.createElement("path", {
  fill: "#4BF8ED",
  d: "M214,21.9c0-0.3,0-0.6,0-0.9c17.9,0,35.8,0,53.8,0c-1.6,0.3-3.2,0.9-4.8,0.9C246.7,22,230.4,22,214,21.9z"
}), /* @__PURE__ */ React29.createElement("path", {
  fill: "#1FB8F9",
  d: "M135.1,311.6c12-1,21.2-7,29.6-15.5c45.4-45.9,90.8-92,137-137.2c17.4-17,20.3-41.5,3.3-59.9\n        c1.7-1.3,3.5-2.5,5-4c14.2-14.1,28.3-28.2,42.4-42.3c17.1,16.8,27,37.3,29.9,61c4.3,35.6-7.1,65.8-32.3,91.1\n        c-33.9,34-67.8,68.1-101.7,102.1c-1.5,1.5-2.9,3.1-4.4,4.7C207.6,311.6,171.4,311.6,135.1,311.6z"
})));
var zero_exchange_default = ZeroExchangeIcon;

// src/searchbar/icons/beamswap.tsx
import React30 from "react";
var BeamSwapIcon = ({ height, width }) => /* @__PURE__ */ React30.createElement(abstract_default, {
  height: height != null ? height : 16,
  width: width != null ? width : 16,
  viewBox: "0 0 400 400"
}, /* @__PURE__ */ React30.createElement("g", {
  transform: "translate(0)"
}, /* @__PURE__ */ React30.createElement("g", {
  style: { opacity: 0.2 }
}, /* @__PURE__ */ React30.createElement("linearGradient", {
  id: "SVGID_1_",
  gradientUnits: "userSpaceOnUse",
  x1: "200.3752",
  y1: "379.0547",
  x2: "200.3752",
  y2: "20.9453",
  gradientTransform: "matrix(1 0 0 -1 0 400)"
}, /* @__PURE__ */ React30.createElement("stop", {
  offset: "0",
  style: { stopColor: "#15CEF7" }
}), /* @__PURE__ */ React30.createElement("stop", {
  offset: "1",
  style: { stopColor: "#9123C5" }
})), /* @__PURE__ */ React30.createElement("path", {
  style: { fillRule: "evenodd", clipRule: "evenodd", fill: "url(#SVGID_1_)" },
  d: "M22,184.5c7.9-91.6,84.7-163.5,178.3-163.5c93.7,0,170.5,71.9,178.4,163.5H22z M341.5,310.2H59.2\n        c-3.3-4.2-6.4-8.5-9.2-13h300.7C347.8,301.6,344.8,306,341.5,310.2z M295,352H105.8c-5.4-3.4-10.6-7-15.6-10.9h220.3\n        C305.5,345,300.3,348.7,295,352z M78.4,331.1h243.9c4.1-3.8,8-7.8,11.7-11.9H66.7C70.5,323.3,74.4,327.3,78.4,331.1z M200.4,379.1\n        c25.5,0,50.7-5.4,74-16H126.4C149.6,373.6,174.9,379.1,200.4,379.1z M21.8,187.4H379c0.3,4.2,0.5,8.4,0.5,12.6c0,1.3,0,2.6-0.1,4\n        l0,0.5c0,0.3,0,0.6,0,0.9H21.4c0-0.5,0-1,0-1.4l0,0c0-1.3-0.1-2.6-0.1-4C21.3,195.8,21.5,191.6,21.8,187.4z M23.3,226.4h354.2\n        c0.8-5.6,1.4-11.2,1.7-17H21.6C21.9,215.1,22.4,220.8,23.3,226.4z M365.9,268.3H34.8c-2-4.9-3.9-9.9-5.5-15h342\n        C369.8,258.4,368,263.4,365.9,268.3z M27.7,247.3h345.4c1.4-5.2,2.6-10.6,3.6-16H24.1C25.1,236.7,26.2,242.1,27.7,247.3z\n        M355.6,289.2H45.1c-2.6-4.5-5-9.2-7.2-14h325C360.6,280,358.2,284.7,355.6,289.2z"
})), /* @__PURE__ */ React30.createElement("linearGradient", {
  id: "SVGID_00000183928502295634376560000004982184485435288483_",
  gradientUnits: "userSpaceOnUse",
  x1: "200.3763",
  y1: "360.8944",
  x2: "200.3763",
  y2: "39.1083",
  gradientTransform: "matrix(1 0 0 -1 0 400)"
}, /* @__PURE__ */ React30.createElement("stop", {
  offset: "0",
  style: { stopColor: "#15CEF7" }
}), /* @__PURE__ */ React30.createElement("stop", {
  offset: "1",
  style: { stopColor: "#9123C5" }
})), /* @__PURE__ */ React30.createElement("path", {
  style: { fillRule: "evenodd", clipRule: "evenodd", fill: "url(#SVGID_00000183928502295634376560000004982184485435288483_)" },
  d: "\n      M40.1,186c7.1-82.3,76.1-146.9,160.3-146.9c84.2,0,153.2,64.6,160.3,146.9H40.1z M327.2,299H73.6c-2.9-3.8-5.7-7.6-8.3-11.6h270.2\n      C332.9,291.3,330.1,295.2,327.2,299z M285.4,336.6h-170c-4.8-3-9.5-6.3-14-9.8h198C294.9,330.3,290.2,333.6,285.4,336.6z\n      M90.8,317.8h219.1c3.7-3.4,7.2-7,10.5-10.7H80.3C83.6,310.8,87.1,314.4,90.8,317.8z M200.4,360.9c22.9,0,45.6-4.9,66.5-14.4H133.9\n      C154.8,356,177.4,360.9,200.4,360.9z M39.9,188.7h320.9c0.3,3.8,0.4,7.5,0.4,11.3c0,1.2,0,2.4-0.1,3.5v0v0v0v0v0c0,0.4,0,0.9,0,1.3\n      H39.6c0-0.4,0-0.9,0-1.3c0-1.2-0.1-2.4-0.1-3.6C39.5,196.2,39.7,192.4,39.9,188.7z M41.2,223.7h318.3c0.7-5,1.3-10.1,1.5-15.3H39.7\n      C40,213.6,40.5,218.7,41.2,223.7z M349.2,261.3H51.6c-1.8-4.4-3.5-8.9-4.9-13.5H354C352.6,252.5,351,256.9,349.2,261.3z M45.2,242.5\n      h310.4c1.3-4.7,2.4-9.5,3.2-14.4H42C42.8,233,43.9,237.8,45.2,242.5z M339.9,280.2h-279c-2.4-4.1-4.5-8.3-6.5-12.5h292\n      C344.4,271.9,342.2,276.1,339.9,280.2z"
}), /* @__PURE__ */ React30.createElement("g", {
  style: { opacity: 0.5 }
}, /* @__PURE__ */ React30.createElement("linearGradient", {
  id: "SVGID_00000013889303268019635800000010446692763919938215_",
  gradientUnits: "userSpaceOnUse",
  x1: "200.3732",
  y1: "349.2991",
  x2: "200.3732",
  y2: "50.7141",
  gradientTransform: "matrix(1 0 0 -1 0 400)"
}, /* @__PURE__ */ React30.createElement("stop", {
  offset: "0",
  style: { stopColor: "#15CEF7" }
}), /* @__PURE__ */ React30.createElement("stop", {
  offset: "1",
  style: { stopColor: "#9123C5" }
})), /* @__PURE__ */ React30.createElement("path", {
  style: { fillRule: "evenodd", clipRule: "evenodd", fill: "url(#SVGID_00000013889303268019635800000010446692763919938215_)" },
  d: "\n        M51.7,187c6.6-76.4,70.6-136.3,148.7-136.3c78.1,0,142.1,60,148.7,136.3H51.7z M318,291.8H82.7c-2.7-3.5-5.3-7.1-7.7-10.8h250.8\n        C323.3,284.7,320.8,288.3,318,291.8z M279.2,326.8H121.5c-4.5-2.8-8.8-5.8-13-9.1h183.7C288.1,320.9,283.7,324,279.2,326.8z\n        M98.7,309.3H302c3.4-3.2,6.7-6.5,9.8-10H88.9C92,302.8,95.3,306.1,98.7,309.3z M200.4,349.3c21.3,0,42.3-4.5,61.7-13.3H138.7\n        C158.1,344.8,179.1,349.3,200.4,349.3z M51.5,189.5h297.8c0.2,3.5,0.4,7,0.4,10.5c0,1.1,0,2.2-0.1,3.3c0,0.4,0,0.8,0,1.2H51.2\n        c0-0.4,0-0.8,0-1.2l0,0c0-1.1-0.1-2.2-0.1-3.3C51.1,196.5,51.2,193,51.5,189.5z M52.7,222h295.4c0.7-4.7,1.2-9.4,1.4-14.2H51.3\n        C51.5,212.6,52,217.3,52.7,222z M338.4,256.9H62.3c-1.7-4.1-3.2-8.2-4.5-12.5H343C341.6,248.7,340.1,252.8,338.4,256.9z\n        M56.4,239.4h288c1.2-4.4,2.2-8.8,3-13.3h-294C54.2,230.6,55.2,235.1,56.4,239.4z M329.8,274.4H70.9c-2.2-3.8-4.2-7.7-6-11.6h271\n        C334,266.7,332,270.6,329.8,274.4z"
})), /* @__PURE__ */ React30.createElement("g", {
  style: { opacity: 0.4 }
}, /* @__PURE__ */ React30.createElement("linearGradient", {
  id: "SVGID_00000073699279880338609790000003861742514358607293_",
  gradientUnits: "userSpaceOnUse",
  x1: "200.3715",
  y1: "309.9554",
  x2: "200.3715",
  y2: "90.0529",
  gradientTransform: "matrix(1 0 0 -1 0 400)"
}, /* @__PURE__ */ React30.createElement("stop", {
  offset: "0",
  style: { stopColor: "#15CEF7" }
}), /* @__PURE__ */ React30.createElement("stop", {
  offset: "1",
  style: { stopColor: "#9123C5" }
})), /* @__PURE__ */ React30.createElement("path", {
  style: { fillRule: "evenodd", clipRule: "evenodd", fill: "url(#SVGID_00000073699279880338609790000003861742514358607293_)" },
  d: "        \n          M90.9,190.5C95.7,134.2,142.9,90,200.4,90c57.5,0,104.7,44.2,109.5,100.4H90.9z M287,267.6H113.7c-2-2.6-3.9-5.2-5.7-8h184.7\n          C290.9,262.4,289,265.1,287,267.6z M258.4,293.4H142.3c-3.3-2.1-6.5-4.3-9.6-6.7H268C265,289,261.8,291.3,258.4,293.4z\n          M125.5,280.5h149.7c2.5-2.3,4.9-4.8,7.2-7.3H118.3C120.6,275.7,123,278.2,125.5,280.5z M200.4,309.9c15.7,0,31.2-3.3,45.4-9.8\n          h-90.8C169.2,306.6,184.7,310,200.4,309.9z M90.7,192.3H310c0.2,2.6,0.3,5.1,0.3,7.7c0,0.8,0,1.6-0.1,2.4c0,0.3,0,0.6,0,0.9H90.5\n          c0-0.3,0-0.6,0-0.9l0,0c0-0.8-0.1-1.6-0.1-2.4C90.4,197.4,90.5,194.8,90.7,192.3z M91.6,216.2h217.5c0.5-3.4,0.9-6.9,1-10.4H90.6\n          C90.7,209.3,91.1,212.7,91.6,216.2z M302,241.9H98.7c-1.2-3-2.4-6.1-3.3-9.2h210C304.4,235.8,303.3,238.9,302,241.9z M94.3,229\n          h212.1c0.9-3.2,1.6-6.5,2.2-9.8H92.1C92.7,222.6,93.4,225.8,94.3,229z M295.7,254.8H105c-1.6-2.8-3.1-5.6-4.5-8.6h199.6\n          C298.8,249.1,297.3,252,295.7,254.8z"
})), /* @__PURE__ */ React30.createElement("path", {
  fill: "#05113B",
  d: "M252.9,112.8c16.8-9.1,29-12.6,48.4-7.4c19.4,5.2,21,42.1,29.2,57.9c-11.6-14.3-18.2-41.6-38.5-42.9\n        c-20.3-1.2-40.8,5.9-53.9,18.6c3.1,2.5,6.2,5,9.3,7.5c-26.1,15.1-61.4,18.5-91.6,8.8c10.8-1.1,21.1-5.1,29.2-11.2\n        c-12.2-17.9-40.7-23.3-64.4-19.7C97,128.1,96,157.3,73.2,163.7c19.6-22.4,29.8-50.6,59.2-59c11.3-3.2,17.3-3.8,28.3,0.5\n        c13.3,5.2,31.8,23.8,46.2,25.8C219.8,132.8,242.2,118.6,252.9,112.8L252.9,112.8z"
}), /* @__PURE__ */ React30.createElement("path", {
  fill: "#05113B",
  d: "M126.2,227.1c11.7-6.4,20.2-8.8,33.7-5.1c13.5,3.6,14.6,29.3,20.3,40.3c-8.1-10-12.7-29-26.8-29.9\n        c-14.1-0.9-28.4,4.1-37.5,13c2.1,1.7,4.3,3.5,6.4,5.2c-18.2,10.5-42.7,12.9-63.7,6.1c7.5-0.8,14.7-3.6,20.3-7.8\n        c-8.5-12.5-28.3-16.2-44.8-13.7c-16.5,2.5-17.1,22.9-33,27.3c13.7-15.6,20.7-35.2,41.2-41.1c7.9-2.2,12-2.7,19.7,0.3\n        c9.3,3.6,22.2,16.6,32.2,18C103.1,241.1,118.7,231.1,126.2,227.1L126.2,227.1z"
}), /* @__PURE__ */ React30.createElement("path", {
  fill: "#05113B",
  d: "M291,297.8c12.7-6.9,22-9.5,36.7-5.6c14.7,3.9,15.9,31.7,22.1,43.6c-8.8-10.8-13.8-31.4-29.1-32.3\n        c-15.3-0.9-30.8,4.4-40.8,14.1c2.3,1.9,4.7,3.8,7,5.6c-19.7,11.4-46.5,14-69.3,6.7c8.2-0.9,16-3.9,22.1-8.5\n        c-9.2-13.5-30.8-17.6-48.7-14.8c-17.9,2.7-18.6,24.8-35.9,29.6c14.9-16.9,22.5-38.1,44.8-44.5c8.6-2.4,13.1-2.9,21.4,0.4\n        c10.1,3.9,24.1,17.9,35,19.5C265.9,312.9,282.8,302.2,291,297.8L291,297.8z"
})));
var beamswap_default = BeamSwapIcon;

// src/searchbar/icons/solarbeam.tsx
import React31 from "react";
var SolarBeamIcon = ({ height, width }) => /* @__PURE__ */ React31.createElement(abstract_default, {
  height: height != null ? height : 16,
  width: width != null ? width : 16,
  viewBox: "0 0 400 400"
}, /* @__PURE__ */ React31.createElement("g", {
  transform: "translate(0)"
}, /* @__PURE__ */ React31.createElement("g", null, /* @__PURE__ */ React31.createElement("linearGradient", {
  id: "SVGID_1_",
  gradientUnits: "userSpaceOnUse",
  x1: "2072.4641",
  y1: "-1546.937",
  x2: "2469.3081",
  y2: "-1546.937",
  gradientTransform: "matrix(-0.7071 -0.7071 -0.7071 0.7071 711.9044 2899.5825)"
}, /* @__PURE__ */ React31.createElement("stop", {
  offset: "0",
  style: { stopColor: "#FFCB86" }
}), /* @__PURE__ */ React31.createElement("stop", {
  offset: "1",
  style: { stopColor: "#D75CA9" }
})), /* @__PURE__ */ React31.createElement("circle", {
  style: { fill: `url(#SVGID_1_)` },
  cx: "200",
  cy: "200",
  r: "198.4"
})), /* @__PURE__ */ React31.createElement("path", {
  fill: "#FFFFFF",
  d: "M373.8,186.5c-2.4-31.5-13.2-60.6-30.1-85.2c-5.8-8.4-12.3-16.3-19.5-23.6c-31.6-32.1-75.5-52-124.1-52\n        c-16.6,0-32.6,2.4-47.9,6.7c-10.7,3-21,7.1-30.7,12c-34.3,17.4-62.2,45.7-78.8,80.4c-4.7,9.8-8.5,20.2-11.3,31\n        c-3.7,14.1-5.7,28.9-5.7,44.2c0,46.5,18.2,88.6,47.8,119.9c7.2,7.6,15,14.5,23.4,20.7c25.6,18.8,56.6,30.8,90.2,33.2\n        c4.2,0.3,8.5,0.5,12.9,0.5c4.3,0,8.5-0.2,12.7-0.5c39.4-2.8,75.1-18.7,103-43.4c6-5.3,11.5-11,16.7-17\n        c23.7-27.7,38.9-62.8,41.5-101.4c0.3-3.9,0.5-7.9,0.5-11.9C374.4,195.4,374.1,190.9,373.8,186.5z M348.8,177.3l-157.5-57.4\n        c0.7-4.5,1.1-9.1,1.1-13.7c0-0.9,0-1.9-0.1-2.8l121.5-1.8C331.9,122.7,344.4,148.7,348.8,177.3z M200,49.5\n        c32.9,0,63.3,10.6,88.1,28.6l-99.9,1.4c-3.2-10.1-8.2-19.5-14.6-27.7C182.1,50.4,191,49.5,200,49.5z M147.6,59\n        c12.8,11.8,20.8,28.6,20.8,47.2c0,35.4-28.8,64.2-64.2,64.2c-18.2,0-34.6-7.6-46.3-19.7C72.6,108.4,105.7,74.6,147.6,59z M49.5,200\n        c0-7.9,0.6-15.7,1.8-23.3c7.5,5.6,16,10.1,25.1,13.1l-2.1,92.7C58.7,258.9,49.5,230.5,49.5,200z M97.6,310.1l2.6-115.9\n        c1.3,0.1,2.6,0.1,3.9,0.1c5,0,9.9-0.4,14.7-1.2l58.9,155.7C147,344.2,119.3,330.3,97.6,310.1z M203.8,350.4l-62.2-164.4\n        c6-2.8,11.6-6.3,16.7-10.3l140.2,137.9C273,335.7,240,349.5,203.8,350.4z M315.3,296.5L175,158.5c3.6-4.9,6.7-10.1,9.3-15.7\n        l166.1,60.5C349.6,238.8,336.5,271.2,315.3,296.5z"
})));
var solarbeam_default = SolarBeamIcon;

// src/searchbar/icons/stellaswap.tsx
import React32 from "react";
var StellaSwapIcon = ({ height, width }) => /* @__PURE__ */ React32.createElement(abstract_default, {
  height: height != null ? height : 16,
  width: width != null ? width : 16,
  viewBox: "0 0 400 400"
}, /* @__PURE__ */ React32.createElement("g", {
  transform: "translate(0)"
}, /* @__PURE__ */ React32.createElement("circle", {
  fill: "#301748",
  cx: "200",
  cy: "199.1",
  r: "194.9"
}), /* @__PURE__ */ React32.createElement("linearGradient", {
  id: "SVGID_1_",
  gradientUnits: "userSpaceOnUse",
  x1: "11109.6904",
  y1: "189.3136",
  x2: "11412.6572",
  y2: "189.3136",
  gradientTransform: "matrix(-1 0 0 -1 11484.75 400)"
}, /* @__PURE__ */ React32.createElement("stop", {
  offset: "0",
  style: { stopColor: `#E2107B` }
}), /* @__PURE__ */ React32.createElement("stop", {
  offset: "1",
  style: { stopColor: `#301748` }
})), /* @__PURE__ */ React32.createElement("path", {
  style: { fill: `url(#SVGID_1_)` },
  d: "M207.4,328.9c-6.6-6.1-12.8-12.6-18.5-19.5c-13.6-17.5-43.9-48.3-51.4-55.9c-8.7-8.8-17.4-17.7-26-26.7\n        c-1.3-1.3-3.3-2.8-2.1-5c1.2-2.2,3.6-1.8,5.7-1.7c0.9,0.1,1.9,0.3,2.7,0.6c6.2,2.4,12.3,4.9,18.5,7.4c12.3,5,24.3,10.1,36.7,14.8\n        c7.4,2.8,10.6,0,9.2-7.8c-1.2-6.5-2.8-12.9-4.6-19.3c-1.5-5.4,1.6-11,7-12.5c0.5-0.1,1-0.2,1.6-0.3c2.5-0.4,5.1-0.4,7.6-0.6\n        c2.5-0.2,5.1-0.8,6.2-3.8c1-2.7,0.1-5.7-2.1-7.4c-8.4-8.1-16.6-16.2-24.9-24.4c-20.8-20.5-41.5-41-62.2-61.5\n        C98.4,93.3,86.1,81.2,73.9,69.1c-1.2-1.2-2.5-2.2-1.5-4.1s2.6-1.6,4.2-1.3c5.1,1,8.8,4.7,12.8,7.4c10.7,7.4,21.9,14,32.8,21\n        c7.6,4.8,15.3,9.5,22.9,14.4c7.6,4.9,14.7,9.7,22.2,14.5c10.7,6.8,21.5,13.4,32.2,20.2c11.5,7.3,23,14.8,34.4,22.3\n        c2.1,1.4,4,2.1,6.2,0.1c2.2-1.9,1.9-3.9,0.9-6.5c-2.3-6.2-6.6-11.1-8.2-17.4c-0.6-2.1-1-4.1,1-5.7c1.7-1.4,4.1-1.5,5.9-0.3\n        c7.8,3.7,15.3,7.8,22.7,12.3c8.9,5.6,18.2,10.6,27.8,14.9c15.6,7.4,30.5,16.1,45.3,24.9c8.1,5.2,15.2,11.9,20.6,19.9\n        c4.3,5.9,7.9,12.3,10.7,19c4,9.8,6.6,20,7.9,30.5c2.4,18.7-4.4,42.7-13.1,55.6c-7.4,11.7-17.1,21.8-28.5,29.8\n        c-7.7,5.2-15.9,9.5-24.6,12.8c-9.1,3.6-18.5,4.1-28.5,4.5c-0.8,0.1-1.6,0.1-2.5,0C256.6,356.6,236.2,353.7,207.4,328.9z\n        M341.7,266.5c0.7-33.6-26-61.5-59.7-62.2c-0.6,0-1.2,0-1.9,0c-32.9,0.2-60,27.1-60.1,62.6c0,29.1,28.3,61.5,60.5,59.5\n        C313.8,327.8,341.5,297.7,341.7,266.5z"
}), /* @__PURE__ */ React32.createElement("linearGradient", {
  id: "SVGID_00000179647521726871257740000015064218755421354396_",
  gradientUnits: "userSpaceOnUse",
  x1: "11332.2012",
  y1: "212.6705",
  x2: "11350.5742",
  y2: "212.6705",
  gradientTransform: "matrix(-1 0 0 -1 11484.75 400)"
}, /* @__PURE__ */ React32.createElement("stop", {
  offset: "0",
  style: { stopColor: `#E2107B` }
}), /* @__PURE__ */ React32.createElement("stop", {
  offset: "1",
  style: { stopColor: `#301748` }
}), /* @__PURE__ */ React32.createElement("stop", {
  offset: "1",
  style: { stopColor: `#0D1126` }
})), /* @__PURE__ */ React32.createElement("path", {
  style: { fill: `url(#SVGID_00000179647521726871257740000015064218755421354396_)` },
  d: "M134.3,187.3c0,5.2,4,9.5,9.2,9.6\n        c5.1,0,9.1-4.2,9.1-9.2c0-0.2,0-0.4,0-0.6c-0.2-5.2-4.4-9.3-9.6-9.4C137.9,178.1,134.1,182.3,134.3,187.3z"
}), /* @__PURE__ */ React32.createElement("linearGradient", {
  id: "SVGID_00000102512321202755739380000006902697473436652699_",
  gradientUnits: "userSpaceOnUse",
  x1: "11302.877",
  y1: "339.0115",
  x2: "11321.7012",
  y2: "339.0115",
  gradientTransform: "matrix(-1 0 0 -1 11484.75 400)"
}, /* @__PURE__ */ React32.createElement("stop", {
  offset: "0",
  style: { stopColor: `#E2107B` }
}), /* @__PURE__ */ React32.createElement("stop", {
  offset: "1",
  style: { stopColor: `#301748` }
}), /* @__PURE__ */ React32.createElement("stop", {
  offset: "1",
  style: { stopColor: `#0D1126` }
})), /* @__PURE__ */ React32.createElement("path", {
  style: { fill: `url(#SVGID_00000102512321202755739380000006902697473436652699_)` },
  d: "M173,70c5.6,0,8.9-3.6,8.8-9.2\n        c-0.3-4.8-4.2-8.7-9.1-8.9c-4.1,0-9.7,5.2-9.8,9.1C163.3,66.3,167.8,70.3,173,70z"
}), /* @__PURE__ */ React32.createElement("linearGradient", {
  id: "SVGID_00000039129237823542455810000013466356786325873588_",
  gradientUnits: "userSpaceOnUse",
  x1: "11411.9697",
  y1: "247.7285",
  x2: "11428.959",
  y2: "247.7285",
  gradientTransform: "matrix(-1 0 0 -1 11484.75 400)"
}, /* @__PURE__ */ React32.createElement("stop", {
  offset: "0",
  style: { stopColor: `#E2107B` }
}), /* @__PURE__ */ React32.createElement("stop", {
  offset: "1",
  style: { stopColor: `#301748` }
}), /* @__PURE__ */ React32.createElement("stop", {
  offset: "1",
  style: { stopColor: `#0D1126` }
})), /* @__PURE__ */ React32.createElement("path", {
  style: { fill: `url(#SVGID_00000039129237823542455810000013466356786325873588_)` },
  d: "M72.7,152.2c0.2-4.4-3.2-8.2-7.6-8.4\n        c-0.3,0-0.5,0-0.8,0c-4.6,0.4-8.3,4.2-8.5,8.8c0.3,4.5,4,8,8.5,8.2c4.5,0.2,8.3-3.4,8.5-7.9C72.8,152.6,72.8,152.4,72.7,152.2z"
}), /* @__PURE__ */ React32.createElement("linearGradient", {
  id: "SVGID_00000057129531663735334810000000943885206532706221_",
  gradientUnits: "userSpaceOnUse",
  x1: "11110.2441",
  y1: "98.411",
  x2: "11261.5781",
  y2: "156.7504",
  gradientTransform: "matrix(-1 0 0 -1 11484.75 400)"
}, /* @__PURE__ */ React32.createElement("stop", {
  offset: "0",
  style: { stopColor: `#0D1126` }
}), /* @__PURE__ */ React32.createElement("stop", {
  offset: "0",
  style: { stopColor: `#301748` }
}), /* @__PURE__ */ React32.createElement("stop", {
  offset: "1",
  style: { stopColor: `#E2107B` }
})), /* @__PURE__ */ React32.createElement("path", {
  style: { fill: `url(#SVGID_00000057129531663735334810000000943885206532706221_)` },
  d: "M280.6,326.3c33.2,1.5,61-28.6,61.2-59.8\n        c0.7-33.6-26-61.5-59.7-62.2c-0.6,0-1.2,0-1.9,0c-32.9,0.2-60,27.1-60.1,62.6C220,296,248.4,328.3,280.6,326.3z"
})));
var stellaswap_default = StellaSwapIcon;

// src/searchbar/icons/solar.flare.tsx
import React33 from "react";
var SolarFlareIcon = ({ height, width }) => /* @__PURE__ */ React33.createElement(abstract_default, {
  height: height != null ? height : 16,
  width: width != null ? width : 16,
  viewBox: "0 0 400 400"
}, /* @__PURE__ */ React33.createElement("g", {
  transform: "translate(0)"
}, /* @__PURE__ */ React33.createElement("linearGradient", {
  id: "SVGID_1_",
  gradientUnits: "userSpaceOnUse",
  x1: "339.4755",
  y1: "339.4754",
  x2: "60.5245",
  y2: "60.5244"
}, /* @__PURE__ */ React33.createElement("stop", {
  offset: "0",
  style: { stopColor: "#FF288B" }
}), /* @__PURE__ */ React33.createElement("stop", {
  offset: "1",
  style: { stopColor: "#FFCF90" }
})), /* @__PURE__ */ React33.createElement("path", {
  style: { fill: `url(#SVGID_1_)` },
  d: "M200,2.8C91.1,2.8,2.8,91.1,2.8,200S91.1,397.2,200,397.2c108.9,0,197.2-88.3,197.2-197.2S308.9,2.8,200,2.8z\n        M370.2,200c0,17-2.5,33.4-7.2,48.9l-83.6-36.2l6.9-6.9l83.6-15.9C370.1,193.2,370.2,196.6,370.2,200z M29.8,200\n        c0-3.3,0.1-6.6,0.3-9.9l83.8,16l6.3,6.3l-83.4,36.1C32.3,233.1,29.8,216.8,29.8,200z M126.9,181l-93.1-17.7\n        c4.1-18.7,11.4-36.3,21.1-52.2l79.8,62.1L126.9,181z M146.1,200l53.9-53.9l53.9,53.9L200,253.9L146.1,200z M273,180.8l-8.1-8.1\n        l79.9-62.2c9.9,16,17.2,33.7,21.4,52.6L273,180.8z M213,120.9V30.3c18.5,1.4,36.2,5.7,52.5,12.6l-48.1,82.3L213,120.9z M186,121.9\n        l-4,4l-48.3-82.7c16.3-6.9,33.9-11.3,52.3-12.9V121.9z M328.6,88.7l-83.1,64.7l-8.4-8.4l52.4-89.7\n        C304.2,64.5,317.4,75.7,328.6,88.7z M109.6,55.9l52.5,89.9l-8.2,8.2l-83-64.7C82.1,76.3,95.1,65,109.6,55.9z M200,370.2\n        c-67.5,0-125.9-39.4-153.4-96.5l94.2-40.8l59.2,59.2l58.9-58.9l94.3,40.9C325.6,330.9,267.3,370.2,200,370.2z"
})));
var solar_flare_default = SolarFlareIcon;

// src/searchbar/icons/mdex.tsx
import React34 from "react";
var MdexIcon = ({ height, width }) => /* @__PURE__ */ React34.createElement(abstract_default, {
  height: height != null ? height : 16,
  width: width != null ? width : 16,
  viewBox: "0 0 12 11"
}, /* @__PURE__ */ React34.createElement("g", {
  transform: "translate(0)"
}, /* @__PURE__ */ React34.createElement("path", {
  d: "M4.18999 3.23002C4.70999 3.71002 5.10999 4.08002 5.54999 4.49002C3.66999 5.76002 5.41999 7.81003 6.83999 6.61002C7.29999 6.20003 7.32999 5.49002 6.90999 5.04002C6.87999 5.00002 6.83999 4.97003 6.80999 4.94002C5.80999 4.02002 4.79999 3.10002 3.79999 2.18002C3.35999 1.69002 2.60999 1.66002 2.11999 2.10002C1.83999 2.35002 1.69999 2.73002 1.72999 3.10002C1.72999 5.50002 1.77999 7.91003 1.72999 10.31C0.899992 10.43 0.129992 9.86002 0.00999174 9.03002C-8.25524e-06 8.93002 -0.0100083 8.83002 -8.25524e-06 8.73002C0.00999174 6.77002 -0.0200083 4.81002 0.0199917 2.87002C0.0499917 1.26002 1.37999 -0.0299754 2.98999 2.45594e-05C3.72999 0.0100246 4.42999 0.300025 4.95999 0.810025C6.04999 1.83002 7.09999 2.89002 8.21999 3.86002C9.25999 5.07002 9.14999 6.88002 7.98999 7.96002C4.67999 10.68 0.949992 5.99002 4.18999 3.23002Z",
  fill: "white"
}), /* @__PURE__ */ React34.createElement("path", {
  d: "M7.39996 2.54002C6.96996 2.15002 6.58996 1.81002 6.20996 1.46002C7.59996 -0.989979 11.76 -0.039979 11.72 2.83002C11.75 4.83002 11.72 6.82002 11.69 8.82002C11.68 9.63002 11.01 10.28 10.2 10.27C10.13 10.27 10.06 10.27 9.98996 10.25C9.98996 7.92002 9.99996 5.58002 10.03 3.25002C10.12 2.65002 9.79996 2.06002 9.23996 1.82002C8.44996 1.46002 7.92996 2.02002 7.38996 2.54002H7.39996Z",
  fill: "white"
})));
var mdex_default = MdexIcon;

// src/searchbar/tokenSearch/Logo.tsx
var Logo = ({
  label,
  width,
  height,
  grayscaleFilter
}) => {
  let result;
  switch (label) {
    case "bsc":
      result = /* @__PURE__ */ React35.createElement(bsc_default, {
        width,
        height
      });
      break;
    case "avalanche":
      result = /* @__PURE__ */ React35.createElement(avalanche_default, {
        width,
        height
      });
      break;
    case "kyberdmm":
      result = /* @__PURE__ */ React35.createElement(kyber_default, {
        width,
        height
      });
      break;
    case "pangolin":
      result = /* @__PURE__ */ React35.createElement(pangolin_default, {
        width,
        height
      });
      break;
    case "sushiswap":
      result = /* @__PURE__ */ React35.createElement(sushi_default, {
        width,
        height
      });
      break;
    case "traderjoe":
      result = /* @__PURE__ */ React35.createElement(trader_default, {
        width,
        height
      });
      break;
    case "mdex":
      result = /* @__PURE__ */ React35.createElement(mdex_default, {
        width,
        height
      });
      break;
    case "Select All":
      result = /* @__PURE__ */ React35.createElement(React35.Fragment, null);
      break;
    case "moonbeam":
      result = /* @__PURE__ */ React35.createElement(moonbeam_default, {
        width,
        height
      });
      break;
    case "moonriver":
      result = /* @__PURE__ */ React35.createElement(moonriver_default, {
        width,
        height
      });
      break;
    case "apeswap":
      result = /* @__PURE__ */ React35.createElement(apeswap_default, {
        width,
        height
      });
      break;
    case "babyswap":
      result = /* @__PURE__ */ React35.createElement(babyswap_default, {
        width,
        height
      });
      break;
    case "biswap":
      result = /* @__PURE__ */ React35.createElement(biswap_default, {
        width,
        height
      });
      break;
    case "ellipsis.finance":
      result = /* @__PURE__ */ React35.createElement(ellipsis_finance_default, {
        width,
        height
      });
      break;
    case "pancakeswap":
      result = /* @__PURE__ */ React35.createElement(pancake_default, {
        width,
        height
      });
      break;
    case "safeswap":
      result = /* @__PURE__ */ React35.createElement(safeswap_default, {
        width,
        height
      });
      break;
    case "baguette":
      result = /* @__PURE__ */ React35.createElement(baguette_default, {
        width,
        height
      });
      break;
    case "canary":
      result = /* @__PURE__ */ React35.createElement(canary_default, {
        width,
        height
      });
      break;
    case "complusnetwork":
      result = /* @__PURE__ */ React35.createElement(complus_network_default, {
        width,
        height
      });
      break;
    case "elkfinance":
      result = /* @__PURE__ */ React35.createElement(elk_finance_default, {
        width,
        height
      });
      break;
    case "lydiafinance":
      result = /* @__PURE__ */ React35.createElement(lydia_finance_default, {
        width,
        height
      });
      break;
    case "oliveswap":
      result = /* @__PURE__ */ React35.createElement(oliveswap_default, {
        width,
        height
      });
      break;
    case "pandaswap":
      result = /* @__PURE__ */ React35.createElement(pandaswap_default, {
        width,
        height
      });
      break;
    case "yetiswap":
      result = /* @__PURE__ */ React35.createElement(yetiswap_default, {
        width,
        height
      });
      break;
    case "zeroexchange":
      result = /* @__PURE__ */ React35.createElement(zero_exchange_default, {
        width,
        height
      });
      break;
    case "beamswap":
      result = /* @__PURE__ */ React35.createElement(beamswap_default, {
        width,
        height
      });
      break;
    case "solarflare":
      result = /* @__PURE__ */ React35.createElement(solar_flare_default, {
        width,
        height
      });
      break;
    case "stellaswap":
      result = /* @__PURE__ */ React35.createElement(stellaswap_default, {
        width,
        height
      });
      break;
    case "solarbeam":
      result = /* @__PURE__ */ React35.createElement(solarbeam_default, {
        width,
        height
      });
      break;
    default:
      result = /* @__PURE__ */ React35.createElement(default_default, {
        width,
        height
      });
      break;
  }
  return /* @__PURE__ */ React35.createElement("div", {
    style: { filter: `grayscale(${grayscaleFilter})` }
  }, result);
};

// src/searchbar/tokenSearch/helpers/firstAndLast.ts
var firstAndLast = (str, chars = 8) => str && str.slice(0, chars) + "..." + str.slice(-chars);

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

// src/searchbar/icons/down.tsx
import React36 from "react";
var DownIcon = ({ height, width }) => /* @__PURE__ */ React36.createElement(abstract_default, {
  height: height != null ? height : 7,
  width: width != null ? width : 5,
  viewBox: "0 0 7 5"
}, /* @__PURE__ */ React36.createElement("g", {
  transform: "translate(0)"
}, /* @__PURE__ */ React36.createElement("path", {
  d: "M1 1L3.49449 3.5L6 1",
  stroke: "#7A808A",
  strokeLinecap: "round",
  transform: "translate(0)"
})));
var down_default = DownIcon;

// src/searchbar/icons/up.tsx
import React37 from "react";
var UpIcon = ({ height, width }) => /* @__PURE__ */ React37.createElement(abstract_default, {
  height: height != null ? height : 7,
  width: width != null ? width : 4,
  viewBox: "0 0 7 4"
}, /* @__PURE__ */ React37.createElement("g", {
  transform: "translate(0)"
}, /* @__PURE__ */ React37.createElement("path", {
  d: "M6 3.5L3.50551 1L1 3.5",
  stroke: "#7A808A",
  strokeLinecap: "round",
  transform: "translate(0)"
})));
var up_default = UpIcon;

// src/searchbar/tokenSearch/ResultDetail.tsx
var imageSize = 26;
var StyledDetailList = styled2.div`
  ${({ styleOverrides }) => {
  var _a2, _b2, _c2, _d2, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q, _r, _s;
  return `
    display: ${((_a2 = styleOverrides == null ? void 0 : styleOverrides.container) == null ? void 0 : _a2.display) || "grid"};
    grid-gap: 5px;
    align-items: ${((_b2 = styleOverrides == null ? void 0 : styleOverrides.container) == null ? void 0 : _b2.alignItems) || "center"};    
    justify-content: space-between;
    padding: ${((_c2 = styleOverrides == null ? void 0 : styleOverrides.container) == null ? void 0 : _c2.padding) || "5px 0"};    
    background: transparent;
    border-bottom: ${((_d2 = styleOverrides == null ? void 0 : styleOverrides.container) == null ? void 0 : _d2.borderbottom) || "1px solid #474F5C"};    
    grid-template-columns: ${((_e = styleOverrides == null ? void 0 : styleOverrides.container) == null ? void 0 : _e.gridTemplateColumns) || "15% 1% 15% 10% 10% 29% 10%"}; 
    
    border-radius: ${((_f = styleOverrides == null ? void 0 : styleOverrides.button) == null ? void 0 : _f.borderRadius) || "4px"};
    position: relative;
    font-size: ${((_g = styleOverrides == null ? void 0 : styleOverrides.token) == null ? void 0 : _g.fontSize) || "10px"};
    color: ${((_h = styleOverrides == null ? void 0 : styleOverrides.token) == null ? void 0 : _h.color) || "#B4BBC7"};

    .token {      
      grid-template-columns: 16px 100px; 
      padding: ${((_i = styleOverrides == null ? void 0 : styleOverrides.token) == null ? void 0 : _i.padding) || "0 5px"};  
      .address {
        position: relative;
        padding-left: 5px;
        > span {
          display: none;
          font-size: 8px;
          margin-top: 5px;
          span {
            color: ${((_j = styleOverrides == null ? void 0 : styleOverrides.token) == null ? void 0 : _j.color) || "#B4BBC7"};
          }
        }
      } 
    }

    &.active {
      background: #474F5C;
      color: white;
      padding: 16px 0;
      grid-template-columns: 15% 1% 15% 10% 10% 39% 0%;
      .token {
        font-weight: ${((_k = styleOverrides == null ? void 0 : styleOverrides.token) == null ? void 0 : _k.fontWeight) || "600"};      
        .address {
          font-size: 12px;
          > span {
            display: block;
          }
        }
        svg {
          width: 26px;
          height: 26px;
          margin-top: -10px;
        }
      }
    }
    .capitalize {
      text-transform: capitalize;
    }
    .text-white {
      color: white;
    }
    .icon-label {
      display: flex;   
      align-items: center;
      > span {
        padding-left: 5px;
        display: block;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;  
        flex: 1;
      }
    }
    .text-line-1 {
      display: block;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;  
      flex: 1;
    }
    .flex-center {
      display: flex;
      align-items: center;
    }  
    .flex-1 {
       flex: 1;
    }
    .gap-5 {
      gap: 20px;
    }
    .gap-2 {
      gap: 8px;
    }
    & .detail {
      padding: ${((_l = styleOverrides == null ? void 0 : styleOverrides.detail) == null ? void 0 : _l.padding) || "3px"};
    }
    
    > button {      
      display: flex;
      align-items: center;
      justify-content: center;
      justify-self: right;
      border-color: ${((_m = styleOverrides == null ? void 0 : styleOverrides.button) == null ? void 0 : _m.borderColor) || "#474F5C"};      
      background-color: ${((_n = styleOverrides == null ? void 0 : styleOverrides.button) == null ? void 0 : _n.backgroundColor) || "#474F5C"};      
      color: ${((_o = styleOverrides == null ? void 0 : styleOverrides.button) == null ? void 0 : _o.color) || "#7A808A"};      
      border-radius: ${((_p = styleOverrides == null ? void 0 : styleOverrides.button) == null ? void 0 : _p.borderRadius) || "4px"};     
      
      border-width: 0;      
      cursor: pointer;
      padding: ${((_q = styleOverrides == null ? void 0 : styleOverrides.button) == null ? void 0 : _q.padding) || "6px 8px !important"};
      width: ${((_r = styleOverrides == null ? void 0 : styleOverrides.button) == null ? void 0 : _r.width) || "auto"};
      &.down {
        position: absolute;
        top: 0;
        right: 0;
        background: transparent;
      }
      &:hover {
        background-color: ${((_s = styleOverrides == null ? void 0 : styleOverrides.button) == null ? void 0 : _s.hoverBackColor) || "#232C38"};      
      }    
    }
    .actions {
      display: flex;
      flex: 1;
      gap: 12px;
      justify-content: center;
      align-items: center;
      flex-wrap: wrap;
    }
    &:not(.active):hover {
      cursor: pointer; 
      color: rgb(193,255,0);
      .token, .pair, button, strong {
        color: rgb(193,255,0);
      }      
    }
  `;
}}
`;
var StyledAction = styled2.div`
  cursor: pointer;
  padding: 10;
`;
var Action = (props) => {
  const { component, detail } = props;
  const Component = component;
  return /* @__PURE__ */ React38.createElement(StyledAction, null, /* @__PURE__ */ React38.createElement(Component, {
    detail
  }));
};
var ResultDetail = (props) => {
  var _a2, _b2;
  const { index, suggestions, handleDetail, currentIndex, logoIcons } = props;
  const renderProps = useContext2(TokenSearch_default);
  const { customActions, customTokenDetail } = renderProps;
  const selectedPair = suggestions[index];
  const tokenImage = (token) => {
    if (token == null ? void 0 : token.image)
      return /* @__PURE__ */ React38.createElement("img", {
        alt: token == null ? void 0 : token.symbol,
        src: token == null ? void 0 : token.image,
        style: { borderRadius: "50%" },
        width: imageSize
      });
    else
      return /* @__PURE__ */ React38.createElement(default_default, null);
  };
  return /* @__PURE__ */ React38.createElement(StyledDetailList, {
    styleOverrides: customTokenDetail == null ? void 0 : customTokenDetail.list,
    onClick: () => currentIndex !== index ? handleDetail(index) : "",
    className: currentIndex === index ? "active" : ""
  }, /* @__PURE__ */ React38.createElement("div", {
    className: "token icon-label"
  }, tokenImage(selectedPair.token0), /* @__PURE__ */ React38.createElement("div", {
    className: "flex-1 address text-line-1"
  }, /* @__PURE__ */ React38.createElement("div", {
    className: "text-line-1"
  }, selectedPair.token0.name), /* @__PURE__ */ React38.createElement("span", {
    className: "text-line-1"
  }, /* @__PURE__ */ React38.createElement("span", null, "Address:"), " ", /* @__PURE__ */ React38.createElement("strong", null, firstAndLast(selectedPair.token0.address))))), "/", /* @__PURE__ */ React38.createElement("div", {
    className: "token icon-label"
  }, tokenImage(selectedPair.token1), /* @__PURE__ */ React38.createElement("div", {
    className: "flex-1 address text-line-1"
  }, /* @__PURE__ */ React38.createElement("div", null, selectedPair.token1.name), /* @__PURE__ */ React38.createElement("span", null, /* @__PURE__ */ React38.createElement("span", null, "Address:"), " ", /* @__PURE__ */ React38.createElement("strong", null, firstAndLast(selectedPair.token1.address))))), /* @__PURE__ */ React38.createElement("div", {
    className: "logo icon-label"
  }, (_a2 = logoIcons[selectedPair.network]) != null ? _a2 : /* @__PURE__ */ React38.createElement(Logo, {
    label: selectedPair.network,
    width: 12,
    height: 12
  }), /* @__PURE__ */ React38.createElement("span", {
    className: "capitalize"
  }, selectedPair.network)), /* @__PURE__ */ React38.createElement("div", {
    className: "logo icon-label"
  }, (_b2 = logoIcons[selectedPair.exchange]) != null ? _b2 : /* @__PURE__ */ React38.createElement(Logo, {
    label: selectedPair.exchange,
    width: 12,
    height: 12
  }), /* @__PURE__ */ React38.createElement("span", {
    className: "capitalize"
  }, selectedPair.exchange)), /* @__PURE__ */ React38.createElement("div", {
    className: "pair flex-center gap-5"
  }, /* @__PURE__ */ React38.createElement("div", null, "Volume: ", /* @__PURE__ */ React38.createElement("strong", {
    className: "text-white"
  }, intToWords(selectedPair.volumeUSD))), currentIndex === index && /* @__PURE__ */ React38.createElement("div", {
    className: "actions"
  }, customActions && customActions.map((action) => /* @__PURE__ */ React38.createElement(Action, {
    key: `action-${action.index}`,
    component: action.component,
    detail: selectedPair
  })))), /* @__PURE__ */ React38.createElement("button", {
    onClick: () => handleDetail(currentIndex === index ? null : index),
    className: currentIndex === index ? "down" : "up"
  }, currentIndex !== index ? /* @__PURE__ */ React38.createElement(React38.Fragment, null, /* @__PURE__ */ React38.createElement("span", null, "Details "), /* @__PURE__ */ React38.createElement(down_default, {
    width: 7,
    height: 7
  })) : /* @__PURE__ */ React38.createElement(React38.Fragment, null, /* @__PURE__ */ React38.createElement("span", null, "Close "), /* @__PURE__ */ React38.createElement(up_default, {
    height: 7,
    width: 7
  }))));
};
var ResultDetail_default = ResultDetail;

// src/searchbar/tokenSearch/SearchResult.tsx
var StyledResult = styled3.div`
  background-color: inherit;
  margin-left: auto;
  margin-right: auto;
  position: relative;
`;
var StyledLoading = styled3.div`
  ${({ styleOverrides }) => `
    position: relative;
    display: flex;
    justify-content: center;  
    margin: 10px;
    color: ${(styleOverrides == null ? void 0 : styleOverrides.color) || "white"};
    font-size: ${(styleOverrides == null ? void 0 : styleOverrides.fontSize) || "12px"};      
  `}
`;
var StyledResultTitle = styled3.div`
  ${({ styleOverrides }) => `    
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: ${(styleOverrides == null ? void 0 : styleOverrides.color) || "#fff"};
    font-size: ${(styleOverrides == null ? void 0 : styleOverrides.fontSize) || "12px"};      
    padding: ${(styleOverrides == null ? void 0 : styleOverrides.padding) || "7px 14px 2px;"};      
    margin: ${(styleOverrides == null ? void 0 : styleOverrides.margin) || "0"};      
    > span {
      font-size: ${(styleOverrides == null ? void 0 : styleOverrides.fontSize2) || "7px"};      
    }
  `}
`;
var StyledResultContent = styled3.div`
  overflow: auto;
  margin-left: auto;
  margin-right: auto;

  ${({ styleOverrides }) => `
    padding: ${(styleOverrides == null ? void 0 : styleOverrides.padding) || "14px"};    
    background: ${(styleOverrides == null ? void 0 : styleOverrides.background) || "#00070E"};
    border-radius: ${(styleOverrides == null ? void 0 : styleOverrides.borderRadius) || "4px"};        
    width: ${(styleOverrides == null ? void 0 : styleOverrides.width) || "auto"};
    height: ${(styleOverrides == null ? void 0 : styleOverrides.height) || "300px"};
    border: ${(styleOverrides == null ? void 0 : styleOverrides.border) || "1px solid grey"};   
    color: ${(styleOverrides == null ? void 0 : styleOverrides.color) || "#FFF"};
    display: ${(styleOverrides == null ? void 0 : styleOverrides.display) || "block"};   
    border-color: ${(styleOverrides == null ? void 0 : styleOverrides.borderColor) || "#474F5C"};  
    border-style: ${(styleOverrides == null ? void 0 : styleOverrides.borderStyle) || "solid"};  
    border-width: ${(styleOverrides == null ? void 0 : styleOverrides.borderWidth) || "1px"};      
    font-size: ${(styleOverrides == null ? void 0 : styleOverrides.fontSize) || "15px"};      
    font-family: ${(styleOverrides == null ? void 0 : styleOverrides.fontFamily) || "'Fira Code', monospace"};  
  `}

  & .header {
    display: grid;
    grid-template-columns: 39% 10% 10% 40%;
    border-bottom: 1px solid #474f5c;
    color: #b4bbc7;
    font-size: 11px;
    font-weight: bold;
    padding-bottom: 10px;

    span {
      display: block;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    > :last-child {
      padding-left: 5px;
    }
  }
`;
var SearchResult = (props) => {
  var _a2;
  const dispatch = useDispatch2();
  const renderProps = useContext3(TokenSearch_default);
  const { customResult, customLoading } = renderProps;
  const { suggestions, searchText, isLoading, suggestionRendered } = useSelector2((state) => state);
  const [currentIndex, setCurrentIndex] = useState2(-1);
  const hasNextPage = useMemo(() => suggestionRendered.length < suggestions.length, [suggestions, suggestionRendered]);
  const [sentryRef] = useInfiniteScroll({
    loading: isLoading,
    hasNextPage,
    onLoadMore: () => dispatch(loadMore())
  });
  if (props.loading) {
    const loadingTitle = (customLoading == null ? void 0 : customLoading.loadingTitle) ? customLoading.loadingTitle : "Searching...";
    return /* @__PURE__ */ React39.createElement(StyledLoading, {
      styleOverrides: customLoading
    }, loadingTitle);
  }
  const notFoundTitle = (customLoading == null ? void 0 : customLoading.notFoundTitle) ? customLoading.notFoundTitle : "No results found";
  const handleClose = () => {
    dispatch(setViewResult(false));
  };
  const logoIcons = {};
  (_a2 = renderProps.networks) == null ? void 0 : _a2.forEach((network) => {
    var _a3;
    logoIcons[network.id] = network.icon;
    (_a3 = network.exchanges) == null ? void 0 : _a3.forEach((exchange) => {
      logoIcons[exchange.name] = exchange.icon;
    });
  });
  return /* @__PURE__ */ React39.createElement(StyledResult, null, /* @__PURE__ */ React39.createElement(StyledResultTitle, {
    styleOverrides: customResult == null ? void 0 : customResult.title
  }, /* @__PURE__ */ React39.createElement("div", null, "Search Results ", /* @__PURE__ */ React39.createElement("span", null, "(", suggestions.length, " Results Found)")), /* @__PURE__ */ React39.createElement("button", {
    onClick: handleClose
  }, "Close\xA0", /* @__PURE__ */ React39.createElement(unchecked_default, {
    width: 7,
    height: 7
  }))), /* @__PURE__ */ React39.createElement(StyledResultContent, {
    styleOverrides: customResult == null ? void 0 : customResult.content
  }, /* @__PURE__ */ React39.createElement("div", {
    className: "header"
  }, /* @__PURE__ */ React39.createElement("span", null, "Pair"), /* @__PURE__ */ React39.createElement("span", null, "Network"), /* @__PURE__ */ React39.createElement("span", null, "Exchange"), /* @__PURE__ */ React39.createElement("span", null, "Details")), suggestionRendered.map((suggestions2, index) => /* @__PURE__ */ React39.createElement(ResultDetail_default, {
    suggestions: suggestionRendered,
    index,
    key: `token-detail-${index}`,
    currentIndex,
    handleDetail: setCurrentIndex,
    logoIcons
  })), !!searchText && !suggestionRendered.length && /* @__PURE__ */ React39.createElement(StyledLoading, {
    styleOverrides: customLoading
  }, notFoundTitle), hasNextPage && /* @__PURE__ */ React39.createElement("div", {
    ref: sentryRef
  }, "loading....")));
};
var SearchResult_default = SearchResult;

// src/searchbar/tokenSearch/SearchFilters.tsx
import React44, { useContext as useContext7, useEffect as useEffect2 } from "react";
import { useDispatch as useDispatch5, useSelector as useSelector5 } from "react-redux";
import { omitBy as omitBy4 } from "lodash";
import styled5 from "styled-components";
import {
  Accordion,
  AccordionItem,
  AccordionItemHeading,
  AccordionItemButton,
  AccordionItemPanel
} from "react-accessible-accordion";

// src/searchbar/tokenSearch/SearchFiltersNetworkSelectors.tsx
import React42, { useContext as useContext5, useMemo as useMemo2 } from "react";
import { useDispatch as useDispatch3, useSelector as useSelector3 } from "react-redux";
import { omitBy as omitBy2 } from "lodash";

// src/searchbar/tokenSearch/Chip.tsx
import React41, { useContext as useContext4 } from "react";
import styled4 from "styled-components";

// src/searchbar/icons/checked.tsx
import React40 from "react";
var CheckedIcon = ({ height, width }) => /* @__PURE__ */ React40.createElement(abstract_default, {
  height: height != null ? height : 11,
  width: width != null ? width : 8,
  viewBox: "0 0 11 8"
}, /* @__PURE__ */ React40.createElement("g", {
  transform: "translate(0)"
}, /* @__PURE__ */ React40.createElement("path", {
  d: "M1 2.91L4.29 6.16L9.48 1",
  stroke: "#00C30E",
  strokeWidth: "1.5",
  strokeLinecap: "round"
})));
var checked_default = CheckedIcon;

// src/searchbar/tokenSearch/Chip.tsx
var StyledChip = styled4.div`
  ${({ styleOverrides }) => `
        > input {
          display: none;
        }

        > input + label {
          
          transition: all 500ms ease;    
          cursor: pointer;    
          display: grid;
          align-items: center;
          user-select: none;

          ::-webkit-transition: all 500ms ease;    
          ::-moz-user-select: -moz-none;
          ::-webkit-user-select: none;
          ::-ms-user-select: none;          
          font-size: ${(styleOverrides == null ? void 0 : styleOverrides.fontSize) || "10px"};  
          font-weight: ${(styleOverrides == null ? void 0 : styleOverrides.fontWeight) || "500"};  
          border-radius: ${(styleOverrides == null ? void 0 : styleOverrides.borderRadius) || "4px"};  
          background-color: ${(styleOverrides == null ? void 0 : styleOverrides.backgroundColor) || "#232B35"};  
          border: ${(styleOverrides == null ? void 0 : styleOverrides.border) || "solid 2px #232B35"};   
          padding: ${(styleOverrides == null ? void 0 : styleOverrides.padding) || "2px 5px"};   
          margin: ${(styleOverrides == null ? void 0 : styleOverrides.margin) || "5px"};   
          color: ${(styleOverrides == null ? void 0 : styleOverrides.defaultColor) || "#B4BBC7"};   
          width: ${(styleOverrides == null ? void 0 : styleOverrides.width) || "120px"};   
          height: ${(styleOverrides == null ? void 0 : styleOverrides.height) || "34px"};   
          text-align: ${(styleOverrides == null ? void 0 : styleOverrides.textAlign) || "left"}; 
          text-transform: ${(styleOverrides == null ? void 0 : styleOverrides.textTransform) || "uppercase"}; 
          grid-template-columns: ${(styleOverrides == null ? void 0 : styleOverrides.gridTemplateColumns) || "22% 68% 10%"}; 
          box-sizing: border-box;
          
          >:last-child {      
            justify-self: ${(styleOverrides == null ? void 0 : styleOverrides.justifySelf) || "end"}; 
          }
        }
        
        > input:checked + label {   
          ::-webkit-transition: all 500ms ease;
          transition: all 500ms ease;   
          border-color: ${(styleOverrides == null ? void 0 : styleOverrides.checkedBorderColor) || "#474F5C"};    
          color: ${(styleOverrides == null ? void 0 : styleOverrides.checkedColor) || "white"};   
          background-color: ${(styleOverrides == null ? void 0 : styleOverrides.checkedBackgroundColor) || "#474F5C"};   
        }    
        label svg {
          max-width: 16px;
        }
    `}
`;
var Chip = (props) => {
  const renderProps = useContext4(TokenSearch_default);
  const { label, checked, onChange, name, value, styleOverrides, grayscaleFilter, icon } = props;
  const { customChip } = renderProps;
  const customStyles = styleOverrides === void 0 ? customChip : styleOverrides;
  const checkedStatus = checked ? /* @__PURE__ */ React41.createElement(checked_default, null) : /* @__PURE__ */ React41.createElement(unchecked_default, null);
  return /* @__PURE__ */ React41.createElement(StyledChip, {
    styleOverrides: customStyles
  }, /* @__PURE__ */ React41.createElement("input", {
    type: "checkbox",
    id: `${label}-${name}`,
    onChange,
    checked,
    name,
    value
  }), /* @__PURE__ */ React41.createElement("label", {
    htmlFor: `${label}-${name}`
  }, /* @__PURE__ */ React41.createElement("div", {
    className: checked ? "chip-icon active" : "chip-icon"
  }, icon != null ? icon : /* @__PURE__ */ React41.createElement(Logo, {
    label,
    grayscaleFilter,
    width: 16,
    height: 16
  })), /* @__PURE__ */ React41.createElement("span", null, label), !["Select All", "Deselect All"].includes(label) && checkedStatus));
};

// src/searchbar/tokenSearch/SearchFiltersNetworkSelectors.tsx
var FilterNetworkAll = () => {
  const dispatch = useDispatch3();
  const renderProps = useContext5(TokenSearch_default);
  const { exchangeMap, networkMap } = useSelector3((state) => state);
  const networkAll = Object.values(omitBy2(networkMap, (b) => !b)).length === 0;
  const exchangeNamesActive = Object.keys(omitBy2(exchangeMap, (b) => !b));
  const { customAllChip, networks } = renderProps;
  const networkNames = networks == null ? void 0 : networks.map((network) => network.id);
  const styleOverrides = {
    fontSize: (customAllChip == null ? void 0 : customAllChip.fontSize) || "10px",
    fontWeight: (customAllChip == null ? void 0 : customAllChip.fontWeight) || "500",
    borderRadius: (customAllChip == null ? void 0 : customAllChip.borderRadius) || "4px",
    backgroundColor: (customAllChip == null ? void 0 : customAllChip.backgroundColor) || "#474F5C",
    border: (customAllChip == null ? void 0 : customAllChip.border) || "0",
    padding: (customAllChip == null ? void 0 : customAllChip.padding) || "3px 4px",
    margin: (customAllChip == null ? void 0 : customAllChip.margin) || "0",
    defaultColor: (customAllChip == null ? void 0 : customAllChip.defaultColor) || "#7A808A",
    width: (customAllChip == null ? void 0 : customAllChip.width) || "auto",
    height: (customAllChip == null ? void 0 : customAllChip.height) || "auto",
    textAlign: (customAllChip == null ? void 0 : customAllChip.textAlign) || "center",
    textTransform: (customAllChip == null ? void 0 : customAllChip.textTransform) || "inherit",
    gridTemplateColumns: (customAllChip == null ? void 0 : customAllChip.gridTemplateColumns) || "unset",
    justifySelf: (customAllChip == null ? void 0 : customAllChip.justifySelf) || "center"
  };
  const handleChange = () => {
    dispatch(setNetworkMapAll({ networkNames, networkAll }));
    dispatch(setExchangeMapAll({ exchangeNames: exchangeNamesActive, exchangeAll: false }));
  };
  return /* @__PURE__ */ React42.createElement(Chip, {
    name: "AllNetworks",
    icon: true,
    label: networkAll ? "Select All" : "Deselect All",
    checked: networkAll,
    styleOverrides,
    onChange: handleChange
  });
};
var FilterNetworkSelectors = () => {
  const renderProps = useContext5(TokenSearch_default);
  const networks = [...renderProps.networks];
  const networkItems = useMemo2(() => networks.map((network) => {
    return { id: network.id, exchanges: network.exchanges.map((exhange) => exhange.name) };
  }), [networks]);
  const dispatch = useDispatch3();
  const { networkMap } = useSelector3((state) => state);
  const networkElement = (network) => {
    return /* @__PURE__ */ React42.createElement(Chip, {
      key: network.id,
      name: network.id,
      label: network.name || network.id,
      icon: network.icon,
      checked: networkMap[network.id] || false,
      onChange: (e) => dispatch(setNetworkMap({
        networkName: network.id,
        checked: e.target.checked,
        networks: networkItems
      }))
    });
  };
  return networks.map((network) => networkElement(network));
};

// src/searchbar/tokenSearch/SearchFiltersExchangeSelectors.tsx
import React43, { useContext as useContext6 } from "react";
import { omitBy as omitBy3 } from "lodash";
import { useDispatch as useDispatch4, useSelector as useSelector4 } from "react-redux";
var FilterExchangeAll = () => {
  const dispatch = useDispatch4();
  const { exchangeMap, networkMap } = useSelector4((state) => state);
  const exchangeAll = Object.values(omitBy3(exchangeMap, (b) => !b)).length === 0;
  const selectedNetworks = Object.keys(omitBy3(networkMap, (b) => !b));
  const renderProps = useContext6(TokenSearch_default);
  const { customAllChip, networks } = renderProps;
  const exchangeNames = [];
  networks == null ? void 0 : networks.forEach((network) => {
    var _a2;
    if (selectedNetworks.includes(network.id)) {
      (_a2 = network.exchanges) == null ? void 0 : _a2.forEach((exchange) => {
        exchangeNames.push(exchange.name);
      });
    }
  });
  const styleOverrides = {
    fontSize: (customAllChip == null ? void 0 : customAllChip.fontSize) || "10px",
    fontWeight: (customAllChip == null ? void 0 : customAllChip.fontWeight) || "500",
    borderRadius: (customAllChip == null ? void 0 : customAllChip.borderRadius) || "4px",
    backgroundColor: (customAllChip == null ? void 0 : customAllChip.backgroundColor) || "#474F5C",
    border: (customAllChip == null ? void 0 : customAllChip.border) || "0",
    padding: (customAllChip == null ? void 0 : customAllChip.padding) || "3px 4px",
    margin: (customAllChip == null ? void 0 : customAllChip.margin) || "0",
    defaultColor: (customAllChip == null ? void 0 : customAllChip.defaultColor) || "#7A808A",
    width: (customAllChip == null ? void 0 : customAllChip.width) || "auto",
    height: (customAllChip == null ? void 0 : customAllChip.height) || "auto",
    textAlign: (customAllChip == null ? void 0 : customAllChip.textAlign) || "center",
    textTransform: (customAllChip == null ? void 0 : customAllChip.textTransform) || "inherit",
    gridTemplateColumns: (customAllChip == null ? void 0 : customAllChip.gridTemplateColumns) || "unset",
    justifySelf: (customAllChip == null ? void 0 : customAllChip.justifySelf) || "center"
  };
  return /* @__PURE__ */ React43.createElement(Chip, {
    name: "AllExchanges",
    icon: true,
    label: exchangeAll ? "Select All" : "Deselect All",
    checked: exchangeAll,
    styleOverrides,
    onChange: () => dispatch(setExchangeMapAll({ exchangeNames, exchangeAll }))
  });
};
var FilterExchangeSelectors = () => {
  var _a2;
  const dispatch = useDispatch4();
  const { networkMap, exchangeMap } = useSelector4((state) => state);
  const renderProps = useContext6(TokenSearch_default);
  const selectedNetworks = Object.keys(omitBy3(networkMap, (b) => !b));
  const exchanges = [];
  (_a2 = renderProps.networks) == null ? void 0 : _a2.forEach((network) => {
    var _a3;
    if (selectedNetworks.includes(network.id)) {
      if ((_a3 = network.exchanges) == null ? void 0 : _a3.length)
        exchanges.push(...network.exchanges);
    }
  });
  const exchangeElement = (exchange) => {
    return /* @__PURE__ */ React43.createElement(Chip, {
      key: exchange.name,
      name: exchange.name,
      label: exchange.name,
      icon: exchange.icon,
      grayscaleFilter: 1,
      checked: exchangeMap[exchange.name] || false,
      onChange: (e) => dispatch(setExchangeMap({
        exchangeName: exchange.name,
        checked: e.target.checked
      }))
    });
  };
  return exchanges.map((exchange) => exchangeElement(exchange));
};

// src/searchbar/tokenSearch/SearchFilters.tsx
var FilterWrapper = styled5.div`
  ${({ styleOverrides }) => `    
    .accordion__button {
      position: relative;
    }
    background-color: ${(styleOverrides == null ? void 0 : styleOverrides.backgroundColor) || "#00070E"};
    border-radius: ${(styleOverrides == null ? void 0 : styleOverrides.borderRadius) || "4px"};

    .accordion__button:first-child:after {
      display: block;    
      content: '';
      position: absolute;    
      transform: rotate(-45deg);  
      
      color: ${(styleOverrides == null ? void 0 : styleOverrides.toggleColor) || "#B4BBC7"};
      height: ${(styleOverrides == null ? void 0 : styleOverrides.toggleHeight) || "7px"};
      width: ${(styleOverrides == null ? void 0 : styleOverrides.toggleWidth) || "7px"};
      margin-right: ${(styleOverrides == null ? void 0 : styleOverrides.toggleMarginRight) || "0"};    
      left: ${(styleOverrides == null ? void 0 : styleOverrides.toggleLeft) || "calc(50% - 3.5px);"};    
      top: ${(styleOverrides == null ? void 0 : styleOverrides.toggleTop) || "calc(50% - 4.9px);"};    
      border-bottom: ${(styleOverrides == null ? void 0 : styleOverrides.toggleBorderBottom) || "2px solid currentColor"}; 
      border-right: ${(styleOverrides == null ? void 0 : styleOverrides.toggleBorderRight) || "2px solid currentColor"}; 
      transform: rotate(45deg);
       
    }

    .accordion__button[aria-expanded='true']:first-child:after,
    .accordion__button[aria-selected='true']:first-child:after {
      transform: rotate(-135deg);
    }

    .accordion__panel {    
      border: ${(styleOverrides == null ? void 0 : styleOverrides.contentBorder) || "0"};       
      border-radius: ${(styleOverrides == null ? void 0 : styleOverrides.contentBorderRadius) || "0"}; 
      margin:  ${(styleOverrides == null ? void 0 : styleOverrides.margin) || "0"};
    }
  `}
`;
var StyledFilterHeader = styled5.div`
  ${({ styleOverrides }) => `
    display: ${(styleOverrides == null ? void 0 : styleOverrides.display) || "flex"};
    justify-content: ${(styleOverrides == null ? void 0 : styleOverrides.justifyContent) || "space-between"};
    align-items: ${(styleOverrides == null ? void 0 : styleOverrides.alignItems) || "center"};
    width: ${(styleOverrides == null ? void 0 : styleOverrides.width) || "auto"};
    border: ${(styleOverrides == null ? void 0 : styleOverrides.border) || "none"}; 
    background-color: ${(styleOverrides == null ? void 0 : styleOverrides.backgroundColor) || "#00070E"}; 
    color: ${(styleOverrides == null ? void 0 : styleOverrides.color) || "#fff"};    
    cursor: pointer;
    padding: ${(styleOverrides == null ? void 0 : styleOverrides.padding) || "6px 14px"};   
    text-align: ${(styleOverrides == null ? void 0 : styleOverrides.textAlign) || "left"};     
    margin: ${(styleOverrides == null ? void 0 : styleOverrides.margin) || "5px 0 0"};     
    border-radius: ${(styleOverrides == null ? void 0 : styleOverrides.borderRadius) || "4px"};     
    font-size: ${(styleOverrides == null ? void 0 : styleOverrides.fontSize) || "13px"};     
    font-weight: ${(styleOverrides == null ? void 0 : styleOverrides.fontWeight) || "500"};     
    &:hover {
      background-color: ${(styleOverrides == null ? void 0 : styleOverrides.hoverColor) || "#232C38"};
    }
  `}
`;
var StyledFilterContent = styled5.div`
  ${({ styleOverrides }) => `
    display: flex;
    flex-wrap: wrap;
    margin-bottom: 5px;
    margin-left: 10px;
    justify-content: ${(styleOverrides == null ? void 0 : styleOverrides.justifyContent) || "start"};
    align-items: ${(styleOverrides == null ? void 0 : styleOverrides.alignItems) || "center"};  
    padding:  ${(styleOverrides == null ? void 0 : styleOverrides.padding) || "0 0 5px"};    
    .chip-icon {
      filter: grayscale(1);
      &.active{
        filter: unset;
      }     
    }
  `}
`;
var StyledDescription = styled5.div`
  ${({ styleOverrides }) => `
    text-align: ${(styleOverrides == null ? void 0 : styleOverrides.textAlign) || "right"};
    font-size: ${(styleOverrides == null ? void 0 : styleOverrides.fontSize) || "12px"};
    padding: ${(styleOverrides == null ? void 0 : styleOverrides.padding) || "10px 10px 5px"};       
    background-color: ${(styleOverrides == null ? void 0 : styleOverrides.backgroundColor) || "#00070E"};
    color: ${(styleOverrides == null ? void 0 : styleOverrides.color) || "#c4c5c7"};       
  `}
`;
var StyledFilterWrapper = styled5.div`
  ${({ styleOverrides }) => `
    display: block;
    justify-content: ${(styleOverrides == null ? void 0 : styleOverrides.justifyContent) || "center"};
    align-items: ${(styleOverrides == null ? void 0 : styleOverrides.alignItems) || "center"};  
    padding:  ${(styleOverrides == null ? void 0 : styleOverrides.padding) || "0 0 5px"};       
    background-color: ${(styleOverrides == null ? void 0 : styleOverrides.backgroundColor) || "#00070E"};    
    border-radius: ${(styleOverrides == null ? void 0 : styleOverrides.borderRadius) || "4px"};    
  `}
`;
var StyledCount = styled5.div`
  color: white;
  font-weight: 400;
`;
var SearchDescription = (props) => {
  const { networkCount, exchangeCount, type } = props;
  let desc;
  if (networkCount === 0 && exchangeCount === 0) {
    desc = "Searching all networks and exchanges";
  } else {
    if (type === "network")
      desc = /* @__PURE__ */ React44.createElement("div", {
        style: { display: "flex", justifyContent: "right" }
      }, "Searching\xA0", /* @__PURE__ */ React44.createElement(StyledCount, null, networkCount, " network", networkCount > 1 ? "s" : ""), exchangeCount > 0 && /* @__PURE__ */ React44.createElement(React44.Fragment, null, "\xA0within\xA0", /* @__PURE__ */ React44.createElement(StyledCount, null, exchangeCount, " exchange", exchangeCount > 1 ? "s" : "")));
    else
      desc = /* @__PURE__ */ React44.createElement("div", {
        style: { display: "flex", justifyContent: "right" }
      }, "Searching\xA0", /* @__PURE__ */ React44.createElement(StyledCount, null, exchangeCount, " exchange", exchangeCount > 1 ? "s" : ""), "\xA0within\xA0", /* @__PURE__ */ React44.createElement(StyledCount, null, networkCount, " network", networkCount > 1 ? "s" : ""));
  }
  return /* @__PURE__ */ React44.createElement(React44.Fragment, null, desc);
};
var SearchFilters = () => {
  var _a2, _b2, _c2, _d2, _e, _f, _g, _h, _i, _j;
  const dispatch = useDispatch5();
  const { networkMap, exchangeMap, searchText } = useSelector5((state) => state);
  const renderProps = useContext7(TokenSearch_default);
  const { customSearchFilter, networks } = renderProps;
  const exchangesActive = Object.values(networkMap).filter((b) => b).length !== 0;
  let networkIds = Object.keys(omitBy4(networkMap, (b) => !b));
  const exchangeIds = Object.keys(omitBy4(exchangeMap, (b) => !b)) || [];
  if (!networkIds.length) {
    networkIds = (networks == null ? void 0 : networks.map((network) => network.id)) || [];
  }
  const networkCount = networkIds.length;
  const exchangeCount = exchangeIds.length;
  if (!exchangeIds.length) {
    networks == null ? void 0 : networks.forEach((network) => {
      var _a3;
      if (networkIds.includes(network.id)) {
        (_a3 = network.exchanges) == null ? void 0 : _a3.forEach((exchange) => {
          exchangeIds.push(exchange.name);
        });
      }
    });
  }
  const totalExchangeCount = exchangeIds.length;
  const networkTitle = ((_a2 = customSearchFilter == null ? void 0 : customSearchFilter.content) == null ? void 0 : _a2.network) || "Select Network(s)";
  const exchangeTitle = ((_b2 = customSearchFilter == null ? void 0 : customSearchFilter.content) == null ? void 0 : _b2.exchange) || "Select Exchange(s)";
  useEffect2(() => {
    (Object.keys(networkMap).length > 0 || Object.keys(exchangeMap).length > 0) && searchText.length > 0 && dispatch(setViewResult(true));
  }, [networkMap, exchangeMap, searchText]);
  return /* @__PURE__ */ React44.createElement(FilterWrapper, {
    styleOverrides: customSearchFilter == null ? void 0 : customSearchFilter.wrapper
  }, /* @__PURE__ */ React44.createElement(Accordion, {
    allowMultipleExpanded: true,
    allowZeroExpanded: true
  }, /* @__PURE__ */ React44.createElement(AccordionItem, null, /* @__PURE__ */ React44.createElement(AccordionItemHeading, null, /* @__PURE__ */ React44.createElement(AccordionItemButton, null, /* @__PURE__ */ React44.createElement(StyledFilterHeader, {
    styleOverrides: (_c2 = customSearchFilter == null ? void 0 : customSearchFilter.content) == null ? void 0 : _c2.header
  }, /* @__PURE__ */ React44.createElement("span", null, networkTitle), /* @__PURE__ */ React44.createElement(FilterNetworkAll, null)))), /* @__PURE__ */ React44.createElement(AccordionItemPanel, null, /* @__PURE__ */ React44.createElement(StyledFilterWrapper, {
    styleOverrides: (_d2 = customSearchFilter == null ? void 0 : customSearchFilter.content) == null ? void 0 : _d2.wrapper
  }, /* @__PURE__ */ React44.createElement(StyledFilterContent, {
    styleOverrides: (_e = customSearchFilter == null ? void 0 : customSearchFilter.content) == null ? void 0 : _e.content
  }, /* @__PURE__ */ React44.createElement(FilterNetworkSelectors, null)), /* @__PURE__ */ React44.createElement(StyledDescription, {
    styleOverrides: (_f = customSearchFilter == null ? void 0 : customSearchFilter.content) == null ? void 0 : _f.description
  }, /* @__PURE__ */ React44.createElement(SearchDescription, {
    networkCount,
    exchangeCount,
    type: "network"
  }))))), exchangesActive && /* @__PURE__ */ React44.createElement(AccordionItem, null, /* @__PURE__ */ React44.createElement(AccordionItemHeading, null, /* @__PURE__ */ React44.createElement(AccordionItemButton, null, /* @__PURE__ */ React44.createElement(StyledFilterHeader, {
    styleOverrides: (_g = customSearchFilter == null ? void 0 : customSearchFilter.content) == null ? void 0 : _g.header
  }, /* @__PURE__ */ React44.createElement("span", null, exchangeTitle), /* @__PURE__ */ React44.createElement(FilterExchangeAll, null)))), /* @__PURE__ */ React44.createElement(AccordionItemPanel, null, /* @__PURE__ */ React44.createElement(StyledFilterWrapper, {
    styleOverrides: (_h = customSearchFilter == null ? void 0 : customSearchFilter.content) == null ? void 0 : _h.wrapper
  }, /* @__PURE__ */ React44.createElement(StyledFilterContent, {
    styleOverrides: (_i = customSearchFilter == null ? void 0 : customSearchFilter.content) == null ? void 0 : _i.content
  }, /* @__PURE__ */ React44.createElement(FilterExchangeSelectors, null)), /* @__PURE__ */ React44.createElement(StyledDescription, {
    styleOverrides: (_j = customSearchFilter == null ? void 0 : customSearchFilter.content) == null ? void 0 : _j.description
  }, /* @__PURE__ */ React44.createElement(SearchDescription, {
    networkCount,
    exchangeCount: exchangeCount || totalExchangeCount,
    type: "exchange"
  })))))));
};
var SearchFilters_default = SearchFilters;

// src/searchbar/tokenSearch/index.tsx
var StyledWrapper2 = styled6.div`
  ${({ styleOverrides }) => `
    min-width: 420px;            
    position: relative;

    & .dropDown {
      position: absolute;
      width: -webkit-fill-available;
      left: 0; 
      bottom: ${(styleOverrides == null ? void 0 : styleOverrides.borderBottomLeftRadius) || "5px"};  
      transform: translateY(100%);
      z-index: 99;
      background-color: ${(styleOverrides == null ? void 0 : styleOverrides.backgroundColor) || "#474F5C"};          
      border-bottom-left-radius: ${(styleOverrides == null ? void 0 : styleOverrides.borderBottomLeftRadius) || "4px"};  
      border-bottom-right-radius: ${(styleOverrides == null ? void 0 : styleOverrides.borderBottomRightRadius) || "4px"};  
      border-color: ${(styleOverrides == null ? void 0 : styleOverrides.borderColor) || "#474F5C"};          
      border-style: ${(styleOverrides == null ? void 0 : styleOverrides.borderStyle) || "solid"};                
      border-width:${(styleOverrides == null ? void 0 : styleOverrides.borderStyle) || "4px"};                 
      border-top: none;
    }

    & button {
      display: flex;
      align-items: center;
      border-color: ${(styleOverrides == null ? void 0 : styleOverrides.button.borderColor) || "#232C38"};      
      background-color: ${(styleOverrides == null ? void 0 : styleOverrides.button.backColor) || "#232C38"};      
      color: ${(styleOverrides == null ? void 0 : styleOverrides.button.color) || "#B1B8C3"};      
      border-radius: ${(styleOverrides == null ? void 0 : styleOverrides.button.borderRadius) || "4px"};      
      font-size: ${(styleOverrides == null ? void 0 : styleOverrides.button.fontSize) || "10px"};      
      padding: ${(styleOverrides == null ? void 0 : styleOverrides.button.padding) || "4px 6px"};      
      border-width: 0;      
      cursor: pointer;
      &:hover {
        background-color: ${(styleOverrides == null ? void 0 : styleOverrides.button.hoverBackColor) || "black"};      
      }

      & span {
        padding-right: 3px;
      }
    }
  `}
`;
var TokenSearch = (renderProps) => {
  const { customWrapper } = renderProps;
  const dispatch = useDispatch6();
  const { isSelecting, isLoading, viewResult } = useSelector6((state) => state);
  const searchRef = useRef();
  const closeResultPanel = () => {
    dispatch(stopSelecting());
    dispatch(setViewResult(false));
  };
  useEffect3(() => {
    window.onmousedown = (e) => {
      var _a2;
      if (!((_a2 = searchRef == null ? void 0 : searchRef.current) == null ? void 0 : _a2.contains(e.target))) {
        closeResultPanel();
      }
    };
    window.addEventListener("searchBarClose", closeResultPanel);
  }, []);
  return /* @__PURE__ */ React45.createElement(TokenSearch_default.Provider, {
    value: renderProps
  }, /* @__PURE__ */ React45.createElement(StyledWrapper2, {
    ref: searchRef,
    styleOverrides: customWrapper
  }, /* @__PURE__ */ React45.createElement(SearchInput_default, null), isSelecting && /* @__PURE__ */ React45.createElement("div", {
    className: "dropDown"
  }, /* @__PURE__ */ React45.createElement(SearchFilters_default, null), viewResult && /* @__PURE__ */ React45.createElement(SearchResult_default, {
    loading: isLoading
  }))));
};
var tokenSearch_default = TokenSearch;

// src/searchbar/index.tsx
var SearchBar = (renderProps) => {
  return /* @__PURE__ */ React46.createElement(Provider, {
    store
  }, !config_default.IS_ENV_PRODUCTION && /* @__PURE__ */ React46.createElement(tokenSearch_default, {
    customWrapper: renderProps.customWrapper,
    customSearchInput: renderProps.customSearchInput,
    customSearchFilter: renderProps.customSearchFilter,
    customLoading: renderProps.customLoading,
    customChip: renderProps.customChip,
    customResult: renderProps.customResult,
    customTokenDetail: renderProps.customTokenDetail,
    customActions: renderProps.customActions,
    customAllChip: renderProps.customAllChip,
    networks: renderProps.networks
  }));
};

// src/types.ts
import {
  Accordion as Accordion2,
  AccordionItem as AccordionItem2,
  AccordionItemHeading as AccordionItemHeading2,
  AccordionItemButton as AccordionItemButton2,
  AccordionItemPanel as AccordionItemPanel2
} from "react-accessible-accordion";

// src/index.tsx
import * as React47 from "react";
import { render } from "react-dom";
var rootElement = document.getElementById("root");
render(/* @__PURE__ */ React47.createElement(SearchBar, {
  networks: []
}), rootElement);
export {
  Accordion2 as Accordion,
  AccordionItem2 as AccordionItem,
  AccordionItemButton2 as AccordionItemButton,
  AccordionItemHeading2 as AccordionItemHeading,
  AccordionItemPanel2 as AccordionItemPanel,
  SearchBar
};
//# sourceMappingURL=index.mjs.map