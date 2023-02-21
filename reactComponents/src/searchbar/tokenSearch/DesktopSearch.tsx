import React, { FC, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector, RootStateOrAny } from 'react-redux';
import styled from 'styled-components';
import Popper from '@mui/material/Popper';
import ClickAwayListener from '@mui/material/ClickAwayListener';

import { stopSelecting, setViewResult } from '../redux/tokenSearchSlice';
import SearchInput from './SearchInput';
import SearchResult from './SearchResult';
import SearchFilters from './SearchFilters';
import { RenderProps } from '../../types';

const DesktopSearchWrapper = styled.div`
  width: 100%;
  margin: auto;
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

const PopoverContent = styled.div<{ minWidth: number }>`
  padding: 10px;
  background: #494F5B;
  border-radius: 4px;
  box-sizing: border-box;
  margin-top: 2px;

  ${({ minWidth }) => Boolean(minWidth) && `min-width: ${minWidth}px;`}
`;

const DesktopSearch: FC<RenderProps> = (renderProps: RenderProps) => {
  const dispatch = useDispatch();
  const { customWrapper } = renderProps;
  const { isSelecting, isLoading, viewResult } = useSelector((state: RootStateOrAny) => state);

  const [, setRecomputePopperPosition] = useState(false);

  const searchInputRef = useRef<HTMLInputElement | null>(null);

  const onClickAwayResultsMenu = () => {
    dispatch(stopSelecting());
    dispatch(setViewResult(false));
  };

  function toggleRecomputePopperPosition() {
    setRecomputePopperPosition(prev => !prev);
  }

  useEffect(() => {
    setTimeout(() => {
      toggleRecomputePopperPosition();
    }, 100);
  }, [isSelecting]);

  return (
    <DesktopSearchWrapper>
        <DesktopSearchInner styleOverrides={customWrapper}>
          <ClickAwayListener onClickAway={onClickAwayResultsMenu}>
            <div>
              <div ref={searchInputRef}>
                <SearchInput />
              </div>
              <Popper
                open={isSelecting}
                anchorEl={searchInputRef?.current}
              >
                <PopoverContent style={{ minWidth: searchInputRef?.current?.offsetWidth ?? 360 }}>
                  <SearchFilters recomputePositioning={toggleRecomputePopperPosition} />
                  {viewResult && <SearchResult loading={isLoading} />}
                </PopoverContent>
              </Popper>
            </div>
          </ClickAwayListener>
        </DesktopSearchInner>
    </DesktopSearchWrapper>
  );
};

export default DesktopSearch;