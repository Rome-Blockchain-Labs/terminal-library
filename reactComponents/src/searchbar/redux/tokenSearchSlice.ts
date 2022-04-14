import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import retry from 'async-retry';
import { stringify } from 'flatted';
import { searchTokensAsync } from "../tokenSearch/helpers/async";
import { TokenSearchState } from "./types";
import { networkExchangePairs } from '../tokenSearch/helpers/config';
import { filterActiveAll, filterActiveNames } from '../tokenSearch/helpers/filters.js';


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


export const searchTokenPairs = createAsyncThunk(
  'token/search',
  async (searchString, thunkAPI) => {
    // Cancel search is string is empty.
    if (!searchString) return;

    try {
      let { networkMap, exchangeMap } = thunkAPI.getState();
      const pairSearchTimestamp = new Date().getTime();
      console.log('Search sent');


      // Dispatches "setPairSearchTimestamp".
      thunkAPI.dispatch(setPairSearchTimestamp(pairSearchTimestamp));

      // Runs the function handling the cleaning of the properties from their values indicating if they are enabled or not.
      networkMap = filterActiveNames(networkMap);
      exchangeMap = filterActiveNames(exchangeMap);

      // Runs the function handling the management of the "All" value selected by the user.
      networkMap = filterActiveAll(networkMap) ? [...new Set(networkExchangePairs.map(pair => pair[0]))] : networkMap;
      exchangeMap = filterActiveAll(exchangeMap) ? [...new Set(networkExchangePairs.map(pair => pair[1]))] : exchangeMap;

      // Filtering out any exchange that is not valid for the selected networks.
      // This has to be done since an exchange will remain in the array when the network is disabled by the user.
      // It's easier here and also offer a more natural experience for the user.
      exchangeMap = exchangeMap
        .filter(exchange => networkExchangePairs
          .filter(pair => networkMap.includes(pair[0]) && pair[1] === exchange).length >= 1);

      // Filtering out any network that does not have at least one valid exchange selected.
      // This has to be done since the user can still have a network selected while it has no valid exchange selected.
      // It's easier here and also offer a more natural experience for the user.
      // We do this in last because this has a real potential to harm the user experience by running GraphQL queries that are not needed unlike feeding to the
      // query an unused echange for a given network.
      networkMap = networkMap
        .filter(network => networkExchangePairs
          .filter(pair => pair[0] === network && exchangeMap.includes(pair[1])).length >= 1);

      // Loading the data.
      const data = await retry(() => searchTokensAsync(searchString, networkMap, exchangeMap), { retries: 1 });

      // console.log("data", data);
      console.log(data.length + ' results', (new Date().getTime() - pairSearchTimestamp) + 'ms');
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
