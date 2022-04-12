import React, { useContext } from "react"
import { useSelector } from 'react-redux';
import styled from  'styled-components'
import {
  Accordion,
  AccordionItem,
  AccordionItemHeading,
  AccordionItemButton,
  AccordionItemPanel,
} from 'react-accessible-accordion';
import { FilterNetworkAll, FilterNetworkSelectors } from "./SearchFiltersNetworkSelectors";
import { FilterExchangeAll, FilterExchangeSelectors } from "./SearchFiltersExchangeSelectors";
import { RootState } from "../redux/store";
import TokenSearchContext from '../Context/TokenSearch';

const FilterWrapper = styled.div`  
  .accordion__button {
    position: relative;
  }

  .accordion__button:first-child:after {
    display: block;    
    content: '';
    height: ${ props => props?.styles?.toggleHeight || "10px" };
    width: ${ props => props?.styles?.toggleWidth || "10px" };
    margin-right: ${ props => props?.styles?.toggleMarginRight || "25px" };
    position: absolute;
    top: ${ props => props?.styles?.toggleMarginRight || "20px" };
    right: 0;
    border-bottom: ${ props => props?.styles?.toggleBorderBottom || "2px solid currentColor" }; 
    border-right: ${ props => props?.styles?.toggleBorderRight || "2px solid currentColor" }; 
    transform: rotate(-45deg);
  }

  .accordion__button[aria-expanded='true']:first-child:after,
  .accordion__button[aria-selected='true']:first-child:after {
    transform: rotate(45deg);
  }

  .accordion__panel {
    border: ${ props => props?.styles?.contentBorder || "0" }; 
    border-top-style: ${ props => props?.styles?.contentBorderTop || "none" }; 
    border-right-style: ${ props => props?.styles?.contentBorderRight || "none" }; 
    border-bottom-style: ${ props => props?.styles?.contentBorderBottom || "none" }; 
    border-left-style: ${ props => props?.styles?.contentBorderLeft || "none" }; 
    border-radius: ${ props => props?.styles?.borderRadius || "0" }; 
    margin:  ${ props => props?.styles?.margin || "0 10px" };       
  }
`;

const StyledFilterHeader = styled.div`  
  display: ${ props => props?.styles?.display || "inline" };
  width: ${ props => props?.styles?.width || "auto" };
  border: ${ props => props?.styles?.border || "none" }; 
  background-color: ${ props => props?.styles?.backgroundColor || "#f4f4f4" }; 
  color: ${ props => props?.styles?.color || "#444" };
  display: ${ props => props?.styles?.display || "block" }; 
  cursor: pointer;
  padding: ${ props => props?.styles?.padding || "18px" };   
  text-align: ${ props => props?.styles?.textAlign || "left" };     
  margin: ${ props => props?.styles?.margin || "5px" };     
  border-radius: ${ props => props?.styles?.borderRadius || "0" };     
  &:hover {
    background-color: ${ props => props?.styles?.hoverColor || "#ddd" };
  }
`; 

const StyledFilterContent = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: ${ props => props?.styles?.justifyContent || "center" };
  align-items: ${ props => props?.styles?.alignItems || "center" };  
  padding:  ${ props => props?.styles?.padding || "5px 10px" };       
  background-color: ${ props => props?.styles?.backgroundColor || "#ddd" };
  border-radius: ${ props => props?.styles?.borderRadius || "0" };     
`;

export const SearchFilters = () => {
  const { networkMap, exchangeMap  } = useSelector((state:RootState) => state);
  const renderProps = useContext(TokenSearchContext);  
  const { customSearchFilter } = renderProps;

  const exchangesActive = Object.values(networkMap).filter(b => b).length !== 0;
  const networkCount = Object.values(networkMap).filter(b=>b).length
  const exchangeCount = Object.values(exchangeMap).filter(b=>b).length

  const title = customSearchFilter?.title || 'Filter Networks'
  const description = networkCount === 0 && exchangeCount === 0 ? 'Searching all networks and exchanges' : customSearchFilter?.description(networkCount, exchangeCount) || `Searching {networkCount} networks and {exchangeCount} exchanges`

  // RENDERING.
  return (
    <FilterWrapper styles={customSearchFilter?.wrapperStyles}>
      <Accordion allowZeroExpanded>
        <AccordionItem>
          <AccordionItemHeading>
            <AccordionItemButton>
              <StyledFilterHeader styles={customSearchFilter?.headerStyles}>
                <b>{title}:</b>  &nbsp; {description}
              </StyledFilterHeader>            
            </AccordionItemButton>
          </AccordionItemHeading>
          <AccordionItemPanel>
            <StyledFilterContent styles={customSearchFilter?.networkStyles}>
              <FilterNetworkAll />
              <FilterNetworkSelectors />
            </StyledFilterContent>            
          </AccordionItemPanel>
          <AccordionItemPanel>
            <StyledFilterContent styles={customSearchFilter?.exchangeStyles}>
            {
              exchangesActive &&
              <FilterExchangeAll />
            }
            {
              exchangesActive &&
              <FilterExchangeSelectors />
            }    
            </StyledFilterContent>            
          </AccordionItemPanel>
        </AccordionItem>
      </Accordion>
    </FilterWrapper>
  );
}

export default SearchFilters