import React, { useEffect, FC } from 'react';
import { useDispatch, useSelector, RootStateOrAny } from 'react-redux';
import styled from 'styled-components';
import { stopSelecting, setViewResult } from '../redux/tokenSearchSlice';
import SearchInput from './SearchInput';
import SearchResult from './SearchResult';
import SearchFilters from './SearchFilters';
import TokenSearchContext from '../Context/TokenSearch';
import { RenderProps } from '../../types';
import useClickOutside from '../hooks/useClickOutside';

const StyledWrapper = styled.div`
  ${({ styleOverrides }) => `
    width: 100%;
    position: relative;

    & .dropDown {
      position: absolute;
      width: -webkit-fill-available;
      left: 0; 
      bottom: ${styleOverrides?.borderBottomLeftRadius || '5px'};  
      transform: translateY(100%);
      z-index: 99;
      background-color: ${styleOverrides?.backgroundColor || '#474F5C'};          
      border-bottom-left-radius: ${styleOverrides?.borderBottomLeftRadius || '4px'};  
      border-bottom-right-radius: ${styleOverrides?.borderBottomRightRadius || '4px'};  
      border-color: ${styleOverrides?.borderColor || '#474F5C'};          
      border-style: ${styleOverrides?.borderStyle || 'solid'};                
      border-width:${styleOverrides?.borderStyle || '4px'};                 
      border-top: none;
    }
    & button {
      display: flex;
      align-items: center;
      border-color: ${styleOverrides?.button.borderColor || '#232C38'};      
      background-color: ${styleOverrides?.button.backColor || '#232C38'};      
      color: ${styleOverrides?.button.color || '#B1B8C3'};      
      border-radius: ${styleOverrides?.button.borderRadius || '4px'};      
      font-size: ${styleOverrides?.button.fontSize || '0.75rem'};      
      padding: ${styleOverrides?.button.padding || '4px 6px'};      
      border-width: 0;      
      cursor: pointer;
      &:hover {
        background-color: ${styleOverrides?.button.hoverBackColor || 'black'};      
      }
      & span {
        padding-right: 3px;
      }
    }
  `}
`;


const Backdrop = styled.div`
  position: fixed;
  width: 100%;
  height: 100%;
  z-index: 1;
`;

export const TokenSearch: FC<RenderProps> = (renderProps: RenderProps) => {
  const { customWrapper } = renderProps;
  const dispatch = useDispatch();
  const { isSelecting, isLoading, viewResult } = useSelector((state: RootStateOrAny) => state);
  
  const closeResultPanel = () => {
    dispatch(stopSelecting());
    dispatch(setViewResult(false));
  };

  const searchRef = useClickOutside(closeResultPanel);

  useEffect(() => {
    window.addEventListener('searchBarClose', closeResultPanel);
  }, []);

  return (
    <TokenSearchContext.Provider value={renderProps}>
      {isSelecting && <Backdrop />}
      <StyledWrapper ref={searchRef} styleOverrides={customWrapper}>
        <SearchInput />
        {isSelecting && (
          <div className="dropDown">
            <SearchFilters />
            {viewResult && <SearchResult loading={isLoading} />}
          </div>
        )}
      </StyledWrapper>
    </TokenSearchContext.Provider>
  );
};

export default TokenSearch;
