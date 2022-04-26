import React, { useEffect, useCallback, useContext, FC } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { searchTokenPairs, startSelecting, setSearchText } from '../redux/tokenSearchSlice';
import SearchIcon from '../icons/SearchIcon';
import debounce from 'lodash.debounce';
import TokenSearchContext from '../Context/TokenSearch';
import {RootState} from '../redux/store';
import config from '../config';

const StyledInput = styled.input`
  ${({styles}) => `    
    margin-left: auto;
    margin-right: auto;
    position: relative;
    width: ${ styles?.width || "-webkit-fill-available" };
    height: ${ styles?.height || "auto" };
    border: ${ styles?.border || "none" };   
    color: ${ styles?.color || "#7A808A" };
    display: ${ styles?.display || "block" };   
    border-color: ${ styles?.borderColor || "#474F5C" };  
    border-style: ${ styles?.borderStyle || "none" };  
    border-width: ${ styles?.borderWidth || "0" };  
    border-radius: ${ styles?.borderRadius || "4px" };  
    background: ${ styles?.background || "#00070E" };   
    padding: ${ styles?.padding || "10px 14px" };    
    font-size: ${ styles?.fontSize || "8px" };      
    font-family: ${ styles?.fontFamily || "'Fira Code', monospace" };
  `}  
`;

const StyledSearchIconWrapper = styled.div`    
  ${({styles}) => `
    cursor: pointer;
    float: right;
    position: absolute;
    right: ${ styles?.right || "14px" };      
    top: ${ styles?.top || "6px" };        
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
    if (searchText.length >= config.SEARCH_INPUT_LENGTH_MINIMUM) {
      dispatch(searchTokenPairs(searchText));
    }
  }, [dispatch, networkMap, exchangeMap, searchText]); 
  

  const onChangeFilter = (event) => {    
    const value = event.target.value    
    dispatch(setSearchText(value))
  }

  const debounceChangeHandler = useCallback( debounce(onChangeFilter, 350), [searchText])
  
  const placeholder = customSearchInput?.placeholder ?  customSearchInput?.placeholder : 'Search pair by symbol, name, contract or token'

  const activeColor = customSearchInput?.search?.activeColor ? customSearchInput?.search?.activeColor : '#FF0000'
  const color  = customSearchInput?.search?.color ? customSearchInput?.search?.color : '#7A808A'
  const height = customSearchInput?.search?.height ? customSearchInput?.search?.height : 14
  const width = customSearchInput?.search?.width ? customSearchInput?.search?.width : 14
 
  // RENDERING.
  return (
    <StyledWrapper onClick={() => dispatch(startSelecting())}>
      <StyledInput 
        placeholder={placeholder}
        autocomplete={'off'}
        onChange={debounceChangeHandler}
        styles={customSearchInput?.input}
      />
      <StyledSearchIconWrapper styles={customSearchInput?.search}>       
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
