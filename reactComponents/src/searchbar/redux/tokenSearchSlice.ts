import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import retry from 'async-retry';
import { stringify } from 'flatted';
import { searchTokensAsync } from "../tokenSearch/helpers/async";
import { uniq, omitBy } from "lodash"
import { networkExchangePairs } from '../tokenSearch/helpers/config';
import { TokenSearchState } from "./types";

export const setPair = createAsyncThunk(
  'token/setPair',
  async ({ selectedPair }: any) => {
    console.log("setPair")
    return selectedPair;
  }
);

export const resetSearchOnNewExchange = createAsyncThunk(
  'token/searchReset',
  async (searchString: any, thunkAPI: any) => {
    console.log("resetSearchOnNewExchange")
    thunkAPI.dispatch(searchTokenPairs(''));
  }
);

//todo no need for this to be a thunk
const setPairSearchTimestamp = createAsyncThunk(
  'token/saveTime',
  async (timestamp: any) => {
    return timestamp;
  }
);


// Function that handles the "All" values of both the network and the exchange.
// Consider that "no value" equates "All".
const allValueHandler = (networkMap, exchangeMap) => {
  let returnedNetworkMap = networkMap;
  let returnedExchangeMap = exchangeMap;


  // Validates that the networkMap contains the "All" value.
  // If "All" is active, it overrides all other networks; thus we enable all the networks.
  if (networkMap.length === 0 || networkMap.includes('All')) {
    // Loads all the networks from "networkExchangePairs".
    returnedNetworkMap = uniq(networkExchangePairs.map(pair => pair[0]));
  }

  // Validates that the networkMap contains the "All" value.
  // If "All" is active, it overrides all other networks; thus we enable all the networks.
  if (exchangeMap.length === 0 || exchangeMap.includes('All')) {
    // Loads all the networks from "networkExchangePairs".
    returnedExchangeMap = uniq(networkExchangePairs.map(pair => pair[1]));
  }


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


export const searchTokenPairs = createAsyncThunk(
  'token/search',
  async (searchString: any, thunkAPI: any) => {
    try {
      let { networkMap, exchangeMap } = thunkAPI.getState();
      let processedNetworks;
      let processedExchanges;
      const pairSearchTimestamp = new Date().getTime();


      // Dispatches "setPairSearchTimestamp".
      thunkAPI.dispatch(setPairSearchTimestamp(pairSearchTimestamp));

      // Runs the function handling the cleaning of the properties from their values indicating if they are enabled or not.
      [processedNetworks, processedExchanges] = valueCleaner(networkMap, exchangeMap);

      // Runs the function handling the management of the "All" value selected by the user.
      [processedNetworks, processedExchanges] = allValueHandler(processedNetworks, processedExchanges);

      // Filtering out any exchange that is not valid for the selected networks.
      // This has to be done since an exchange will remain in the array when the network is disabled by the user.
      // It's easier here and also offer a more natural experience for the user.
      processedExchanges = processedExchanges
        .filter(exchange => networkExchangePairs
          .filter(pair => processedNetworks.includes(pair[0]) && pair[1] === exchange).length >= 1);

      // Filtering out any network that does not have at least one valid exchange selected.
      // This has to be done since the user can still have a network selected while it has no valid exchange selected.
      // It's easier here and also offer a more natural experience for the user.
      // We do this in last because this has a real potential to harm the user experience by running GraphQL queries that are not needed unlike feeding to the
      // query an unused echange for a given network.
      processedNetworks = processedNetworks
        .filter(network => networkExchangePairs
          .filter(pair => pair[0] === network && processedExchanges.includes(pair[1])).length >= 1);

      // Loading the data.
      const data = await retry(() => searchTokensAsync(searchString, processedNetworks, processedExchanges), { retries: 1 });

      // console.log("data", data);
      console.log("data", data.length);
      return { data, pairSearchTimestamp };
    }
    catch (e) {
      console.log("err searchTokenPairs", e);
      throw new Error(stringify(e, Object.getOwnPropertyNames(e)));
    }
  }
);

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
  exchangeMap: {},
  networkMap: {}
};

export const tokenSearchSlice = createSlice({
  extraReducers: (builder) => {
    builder.addCase(resetSearchOnNewExchange.fulfilled, (state, action) => {
      state.searchText = '';
      state.suggestions = [];
      state.isLoading = true;
      state.fetchError = null;
      state.isSelecting = false;
      state.selectedPair = undefined;
      // don't update pairSearchTimestamp
      state.serializedTradeEstimator = '';
    });
    builder.addCase(setPairSearchTimestamp.fulfilled, (state, action) => {
      state.pairSearchTimestamp = action.payload;
    });
    builder.addCase(setPair.fulfilled, (state, action) => {
      //pending/rejected not needed as its not really async
      state.searchText = '';
      state.isSelecting = false;
      state.selectedPair = action.payload;
    });
    builder.addCase(searchTokenPairs.pending, (state) => {
      state.isLoading = true;
      state.fetchError = null;
    });
    builder.addCase(searchTokenPairs.fulfilled, (state, action) => {
      if (action.payload?.pairSearchTimestamp >= state.pairSearchTimestamp) {
        state.pairSearchTimestamp = action.payload.pairSearchTimestamp;
        state.suggestions = action.payload.data;
        state.isLoading = false;
        state.fetchError = null;
      }
    });
    builder.addCase(searchTokenPairs.rejected, (state, action) => {
      state.suggestions = [];
      state.isLoading = false;
      state.fetchError = 'Something went wrong fetching token pair.'; //action.error.message
    });
  },
  initialState,
  name: 'tokenSearch',
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
        }
        else {
          // Removes all manual networks.
          delete state.exchangeMap[exchangeName]
        }
      };
      // Object.keys(state.exchangeMap).map(key => delete state.exchangeMap[key]);
    },
    setNetworkMap: (state, action) => {
      // Setting the payload network name to the payload value.
      state.networkMap[action.payload.networkName] = action.payload.checked;
    },
    setNetworkMapAll: (state, action) => {
      let networkName;


      // Loops through the network names.
      for (networkName of action.payload.networkNames) {
        // Validate if "all network" is active.
        if (action.payload.networkAll) {
          // Sets all networks to true.
          state.networkMap[networkName] = true;
        }
        else {
          // Removes all manual networks.
          delete state.networkMap[networkName]
        }
      };
    }
  },
});

export const { setSearchText, startSelecting, stopSelecting, toggleSelecting, setExchangeMap, setExchangeMapAll, setNetworkMap, setNetworkMapAll, setSearchToken } =
  tokenSearchSlice.actions;
export default tokenSearchSlice.reducer;
