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
    position: absolute;
    right: 0;
    transform: rotate(-45deg);

    ${({props}) => `
      height: ${ props?.styles?.toggleHeight || "10px" };
      width: ${ props?.styles?.toggleWidth || "10px" };
      margin-right: ${ props?.styles?.toggleMarginRight || "25px" };    
      top: ${ props?.styles?.toggleTop || "20px" };    
      border-bottom: ${ props?.styles?.toggleBorderBottom || "2px solid currentColor" }; 
      border-right: ${ props?.styles?.toggleBorderRight || "2px solid currentColor" }; 
    `}
  }

  .accordion__button[aria-expanded='true']:first-child:after,
  .accordion__button[aria-selected='true']:first-child:after {
    transform: rotate(45deg);
  }

  .accordion__panel {
    ${({props}) => `
      border: ${ props?.styles?.contentBorder || "0" }; 
      border-top-style: ${ props?.styles?.contentBorderTop || "none" }; 
      border-right-style: ${ props?.styles?.contentBorderRight || "none" }; 
      border-bottom-style: ${ props?.styles?.contentBorderBottom || "none" }; 
      border-left-style: ${ props?.styles?.contentBorderLeft || "none" }; 
      border-radius: ${ props?.styles?.borderRadius || "0" }; 
      margin:  ${ props?.styles?.margin || "0 10px" };       
    `}    
  }
`;

const StyledFilterHeader = styled.div`  
  ${({props}) => `
    display: ${ props?.styles?.display || "inline" };
    width: ${ props?.styles?.width || "auto" };
    border: ${ props?.styles?.border || "none" }; 
    background-color: ${ props?.styles?.backgroundColor || "#f4f4f4" }; 
    color: ${ props?.styles?.color || "#444" };
    display: ${ props?.styles?.display || "block" }; 
    cursor: pointer;
    padding: ${ props?.styles?.padding || "18px" };   
    text-align: ${ props?.styles?.textAlign || "left" };     
    margin: ${ props?.styles?.margin || "5px" };     
    border-radius: ${ props?.styles?.borderRadius || "0" };     
    &:hover {
      background-color: ${ props?.styles?.hoverColor || "#ddd" };
    }
  `}      
`; 

const StyledFilterContent = styled.div`
  display: flex;
  flex-wrap: wrap;

  ${({props}) => `
    justify-content: ${ props?.styles?.justifyContent || "center" };
    align-items: ${ props?.styles?.alignItems || "center" };  
    padding:  ${ props?.styles?.padding || "5px 10px" };       
    background-color: ${ props?.styles?.backgroundColor || "#ddd" };
    border-radius: ${ props?.styles?.borderRadius || "0" };     
  `}      
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
    <FilterWrapper styles={customSearchFilter?.styles.wrapper}>
      <Accordion allowZeroExpanded>
        <AccordionItem>
          <AccordionItemHeading>
            <AccordionItemButton>
              <StyledFilterHeader styles={customSearchFilter?.styles.header}>
                <b>{title}:</b>  &nbsp; {description}
              </StyledFilterHeader>            
            </AccordionItemButton>
          </AccordionItemHeading>
          <AccordionItemPanel>
            <StyledFilterContent styles={customSearchFilter?.styles.network}>
              <FilterNetworkAll />
              <FilterNetworkSelectors />
            </StyledFilterContent>            
          </AccordionItemPanel>
          <AccordionItemPanel>
            <StyledFilterContent styles={customSearchFilter?.styles.exchange}>
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