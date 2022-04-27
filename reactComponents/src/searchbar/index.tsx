import React, { FC } from 'react';

import './App.css';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import TokenSearch from "./tokenSearch";
import { RenderProps } from '../types';

export const SearchBar: FC<RenderProps> = (renderProps: RenderProps) => {
  return (  
    <Provider store={store}>      
      <TokenSearch 
        customWrapper={renderProps?.customWrapper}
        customSearchInput={renderProps?.customSearchInput}
        customSearchFilter={renderProps?.customSearchFilter}
        customLoading={renderProps?.customLoading}
        customChip={renderProps?.customChip}
        customResult={renderProps?.customResult}
        customTokenDetail={renderProps?.customTokenDetail}        
        customActions={renderProps?.customActions}        
        customAllChip={renderProps?.customAllChip}
      />
    </Provider>    
  );
}
