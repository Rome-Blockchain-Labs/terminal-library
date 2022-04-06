import React from "react"
import './App.css';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import TokenSearch from "./tokenSearch";

function SearchBar() {
  return (
    <div className="App">
      <Provider store={store}>
      <br/><br/><br/><br/><br/><br/>
      <br/><br/>
      <div style={{width:"500px", margin:"auto", border:"solid"}}>
        <TokenSearch />
      </div>
      </Provider>
    </div>
  );
}

export default SearchBar;
