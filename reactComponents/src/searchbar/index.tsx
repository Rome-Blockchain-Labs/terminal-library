import React from "react"
import 'twin.macro';
import 'styled-components/macro'
import './App.css';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import TokenSearch from "./tokenSearch";

export function SearchBar() {
  return (
  <div>
      <Provider store={store}>
        <TokenSearch />
      </Provider>
    </div>
  );
}
