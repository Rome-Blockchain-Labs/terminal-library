import React from "react"
import { useDispatch, useSelector } from 'react-redux';
import { setExchangeMap, setExchangeMapAll } from "../redux/tokenSearchSlice"
import { Chip } from "../Components/Chip";
import { RootState } from "../redux/store";
import { filterActiveAll, filterValidExchangeNames } from './helpers/filters';
import { networkExchangePairs } from "./helpers/config";


export const FilterExchangeAll = () => {
  const dispatch = useDispatch();
  const { exchangeMap, networkMap } = useSelector((state: RootState) => state);
  const exchangeAll = filterActiveAll(exchangeMap);
  const exchangeNamesActive = filterValidExchangeNames(networkMap, networkExchangePairs);


  // RENDERING.
  return <Chip
    name={'AllExchanges'}
    label={'All'}
    checked={exchangeAll}
    onChange={() => dispatch(setExchangeMapAll({ exchangeNames: exchangeNamesActive, exchangeAll: exchangeAll }))}
  />;
};


export const FilterExchangeSelectors = () => {
  const dispatch = useDispatch();
  const { networkMap, exchangeMap } = useSelector((state: RootState) => state);
  const exchangeNamesActive = filterValidExchangeNames(networkMap, networkExchangePairs);


  // Function generating the HTML element of the network.
  const exchangeElement = exchangeName => {
    // RENDERING.
    return <Chip
      key={exchangeName}
      name={exchangeName}
      label={exchangeName}
      checked={exchangeMap[exchangeName] || false}
      onChange={e => dispatch(setExchangeMap({ exchangeName: exchangeName, checked: e.target.checked }))}
    />;
  };


  // RENDERING.
  return <>{exchangeNamesActive.map(exchangeName => exchangeElement(exchangeName))}</>
};