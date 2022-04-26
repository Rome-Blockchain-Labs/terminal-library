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
  position: relative;
  display: flex;
  justify-content: center;  
  margin: 10px;
  ${({props}) => `
    color: ${ props?.styles?.color || "black" };
    font-size: ${ props?.styles?.fontSize || "15px" };      
  `}    
`

const StyledResultTitle = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  ${({styles}) => `    
    color: ${ styles?.color || "#B4BBC7" };
    font-size: ${ styles?.fontSize || "9px" };      
    padding: ${ styles?.padding || "4px 16px" };      
    margin: ${ styles?.padding || "0" };      
    > span {
      font-size: ${ styles?.fontSize || "7px" };      
    }

    > button {
      border-color: ${ styles?.buttonBorderColor || "#232C38" };      
      background-color: ${ styles?.buttonBackColor || "#232C38" };      
      color: ${ styles?.buttonColor || "#7A808A" };      
      border-radius: ${ styles?.buttonBorderRadius || "4px" };      
      border-width: 0;      
      cursor: pointer;
      padding: 3px 6px;

      &:hover {
        background-color: ${ styles?.buttonHoverBackColor || "black" };      
      }
    }
  `}    
`

const StyledResultContent = styled.div`
  overflow: auto;
  margin-left: auto;
  margin-right: auto;

  ${({styles}) => `
    padding: ${ styles?.padding || "14px" };    
    background: ${ styles?.background || "#00070E" };
    border-radius: ${ styles?.borderRadius || "4px" };        
    width: ${ styles?.width || "auto" };
    height: ${ styles?.height || "300px" };
    border: ${ styles?.border || "1px solid grey" };   
    color: ${ styles?.color || "#FFF" };
    display: ${ styles?.display || "block" };   
    border-color: ${ styles?.borderColor || "#474F5C" };  
    border-style: ${ styles?.borderStyle || "solid" };  
    border-width: ${ styles?.borderWidth || "1px" };      
    font-size: ${ styles?.fontSize || "15px" };      
    font-family: ${ styles?.fontFamily || "'Fira Code', monospace" };  
  `}  

  & .header {
    display: grid;
    grid-template-columns: 40% 5% 6% 48%; 
    border-bottom: 1px solid #474F5C; 
    color: #7A808A;
    font-size: 10px;
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
      return <StyledLoading styles={customLoading?.styles}>{loadingTitle}</StyledLoading>;
    }
  
    if (!!searchText && !filteredSuggestions.length) {
      const notFoundTitle = customLoading?.notFoundTitle ? customLoading.notFoundTitle : 'No pairs found...'    
      return <StyledLoading styles={customLoading?.styles}>{notFoundTitle}</StyledLoading>;
    }   
  
    const handleClose = () => {
      dispatch(stopSelecting());
    }
     
    return (    
      <StyledResult styles={customResult?.wrapper}>    
        <StyledResultTitle styles={customResult?.title}>
          <div>
            Search Results <span>({filteredSuggestions.length} Results Found)</span>
          </div>
          <button onClick={handleClose}>Close <UnCheckedIcon /></button>
        </StyledResultTitle>      
        <StyledResultContent styles={customResult?.content}>
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
        </StyledResultContent>
      </StyledResult>        
    );
};
export default SearchResult;
