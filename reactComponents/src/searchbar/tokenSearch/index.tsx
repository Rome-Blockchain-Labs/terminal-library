import React, { FC } from 'react';
import TokenSearchContext from '../Context/TokenSearch';
import DesktopSearch from './DesktopSearch';
import MobileSearch from './MobileSearch';
import { RenderProps } from '../../types';
import { useIsMobile } from '../hooks/useReponsive';

export const TokenSearch: FC<RenderProps> = (renderProps: RenderProps) => {
  const isMobile = useIsMobile();  
  
  return (
    <TokenSearchContext.Provider value={renderProps}>
      {isMobile ? (
        <MobileSearch {...renderProps} />
      ) : (
        <DesktopSearch {...renderProps} />
      )}
    </TokenSearchContext.Provider>
  );
};

export default TokenSearch;
