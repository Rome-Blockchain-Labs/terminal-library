import React from "react";
import "./App.css";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import TokenSearch from "./tokenSearch";

export function SearchBar() {
  return (
    <div className="App">
      <Provider store={store}>
        <div style={{ width: "500px", margin: "auto", border: "solid" }}>
          <TokenSearch />
        </div>
      </Provider>
    </div>
  );
}
