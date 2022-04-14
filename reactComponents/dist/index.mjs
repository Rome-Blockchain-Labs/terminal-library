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
import React9 from "react";
import "twin.macro";
import "styled-components/macro";
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

// src/searchbar/tokenSearch/helpers/filters.js
var filterActiveAll = (data) => !Object.values(data).some((b) => b);
var filterActiveNames = (data) => Object.entries(data).filter((entry) => entry[1]).map((entry) => entry[0]);
var filterValidExchangeNames = (data, source) => [...new Set(source.filter((entry) => filterActiveNames(data).includes(entry[0])).map((entry) => entry[1]))];

// src/searchbar/redux/tokenSearchSlice.ts
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
var searchTokenPairs = createAsyncThunk("token/search", async (searchString, thunkAPI) => {
  if (!searchString)
    return;
  try {
    let { networkMap, exchangeMap } = thunkAPI.getState();
    const pairSearchTimestamp = new Date().getTime();
    console.log("Search sent");
    thunkAPI.dispatch(setPairSearchTimestamp(pairSearchTimestamp));
    networkMap = filterActiveNames(networkMap);
    exchangeMap = filterActiveNames(exchangeMap);
    networkMap = filterActiveAll(networkMap) ? [...new Set(networkExchangePairs.map((pair) => pair[0]))] : networkMap;
    exchangeMap = filterActiveAll(exchangeMap) ? [...new Set(networkExchangePairs.map((pair) => pair[1]))] : exchangeMap;
    exchangeMap = exchangeMap.filter((exchange) => networkExchangePairs.filter((pair) => networkMap.includes(pair[0]) && pair[1] === exchange).length >= 1);
    networkMap = networkMap.filter((network) => networkExchangePairs.filter((pair) => pair[0] === network && exchangeMap.includes(pair[1])).length >= 1);
    const data = await retry(() => searchTokensAsync(searchString, networkMap, exchangeMap), { retries: 1 });
    console.log(data.length + " results", new Date().getTime() - pairSearchTimestamp + "ms");
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
    setSearchToken: (state, action) => {
      state.searchToken = action.payload;
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
var { setSearchText, startSelecting, stopSelecting, toggleSelecting, setExchangeMap, setExchangeMapAll, setNetworkMap, setNetworkMapAll, setSearchToken } = tokenSearchSlice.actions;
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
import React8, { useEffect as useEffect2, useRef } from "react";
import { useDispatch as useDispatch4, useSelector as useSelector6 } from "react-redux";
import "twin.macro";
import "styled-components/macro";

// src/searchbar/tokenSearch/SearchInput.tsx
import React, { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import debounce from "lodash.debounce";

// src/searchbar/tokenSearch/icon-search.svg
var icon_search_default = "./icon-search-AYYIN6AJ.svg";

// src/searchbar/tokenSearch/SearchInput.tsx
var PairField = styled.div`
  display: block;
  margin-left: auto;
  margin-right: auto;
  position: relative;
  border-color: #067c82;
  border-style: solid;
  border-width: 2px;
  border-radius: 30px;
  background: #08333c;
  padding: 11px 15px;
  font-size: 15px;
  color: #ffffff;
  font-family: 'Fira Code', monospace;

  @media only screen and (max-width: 990px) {
    width: 100%;
  }

  @media only screen and (max-width: 769px) {
    width: 100%;
  }
`;
var StyledInput = styled.input`
  width: 100%;
  border: none;
  background-color: inherit;
  color: #ffffff;
  //width: auto;
`;
var HideOnSmallScreen = styled.img`
  width: 30px;
  cursor: pointer;
  float: right;
  position: absolute;
  right: 22px;
  top: 9px;
  @media only screen and (max-width: 990px) {
    display: none;
  }
`;
var SearchInput = () => {
  const dispatch = useDispatch();
  const { searchText, networkMap, exchangeMap, searchToken } = useSelector((state) => state);
  const searchTokenValidation = (input) => {
    let value = input.value;
    let leadIsTokenLike = value.substr(0, 2).toLowerCase() === "0x";
    let valueIsTokenLike = new RegExp(/^[0-9a-f]+$/i).test(value.substr(leadIsTokenLike ? 2 : 0));
    let valueLength = value.length;
    if (!leadIsTokenLike && valueIsTokenLike && valueLength >= 5) {
      value = "0x" + value;
      dispatch(setSearchToken(true));
    } else if (searchToken)
      if (leadIsTokenLike) {
        if (valueLength < 7) {
          value = value.substr(2);
          dispatch(setSearchToken(false));
        } else if (!valueIsTokenLike) {
          value = value.substr(2);
          dispatch(setSearchToken(false));
        }
      } else
        dispatch(setSearchToken(false));
    if (!value)
      input.value = value;
    return value;
  };
  useEffect(() => {
    if (searchText.length >= minStringSearch) {
      dispatch(searchTokenPairs(searchText));
    }
  }, [dispatch, searchText, networkMap, exchangeMap]);
  const onChangeFilter = (event) => {
    const value = searchTokenValidation(event.target);
    dispatch(setSearchText(value));
  };
  const debounceChangeHandler = useCallback(debounce(onChangeFilter, 350), [searchText]);
  return /* @__PURE__ */ React.createElement(PairField, {
    onClick: () => dispatch(startSelecting())
  }, /* @__PURE__ */ React.createElement(StyledInput, {
    placeholder: "Select a token pair",
    autocomplete: "off",
    maxLength: "48",
    onChange: debounceChangeHandler
  }), /* @__PURE__ */ React.createElement(HideOnSmallScreen, {
    alt: "",
    src: icon_search_default,
    onClick: () => dispatch(toggleSelecting())
  }));
};
var SearchInput_default = SearchInput;

// src/searchbar/tokenSearch/SearchResult.tsx
import React3 from "react";
import { useSelector as useSelector2 } from "react-redux";
import "twin.macro";
import "styled-components/macro";

// src/searchbar/tokenSearch/TokenPairDetail.tsx
import React2 from "react";
import "twin.macro";
import "styled-components/macro";
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
var TokenPairDetail = (props) => {
  const { index, suggestions } = props;
  const selectedPair = suggestions[index];
  const tokenImage = (token) => {
    return (token == null ? void 0 : token.image) && /* @__PURE__ */ React2.createElement("img", {
      alt: token == null ? void 0 : token.symbol,
      src: token == null ? void 0 : token.image,
      style: { borderRadius: "50%" },
      width: imageSize
    });
  };
  return /* @__PURE__ */ React2.createElement(Accordion, {
    allowZeroExpanded: true
  }, /* @__PURE__ */ React2.createElement(AccordionItem, {
    key: selectedPair.id
  }, /* @__PURE__ */ React2.createElement(AccordionItemHeading, null, /* @__PURE__ */ React2.createElement(AccordionItemButton, {
    tw: "cursor-pointer"
  }, /* @__PURE__ */ React2.createElement("div", {
    tw: "grid grid-flow-col hover:border-dotted p-4 gap-4"
  }, /* @__PURE__ */ React2.createElement("div", {
    tw: "row-span-2 text-gray-900"
  }, /* @__PURE__ */ React2.createElement("div", null, selectedPair.network.toUpperCase(), " - ", capitalizeFirstLetter(selectedPair.exchange), " - "), /* @__PURE__ */ React2.createElement("div", {
    tw: "text-[12px]"
  }, "Volume: ", intToWords(selectedPair.volumeUSD))), /* @__PURE__ */ React2.createElement("div", {
    tw: "row-span-1 pl-2 font-bold"
  }, tokenImage(selectedPair.token0), selectedPair.token0.name, " -", tokenImage(selectedPair.token1), selectedPair.token1.name)))), /* @__PURE__ */ React2.createElement(AccordionItemPanel, null, /* @__PURE__ */ React2.createElement("div", {
    tw: "grid grid-rows-3 grid-flow-col gap-4 m-4"
  }, /* @__PURE__ */ React2.createElement("div", {
    tw: "row-span-3"
  }, /* @__PURE__ */ React2.createElement("div", null, /* @__PURE__ */ React2.createElement("span", {
    tw: "font-bold"
  }, "Pair Address:"), " ", selectedPair.id), /* @__PURE__ */ React2.createElement("div", null, /* @__PURE__ */ React2.createElement("span", {
    tw: "font-bold"
  }, tokenImage(selectedPair.token0), " token0 address: "), firstAndLast(selectedPair.token0.address)), /* @__PURE__ */ React2.createElement("div", null, /* @__PURE__ */ React2.createElement("span", {
    tw: "font-bold"
  }, tokenImage(selectedPair.token1), " token1 address: "), firstAndLast(selectedPair.token1.address))), /* @__PURE__ */ React2.createElement("div", {
    tw: "row-span-2"
  }, /* @__PURE__ */ React2.createElement("div", {
    tw: "font-bold"
  }, selectedPair.network.toUpperCase()), /* @__PURE__ */ React2.createElement("div", {
    tw: "font-bold"
  }, capitalizeFirstLetter(selectedPair.exchange), " "))))));
};
var TokenPairDetail_default = TokenPairDetail;

// src/searchbar/tokenSearch/SearchResult.tsx
var SearchResult = (props) => {
  const { suggestions, searchText } = useSelector2((state) => state);
  const filteredSuggestions = suggestions.slice().sort((pair1, pair2) => pair2.volumeUSD - pair1.volumeUSD);
  if (props.loading) {
    return /* @__PURE__ */ React3.createElement("div", {
      tw: "relative flex bg-white justify-center items-center"
    }, "Loading...");
  }
  if (!!searchText && !filteredSuggestions.length) {
    return /* @__PURE__ */ React3.createElement("div", {
      tw: "relative flex bg-white justify-center items-center"
    }, "No pairs found...");
  }
  return /* @__PURE__ */ React3.createElement("div", {
    tw: "h-60 overflow-y-auto pl-4 border-solid"
  }, filteredSuggestions.map((suggestions2, index) => /* @__PURE__ */ React3.createElement(TokenPairDetail_default, {
    suggestions: filteredSuggestions,
    index
  })));
};
var SearchResult_default = SearchResult;

// src/searchbar/tokenSearch/SearchFilters.tsx
import React7 from "react";
import { useSelector as useSelector5 } from "react-redux";
import "twin.macro";
import "styled-components/macro";
import {
  Accordion as Accordion2,
  AccordionItem as AccordionItem2,
  AccordionItemHeading as AccordionItemHeading2,
  AccordionItemButton as AccordionItemButton2,
  AccordionItemPanel as AccordionItemPanel2
} from "react-accessible-accordion";

// src/searchbar/tokenSearch/SearchFiltersNetworkSelectors.tsx
import React5 from "react";
import { useDispatch as useDispatch2, useSelector as useSelector3 } from "react-redux";

// src/searchbar/Components/Chip/index.tsx
import React4, { memo } from "react";
var Chip = memo((props) => {
  const { label, checked, onChange, name, value } = props;
  return /* @__PURE__ */ React4.createElement(React4.Fragment, null, /* @__PURE__ */ React4.createElement("input", {
    type: "checkbox",
    id: `${label}-${name}`,
    onChange,
    checked,
    name,
    value
  }), /* @__PURE__ */ React4.createElement("label", {
    htmlFor: `${label}-${name}`
  }, label, " "));
});

// src/searchbar/tokenSearch/SearchFiltersNetworkSelectors.tsx
var FilterNetworkAll = () => {
  const dispatch = useDispatch2();
  const { exchangeMap, networkMap } = useSelector3((state) => state);
  const networkAll = filterActiveAll(networkMap);
  const exchangeNamesActive = filterActiveNames(exchangeMap);
  return /* @__PURE__ */ React5.createElement(Chip, {
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
    return /* @__PURE__ */ React5.createElement(Chip, {
      key: networkName,
      name: networkName,
      label: networkName,
      checked: networkMap[networkName] || false,
      onChange: (e) => dispatch(setNetworkMap({ networkName, checked: e.target.checked }))
    });
  };
  return /* @__PURE__ */ React5.createElement(React5.Fragment, null, networkNames.map((networkName) => networkElement(networkName)));
};

// src/searchbar/tokenSearch/SearchFiltersExchangeSelectors.tsx
import React6 from "react";
import { useDispatch as useDispatch3, useSelector as useSelector4 } from "react-redux";
var FilterExchangeAll = () => {
  const dispatch = useDispatch3();
  const { exchangeMap, networkMap } = useSelector4((state) => state);
  const exchangeAll = filterActiveAll(exchangeMap);
  const exchangeNamesActive = filterValidExchangeNames(networkMap, networkExchangePairs);
  return /* @__PURE__ */ React6.createElement(Chip, {
    name: "AllExchanges",
    label: "All",
    checked: exchangeAll,
    onChange: () => dispatch(setExchangeMapAll({ exchangeNames: exchangeNamesActive, exchangeAll }))
  });
};
var FilterExchangeSelectors = () => {
  const dispatch = useDispatch3();
  const { networkMap, exchangeMap } = useSelector4((state) => state);
  const exchangeNamesActive = filterValidExchangeNames(networkMap, networkExchangePairs);
  const exchangeElement = (exchangeName) => {
    return /* @__PURE__ */ React6.createElement(Chip, {
      key: exchangeName,
      name: exchangeName,
      label: exchangeName,
      checked: exchangeMap[exchangeName] || false,
      onChange: (e) => dispatch(setExchangeMap({ exchangeName, checked: e.target.checked }))
    });
  };
  return /* @__PURE__ */ React6.createElement(React6.Fragment, null, exchangeNamesActive.map((exchangeName) => exchangeElement(exchangeName)));
};

// src/searchbar/tokenSearch/SearchFilters.tsx
var networkCount = (networkMap) => {
  let count = Object.values(networkMap).filter((b) => b).length;
  return count === 0 ? "all" : count;
};
var exchangeCount = (exchangeMap) => {
  let count = Object.values(exchangeMap).filter((b) => b).length;
  return count === 0 ? "all" : count;
};
var SearchFilters = () => {
  const { networkMap, exchangeMap } = useSelector5((state) => state);
  const exchangesActive = Object.values(networkMap).some((b) => b);
  return /* @__PURE__ */ React7.createElement(Accordion2, {
    allowZeroExpanded: true
  }, /* @__PURE__ */ React7.createElement(AccordionItem2, null, /* @__PURE__ */ React7.createElement(AccordionItemHeading2, null, /* @__PURE__ */ React7.createElement(AccordionItemButton2, null, /* @__PURE__ */ React7.createElement("div", {
    tw: "p-4 flex"
  }, /* @__PURE__ */ React7.createElement("div", {
    tw: "font-bold"
  }, "Filter Networks:"), "\xA0Searching ", networkCount(exchangeMap), " networks and ", exchangeCount(exchangeMap), " exchanges"))), /* @__PURE__ */ React7.createElement(AccordionItemPanel2, null, /* @__PURE__ */ React7.createElement(FilterNetworkAll, null), /* @__PURE__ */ React7.createElement(FilterNetworkSelectors, null)), /* @__PURE__ */ React7.createElement(AccordionItemPanel2, null, /* @__PURE__ */ React7.createElement("div", {
    tw: "flex justify-center items-center m-2"
  }, /* @__PURE__ */ React7.createElement(FilterNetworkAll, null), /* @__PURE__ */ React7.createElement(FilterNetworkSelectors, null))), /* @__PURE__ */ React7.createElement(AccordionItemPanel2, null, /* @__PURE__ */ React7.createElement("div", {
    tw: "flex flex-wrap justify-center m-2"
  }, exchangesActive && /* @__PURE__ */ React7.createElement(FilterExchangeAll, null), exchangesActive && /* @__PURE__ */ React7.createElement(FilterExchangeSelectors, null)))));
};
var SearchFilters_default = SearchFilters;

// src/searchbar/tokenSearch/index.tsx
var TokenSearch = () => {
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
  return /* @__PURE__ */ React8.createElement("div", {
    tw: "m-10",
    ref: searchRef
  }, /* @__PURE__ */ React8.createElement(SearchInput_default, null), /* @__PURE__ */ React8.createElement(SearchFilters_default, null), isSelecting && /* @__PURE__ */ React8.createElement(SearchResult_default, {
    loading: isLoading
  }));
};
var tokenSearch_default = TokenSearch;

// src/searchbar/index.tsx
function SearchBar() {
  return /* @__PURE__ */ React9.createElement("div", null, /* @__PURE__ */ React9.createElement(Provider, {
    store
  }, /* @__PURE__ */ React9.createElement(tokenSearch_default, null)));
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