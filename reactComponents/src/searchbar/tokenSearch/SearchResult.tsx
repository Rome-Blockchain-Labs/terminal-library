import React from 'react';
import { useSelector } from 'react-redux';
import 'twin.macro';
import {styled} from 'styled-components/macro'

import {RootState} from "../redux/store";
import TokenPairDetail from './TokenPairDetail'

const NilFoundContainer = styled.div`
  width: 50%;
  margin-left: 25%;
  margin-right: 25%;
  margin-top: -5px;
  position: relative;
  background-color: #1c646c;
  z-index: 100;
  color: rgba(0, 0, 0, 0.87);
  height: 60px;
  text-align: center;
  color: white;
  font-weight: bolder;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const SearchResult = (props) => {
  const {suggestions, searchText} = useSelector(
    (state:RootState) => state
  );
  const filteredSuggestions = suggestions
    .slice()
    .sort((pair1, pair2) => pair2.volumeUSD - pair1.volumeUSD);

  if (props.loading) {
    return <NilFoundContainer>Loading...</NilFoundContainer>;
  }

  if (!!searchText && !filteredSuggestions.length) {
    return <NilFoundContainer>No pairs found...</NilFoundContainer>;
  }

  return (
    <div tw="h-60 overflow-y-auto pl-4 border-solid">    
    {
      filteredSuggestions.map((suggestions, index) => 
      <TokenPairDetail
        suggestions={filteredSuggestions}
        index={index}
      />
      )
    }  
  </div>    
  );
};
export default SearchResult;
