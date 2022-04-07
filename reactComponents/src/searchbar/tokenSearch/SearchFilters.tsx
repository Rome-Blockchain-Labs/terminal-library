import React from "react"
import { useSelector } from 'react-redux';
import 'twin.macro';
import 'styled-components/macro'

import {
  Accordion,
  AccordionItem,
  AccordionItemHeading,
  AccordionItemButton,
  AccordionItemPanel,
} from 'react-accessible-accordion';
import { FilterNetworkAll, FilterNetworkSelectors } from "./SearchFiltersNetworkSelectors";
import { FilterExchangeAll, FilterExchangeSelectors } from "./SearchFiltersExchangeSelectors";
import {RootState} from "../redux/store";

export const SearchFilters = () => {
  const { networkMap, exchangeMap  } = useSelector((state:RootState) => state);
  
  const exchangesActive = Object.values(networkMap).filter(b => b).length !== 0;
  const networkCount = Object.values(networkMap).filter(b=>b).length
  const exchangeCount = Object.values(exchangeMap).filter(b=>b).length

  // RENDERING.
  return (
    <Accordion allowZeroExpanded>
      <AccordionItem>
        <AccordionItemHeading>
          <AccordionItemButton >
            <div tw="p-4 flex">
              <div tw="font-bold">Filter Networks:</div>  &nbsp; Searching {networkCount} networks and {exchangeCount} exchanges
            </div>
          </AccordionItemButton>
        </AccordionItemHeading>
        <AccordionItemPanel>
          <FilterNetworkAll />
          <FilterNetworkSelectors />
        </AccordionItemPanel>
        <AccordionItemPanel>
          <div tw="flex justify-center items-center m-2">
            <FilterNetworkAll />
            <FilterNetworkSelectors />
          </div>
        </AccordionItemPanel>
        <AccordionItemPanel>          
          <div tw="flex flex-wrap justify-center m-2">
          {
            exchangesActive &&
            <FilterExchangeAll />
          }
          {
            exchangesActive &&
            <FilterExchangeSelectors />
          }    
          </div>      
        </AccordionItemPanel>
      </AccordionItem>
    </Accordion>
  );
}

export default SearchFilters