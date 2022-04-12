import React, { useEffect, useCallback, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { searchTokenPairs, startSelecting, toggleSelecting, setSearchText } from '../redux/tokenSearchSlice';
import magnifyingGlass from './icon-search.svg';
import {minStringSearch} from "./helpers/config";
import debounce from 'lodash.debounce';
import TokenSearchContext from '../Context/TokenSearch';
import {RootState} from "../redux/store";

const StyledInput = styled.input`
  width: ${ props => props?.styles?.width || "-webkit-fill-available" };
  border: ${ props => props?.styles?.border || "none" }; 
  background-color: inherit;
  color: ${ props => props?.styles?.color || "#FFF" };
  display: ${ props => props?.styles?.display || "block" }; 
  margin-left: auto;
  margin-right: auto;
  position: relative;
  border-color: ${ props => props?.styles?.borderColor || "#067c82" };  
  border-style: ${ props => props?.styles?.borderStyle || "solid" };  
  border-width: ${ props => props?.styles?.borderWidth || "1px" };  
  border-radius: ${ props => props?.styles?.borderRadius || "0" };  
  background: ${ props => props?.styles?.background || "#08333c" };   
  padding: ${ props => props?.styles?.padding || "11px 15px" };    
  font-size: ${ props => props?.styles?.fontSize || "15px" };      
  font-family: ${ props => props?.styles?.fontFamily || "'Fira Code', monospace" };
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
  const renderProps = useContext(TokenSearchContext);  
  const { customSearchInput } = renderProps;
 
  const { searchText, networkMap, exchangeMap } = useSelector((state:RootState) => state);
  
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

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debounceChangeHandler = useCallback( debounce(onChangeFilter, 350), [searchText])
  
  const placeholder = customSearchInput?.placeholder ?  customSearchInput?.placeholder : 'Please input token name or address.'
  // RENDERING.
  return (
    <div onClick={() => dispatch(startSelecting())}>
      <StyledInput 
        placeholder={placeholder}
        autocomplete={'off'}
        onChange={debounceChangeHandler}
        styles={customSearchInput?.styles}
      />
       
      <HideOnSmallScreen
        alt={''}
        src={magnifyingGlass}
        onClick={() => dispatch(toggleSelecting())}
      />
    </div>
  );
};
export default SearchInput;
