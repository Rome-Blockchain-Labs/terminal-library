import React, { useContext, useMemo } from 'react';
import { omitBy, uniq, uniqBy } from "lodash"
import { useDispatch, useSelector } from 'react-redux';
import { setExchangeMap, setExchangeMapAll } from "../redux/tokenSearchSlice"
import { Chip } from "./Chip"
import Button from "./Button";
import { RootState } from "../redux/store";
import TokenSearchContext from '../Context/TokenSearch';
import { ExchangeName, ExchangeType } from '../../types';

export const FilterExchangeAll = (): JSX.Element => {
  const dispatch = useDispatch();
  const { exchangeMap, networkMap } = useSelector((state:RootState) => state);
  const exchangeAll = Object.values(omitBy(exchangeMap, (b) => !b)).length === 0;
  const selectedNetworks = Object.keys(omitBy(networkMap, (b) => !b));

  const renderProps = useContext(TokenSearchContext);
  const { networks } = renderProps;

  const exchangeNames = useMemo(() => {
    const uniqExchangeNames: ExchangeName[] = [];

    networks?.forEach((network) => {
      if (selectedNetworks.includes(network.id)) {
        network.exchanges?.forEach((exchange) => {
          uniqExchangeNames.push(exchange.name);
        });
      }
    });

    return uniq(uniqExchangeNames);
  }, [networks, selectedNetworks]);
  
  // RENDERING.
  return (
    <Button
      onClick={() => dispatch(setExchangeMapAll({ exchangeNames, exchangeAll: exchangeAll }))}
    >
      {exchangeAll ? 'Select All' : 'Unselect All'}
    </Button>
  );
};

export const FilterExchangeSelectors = (): JSX.Element => {
  const dispatch = useDispatch();
  const { networkMap, exchangeMap } = useSelector((state: RootState) => state);
  const renderProps = useContext(TokenSearchContext);
  const selectedNetworks = Object.keys(omitBy(networkMap, (b) => !b));
  
  const exchanges = useMemo(() => {
    const uniqExchanges: ExchangeType[] = [];
    renderProps.networks?.forEach((network) => {
      if (selectedNetworks.includes(network.id)) {
        if (network.exchanges?.length) uniqExchanges.push(...network.exchanges);
      }
    });
  
    return uniqBy(uniqExchanges, 'name');
  }, [renderProps.networks, selectedNetworks]);  

  // Function generating the HTML element of the network.
  const exchangeElement = (exchange: ExchangeType) => {
    // RENDERING.
    return (
      <Chip
        key={exchange.name}
        name={exchange.name}
        label={exchange.title || exchange.name}
        icon={exchange.icon}
        checked={exchangeMap[exchange.name] || false}
        onChange={(e) =>
          dispatch(
            setExchangeMap({
              exchangeName: exchange.name,
              checked: e.target.checked,
            })
          )
        }
      />
    );
  };

  // RENDERING.
  return (
    <>
      {exchanges.map((exchange) => exchangeElement(exchange))}
    </>
  )
};
