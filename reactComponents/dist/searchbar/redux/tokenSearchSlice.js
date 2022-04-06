"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.setNetworkMapAll = exports.setNetworkMap = exports.setExchangeMapAll = exports.setExchangeMap = exports.toggleSelecting = exports.stopSelecting = exports.startSelecting = exports.setSearchText = exports.tokenSearchSlice = exports.searchTokenPairs = exports.resetSearchOnNewExchange = exports.setPair = void 0;
const toolkit_1 = require("@reduxjs/toolkit");
const async_retry_1 = __importDefault(require("async-retry"));
const flatted_1 = require("flatted");
const async_1 = require("../tokenSearch/helpers/async");
const lodash_1 = require("lodash");
const config_1 = require("../tokenSearch/helpers/config");
exports.setPair = (0, toolkit_1.createAsyncThunk)('token/setPair', ({ selectedPair }) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("setPair");
    return selectedPair;
}));
exports.resetSearchOnNewExchange = (0, toolkit_1.createAsyncThunk)('token/searchReset', (searchString, thunkAPI) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("resetSearchOnNewExchange");
    thunkAPI.dispatch((0, exports.searchTokenPairs)(''));
}));
//todo no need for this to be a thunk
const setPairSearchTimestamp = (0, toolkit_1.createAsyncThunk)('token/saveTime', (timestamp) => __awaiter(void 0, void 0, void 0, function* () {
    return timestamp;
}));
// Function that handles the "All" values of both the network and the exchange.
// Consider that "no value" equates "All".
const allValueHandler = (networkMap, exchangeMap) => {
    let returnedNetworkMap = networkMap;
    let returnedExchangeMap = exchangeMap;
    // Validates that the networkMap contains the "All" value.
    // If "All" is active, it overrides all other networks; thus we enable all the networks.
    if (networkMap.length === 0 || networkMap.includes('All')) {
        // Loads all the networks from "networkExchangePairs".
        returnedNetworkMap = (0, lodash_1.uniq)(config_1.networkExchangePairs.map(pair => pair[0]));
    }
    // Validates that the networkMap contains the "All" value.
    // If "All" is active, it overrides all other networks; thus we enable all the networks.
    if (exchangeMap.length === 0 || exchangeMap.includes('All')) {
        // Loads all the networks from "networkExchangePairs".
        returnedExchangeMap = (0, lodash_1.uniq)(config_1.networkExchangePairs.map(pair => pair[1]));
    }
    // Returns the processed values of "networkMap" and "exchangeMap".
    return [returnedNetworkMap, returnedExchangeMap];
};
// Function that handles the "All" values of both the network and the exchange.
const valueCleaner = (networkMap, exchangeMap) => {
    // We have to use "omitBy" since a network or exchange will remain in the object if a user unselect them, but as false instead of true.
    // We then load each network and exchange by their key into an array to further filter them.
    networkMap = Object.keys((0, lodash_1.omitBy)(networkMap, (b) => !b));
    exchangeMap = Object.keys((0, lodash_1.omitBy)(exchangeMap, (b) => !b));
    // Returns the processed values of "networkMap" and "exchangeMap".
    return [networkMap, exchangeMap];
};
exports.searchTokenPairs = (0, toolkit_1.createAsyncThunk)('token/search', (searchString, thunkAPI) => __awaiter(void 0, void 0, void 0, function* () {
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
            .filter(exchange => config_1.networkExchangePairs
            .filter(pair => processedNetworks.includes(pair[0]) && pair[1] === exchange).length >= 1);
        // Filtering out any network that does not have at least one valid exchange selected.
        // This has to be done since the user can still have a network selected while it has no valid exchange selected.
        // It's easier here and also offer a more natural experience for the user.
        // We do this in last because this has a real potential to harm the user experience by running GraphQL queries that are not needed unlike feeding to the
        // query an unused echange for a given network.
        processedNetworks = processedNetworks
            .filter(network => config_1.networkExchangePairs
            .filter(pair => pair[0] === network && processedExchanges.includes(pair[1])).length >= 1);
        // Loading the data.
        const data = yield (0, async_retry_1.default)(() => (0, async_1.searchTokensAsync)(searchString, processedNetworks, processedExchanges), { retries: 1 });
        // console.log("data", data);
        console.log("data", data.length);
        return { data, pairSearchTimestamp };
    }
    catch (e) {
        console.log("err searchTokenPairs", e);
        throw new Error((0, flatted_1.stringify)(e, Object.getOwnPropertyNames(e)));
    }
}));
const initialTimestamp = new Date().getTime();
const initialState = {
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
exports.tokenSearchSlice = (0, toolkit_1.createSlice)({
    extraReducers: (builder) => {
        builder.addCase(exports.resetSearchOnNewExchange.fulfilled, (state, action) => {
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
        builder.addCase(exports.setPair.fulfilled, (state, action) => {
            //pending/rejected not needed as its not really async
            state.searchText = '';
            state.isSelecting = false;
            state.selectedPair = action.payload;
        });
        builder.addCase(exports.searchTokenPairs.pending, (state) => {
            state.isLoading = true;
            state.fetchError = null;
        });
        builder.addCase(exports.searchTokenPairs.fulfilled, (state, action) => {
            var _a;
            if (((_a = action.payload) === null || _a === void 0 ? void 0 : _a.pairSearchTimestamp) >= state.pairSearchTimestamp) {
                state.pairSearchTimestamp = action.payload.pairSearchTimestamp;
                state.suggestions = action.payload.data;
                state.isLoading = false;
                state.fetchError = null;
            }
        });
        builder.addCase(exports.searchTokenPairs.rejected, (state, action) => {
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
                    delete state.exchangeMap[exchangeName];
                }
            }
            ;
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
                    delete state.networkMap[networkName];
                }
            }
            ;
        }
    },
});
_a = exports.tokenSearchSlice.actions, exports.setSearchText = _a.setSearchText, exports.startSelecting = _a.startSelecting, exports.stopSelecting = _a.stopSelecting, exports.toggleSelecting = _a.toggleSelecting, exports.setExchangeMap = _a.setExchangeMap, exports.setExchangeMapAll = _a.setExchangeMapAll, exports.setNetworkMap = _a.setNetworkMap, exports.setNetworkMapAll = _a.setNetworkMapAll;
exports.default = exports.tokenSearchSlice.reducer;
