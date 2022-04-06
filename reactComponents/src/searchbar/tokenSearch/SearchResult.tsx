import React from 'react';
import { useSelector } from 'react-redux';
import { AutoSizer, List } from 'react-virtualized/dist/es';
import styled from 'styled-components';

import SearchResultRow from './SearchResultRow';
import {RootState} from "../redux/store";

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

const SearchDropdown = (props) => {
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
    <div style={{ display: 'flex', height: '240px', marginTop: '20px' }}>
      <div style={{ flex: '1 1 auto' }}>
        <AutoSizer>
          {({ height, width }) => {
            return (
              <List
                height={height}
                overscanRowCount={3}
                rowCount={filteredSuggestions.length}
                rowHeight={40}
                rowRenderer={(props) => (
                  <SearchResultRow
                    suggestions={filteredSuggestions}
                    {...props}
                  />
                )}
                width={width}
              />
            );
          }}
        </AutoSizer>
      </div>
    </div>
  );
};
export default SearchDropdown;
