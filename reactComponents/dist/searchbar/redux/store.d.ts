declare const rootReducer: import("redux").Reducer<import("./types").TokenSearchState, import("redux").AnyAction>;
export declare type RootState = ReturnType<typeof rootReducer>;
export declare const store: import("@reduxjs/toolkit").EnhancedStore<import("./types").TokenSearchState, import("redux").AnyAction, import("@reduxjs/toolkit").MiddlewareArray<[import("redux-thunk").ThunkMiddleware<any, import("redux").AnyAction, undefined>]>>;
export {};
