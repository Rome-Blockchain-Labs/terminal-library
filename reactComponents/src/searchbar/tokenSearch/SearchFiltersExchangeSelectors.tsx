import React, { useContext } from 'react';
import { omitBy } from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import { setExchangeMap, setExchangeMapAll } from '../redux/tokenSearchSlice';
import { Chip } from './Chip';
import { RootState } from '../redux/store';
import TokenSearchContext from '../Context/TokenSearch';

export const FilterExchangeAll = (): JSX.Element => {
  const dispatch = useDispatch();
  const { exchangeMap, networkMap } = useSelector((state: RootState) => state);

  const exchangeAll = Object.values(omitBy(exchangeMap, (b) => !b)).length === 0;
  const selectedNetworks = Object.keys(omitBy(networkMap, (b) => !b));

  const renderProps = useContext(TokenSearchContext);
  const { customAllChip, networks } = renderProps;

  const exchangeNames: any = [];
  networks?.forEach((network) => {
    if (selectedNetworks.includes(network.id)) {
      network.exchanges?.forEach((exchange) => {
        exchangeNames.push(exchange.id);
      });
    }
  });

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
    gridTemplateColumns: customAllChip?.gridTemplateColumns || '40px',
    justifySelf: customAllChip?.justifySelf || 'center',
  };

  // RENDERING.
  return (
    <Chip
      name={'AllExchanges'}
      label={'Select All'}
      checked={exchangeAll}
      styleOverrides={styleOverrides}
      onChange={() => dispatch(setExchangeMapAll({ exchangeNames, exchangeAll: exchangeAll }))}
    />
  );
};

export const FilterExchangeSelectors = (): JSX.Element => {
  const dispatch = useDispatch();
  const { networkMap, exchangeMap } = useSelector((state: RootState) => state);
  const renderProps = useContext(TokenSearchContext);
  const selectedNetworks = Object.keys(omitBy(networkMap, (b) => !b));
  const exchanges: any = [];

  renderProps.networks?.forEach((network) => {
    if (selectedNetworks.includes(network.id)) {
      if (network.exchanges?.length) exchanges.push(...network.exchanges);
    }
  });

  // Function generating the HTML element of the network.
  const exchangeElement = (exchange) => {
    // RENDERING.
    return (
      <Chip
        key={exchange.id}
        name={exchange.id}
        label={exchange.name}
        icon={exchange.icon}
        grayscaleFilter={1}
        checked={exchangeMap[exchange.id] || false}
        onChange={(e) =>
          dispatch(
            setExchangeMap({
              exchangeName: exchange.id,
              checked: e.target.checked,
            })
          )
        }
      />
    );
  };

  // RENDERING.
  return exchanges.map((exchange) => exchangeElement(exchange));
};
