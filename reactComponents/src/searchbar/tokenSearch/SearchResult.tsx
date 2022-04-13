import React, { useContext } from 'react';
import styled from 'styled-components'

import { useSelector } from 'react-redux';
import TokenPairDetail from './TokenPairDetail';
import TokenSearchContext from '../Context/TokenSearch';
import { RootState } from "../redux/store";
const StyledResult = styled.div`
  background-color: inherit;
  margin-left: auto;
  margin-right: auto;
  position: relative;
  overflow: auto;

  ${({props}) => `
    width: ${ props?.styles?.width || "auto" };
    height: ${ props?.styles?.height || "300px" };
    border: ${ props?.styles?.border || "1px solid grey" };   
    color: ${ props?.styles?.color || "#FFF" };
    display: ${ props?.styles?.display || "block" };   
    border-color: ${ props?.styles?.borderColor || "#067c82" };  
    border-style: ${ props?.styles?.borderStyle || "solid" };  
    border-width: ${ props?.styles?.borderWidth || "1px" };  
    border-radius: ${ props?.styles?.borderRadius || "0" };  
    background: ${ props?.styles?.background || "#08333c" };   
    padding: ${ props?.styles?.padding || "0" };    
    font-size: ${ props?.styles?.fontSize || "15px" };      
    font-family: ${ props?.styles?.fontFamily || "'Fira Code', monospace" };  
  `}  
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

const SearchResult = (props) => {
  const renderProps = useContext(TokenSearchContext);  
  const { customResult, customLoading } = renderProps;
  const {suggestions, searchText} = useSelector(
    (state:RootState) => state
  );
  const filteredSuggestions = suggestions
    .slice()
    .sort((pair1, pair2) => pair2.volumeUSD - pair1.volumeUSD);
  
  if (props.loading) {
    const loadingTitle = customLoading?.loadingTitle ? customLoading.loadingTitle : 'Loading...'
    return <StyledLoading styles={customLoading?.styles}>{loadingTitle}</StyledLoading>;
  }

  if (!!searchText && !filteredSuggestions.length) {
    const notFoundTitle = customLoading?.notFoundTitle ? customLoading.notFoundTitle : 'No pairs found...'    
    return <StyledLoading styles={customLoading?.styles}>{notFoundTitle}</StyledLoading>;
  }   

  return (    
    <StyledResult styles={customResult?.styles}>    
      {
        filteredSuggestions.map((suggestions, index) => 
        <TokenPairDetail
          suggestions={filteredSuggestions}
          index={index}
          key={`token-detail-${index}`}
        />
        )
      }  
    </StyledResult>        
  );
};
export default SearchResult;
