import React, { useEffect, useRef, FC } from 'react';
import { useDispatch, useSelector, RootStateOrAny } from 'react-redux';
import styled from 'styled-components';
import { stopSelecting } from '../redux/tokenSearchSlice';
import SearchInput from "./SearchInput";
import SearchResult from "./SearchResult";
import SearchFilters from "./SearchFilters";
import TokenSearchContext from '../Context/TokenSearch'
import { RenderProps } from '../../types';

const StyledWrapper = styled.div`
  ${({styles}) => `
    min-width: 420px;
    overflow-x: auto;
    background-color: ${ styles?.backgroundColor || "#474F5C" };          
    border-radius: ${ styles?.borderRadius || "4px" };  
    border:  ${ styles?.border || "4px solid #474F5C" };  
  `}  
`

export const TokenSearch: FC<RenderProps> = (renderProps: RenderProps) => {
  const { customWrapper } = renderProps
  const dispatch = useDispatch();
  const { isSelecting, isLoading } = useSelector((state: RootStateOrAny) => state);
  const searchRef = useRef<HTMLDivElement>();

  useEffect(() => {
    window.onmousedown = (e) => {
      if (!searchRef?.current?.contains(e.target)) {
        dispatch(stopSelecting());
      }
    };
  }, [dispatch]);

  return (
    <TokenSearchContext.Provider value={renderProps}>
      <StyledWrapper ref={searchRef} styles={customWrapper}>
        <SearchInput />
        
        {isSelecting && (
          <>
            <SearchFilters />      
            <SearchResult loading={isLoading} />
          </>
          )
        }
      </StyledWrapper>
    </TokenSearchContext.Provider>
  );
};

export default TokenSearch;
