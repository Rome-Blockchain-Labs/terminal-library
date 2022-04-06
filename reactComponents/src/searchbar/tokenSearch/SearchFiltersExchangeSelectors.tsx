import React from "react"
import { omitBy } from "lodash"
import { useDispatch, useSelector } from 'react-redux';
import { setExchangeMap, setExchangeMapAll } from "../redux/tokenSearchSlice"
import { exchangeNames } from "./helpers/config";
import { Chip } from "../Components/Chip";
import {RootState} from "../redux/store";


export const FilterExchangeAll = () => {
  const dispatch = useDispatch();
  const { exchangeMap, networkMap } = useSelector((state:RootState) => state);
  const exchangeAll = Object.values(omitBy(exchangeMap, b => !b)).length === 0;
  const exchangeNamesActive = exchangeNames(Object.keys(omitBy(networkMap, b => !b)));


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
  const { networkMap, exchangeMap } = useSelector((state:RootState) => state);
  const exchangeNamesActive = exchangeNames(Object.keys(omitBy(networkMap, b => !b)));


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