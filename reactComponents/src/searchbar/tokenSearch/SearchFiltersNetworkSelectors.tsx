import React from "react"
import { useDispatch, useSelector } from 'react-redux';
import { omitBy } from "lodash"
import { setNetworkMap, setNetworkMapAll, setExchangeMapAll } from "../redux/tokenSearchSlice"
import { networkNames } from "./helpers/config";
import { Chip } from "./Chip"
import Button from "./Button"
import {RootState} from "../redux/store";

export const FilterNetworkAll = (): JSX.Element => {
  const dispatch = useDispatch();

  const { exchangeMap, networkMap } = useSelector((state:RootState) => state);
  const networkAll = Object.values(omitBy(networkMap, b => !b)).length === 0;
  const exchangeNamesActive = Object.keys(omitBy(exchangeMap, b => !b));
  
  const handleChange = () => {
    dispatch(setNetworkMapAll({ networkNames: networkNames, networkAll: networkAll }));
    dispatch(setExchangeMapAll({ exchangeNames: exchangeNamesActive, exchangeAll: false }));
  }
  // RENDERING.
  return <Button onClick={handleChange}>
    {networkAll ? 'Select All' : 'Unselect All'}
  </Button>;
};

export const FilterNetworkSelectors = (): JSX.Element => {
  const dispatch = useDispatch();
  const { networkMap } = useSelector((state:RootState) => state);


  // Function generating the HTML element of the network.
  const networkElement = networkName => {
    // RENDERING.
    return <Chip
      key={networkName}
      name={networkName}
      label={networkName}
      checked={networkMap[networkName] || false}
      onChange={(e) => dispatch(setNetworkMap({ networkName, checked: e.target.checked }))}
    />;
  };

  // RENDERING.
  return networkNames.map(networkName => networkElement(networkName));
};