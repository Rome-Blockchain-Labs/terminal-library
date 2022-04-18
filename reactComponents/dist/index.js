var __create = Object.create;
var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __getProtoOf = Object.getPrototypeOf;
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
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target, mod));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.tsx
var src_exports = {};
__export(src_exports, {
  Accordion: () => import_react_accessible_accordion3.Accordion,
  AccordionItem: () => import_react_accessible_accordion3.AccordionItem,
  AccordionItemButton: () => import_react_accessible_accordion3.AccordionItemButton,
  AccordionItemHeading: () => import_react_accessible_accordion3.AccordionItemHeading,
  AccordionItemPanel: () => import_react_accessible_accordion3.AccordionItemPanel,
  SearchBar: () => SearchBar
});
module.exports = __toCommonJS(src_exports);

// src/searchbar/index.tsx
var import_react11 = __toESM(require("react"));
var import_react_redux7 = require("react-redux");

// src/searchbar/redux/store.ts
var import_toolkit2 = require("@reduxjs/toolkit");

// src/searchbar/redux/tokenSearchSlice.ts
var import_toolkit = require("@reduxjs/toolkit");
var import_async_retry = __toESM(require("async-retry"));
var import_flatted2 = require("flatted");

// src/searchbar/tokenSearch/helpers/async.ts
var import_bignumber = __toESM(require("bignumber.js"));
var import_flatted = require("flatted");
var import_graphql_request2 = require("graphql-request");

// src/searchbar/tokenSearch/helpers/graphqlClients.ts
var import_graphql_request = require("graphql-request");

// src/searchbar/tokenSearch/helpers/config.ts
var import_lodash = require("lodash");
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
var networkNames = (0, import_lodash.uniq)(networkExchangePairs.map((pair) => pair[0]));
var exchangeNames = (networkNames2) => (0, import_lodash.uniq)(networkExchangePairs.filter((pair) => networkNames2.includes(pair[0])).map((pair) => pair[1]));

// src/searchbar/tokenSearch/helpers/graphqlClients.ts
var romePairsClient = new import_graphql_request.GraphQLClient(romeTokenSyncUri);

// src/searchbar/tokenSearch/helpers/async.ts
var getRomeSearchTokenQuery = (networks, isPair = false) => {
  let network;
  let pair_search = ``;
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
  let graphQl = import_graphql_request2.gql`query SearchTokens($searchText:String!,$exchanges:[String!]!){${pair_search}}`;
  if (isPair)
    graphQl = import_graphql_request2.gql`query SearchTokens($filter1:String!,$filter2:String!,$exchanges:[String!]!){${pair_search}}`;
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
    throw new Error(`${(0, import_flatted.stringify)(e, Object.getOwnPropertyNames(e))}, args:${(0, import_flatted.stringify)({ parameters, query })}`);
  }
  const mappedPairs = Object.entries(res).map((network) => {
    network[1].map((result) => result.network = network[0]);
    return network[1];
  }).flat().filter((pair) => pair.token0 && pair.token1).map((pair) => {
    const tokenPrices = pair.latest_token0_usd_price && pair.latest_token1_usd_price ? {
      token0Price: new import_bignumber.default(pair.latest_token1_usd_price).dividedBy(pair.latest_token0_usd_price).toString(),
      token1Price: new import_bignumber.default(pair.latest_token0_usd_price).dividedBy(pair.latest_token1_usd_price).toString()
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
var import_lodash2 = require("lodash");
var setPair = (0, import_toolkit.createAsyncThunk)("token/setPair", async ({ selectedPair }) => {
  return selectedPair;
});
var resetSearchOnNewExchange = (0, import_toolkit.createAsyncThunk)("token/searchReset", async (searchString, thunkAPI) => {
  thunkAPI.dispatch(searchTokenPairs(""));
});
var setPairSearchTimestamp = (0, import_toolkit.createAsyncThunk)("token/saveTime", async (timestamp) => {
  return timestamp;
});
var allValueHandler = (networkMap, exchangeMap) => {
  let returnedNetworkMap = networkMap;
  let returnedExchangeMap = exchangeMap;
  if (networkMap.length === 0 || networkMap.includes("All")) {
    returnedNetworkMap = (0, import_lodash2.uniq)(networkExchangePairs.map((pair) => pair[0]));
  }
  if (exchangeMap.length === 0 || exchangeMap.includes("All")) {
    returnedExchangeMap = (0, import_lodash2.uniq)(networkExchangePairs.map((pair) => pair[1]));
  }
  return [returnedNetworkMap, returnedExchangeMap];
};
var valueCleaner = (networkMap, exchangeMap) => {
  networkMap = Object.keys((0, import_lodash2.omitBy)(networkMap, (b) => !b));
  exchangeMap = Object.keys((0, import_lodash2.omitBy)(exchangeMap, (b) => !b));
  return [networkMap, exchangeMap];
};
var searchTokenPairs = (0, import_toolkit.createAsyncThunk)("token/search", async (searchString, thunkAPI) => {
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
    const data = await (0, import_async_retry.default)(() => searchTokensAsync(searchString, processedNetworks, processedExchanges), { retries: 1 });
    return { data, pairSearchTimestamp };
  } catch (e) {
    console.log("err searchTokenPairs", e);
    throw new Error((0, import_flatted2.stringify)(e, Object.getOwnPropertyNames(e)));
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
var tokenSearchSlice = (0, import_toolkit.createSlice)({
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
var store = (0, import_toolkit2.configureStore)({
  devTools: process.env.NODE_ENV !== "production",
  middleware: (0, import_toolkit2.getDefaultMiddleware)({
    immutableCheck: false
  }),
  reducer: rootReducer
});

// src/searchbar/tokenSearch/index.tsx
var import_react10 = __toESM(require("react"));
var import_react_redux6 = require("react-redux");
var import_macro = require("styled-components/macro");

// src/searchbar/tokenSearch/SearchInput.tsx
var import_react3 = __toESM(require("react"));
var import_react_redux = require("react-redux");
var import_styled_components2 = __toESM(require("styled-components"));

// src/searchbar/tokenSearch/SearchIcon.tsx
var import_react = __toESM(require("react"));
var import_styled_components = __toESM(require("styled-components"));
var StyledSVG = import_styled_components.default.svg`
  '&:hover': {     
      ${({ hoverColor }) => `stroke: ${hoverColor};`}
     
  }
`;
var SearchIcon = (0, import_react.memo)(({ active, activeColor, color, height, width }) => /* @__PURE__ */ import_react.default.createElement(StyledSVG, {
  height: height != null ? height : 19.519,
  hoverColor: activeColor,
  viewBox: "0 0 19.519 19.519",
  width: width != null ? width : 19.519,
  xmlns: "http://www.w3.org/2000/svg"
}, /* @__PURE__ */ import_react.default.createElement("path", {
  d: "M1427.667,779.6l-5.554-5.555a7.774,7.774,0,1,0-1.061,1.06l5.554,5.555a.75.75,0,0,0,1.061-1.06Zm-17.8-10.482a6.258,6.258,0,1,1,6.258,6.257A6.265,6.265,0,0,1,1409.868,769.119Z",
  "data-name": "Search icon",
  stroke: active ? activeColor : color,
  id: "Search_icon",
  transform: "translate(-1408.368 -761.362)"
})));
var SearchIcon_default = SearchIcon;

// src/searchbar/tokenSearch/SearchInput.tsx
var import_lodash3 = __toESM(require("lodash.debounce"));

// src/searchbar/Context/TokenSearch.tsx
var import_react2 = require("react");
var TokenSearchContext = (0, import_react2.createContext)({});
var TokenSearch_default = TokenSearchContext;

// src/searchbar/tokenSearch/SearchInput.tsx
var StyledInput = import_styled_components2.default.input`
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
var StyledSearchIconWrapper = import_styled_components2.default.div`  
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
var StyledWrapper = import_styled_components2.default.div`
  position: relative;
`;
var SearchInput = () => {
  var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j;
  const dispatch = (0, import_react_redux.useDispatch)();
  const renderProps = (0, import_react3.useContext)(TokenSearch_default);
  const { customSearchInput } = renderProps;
  const { searchText, networkMap, exchangeMap } = (0, import_react_redux.useSelector)((state) => state);
  (0, import_react3.useEffect)(() => {
    if (searchText.length >= minStringSearch) {
      dispatch(searchTokenPairs(searchText));
    }
  }, [dispatch, searchText, networkMap, exchangeMap]);
  const onChangeFilter = (event) => {
    const value = event.target.value;
    dispatch(setSearchText(value));
  };
  const debounceChangeHandler = (0, import_react3.useCallback)((0, import_lodash3.default)(onChangeFilter, 350), [searchText]);
  const placeholder = (customSearchInput == null ? void 0 : customSearchInput.placeholder) || "Please input token name or address.";
  const activeColor = ((_b = (_a = customSearchInput == null ? void 0 : customSearchInput.styles) == null ? void 0 : _a.search) == null ? void 0 : _b.activeColor) || "#666699";
  const color = ((_d = (_c = customSearchInput == null ? void 0 : customSearchInput.styles) == null ? void 0 : _c.search) == null ? void 0 : _d.color) || "#FFF";
  const height = ((_f = (_e = customSearchInput == null ? void 0 : customSearchInput.styles) == null ? void 0 : _e.search) == null ? void 0 : _f.height) || 14;
  const width = ((_h = (_g = customSearchInput == null ? void 0 : customSearchInput.styles) == null ? void 0 : _g.search) == null ? void 0 : _h.width) || 14;
  return /* @__PURE__ */ import_react3.default.createElement(StyledWrapper, {
    onClick: () => dispatch(startSelecting())
  }, /* @__PURE__ */ import_react3.default.createElement(StyledInput, {
    placeholder,
    autocomplete: "off",
    onChange: debounceChangeHandler,
    styles: (_i = customSearchInput == null ? void 0 : customSearchInput.styles) == null ? void 0 : _i.input
  }), /* @__PURE__ */ import_react3.default.createElement(StyledSearchIconWrapper, {
    styles: (_j = customSearchInput == null ? void 0 : customSearchInput.styles) == null ? void 0 : _j.search
  }, /* @__PURE__ */ import_react3.default.createElement(SearchIcon_default, {
    activeColor,
    color,
    height,
    width
  })));
};
var SearchInput_default = SearchInput;

// src/searchbar/tokenSearch/SearchResult.tsx
var import_react5 = __toESM(require("react"));
var import_styled_components4 = __toESM(require("styled-components"));
var import_react_redux2 = require("react-redux");

// src/searchbar/tokenSearch/TokenPairDetail.tsx
var import_react4 = __toESM(require("react"));
var import_styled_components3 = __toESM(require("styled-components"));
var import_react_accessible_accordion = require("react-accessible-accordion");

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
var DetailWrapper = import_styled_components3.default.div`
  .accordion__button: hover {
    cursor: pointer;
  }
`;
var StyledHeader = import_styled_components3.default.div`
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
var StyeldPanel = import_styled_components3.default.div`
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
var StyledActionWrapper = import_styled_components3.default.div`
  display: flex;  
  margin-top: 10px;  
`;
var StyledAction = import_styled_components3.default.div`
  cursor: pointer;
  padding: 10;
`;
var Action = (props) => {
  const { component, detail } = props;
  const Component = component;
  return /* @__PURE__ */ import_react4.default.createElement(StyledAction, null, /* @__PURE__ */ import_react4.default.createElement(Component, {
    detail
  }));
};
var TokenPairDetail = (props) => {
  var _a, _b;
  const { index, suggestions } = props;
  const renderProps = (0, import_react4.useContext)(TokenSearch_default);
  const { customTokenDetail, customActions } = renderProps;
  const selectedPair = suggestions[index];
  const tokenImage = (token) => {
    return (token == null ? void 0 : token.image) && /* @__PURE__ */ import_react4.default.createElement("img", {
      alt: token == null ? void 0 : token.symbol,
      src: token == null ? void 0 : token.image,
      style: { borderRadius: "50%" },
      width: imageSize
    });
  };
  return /* @__PURE__ */ import_react4.default.createElement(DetailWrapper, null, /* @__PURE__ */ import_react4.default.createElement(import_react_accessible_accordion.Accordion, {
    allowZeroExpanded: true
  }, /* @__PURE__ */ import_react4.default.createElement(import_react_accessible_accordion.AccordionItem, {
    key: selectedPair.id
  }, /* @__PURE__ */ import_react4.default.createElement(import_react_accessible_accordion.AccordionItemHeading, null, /* @__PURE__ */ import_react4.default.createElement(import_react_accessible_accordion.AccordionItemButton, null, /* @__PURE__ */ import_react4.default.createElement(StyledHeader, {
    styles: (_a = customTokenDetail == null ? void 0 : customTokenDetail.styles) == null ? void 0 : _a.header
  }, /* @__PURE__ */ import_react4.default.createElement("div", null, /* @__PURE__ */ import_react4.default.createElement("div", null, selectedPair.network.toUpperCase(), " - ", capitalizeFirstLetter(selectedPair.exchange), " - "), /* @__PURE__ */ import_react4.default.createElement("div", null, "Volume: ", intToWords(selectedPair.volumeUSD))), /* @__PURE__ */ import_react4.default.createElement("div", null, tokenImage(selectedPair.token0), selectedPair.token0.name, " -", tokenImage(selectedPair.token1), selectedPair.token1.name)))), /* @__PURE__ */ import_react4.default.createElement(import_react_accessible_accordion.AccordionItemPanel, null, /* @__PURE__ */ import_react4.default.createElement(StyeldPanel, {
    styles: (_b = customTokenDetail == null ? void 0 : customTokenDetail.styles) == null ? void 0 : _b.panel
  }, /* @__PURE__ */ import_react4.default.createElement("div", null, /* @__PURE__ */ import_react4.default.createElement("div", null, /* @__PURE__ */ import_react4.default.createElement("b", null, "Pair Address:"), " ", selectedPair.id), /* @__PURE__ */ import_react4.default.createElement("div", null, /* @__PURE__ */ import_react4.default.createElement("b", null, tokenImage(selectedPair.token0), " token0 address: "), firstAndLast(selectedPair.token0.address)), /* @__PURE__ */ import_react4.default.createElement("div", null, /* @__PURE__ */ import_react4.default.createElement("b", null, tokenImage(selectedPair.token1), " token1 address: "), firstAndLast(selectedPair.token1.address))), /* @__PURE__ */ import_react4.default.createElement("div", null, /* @__PURE__ */ import_react4.default.createElement("div", null, /* @__PURE__ */ import_react4.default.createElement("b", null, selectedPair.network.toUpperCase())), /* @__PURE__ */ import_react4.default.createElement("div", null, /* @__PURE__ */ import_react4.default.createElement("b", null, capitalizeFirstLetter(selectedPair.exchange))), /* @__PURE__ */ import_react4.default.createElement(StyledActionWrapper, null, customActions.map((action) => /* @__PURE__ */ import_react4.default.createElement(Action, {
    key: `action-${action.index}`,
    component: action.component,
    detail: selectedPair
  })))))))));
};
var TokenPairDetail_default = TokenPairDetail;

// src/searchbar/tokenSearch/SearchResult.tsx
var StyledResult = import_styled_components4.default.div`
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
var StyledLoading = import_styled_components4.default.div`
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
  const renderProps = (0, import_react5.useContext)(TokenSearch_default);
  const { customResult, customLoading } = renderProps;
  const { suggestions, searchText } = (0, import_react_redux2.useSelector)((state) => state);
  const filteredSuggestions = suggestions.slice().sort((pair1, pair2) => pair2.volumeUSD - pair1.volumeUSD);
  if (props.loading) {
    const loadingTitle = (customLoading == null ? void 0 : customLoading.loadingTitle) ? customLoading.loadingTitle : "Loading...";
    return /* @__PURE__ */ import_react5.default.createElement(StyledLoading, {
      styles: customLoading == null ? void 0 : customLoading.styles
    }, loadingTitle);
  }
  if (!!searchText && !filteredSuggestions.length) {
    const notFoundTitle = (customLoading == null ? void 0 : customLoading.notFoundTitle) ? customLoading.notFoundTitle : "No pairs found...";
    return /* @__PURE__ */ import_react5.default.createElement(StyledLoading, {
      styles: customLoading == null ? void 0 : customLoading.styles
    }, notFoundTitle);
  }
  return /* @__PURE__ */ import_react5.default.createElement(StyledResult, {
    styles: customResult == null ? void 0 : customResult.styles
  }, filteredSuggestions.map((suggestions2, index) => /* @__PURE__ */ import_react5.default.createElement(TokenPairDetail_default, {
    suggestions: filteredSuggestions,
    index,
    key: `token-detail-${index}`
  })));
};
var SearchResult_default = SearchResult;

// src/searchbar/tokenSearch/SearchFilters.tsx
var import_react9 = __toESM(require("react"));
var import_react_redux5 = require("react-redux");
var import_styled_components6 = __toESM(require("styled-components"));
var import_react_accessible_accordion2 = require("react-accessible-accordion");

// src/searchbar/tokenSearch/SearchFiltersNetworkSelectors.tsx
var import_react7 = __toESM(require("react"));
var import_react_redux3 = require("react-redux");
var import_lodash4 = require("lodash");

// src/searchbar/tokenSearch/Chip.tsx
var import_react6 = __toESM(require("react"));
var import_styled_components5 = __toESM(require("styled-components"));
var StyledChip = import_styled_components5.default.div`
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
var Chip = (0, import_react6.memo)((props) => {
  const renderProps = (0, import_react6.useContext)(TokenSearch_default);
  const { label, checked, onChange, name, value } = props;
  const { customChip } = renderProps;
  return /* @__PURE__ */ import_react6.default.createElement(StyledChip, {
    styles: customChip == null ? void 0 : customChip.styles
  }, /* @__PURE__ */ import_react6.default.createElement("input", {
    type: "checkbox",
    id: `${label}-${name}`,
    onChange,
    checked,
    name,
    value
  }), /* @__PURE__ */ import_react6.default.createElement("label", {
    htmlFor: `${label}-${name}`
  }, label, " "));
});

// src/searchbar/tokenSearch/SearchFiltersNetworkSelectors.tsx
var FilterNetworkAll = () => {
  const dispatch = (0, import_react_redux3.useDispatch)();
  const { exchangeMap, networkMap } = (0, import_react_redux3.useSelector)((state) => state);
  const networkAll = Object.values((0, import_lodash4.omitBy)(networkMap, (b) => !b)).length === 0;
  const exchangeNamesActive = Object.keys((0, import_lodash4.omitBy)(exchangeMap, (b) => !b));
  return /* @__PURE__ */ import_react7.default.createElement(Chip, {
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
  const dispatch = (0, import_react_redux3.useDispatch)();
  const { networkMap } = (0, import_react_redux3.useSelector)((state) => state);
  const networkElement = (networkName) => {
    return /* @__PURE__ */ import_react7.default.createElement(Chip, {
      key: networkName,
      name: networkName,
      label: networkName,
      checked: networkMap[networkName] || false,
      onChange: (e) => dispatch(setNetworkMap({ networkName, checked: e.target.checked }))
    });
  };
  return /* @__PURE__ */ import_react7.default.createElement(import_react7.default.Fragment, null, networkNames.map((networkName) => networkElement(networkName)));
};

// src/searchbar/tokenSearch/SearchFiltersExchangeSelectors.tsx
var import_react8 = __toESM(require("react"));
var import_lodash5 = require("lodash");
var import_react_redux4 = require("react-redux");
var FilterExchangeAll = () => {
  const dispatch = (0, import_react_redux4.useDispatch)();
  const { exchangeMap, networkMap } = (0, import_react_redux4.useSelector)((state) => state);
  const exchangeAll = Object.values((0, import_lodash5.omitBy)(exchangeMap, (b) => !b)).length === 0;
  const exchangeNamesActive = exchangeNames(Object.keys((0, import_lodash5.omitBy)(networkMap, (b) => !b)));
  return /* @__PURE__ */ import_react8.default.createElement(Chip, {
    name: "AllExchanges",
    label: "All",
    checked: exchangeAll,
    onChange: () => dispatch(setExchangeMapAll({ exchangeNames: exchangeNamesActive, exchangeAll }))
  });
};
var FilterExchangeSelectors = () => {
  const dispatch = (0, import_react_redux4.useDispatch)();
  const { networkMap, exchangeMap } = (0, import_react_redux4.useSelector)((state) => state);
  const exchangeNamesActive = exchangeNames(Object.keys((0, import_lodash5.omitBy)(networkMap, (b) => !b)));
  const exchangeElement = (exchangeName) => {
    return /* @__PURE__ */ import_react8.default.createElement(Chip, {
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
var FilterWrapper = import_styled_components6.default.div`  
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
var StyledFilterHeader = import_styled_components6.default.div`  
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
var StyledFilterContent = import_styled_components6.default.div`
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
  const { networkMap, exchangeMap } = (0, import_react_redux5.useSelector)((state) => state);
  const renderProps = (0, import_react9.useContext)(TokenSearch_default);
  const { customSearchFilter } = renderProps;
  const exchangesActive = Object.values(networkMap).filter((b) => b).length !== 0;
  const networkCount = Object.values(networkMap).filter((b) => b).length;
  const exchangeCount = Object.values(exchangeMap).filter((b) => b).length;
  const title = (customSearchFilter == null ? void 0 : customSearchFilter.title) || "Filter Networks";
  const description = networkCount === 0 && exchangeCount === 0 ? "Searching all networks and exchanges" : (customSearchFilter == null ? void 0 : customSearchFilter.description(networkCount, exchangeCount)) || `Searching {networkCount} networks and {exchangeCount} exchanges`;
  return /* @__PURE__ */ import_react9.default.createElement(FilterWrapper, {
    styles: customSearchFilter == null ? void 0 : customSearchFilter.styles.wrapper
  }, /* @__PURE__ */ import_react9.default.createElement(import_react_accessible_accordion2.Accordion, {
    allowZeroExpanded: true
  }, /* @__PURE__ */ import_react9.default.createElement(import_react_accessible_accordion2.AccordionItem, null, /* @__PURE__ */ import_react9.default.createElement(import_react_accessible_accordion2.AccordionItemHeading, null, /* @__PURE__ */ import_react9.default.createElement(import_react_accessible_accordion2.AccordionItemButton, null, /* @__PURE__ */ import_react9.default.createElement(StyledFilterHeader, {
    styles: customSearchFilter == null ? void 0 : customSearchFilter.styles.header
  }, /* @__PURE__ */ import_react9.default.createElement("b", null, title, ":"), "  \xA0 ", description))), /* @__PURE__ */ import_react9.default.createElement(import_react_accessible_accordion2.AccordionItemPanel, null, /* @__PURE__ */ import_react9.default.createElement(StyledFilterContent, {
    styles: customSearchFilter == null ? void 0 : customSearchFilter.styles.network
  }, /* @__PURE__ */ import_react9.default.createElement(FilterNetworkAll, null), /* @__PURE__ */ import_react9.default.createElement(FilterNetworkSelectors, null))), /* @__PURE__ */ import_react9.default.createElement(import_react_accessible_accordion2.AccordionItemPanel, null, /* @__PURE__ */ import_react9.default.createElement(StyledFilterContent, {
    styles: customSearchFilter == null ? void 0 : customSearchFilter.styles.exchange
  }, exchangesActive && /* @__PURE__ */ import_react9.default.createElement(FilterExchangeAll, null), exchangesActive && /* @__PURE__ */ import_react9.default.createElement(FilterExchangeSelectors, null))))));
};
var SearchFilters_default = SearchFilters;

// src/searchbar/tokenSearch/index.tsx
var TokenSearch = (renderProps) => {
  const dispatch = (0, import_react_redux6.useDispatch)();
  const { isSelecting, isLoading } = (0, import_react_redux6.useSelector)((state) => state);
  const searchRef = (0, import_react10.useRef)();
  (0, import_react10.useEffect)(() => {
    window.onmousedown = (e) => {
      var _a;
      if (!((_a = searchRef == null ? void 0 : searchRef.current) == null ? void 0 : _a.contains(e.target))) {
        dispatch(stopSelecting());
      }
    };
  }, [dispatch]);
  return /* @__PURE__ */ import_react10.default.createElement(TokenSearch_default.Provider, {
    value: renderProps
  }, /* @__PURE__ */ import_react10.default.createElement("div", {
    ref: searchRef
  }, /* @__PURE__ */ import_react10.default.createElement(SearchInput_default, null), /* @__PURE__ */ import_react10.default.createElement(SearchFilters_default, null), isSelecting && /* @__PURE__ */ import_react10.default.createElement(SearchResult_default, {
    loading: isLoading
  })));
};
var tokenSearch_default = TokenSearch;

// src/searchbar/index.tsx
function SearchBar(renderProps) {
  return /* @__PURE__ */ import_react11.default.createElement(import_react_redux7.Provider, {
    store
  }, /* @__PURE__ */ import_react11.default.createElement(tokenSearch_default, {
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
var import_react_accessible_accordion3 = require("react-accessible-accordion");
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Accordion,
  AccordionItem,
  AccordionItemButton,
  AccordionItemHeading,
  AccordionItemPanel,
  SearchBar
});
//# sourceMappingURL=index.js.map