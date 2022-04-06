import React from "react"
import { useSelector } from 'react-redux';
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
  const { isSelecting, networkMap } = useSelector((state:RootState) => state);
  const exchangesActive = Object.values(networkMap).filter(b => b).length !== 0;


  // RENDERING.
  return (
    <Accordion allowZeroExpanded>
      <AccordionItem>
        <AccordionItemHeading>
          <AccordionItemButton >
            Filter Networks: search
          </AccordionItemButton>
        </AccordionItemHeading>
        <AccordionItemPanel>
          <FilterNetworkAll />
          <FilterNetworkSelectors />
        </AccordionItemPanel>
        <AccordionItemPanel>
          {
            exchangesActive &&
            <FilterExchangeAll />
          }
          {
            exchangesActive &&
            <FilterExchangeSelectors />
          }
        </AccordionItemPanel>
      </AccordionItem>
    </Accordion>
  );
}
export default SearchFilters