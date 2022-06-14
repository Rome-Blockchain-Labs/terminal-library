import React, { FC } from 'react';

import { Provider } from 'react-redux';
import { store } from './redux/store';
import TokenSearch from './tokenSearch';
import { RenderProps } from '../../types';

/**
 * This component can be used to search for token pairs in various networks and exchanges
 * 
 * Current features:
 * - Search token pairs registered in RomeNET
 * - Filter pairs by network and exchange
 */
export const SearchBar: FC<RenderProps> = (renderProps: RenderProps) => {
  return (
    <Provider store={store}>
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
    </Provider>
  );
};
