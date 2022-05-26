import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import retry from 'async-retry';
import { stringify } from 'flatted';
import { searchTokensAsync } from '../tokenSearch/helpers/async';
import { uniq, omitBy } from 'lodash';
import { TokenSearchState } from './types';
import config from '../config';

const LOAD_LIMIT = Number(config.LOAD_LIMIT || 10);

// Function that handles the "All" values of both the network and the exchange.
// Consider that "no value" equates "All".
const allValueHandler = (networkMap, exchangeMap, networks) => {
  let returnedNetworkMap = networkMap;
  let returnedExchangeMap = exchangeMap;

  // Validates that the networkMap contains the "All" value.
  // If "All" is active, it overrides all other networks; thus we enable all the networks.
  if (networkMap.length === 0 || networkMap.includes('All')) {
    // Loads all the networks from "networkExchangePairs".
    returnedNetworkMap = uniq(networks.map((network) => network.id));
  }

  // Validates that the networkMap contains the "All" value.
  // If "All" is active, it overrides all other networks; thus we enable all the networks.
  if (exchangeMap.length === 0 || exchangeMap.includes('All')) {
    // Loads all the networks from "networkExchangePairs".
  }
  const exchanges: string[] = [];
  networks.forEach((network) => {
    if (returnedNetworkMap.includes(network.id)) {
      network.exchanges.forEach((exchange) => {
        exchanges.push(exchange.name);
      });
    }
  });
  returnedExchangeMap = exchanges;

  // Returns the processed values of "networkMap" and "exchangeMap".
  return [returnedNetworkMap, returnedExchangeMap];
};

// Function that handles the "All" values of both the network and the exchange.
const valueCleaner = (networkMap, exchangeMap) => {
  // We have to use "omitBy" since a network or exchange will remain in the object if a user unselect them, but as false instead of true.
  // We then load each network and exchange by their key into an array to further filter them.
  networkMap = Object.keys(omitBy(networkMap, (b) => !b));
  exchangeMap = Object.keys(omitBy(exchangeMap, (b) => !b));

  // Returns the processed values of "networkMap" and "exchangeMap".
  return [networkMap, exchangeMap];
};

export const searchTokenPairs = createAsyncThunk('token/search', async (dataProp: any, thunkAPI: any) => {
  try {
    const { networkMap, exchangeMap } = thunkAPI.getState();
    const { searchString, networks } = dataProp;
    let processedNetworks;
    let processedExchanges;
    const pairSearchTimestamp = new Date().getTime();

    // Dispatches "setPairSearchTimestamp".
    thunkAPI.dispatch(setPairSearchTimestamp(pairSearchTimestamp));

    // Runs the function handling the cleaning of the properties from their values indicating if they are enabled or not.
    [processedNetworks, processedExchanges] = valueCleaner(networkMap, exchangeMap);

    // Runs the function handling the management of the "All" value selected by the user.
    [processedNetworks, processedExchanges] = allValueHandler(
      processedNetworks,
      processedExchanges,
      networks
    );

    // Loading the data.
    const data = await retry(() => searchTokensAsync(searchString, processedNetworks, processedExchanges), {
      retries: 1,
    });

    return { data, pairSearchTimestamp };
  } catch (e) {
    console.log('err searchTokenPairs', e);
    throw new Error(stringify(e, Object.getOwnPropertyNames(e)));
  }
});

const initialTimestamp = new Date().getTime();
const initialState: TokenSearchState = {
  fetchError: null,
  isLoading: false,
  isSelecting: false,
  pairSearchTimestamp: initialTimestamp,
  searchText: '',
  selectedPair: undefined,
  serializedTradeEstimator: '',
  suggestions: [],
  suggestionRendered: [],
  page: 1,
  exchangeMap: {},
  networkMap: {},
  viewResult: false,
};

const loadMoreItem = (state) => {
  state.suggestionRendered = state.suggestions.slice(0, state.page * LOAD_LIMIT);
  state.page += 1;
};

export const tokenSearchSlice = createSlice({
  extraReducers: (builder) => {
    builder.addCase(searchTokenPairs.pending, (state) => {
      state.isLoading = true;
      state.fetchError = null;
    });
    builder.addCase(searchTokenPairs.fulfilled, (state, action) => {
      if (action.payload?.pairSearchTimestamp >= state.pairSearchTimestamp) {
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
      state.fetchError = 'Something went wrong fetching token pair.'; //action.error.message
    });
  },
  initialState,
  name: 'tokenSearch',
  reducers: {
    resetSearch: (state) => {
      state.searchText = '';
      state.suggestions = [];
      state.isLoading = false;
      (state.exchangeMap = {}), (state.networkMap = {}), (state.isSelecting = false);
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
      // Setting the payload exchange name to the payload value.
      state.exchangeMap[action.payload.exchangeName] = action.payload.checked;
    },
    setExchangeMapAll: (state, action) => {
      let exchangeName;

      // Loops through the network names.
      for (exchangeName of action.payload.exchangeNames) {
        // Validate if "all exchange" is active.
        if (action.payload.exchangeAll) {
          // Sets all networks to true.
          state.exchangeMap[exchangeName] = true;
        } else {
          // Removes all manual networks.
          delete state.exchangeMap[exchangeName];
        }
      }
      // Object.keys(state.exchangeMap).map(key => delete state.exchangeMap[key]);
    },
    setNetworkMap: (state, action) => {
      // Setting the payload network name to the payload value.
      state.networkMap[action.payload.networkName] = action.payload.checked;
      // if network is false, all exchanges will be deselected.
      if (!action.payload.checked) {
        action.payload.networks.forEach((network) => {
          if (network.id === action.payload.networkName) {
            network.exchanges.forEach((exhange) => {
              if (state.exchangeMap[exhange]) state.exchangeMap[exhange] = false;
            });
          } else return false;
        });
      }
    },
    setNetworkMapAll: (state, action) => {
      let networkName;

      // Loops through the network names.
      for (networkName of action.payload.networkNames) {
        // Validate if "all network" is active.
        if (action.payload.networkAll) {
          // Sets all networks to true.
          state.networkMap[networkName] = true;
        } else {
          // Removes all manual networks.
          delete state.networkMap[networkName];
        }
      }
    },
    loadMore: (state) => {
      loadMoreItem(state);
    },
  },
});

export const {
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
  setPairSearchTimestamp,
} = tokenSearchSlice.actions;

export default tokenSearchSlice.reducer;
