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
  ${({styleOverrides}) => `    
    margin-left: auto;
    margin-right: auto;
    position: relative;
    outline: 0;
    width: ${ styleOverrides?.width || "-webkit-fill-available" };
    height: ${ styleOverrides?.height || "auto" };
    border: ${ styleOverrides?.border || "5px solid #474F5C" };   
    color: ${ styleOverrides?.color || "#7A808A" };
    display: ${ styleOverrides?.display || "block" };           
    border-radius: ${ styleOverrides?.borderRadius || "4px" };  
    background: ${ styleOverrides?.background || "#00070E" };   
    padding: ${ styleOverrides?.padding || "10px 14px" };    
    font-size: ${ styleOverrides?.fontSize || "8px" };      
    font-family: ${ styleOverrides?.fontFamily || "'Fira Code', monospace" };
  `}  
`;

const StyledSearchIconWrapper = styled.div`    
  ${({styleOverrides}) => `
    cursor: pointer;
    float: right;
    position: absolute;
    right: ${ styleOverrides?.right || "14px" };      
    top: ${ styleOverrides?.top || "12px" };        
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

  const activeColor = customSearchInput?.icon?.activeColor ? customSearchInput?.icon?.activeColor : '#FF0000'
  const color  = customSearchInput?.icon?.color ? customSearchInput?.icon?.color : '#7A808A'
  const height = customSearchInput?.icon?.height ? customSearchInput?.icon?.height : 14
  const width = customSearchInput?.icon?.width ? customSearchInput?.icon?.width : 14
 
  // RENDERING.
  return (
    <StyledWrapper onClick={() => dispatch(startSelecting())}>
      <StyledInput 
        placeholder={placeholder}
        autocomplete={'off'}
        onChange={debounceChangeHandler}
        styleOverrides={customSearchInput?.input}
      />
      <StyledSearchIconWrapper styleOverrides={customSearchInput?.icon}>       
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
