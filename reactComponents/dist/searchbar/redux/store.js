"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.store = void 0;
const toolkit_1 = require("@reduxjs/toolkit");
const tokenSearchSlice_1 = require("./tokenSearchSlice");
const rootReducer = tokenSearchSlice_1.tokenSearchSlice.reducer;
exports.store = (0, toolkit_1.configureStore)({
    devTools: process.env.NODE_ENV !== 'production',
    middleware: (0, toolkit_1.getDefaultMiddleware)({
        immutableCheck: false,
    }),
    reducer: rootReducer
});
