import React, { useEffect, useCallback, useContext, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import {
  searchTokenPairs,
  startSelecting,
  setSearchText,
  setViewResult,
  resetSearch,
} from '../redux/tokenSearchSlice';
import Button from './Button';
import SearchIcon from '../icons/search';
import ResetIcon from '../icons/reset';
import debounce from 'lodash.debounce';
import TokenSearchContext from '../Context/TokenSearch';
import { RootState } from '../redux/store';
import config from '../config';

const StyledWrapper = styled.div`
  ${({ styleOverrides }) => `    
    position: relative;
    border-radius: ${styleOverrides?.borderRadius || '4px'};
    color: ${styleOverrides?.color || '#7A808A'};
    background: ${styleOverrides?.background || '#474F5C'};  
    font-family: ${styleOverrides?.fontFamily || "'Montserrat', monospace"};
    z-index: 2;

    .invalid-error {
      padding: ${styleOverrides?.padding || '0 14px 5px'};   
      color: ${styleOverrides?.colorError || '#F52E2E'};  
      font-size: 0.825rem;
    }
  `}
`;

const StyledInputGroup = styled.div`
  ${({ styleOverrides }) => ` 
    position: relative;
    width: ${styleOverrides?.width || '-webkit-fill-available'};
    padding: 0 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  `}
`;
const StyledInput = styled.input`
  ${({ styleOverrides }) => `
    flex: auto;
    position: relative;
    outline: 0;
    border: none;
    width: ${styleOverrides?.width || '100%'};
    height: ${styleOverrides?.height || '40px'};    
    color: ${styleOverrides?.color || '#B7BEC9'};
    display: ${styleOverrides?.display || 'block'}; 
    padding: ${styleOverrides?.padding || '0 10px'};    
    background: transparent;  
    font-size: ${styleOverrides?.fontSize || '0.875rem'};

    &::placeholder {
      font-family: 'Montserrat', monospace;
      color: #7A808A;

    }
  `}
`;

const StyledInputPrefixWrapper = styled.div`
  display: flex;
  align-items: center;
  flex-shrink: 0;
`

const StyledInputSuffixWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-shrink: 0;
`

const StyledResetBtn = styled(Button)`
  background-color: #252C37;
  border: 1px solid #252C37;
  margin-right: 5px;
  cursor: pointer;

  &:hover {
    background: #474F5C;
  }
`;
const SearchInput = (): JSX.Element => {
  const dispatch = useDispatch();
  const renderProps = useContext(TokenSearchContext);
  const { customSearchInput } = renderProps;
  const [text, setText] = useState('');
  const [error, setError] = useState(false);
  const { searchText, networkMap, exchangeMap } = useSelector((state: RootState) => state);

  const inputRef = useRef<HTMLInputElement>(null);
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

    if (Object.keys(networkMap).length > 0 && Object.keys(exchangeMap).length > 0 && inputRef.current) {
      inputRef.current.focus();
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

  const handleReset = (e) => {
    e.stopPropagation();
    setText('');
    dispatch(resetSearch());
    if (inputRef && inputRef.current) {
      inputRef.current.focus();
    }
  };

  // RENDERING.
  return (
    <StyledWrapper onClick={() => dispatch(startSelecting())} styleOverrides={customSearchInput?.input}>
      <StyledInputGroup styleOverrides={customSearchInput?.input}>
        <StyledInputPrefixWrapper styleOverrides={customSearchInput?.icon}>
          <SearchIcon height={height} width={width} />
        </StyledInputPrefixWrapper>
        <StyledInput
          ref={inputRef}
          placeholder={placeholder}
          autocomplete={'off'}
          onChange={onChangeFilter}
          onClick={handleClick}
          styleOverrides={customSearchInput?.input}
          value={text}
        />
        <StyledInputSuffixWrapper>
          <StyledResetBtn onClick={handleReset}>
            <span>Reset Search</span>
            <ResetIcon width={12} height={12} />
          </StyledResetBtn>
        </StyledInputSuffixWrapper>
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
