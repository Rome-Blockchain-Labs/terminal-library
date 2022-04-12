import React, { useContext } from 'react';
import styled from 'styled-components'

import { useSelector } from 'react-redux';
import TokenPairDetail from './TokenPairDetail';
import TokenSearchContext from '../Context/TokenSearch';
import { RootState } from "../redux/store";

const StyledResult = styled.div`
  width: ${ props => props?.styles?.width || "auto" };
  height: ${ props => props?.styles?.height || "300px" };
  border: ${ props => props?.styles?.border || "1px solid grey" }; 
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
  padding: ${ props => props?.styles?.padding || "0" };    
  font-size: ${ props => props?.styles?.fontSize || "15px" };      
  font-family: ${ props => props?.styles?.fontFamily || "'Fira Code', monospace" };
  overflow: auto;
`;

const StyledLoading = styled.div`
  position: relative;
  display: flex;
  justify-content: center;  
  margin: 10px;
  color: ${ props => props?.styles?.color || "black" };
  font-size: ${ props => props?.styles?.fontSize || "15px" };      
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
