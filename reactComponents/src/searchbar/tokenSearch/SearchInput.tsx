import React, { useEffect, useCallback, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { searchTokenPairs, startSelecting, setSearchText } from '../redux/tokenSearchSlice';
import SearchIcon from './SearchIcon';
import {minStringSearch} from "./helpers/config";
import debounce from 'lodash.debounce';
import TokenSearchContext from '../Context/TokenSearch';
import {RootState} from "../redux/store";

const StyledInput = styled.input`
  background-color: inherit;
  margin-left: auto;
  margin-right: auto;
  position: relative;

  ${({props}) => `
    width: ${ props?.styles?.width || "-webkit-fill-available" };
    border: ${ props?.styles?.border || "none" };   
    color: ${ props?.styles?.color || "#FFF" };
    display: ${ props?.styles?.display || "block" };   
    border-color: ${ props?.styles?.borderColor || "#067c82" };  
    border-style: ${ props?.styles?.borderStyle || "solid" };  
    border-width: ${ props?.styles?.borderWidth || "1px" };  
    border-radius: ${ props?.styles?.borderRadius || "0" };  
    background: ${ props?.styles?.background || "#08333c" };   
    padding: ${ props?.styles?.padding || "11px 15px" };    
    font-size: ${ props?.styles?.fontSize || "15px" };      
    font-family: ${ props?.styles?.fontFamily || "'Fira Code', monospace" };
  `}  
`;

const StyledSearchIconWrapper = styled.div`  
  cursor: pointer;
  float: right;
  position: absolute;
  ${({props}) => `
    right: ${ props?.styles?.right || "15px" };      
    top: ${ props?.styles?.top || "12px" };        
  `}    
`;

const StyledWrapper = styled.div`
  position: relative;
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
  
  const placeholder = customSearchInput?.placeholder || 'Please input token name or address.'
  const activeColor = customSearchInput?.styles?.search?.activeColor || '#666699'
  const color  = customSearchInput?.styles?.search?.color || '#FFF'
  const height = customSearchInput?.styles?.search?.height || 14
  const width = customSearchInput?.styles?.search?.width || 14

  // RENDERING.
  return (
    <StyledWrapper onClick={() => dispatch(startSelecting())}>
      <StyledInput 
        placeholder={placeholder}
        autocomplete={'off'}
        onChange={debounceChangeHandler}
        styles={customSearchInput?.styles?.input}
      />
      <StyledSearchIconWrapper styles={customSearchInput?.styles?.search}>
       <SearchIcon
            activeColor={activeColor}
            color={color}
            height={height}
            width={width}
          />
        </StyledSearchIconWrapper>
    </StyledWrapper>
  );
};
export default SearchInput;
