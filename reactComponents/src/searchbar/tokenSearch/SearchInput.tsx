import React, { useEffect, useCallback, useContext, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import {
  searchTokenPairs,
  startSelecting,
  setSearchText,
  setViewResult,
  resetSearch,
} from '../redux/tokenSearchSlice';
import SearchIcon from '../icons/search';
import ResetIcon from '../icons/reset';
import debounce from 'lodash.debounce';
import TokenSearchContext from '../Context/TokenSearch';
import { RootState } from '../redux/store';
import config from '../config';

const StyledInputGroup = styled.div`
  ${({ styleOverrides }) => ` 
    position: relative;
    display: flex;
    align-items: center;
    box-sizing: border-box;    
    background: ${ styleOverrides?.background || "#00070E" };
    border-radius: ${ styleOverrides?.borderRadius || "4px" };
    border: ${ styleOverrides?.border || "5px solid #474F5C" };
    padding: ${ styleOverrides?.padding || "10px 14px" };
    width: ${ styleOverrides?.width || "100%" };
    height: ${ styleOverrides?.height || "35px" };
  `}
`;
const StyledInput = styled.input`
  ${({ styleOverrides }) => `    
    margin-left: auto;
    margin-right: auto;
    position: relative;
    outline: 0;
    flex: auto;
    background: transparent;
    border: none;        
    width: 100%;
    height: 100%;
    color: ${ styleOverrides?.color || "#7A808A" };
    font-size: ${ styleOverrides?.fontSize || "8px" };      
    font-family: ${ styleOverrides?.fontFamily || "'Fira Code', monospace" };
  `}  
`;

const StyledSearchIconWrapper = styled.div`    
  cursor: pointer;
  svg {
    vertical-align: middle;
  }
`;

const StyledWrapper = styled.div`
  position: relative;
`;

const StyledActionWrapper = styled.div`
  display: flex;
  align-items: center;
  flex-shrink: 0;
`

const StyledResetBtn = styled.button`
  margin-right: 10px;
`

const SearchInput = (): JSX.Element => {
  const dispatch = useDispatch();
  const renderProps = useContext(TokenSearchContext);
  const { customSearchInput } = renderProps;
  const [text, setText] = useState('');
  const [error, setError] = useState(false);
  const { searchText, networkMap, exchangeMap } = useSelector((state: RootState) => state);
  // Updates the datasets of the results.
  useEffect(() => {
    // Ensure that the search text fulfills the minimum lenght requirement.
    if (searchText.length >= config.SEARCH_INPUT_LENGTH_MINIMUM) {
      setError(false);
      dispatch(searchTokenPairs({ searchString: searchText, networks: renderProps.networks }));
      dispatch(setSearchText(searchText));
    } else if (searchText.length > 0) {
      setError(true);
    }
  }, [dispatch, networkMap, exchangeMap, searchText]);

  const debounceChangeHandler = useCallback(
    debounce((value) => dispatch(setSearchText(value)), 350),
    []
  );

  const onChangeFilter = (event) => {
    const value = event.target.value;
    setText(value);
    debounceChangeHandler(value);
    dispatch(setViewResult(true));
  };

  const handleClick = () => {
    text.length > 0 && dispatch(setViewResult(true));
  };

  const placeholder = customSearchInput?.placeholder
    ? customSearchInput?.placeholder
    : 'Search pair by symbol, name, contract or token';
  const height = customSearchInput?.icon?.height ? customSearchInput?.icon?.height : 14;
  const width = customSearchInput?.icon?.width ? customSearchInput?.icon?.width : 14;

  const handleReset = () => {
    setText('');
    dispatch(resetSearch());
  };

  // RENDERING.
  return (
    <StyledWrapper onClick={() => dispatch(startSelecting())}>
      <StyledInputGroup styleOverrides={customSearchInput?.input}>
        <StyledInput 
          placeholder={placeholder}
          autocomplete={'off'}        
          onChange={onChangeFilter}
          onClick={handleClick}
          styleOverrides={customSearchInput?.input}    
          value={text}
        />
        <StyledActionWrapper>
          <StyledResetBtn onClick={handleReset}>
            <span>Reset Search</span>
            <ResetIcon />
          </StyledResetBtn>      
          <StyledSearchIconWrapper styleOverrides={customSearchInput?.icon}>       
            <SearchIcon            
                height={height}
                width={width}
            />          
          </StyledSearchIconWrapper>
        </StyledActionWrapper>
      </StyledInputGroup>
      {error && (
        <div className="invalid-error">
          Please input {config.SEARCH_INPUT_LENGTH_MINIMUM} characters minimum
        </div>
      )}
    </StyledWrapper>
  );
};
export default SearchInput;
