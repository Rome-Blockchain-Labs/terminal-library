import React from "react"
import { useDispatch, useSelector } from 'react-redux';
import { setNetworkMap, setNetworkMapAll, setExchangeMapAll } from "../redux/tokenSearchSlice"
import { networkNames } from "./helpers/config";
import { Chip } from "../Components/Chip";
import { RootState } from "../redux/store";
import { filterActiveAll, filterActiveNames } from './helpers/filters';


export const FilterNetworkAll = () => {
  const dispatch = useDispatch();
  const { exchangeMap, networkMap } = useSelector((state: RootState) => state);
  const networkAll = filterActiveAll(networkMap);
  const exchangeNamesActive = filterActiveNames(exchangeMap);


  // RENDERING.
  return <Chip
    name={'AllNetworks'}
    label={'All'}
    checked={networkAll}
    onChange={
      e => {
        dispatch(setNetworkMapAll({ networkNames: networkNames, networkAll: networkAll }));
        dispatch(setExchangeMapAll({ exchangeNames: exchangeNamesActive, exchangeAll: false }));
      }
    }
  />;
};


export const FilterNetworkSelectors = () => {
  const dispatch = useDispatch();
  const { networkMap } = useSelector((state: RootState) => state);


  // Function generating the HTML element of the network.
  const networkElement = networkName => {
    // RENDERING.
    return <Chip
      key={networkName}
      name={networkName}
      label={networkName}
      checked={networkMap[networkName] || false}
      onChange={e => dispatch(setNetworkMap({ networkName, checked: e.target.checked }))}
    />;
  };


  // RENDERING.
  return <>{networkNames.map((networkName: any) => networkElement(networkName))}</>
};