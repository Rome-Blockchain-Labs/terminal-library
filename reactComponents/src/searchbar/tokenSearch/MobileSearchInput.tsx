import React, { FC, useContext, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import {
  searchTokenPairs,
  startSelecting,
  setSearchText,
  setViewResult,
  resetSearch,
} from "../redux/tokenSearchSlice";
import Button from "./Button";
import SearchIcon from "../icons/search";
import ResetIcon from "../icons/reset";
import TokenSearchContext from "../Context/TokenSearch";
import { RootState } from "../redux/store";
import config from "../config";

const StyledWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
`;

const InputWrapper = styled.div`
  ${({ styleOverrides }) => `
    position: relative;
    border-radius: ${styleOverrides?.borderRadius || "4px"};
    color: ${styleOverrides?.color || "#FFFFFF"};
    background: ${styleOverrides?.background || "#7A808A"};  
    font-family: ${styleOverrides?.fontFamily || "'Montserrat', monospace"};
    z-index: 2;
    width: 100%;

    .invalid-error {
      padding: ${styleOverrides?.padding || "0 14px 5px"};   
      color: ${styleOverrides?.colorError || "#F52E2E"};  
    }
  `}
`;

const StyledInputGroup = styled.div`
  ${({ styleOverrides }) => ` 
    position: relative;
    width: ${styleOverrides?.width || "-webkit-fill-available"};
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
    width: ${styleOverrides?.width || "100%"};
    height: ${styleOverrides?.height || "54px"};    
    color: ${styleOverrides?.color || "#FFFFFF"};
    display: ${styleOverrides?.display || "block"}; 
    padding: ${styleOverrides?.padding || "0 10px"};    
    background: transparent;  
    font-size: ${styleOverrides?.fontSize || "0.875rem"};

    &::placeholder {
      font-family: 'Montserrat', monospace;
      color: #FFFFFF;
      word-break: break-word;
    }
  `}
`;

const StyledInputPrefixWrapper = styled.div`
  display: flex;
  align-items: center;
  flex-shrink: 0;
`;

const StyledInputSuffixWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-shrink: 0;
`;

const StyledResetBtn = styled(Button)`
  background-color: #252c37;
  min-width: 0;
  background: transparent;
`;

const StyledMobileSearchBtn = styled(Button)`
  background-color: #c1ff00;
  color: #262a35;
  margin-left: 10px;
  justify-content: center;
  width: 73px;

  &:hover {
    background-color: #c1ff00;
  }
`;

type MobileSearchInputProps = {
  searchable?: boolean;
  resetable?: boolean;
  onSearch?: () => void;
};

const MobileSearchInput: FC<MobileSearchInputProps> = ({
  searchable,
  resetable,
  onSearch
}): JSX.Element => {
  const dispatch = useDispatch();
  const renderProps = useContext(TokenSearchContext);
  const { customSearchInput } = renderProps;
  const [text, setText] = useState("");
  const [error, setError] = useState(false);
  const { searchText } = useSelector((state: RootState) => state);

  const inputRef = useRef<HTMLInputElement>(null);
  
  const onChangeFilter = (event) => {
    const value = event.target.value;
    setText(value);
  };

  const onMobileSearchClick = () => {
    if (text.length < config.SEARCH_INPUT_LENGTH_MINIMUM) {
      setError(true);
      return;
    }

    setError(false);
    dispatch(setSearchText(text));
    dispatch(setViewResult(true));
    dispatch(
      searchTokenPairs({
        searchString: searchText,
        networks: renderProps.networks,
      })
    );
    onSearch && onSearch();
  };

  const handleClick = () => {
    text.length > 0 && dispatch(setViewResult(true));
  };

  const placeholder = customSearchInput?.placeholder
    ? customSearchInput?.placeholder
    : "Search pair by symbol, name, contract or token";
  const height = customSearchInput?.icon?.height
    ? customSearchInput?.icon?.height
    : 20;
  const width = customSearchInput?.icon?.width
    ? customSearchInput?.icon?.width
    : 20;

  const handleReset = (e) => {
    e.stopPropagation();
    setText("");
    dispatch(resetSearch());
    if (inputRef && inputRef.current) {
      inputRef.current.focus();
    }
  };

  // RENDERING.
  return (
    <StyledWrapper>
      <InputWrapper
        onClick={() => dispatch(startSelecting())}
        styleOverrides={customSearchInput?.input}
      >
        <StyledInputGroup styleOverrides={customSearchInput?.input}>
          <StyledInputPrefixWrapper styleOverrides={customSearchInput?.icon}>
            <SearchIcon height={height} width={width} />
          </StyledInputPrefixWrapper>
          <StyledInput
            ref={inputRef}
            placeholder={placeholder}
            autocomplete={"off"}
            onChange={onChangeFilter}
            onClick={handleClick}
            styleOverrides={customSearchInput?.input}
            value={text}
            autoFocus
          />
          <StyledInputSuffixWrapper>
            {resetable && (
              <StyledResetBtn onClick={handleReset}>
                <ResetIcon width={16} height={16} />
              </StyledResetBtn>
            )}
          </StyledInputSuffixWrapper>
        </StyledInputGroup>
        {error && (
          <div className="invalid-error">
            Please input {config.SEARCH_INPUT_LENGTH_MINIMUM} characters minimum
          </div>
        )}
      </InputWrapper>
      {searchable && (
        <StyledMobileSearchBtn onClick={onMobileSearchClick}>
          <span>Search</span>
        </StyledMobileSearchBtn>
      )}
    </StyledWrapper>
  );
};
export default MobileSearchInput;
