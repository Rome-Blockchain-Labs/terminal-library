import React, { useContext, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { omitBy } from 'lodash';
import { setNetworkMap, setNetworkMapAll, setExchangeMapAll } from '../redux/tokenSearchSlice';
import { Chip } from './Chip';
import { RootState } from '../redux/store';
import TokenSearchContext from '../Context/TokenSearch';

export const FilterNetworkAll = (): JSX.Element => {
  const dispatch = useDispatch();
  const renderProps = useContext(TokenSearchContext);

  const { exchangeMap, networkMap } = useSelector((state: RootState) => state);
  const networkAll = Object.values(omitBy(networkMap, (b) => !b)).length === 0;
  const exchangeNamesActive = Object.keys(omitBy(exchangeMap, (b) => !b));
  const { customAllChip, networks } = renderProps;

  const networkNames = networks?.map((network) => network.id);

  const styleOverrides = {
    fontSize: customAllChip?.fontSize || '10px',
    fontWeight: customAllChip?.fontWeight || '500',
    borderRadius: customAllChip?.borderRadius || '4px',
    backgroundColor: customAllChip?.backgroundColor || '#474F5C',
    border: customAllChip?.border || '0',
    padding: customAllChip?.padding || '3px 4px',
    margin: customAllChip?.margin || '0',
    defaultColor: customAllChip?.defaultColor || '#7A808A',
    width: customAllChip?.width || 'auto',
    height: customAllChip?.height || 'auto',
    textAlign: customAllChip?.textAlign || 'center',
    textTransform: customAllChip?.textTransform || 'inherit',
    gridTemplateColumns: customAllChip?.gridTemplateColumns || 'unset',
    justifySelf: customAllChip?.justifySelf || 'center',
  };

  const handleChange = () => {
    dispatch(setNetworkMapAll({ networkNames, networkAll: networkAll }));
    dispatch(setExchangeMapAll({ exchangeNames: exchangeNamesActive, exchangeAll: false }));
  };
  // RENDERING.
  return (
    <Chip
      name={'AllNetworks'}
      icon={true}
      label={networkAll ? 'Select All' : 'Deselect All'}
      checked={networkAll}
      styleOverrides={styleOverrides}
      onChange={handleChange}
    />
  );
};

export const FilterNetworkSelectors = (): JSX.Element => {
  const renderProps = useContext(TokenSearchContext);
  const networks: any = [...renderProps.networks];
  const networkItems: any = useMemo(
    () =>
      networks.map((network) => {
        return { id: network.id, exchanges: network.exchanges.map((exhange) => exhange.name) };
      }),
    [networks]
  );
  const dispatch = useDispatch();
  const { networkMap } = useSelector((state: RootState) => state);

  // Function generating the HTML element of the network.
  const networkElement = (network) => {
    // RENDERING.
    return (
      <Chip
        key={network.id}
        name={network.id}
        label={network.name || network.id}
        icon={network.icon}
        checked={networkMap[network.id] || false}
        onChange={(e) =>
          dispatch(
            setNetworkMap({
              networkName: network.id,
              checked: e.target.checked,
              networks: networkItems,
            })
          )
        }
      />
    );
  };

  // RENDERING.
  return networks.map((network) => networkElement(network));
};
