import React from "react"
import './App.css';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import TokenSearch from "./tokenSearch";

export function SearchBar(renderProps) {
  
  return (  
    <Provider store={store}>      
      <TokenSearch 
        customSearchInput={renderProps?.customSearchInput}
        customSearchFilter={renderProps?.customSearchFilter}
        customChip={renderProps?.customChip}
        customResult={renderProps?.customResult}
        customTokenDetail={renderProps?.customTokenDetail}
        customLoading={renderProps?.customLoading}
        customActions={renderProps?.customActions}
      />
    </Provider>    
  );
}
