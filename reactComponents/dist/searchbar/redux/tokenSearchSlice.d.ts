import { TokenSearchState } from "./types";
export declare const setPair: import("@reduxjs/toolkit").AsyncThunk<any, any, {}>;
export declare const resetSearchOnNewExchange: import("@reduxjs/toolkit").AsyncThunk<void, any, {}>;
export declare const searchTokenPairs: import("@reduxjs/toolkit").AsyncThunk<{
    data: any;
    pairSearchTimestamp: number;
}, any, {}>;
export declare const tokenSearchSlice: import("@reduxjs/toolkit").Slice<TokenSearchState, {
    setSearchText: (state: import("immer/dist/internal").WritableDraft<TokenSearchState>, action: {
        payload: any;
        type: string;
    }) => void;
    startSelecting: (state: import("immer/dist/internal").WritableDraft<TokenSearchState>) => void;
    stopSelecting: (state: import("immer/dist/internal").WritableDraft<TokenSearchState>) => void;
    toggleSelecting: (state: import("immer/dist/internal").WritableDraft<TokenSearchState>) => void;
    setExchangeMap: (state: import("immer/dist/internal").WritableDraft<TokenSearchState>, action: {
        payload: any;
        type: string;
    }) => void;
    setExchangeMapAll: (state: import("immer/dist/internal").WritableDraft<TokenSearchState>, action: {
        payload: any;
        type: string;
    }) => void;
    setNetworkMap: (state: import("immer/dist/internal").WritableDraft<TokenSearchState>, action: {
        payload: any;
        type: string;
    }) => void;
    setNetworkMapAll: (state: import("immer/dist/internal").WritableDraft<TokenSearchState>, action: {
        payload: any;
        type: string;
    }) => void;
}, "tokenSearch">;
export declare const setSearchText: import("@reduxjs/toolkit").ActionCreatorWithPayload<any, string>, startSelecting: import("@reduxjs/toolkit").ActionCreatorWithoutPayload<string>, stopSelecting: import("@reduxjs/toolkit").ActionCreatorWithoutPayload<string>, toggleSelecting: import("@reduxjs/toolkit").ActionCreatorWithoutPayload<string>, setExchangeMap: import("@reduxjs/toolkit").ActionCreatorWithPayload<any, string>, setExchangeMapAll: import("@reduxjs/toolkit").ActionCreatorWithPayload<any, string>, setNetworkMap: import("@reduxjs/toolkit").ActionCreatorWithPayload<any, string>, setNetworkMapAll: import("@reduxjs/toolkit").ActionCreatorWithPayload<any, string>;
declare const _default: import("redux").Reducer<TokenSearchState, import("redux").AnyAction>;
export default _default;
