import React, { useContext } from "react"
import { useDispatch, useSelector } from 'react-redux';
import { omitBy } from "lodash"
import { setNetworkMap, setNetworkMapAll, setExchangeMapAll } from "../redux/tokenSearchSlice"
import { networkNames } from "./helpers/config";
import { Chip } from "./Chip"
import {RootState} from "../redux/store";
import TokenSearchContext from '../Context/TokenSearch';

export const FilterNetworkAll = (): JSX.Element => {
  const dispatch = useDispatch();
  const renderProps = useContext(TokenSearchContext);

  const { exchangeMap, networkMap } = useSelector((state:RootState) => state);
  const networkAll = Object.values(omitBy(networkMap, b => !b)).length === 0;
  const exchangeNamesActive = Object.keys(omitBy(exchangeMap, b => !b));
  
  const { customAllChip } = renderProps
  const styleOverrides = {
    fontSize: customAllChip?.fontSize || '7px',
    fontWeight: customAllChip?.fontWeight || '500',
    borderRadius: customAllChip?.borderRadius || "4px",
    backgroundColor: customAllChip?.backgroundColor || "#474F5C",
    border: customAllChip?.border || "0",
    padding: customAllChip?.padding || "3px 2px",
    margin: customAllChip?.margin || "0",
    defaultColor: customAllChip?.defaultColor || "#7A808A",   
    width: customAllChip?.width || "auto",
    height: customAllChip?.height || "auto",
    textAlign: customAllChip?.textAlign || "center" ,
    textTransform: customAllChip?.textTransform || "inherit",
    gridTemplateColumns: customAllChip?.gridTemplateColumns || "40px",
    justifySelf: customAllChip?.justifySelf || "center",    
  }

  const handleChange = () => {
    dispatch(setNetworkMapAll({ networkNames: networkNames, networkAll: networkAll }));
    dispatch(setExchangeMapAll({ exchangeNames: exchangeNamesActive, exchangeAll: false }));
  }
  // RENDERING.
  return <Chip
    name={'AllNetworks'}
    label={'Select All'}
    checked={networkAll}
    styleOverrides={styleOverrides}
    onChange={handleChange}
  />;
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