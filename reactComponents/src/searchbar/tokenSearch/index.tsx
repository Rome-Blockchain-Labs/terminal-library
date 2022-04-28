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
  ${({styleOverrides}) => `
    min-width: 420px;            
    position: relative;

    & .dropDown {
      position: absolute;
      width: -webkit-fill-available;
      left: 0; 
      top: 33px;
      z-index: 99;
      background-color: ${ styleOverrides?.backgroundColor || "#474F5C" };          
      border-bottom-left-radius: ${ styleOverrides?.borderBottomLeftRadius || "4px" };  
      border-bottom-right-radius: ${ styleOverrides?.borderBottomRightRadius || "4px" };  
      border-color: ${ styleOverrides?.borderColor || "#474F5C" };          
      border-style: ${ styleOverrides?.borderStyle || "solid" };                
      border-width:${ styleOverrides?.borderStyle || "4px" };                 
      border-top: none;
    }
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
      <StyledWrapper ref={searchRef} styleOverrides={customWrapper}>
        <SearchInput />      
        {isSelecting && (
          <div className='dropDown'>        
              <SearchFilters />      
              <SearchResult loading={isLoading} />            
          </div>
          )
        }      
      </StyledWrapper>      
    </TokenSearchContext.Provider>
  );
};

export default TokenSearch;
