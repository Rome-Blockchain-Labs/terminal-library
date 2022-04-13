import React, { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import debounce from 'lodash.debounce';
import { searchTokenPairs, startSelecting, toggleSelecting, setSearchText, setSearchToken } from '../redux/tokenSearchSlice';
import magnifyingGlass from './icon-search.svg'
import { RootState } from "../redux/store";
import { minStringSearch } from "./helpers/config";

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


  // Function that validates if the user is searching for a token and changes the search string accordingly.
  // We are also adding a value to say if the token search was enabled or not, that way if the user removes characters from the string outside of the threshold,
  // we will revert to a non-token search.
  //
  // IMPORTANT: If the user is searching for a string, that is NOT a token but validates as one, the search WILL only be looking for a token.
  //
  const searchTokenValidation = input => {
    // We want to tell the user whats going on by updating the value on the UI.
    // The user has to know that we will be looking only for tokens that start with the said string now.
    let value = input.value;
    let leadIsTokenLike = value.substr(0, 2).toLowerCase() === '0x';
    let valueIsTokenLike = new RegExp(/^[0-9a-f]+$/i).test(value.substr(leadIsTokenLike ? 2 : 0));
    let valueLength = value.length;


    // Checks that 'leadIsTokenLike' is false and that the value is token like.
    if (!leadIsTokenLike && valueIsTokenLike && valueLength >= 5) {
      // Add the leading '0x' to the value.
      value = '0x' + value;

      // User is looking for a token.
      dispatch(setSearchToken(true));
    }
    else
      // Checks if the search is looking for a token.
      if (searchToken)
        // Checks that the value lead is token like.
        if (leadIsTokenLike) {
          // Checks if the user has deleted characters from the search threshold for token detection.
          // We are looking for a lenght smaller than 7, since we have to take into account the leading '0x'.
          if (valueLength < 7) {
            // Removes the leading '0x' from the value.
            value = value.substr(2);

            // User is NOT looking for a token.
            dispatch(setSearchToken(false));
          }
          else
            // We are checking if the value is token like; since the user may have added non-hex characters to the search string.
            if (!valueIsTokenLike) {
              // Removes the leading '0x' from the value.
              value = value.substr(2);

              // User is NOT looking for a token.
              dispatch(setSearchToken(false));
            }
        }
        // This should not happen.
        // Something went wrong, not sure how this case can happen, but we are turning off the token search.
        else
          // User is NOT looking for a token.
          dispatch(setSearchToken(false));

    // We update the input value if the string is not empty.
    if (!value) input.value = value;

    // Returning.
    return value;
  };


  // Updates the datasets of the results.
  useEffect(() => {
    // Ensure that the search text fulfills the minimum lenght requirement.
    if (searchText.length >= minStringSearch) {
      dispatch(searchTokenPairs(searchText));
    }
  }, [dispatch, searchText, networkMap, exchangeMap]);


  const onChangeFilter = (event) => {
    const value = event.target.value
    dispatch(setSearchText(value))
  }

  const debounceChangeHandler = useCallback(debounce(onChangeFilter, 350), [searchText])
  // RENDERING.
  return (
    <PairField onClick={() => dispatch(startSelecting())}>
      <StyledInput
        placeholder={'Select a token pair'}
        autocomplete={'off'}
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
