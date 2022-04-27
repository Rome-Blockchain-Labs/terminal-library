import React, { useContext, useState, FC } from 'react';
import styled from 'styled-components'

import { useSelector, useDispatch } from 'react-redux';
import TokenSearchContext from '../Context/TokenSearch';
import { RootState } from "../redux/store";
import UnCheckedIcon from '../icons/unchecked';
import { stopSelecting } from '../redux/tokenSearchSlice';
import ResultDetail from './ResultDetail'

const StyledResult = styled.div`
  background-color: inherit;
  margin-left: auto;
  margin-right: auto;
  position: relative;  
`;

const StyledLoading = styled.div`  
  ${({styleOverrides}) => `
    position: relative;
    display: flex;
    justify-content: center;  
    margin: 10px;
    color: ${ styleOverrides?.color || "white" };
    font-size: ${ styleOverrides?.fontSize || "12px" };      
  `}    
`

const StyledResultTitle = styled.div`
  ${({styleOverrides}) => `    
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: ${ styleOverrides?.color || "#B4BBC7" };
    font-size: ${ styleOverrides?.fontSize || "9px" };      
    padding: ${ styleOverrides?.padding || "4px 16px" };      
    margin: ${ styleOverrides?.margin || "0" };      
    > span {
      font-size: ${ styleOverrides?.fontSize2 || "7px" };      
    }

    > button {
      display: flex;
      align-items: center;
      
      border-color: ${ styleOverrides?.buttonBorderColor || "#232C38" };      
      background-color: ${ styleOverrides?.buttonBackColor || "#232C38" };      
      color: ${ styleOverrides?.buttonColor || "#7A808A" };      
      border-radius: ${ styleOverrides?.buttonBorderRadius || "4px" };      
      font-size: ${ styleOverrides?.buttonFontSize || "7px" };      
      padding: ${ styleOverrides?.buttonPadding || "3px 6px" };      
      border-width: 0;      
      cursor: pointer;
      
      &:hover {
        background-color: ${ styleOverrides?.buttonHoverBackColor || "black" };      
      }
    }
  `}    
`

const StyledResultContent = styled.div`
  overflow: auto;
  margin-left: auto;
  margin-right: auto;

  ${({styleOverrides}) => `
    padding: ${ styleOverrides?.padding || "14px" };    
    background: ${ styleOverrides?.background || "#00070E" };
    border-radius: ${ styleOverrides?.borderRadius || "4px" };        
    width: ${ styleOverrides?.width || "auto" };
    height: ${ styleOverrides?.height || "300px" };
    border: ${ styleOverrides?.border || "1px solid grey" };   
    color: ${ styleOverrides?.color || "#FFF" };
    display: ${ styleOverrides?.display || "block" };   
    border-color: ${ styleOverrides?.borderColor || "#474F5C" };  
    border-style: ${ styleOverrides?.borderStyle || "solid" };  
    border-width: ${ styleOverrides?.borderWidth || "1px" };      
    font-size: ${ styleOverrides?.fontSize || "15px" };      
    font-family: ${ styleOverrides?.fontFamily || "'Fira Code', monospace" };  
  `}  

  & .header {
    display: grid;
    grid-template-columns: 41% 5% 6% 49%; 
    border-bottom: 1px solid #474F5C; 
    color: #B4BBC7;
    font-size: 7px;
    font-weight: bold;
    padding-bottom: 10px; 

    >:last-child {
      padding-left: 5px;
    }
  }
`
type Loading = {
  loading: boolean;
}

const SearchResult: FC<Loading> = (props: Loading) => {
  const dispatch = useDispatch();
  const renderProps = useContext(TokenSearchContext);  
  const { customResult, customLoading } = renderProps;
  const {suggestions, searchText} = useSelector(
    (state:RootState) => state
  );
  const [currentIndex, setCurrentIndex] = useState(0)
  const filteredSuggestions = suggestions
    .slice()
    .sort((pair1, pair2) => pair2.volumeUSD - pair1.volumeUSD);
  
    if (props.loading) {
      const loadingTitle = customLoading?.loadingTitle ? customLoading.loadingTitle : 'Searching...'
      return <StyledLoading styleOverrides={customLoading}>{loadingTitle}</StyledLoading>;
    }

    const notFoundTitle = customLoading?.notFoundTitle ? customLoading.notFoundTitle : 'No results found'    
      
    const handleClose = () => {
      dispatch(stopSelecting());
    }
     
    return (    
      <StyledResult>    
        <StyledResultTitle styleOverrides={customResult?.title}>
          <div>
            Search Results <span>({filteredSuggestions.length} Results Found)</span>
          </div>
          <button onClick={handleClose}>Close&nbsp;<UnCheckedIcon width={7} height={7}/></button>
        </StyledResultTitle>      
        <StyledResultContent styleOverrides={customResult?.content}>
          <div className='header'>
            <span>Pair</span>
            <span>Net.</span>
            <span>Exch.</span>
            <span>Details.</span>
          </div>
          {
            filteredSuggestions.map((suggestions, index) => 
            <ResultDetail
              suggestions={filteredSuggestions}
              index={index}
              key={`token-detail-${index}`}
              currentIndex={currentIndex}
              handleDetail={setCurrentIndex}
            />
            )
          }  
          {
            !!searchText && !filteredSuggestions.length &&
            <StyledLoading styleOverrides={customLoading?.styles}>{notFoundTitle}</StyledLoading>
          }
        </StyledResultContent>
      </StyledResult>        
    );
};
export default SearchResult;
