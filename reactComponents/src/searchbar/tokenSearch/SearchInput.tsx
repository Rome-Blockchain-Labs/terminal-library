import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { searchTokenPairs, startSelecting, toggleSelecting, setSearchText } from '../redux/tokenSearchSlice';
import magnifyingGlass from './icon-search.svg'
import {RootState} from "../redux/store";
import {minStringSearch} from "./helpers/config";


const PairField = styled.div`
  display: block;
  margin-left: auto;
  margin-right: auto;
  position: relative;
  border-color: #067c82;
  border-style: solid;
  border-width: 2px;
  border-radius: 30px;
  background: #08333c;
  padding: 11px 15px;
  font-size: 15px;
  color: #ffffff;
  font-family: 'Fira Code', monospace;

  @media only screen and (max-width: 990px) {
    width: 100%;
  }

  @media only screen and (max-width: 769px) {
    width: 100%;
  }
`;

const StyledInput = styled.input`
  width: 100%;
  border: none;
  background-color: inherit;
  color: #ffffff;
  //width: auto;
`;

const HideOnSmallScreen = styled.img`
  width: 30px;
  cursor: pointer;
  float: right;
  position: absolute;
  right: 22px;
  top: 9px;
  @media only screen and (max-width: 990px) {
    display: none;
  }
`;


const SearchInput = () => {
  const dispatch = useDispatch();
  const { searchText, networkMap, exchangeMap } = useSelector((state:RootState) => state);
  const isSelecting = useSelector((state:RootState) => state?.isSelecting);
  const isLoading = useSelector((state:RootState) => state.isLoading);
  const fetchError = useSelector((state:RootState) => state?.fetchError);
  const selectedPair = useSelector((state:RootState) => state?.selectedPair);


  // Updates the datasets of the results.
  useEffect(() => {
    // Ensure that the search text fulfills the minimum lenght requirement.
    if (searchText.length >= minStringSearch) {
      dispatch(searchTokenPairs(searchText));
    }
  }, [dispatch, searchText, networkMap, exchangeMap]);

  
  // RENDERING.
  return (
    <PairField onClick={() => dispatch(startSelecting())}>
      <StyledInput
        placeholder={'Select a token pair'}
        autocomplete={'off'}
        onChange={e => dispatch(setSearchText(e.target.value))}
      />
      <HideOnSmallScreen
        alt={''}
        src={magnifyingGlass}
        onClick={() => dispatch(toggleSelecting())}
      />
    </PairField>
  );
};
export default SearchInput;


  // const selectedPairText = selectedPair && combinePairText(selectedPair);

  // const onClick = () => dispatch(startSelecting());
  // const onKeyDown = (e) => e.code === 'Escape' && dispatch(stopSelecting());

  // //todo throw to a global error boundary
  // if (fetchError) {
  //   return (
  //     <PairField>
  //       <StyledInput
  //         autocomplete={'off'}
  //         style={{ color: 'red' }}
  //         value={'Something went wrong..'}
  //         onChange={() => {}}
  //       />
  //     </PairField>
  //   );
  // }

  // let value;
  // if (isSelecting) {
  //   value = searchText;
  // } else {
  //   value = selectedPairText || 'Select a token pair..';
  // }
// const combinePairText = (pair) => {
//   if (pair.token0?.symbol && pair.token1?.symbol && pair.id) {
//     const miniAddress = pair.id.slice(0, 8) + '...' + pair.id.slice(-8);
//     return pair.token0?.symbol + '/' + pair.token1?.symbol + '/' + miniAddress;
//   }
//   return '';
// };