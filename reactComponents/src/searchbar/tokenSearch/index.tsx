import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import 'styled-components/macro'
import { stopSelecting } from '../redux/tokenSearchSlice';
import SearchInput from "./SearchInput";
import SearchResult from "./SearchResult";
import SearchFilters from "./SearchFilters";
import {RootState} from "../redux/store";
import TokenSearchContext from '../Context/TokenSearch'

export const TokenSearch = (renderProps: any) => {
  const dispatch = useDispatch();
  const { isSelecting, isLoading } = useSelector((state:RootState) => state);
  const searchRef = useRef<HTMLInputElement>();

  useEffect(() => {
    window.onmousedown = (e) => {
      if (!searchRef?.current?.contains(e.target)) {
        dispatch(stopSelecting());
      }
    };
  }, [dispatch]);

  return (
    <TokenSearchContext.Provider value={renderProps}>
      <div ref={searchRef}>
        <SearchInput />
        <SearchFilters />
        {isSelecting && <SearchResult loading={isLoading} />}
      </div>
      </TokenSearchContext.Provider>
  );
};

export default TokenSearch;
