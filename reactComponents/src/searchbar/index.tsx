import React, { FC } from 'react';

import './App.css';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import TokenSearch from './tokenSearch';
import { RenderProps } from '../types';
import config from './config';

export const SearchBar: FC<RenderProps> = (renderProps: RenderProps) => {
  return (
    <Provider store={store}>
      {!config.IS_ENV_PRODUCTION && (
        <TokenSearch
          customWrapper={renderProps.customWrapper}
          customSearchInput={renderProps.customSearchInput}
          customSearchFilter={renderProps.customSearchFilter}
          customLoading={renderProps.customLoading}
          customChip={renderProps.customChip}
          customResult={renderProps.customResult}
          customTokenDetail={renderProps.customTokenDetail}
          customActions={renderProps.customActions}
          customAllChip={renderProps.customAllChip}
          networks={renderProps.networks}
        />
      )}
    </Provider>
  );
};
