import React, { useEffect, FC } from 'react';
import { useDispatch, useSelector, RootStateOrAny } from 'react-redux';
import styled from 'styled-components';
import { stopSelecting, setViewResult } from '../redux/tokenSearchSlice';
import SearchInput from './SearchInput';
import SearchResult from './SearchResult';
import SearchFilters from './SearchFilters';
import useClickOutside from '../hooks/useClickOutside';
import { RenderProps } from '../../types';

const DesktopSearchWrapper = styled.div`
`;

const DesktopSearchInner = styled.div`
  width: 100%;
  position: relative;
  box-sizing: border-box;
  
  ${({ styleOverrides }) => `
    & .tl-dropdown {
      position: absolute;
      left: 0; 
      bottom: ${styleOverrides?.borderRadius || '4px'};
      transform: translateY(100%);
      z-index: 2;
      width: -webkit-fill-available;
      padding: 10px;
      background-color: ${styleOverrides?.backgroundColor || '#494F5B'};
      border-bottom-left-radius: ${styleOverrides?.borderRadius || '4px'};
      border-bottom-right-radius: ${styleOverrides?.borderRadius || '4px'};
      border-top: none;
    }
  `}
`;

const Backdrop = styled.div`
  position: fixed;
  width: 100%;
  height: 100%;
  z-index: 1;
`;

const DesktopSearch: FC<RenderProps> = (renderProps: RenderProps) => {
  const dispatch = useDispatch();
  const { customWrapper } = renderProps;
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
    <DesktopSearchWrapper>
      {isSelecting && <Backdrop />}
      <DesktopSearchInner ref={searchRef} styleOverrides={customWrapper}>
        <SearchInput />
        {isSelecting && (
          <div className="tl-dropdown">
            <SearchFilters />
            {viewResult && <SearchResult loading={isLoading} />}
          </div>
        )}
      </DesktopSearchInner>
    </DesktopSearchWrapper>
  )

  
};

export default DesktopSearch;