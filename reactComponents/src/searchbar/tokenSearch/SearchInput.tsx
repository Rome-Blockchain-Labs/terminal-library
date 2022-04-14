import React, { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import debounce from 'lodash.debounce';
import { searchTokenPairs, startSelecting, toggleSelecting, setSearchText, setSearchToken } from '../redux/tokenSearchSlice';
import magnifyingGlass from './icon-search.svg'
import { RootState } from "../redux/store";
import { mutatorTextToken } from "./helpers/mutatorTextToken";

const PairField = styled.div`
  display: block;
  margin-left: auto;
  margin-right: auto;
  position: relative;
  border-color: #067c82;
  border-style: solid;
  border-width: 2px;
  border-radius: 30px;
  background: #08333c;
  padding: 11px 15px;
  font-size: 15px;
  color: #ffffff;
  font-family: 'Fira Code', monospace;

  @media only screen and (max-width: 990px) {
    width: 100%;
  }

  @media only screen and (max-width: 769px) {
    width: 100%;
  }
`;

const StyledInput = styled.input`
  width: 100%;
  border: none;
  background-color: inherit;
  color: #ffffff;
  //width: auto;
`;

const HideOnSmallScreen = styled.img`
  width: 30px;
  cursor: pointer;
  float: right;
  position: absolute;
  right: 22px;
  top: 9px;
  @media only screen and (max-width: 990px) {
    display: none;
  }
`;


const SearchInput = () => {
  const dispatch = useDispatch();
  const { searchText, networkMap, exchangeMap, searchToken } = useSelector((state: RootState) => state);


  // Updates the datasets of the results.
  useEffect(() => { dispatch(searchTokenPairs(searchText)); }, [dispatch, searchText, networkMap, exchangeMap]);


  const onChangeFilter = (event) => {
    const value = mutatorTextToken(event.target, searchToken, dispatch);
    dispatch(setSearchText(value));
  }

  const debounceChangeHandler = useCallback(debounce(onChangeFilter, 350), [searchText])
  // RENDERING.
  return (
    <PairField onClick={() => dispatch(startSelecting())}>
      <StyledInput
        placeholder={'Select a token pair'}
        autocomplete={'off'}
        maxLength="48"
        onChange={debounceChangeHandler}
      />
      <HideOnSmallScreen
        alt={''}
        src={magnifyingGlass}
        onClick={() => dispatch(toggleSelecting())}
      />
    </PairField>
  );
};
export default SearchInput;
