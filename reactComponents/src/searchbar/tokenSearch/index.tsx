import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import 'twin.macro';
import 'styled-components/macro'
import { stopSelecting } from '../redux/tokenSearchSlice';
import SearchInput from "./SearchInput";
import SearchResult from "./SearchResult";
import SearchFilters from "./SearchFilters";
import {RootState} from "../redux/store";


export const TokenSearch = () => {
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
    <div tw="m-10" ref={searchRef}>
      <SearchInput />
      <SearchFilters />
      {isSelecting && <SearchResult loading={isLoading} />}
    </div>
  );
};

export default TokenSearch;
