import {
  configureStore,
  getDefaultMiddleware,
} from '@reduxjs/toolkit';

import { tokenSearchSlice } from './tokenSearchSlice';



const rootReducer = tokenSearchSlice.reducer

export type RootState = ReturnType<typeof rootReducer>

export const store = configureStore({
  devTools: process.env.NODE_ENV !== 'production',
  middleware: getDefaultMiddleware({
    immutableCheck: false,
  }),
  reducer: rootReducer
});

