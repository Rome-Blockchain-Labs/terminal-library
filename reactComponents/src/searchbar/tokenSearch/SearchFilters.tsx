import React, { useContext, FC } from "react"
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
  ${({styles}) => `    
    .accordion__button {
      position: relative;
    }
    background-color: ${ styles?.backgroundColor || "#00070E" };
    border-radius: ${ styles?.borderRadius || "4px" };

    .accordion__button:first-child:after {
      display: block;    
      content: '';
      position: absolute;    
      transform: rotate(-45deg);  
      
      color: ${ styles?.toggleColor || "#B4BBC7" };
      height: ${ styles?.toggleHeight || "7px" };
      width: ${ styles?.toggleWidth || "7px" };
      margin-right: ${ styles?.toggleMarginRight || "0" };    
      left: ${ styles?.toggleLeft || "50%" };    
      top: ${ styles?.toggleTop || "5px" };    
      border-bottom: ${ styles?.toggleBorderBottom || "2px solid currentColor" }; 
      border-right: ${ styles?.toggleBorderRight || "2px solid currentColor" }; 
      transform: rotate(45deg);
       
    }

    .accordion__button[aria-expanded='true']:first-child:after,
    .accordion__button[aria-selected='true']:first-child:after {
      transform: rotate(-135deg);
      top: 10px;    
    }

    .accordion__panel {    
      border: ${ styles?.contentBorder || "0" };       
      border-radius: ${ styles?.contentBorderRadius || "0" }; 
      margin:  ${ styles?.margin || "0" };
    }
  `}  
`;

const StyledFilterHeader = styled.div`  
  ${({styles}) => `
    display: ${ styles?.display || "flex" };
    justify-content: ${ styles?.justifyContent || "space-between" };
    align-items: ${ styles?.alignItems || "center" };
    width: ${ styles?.width || "auto" };
    border: ${ styles?.border || "none" }; 
    background-color: ${ styles?.backgroundColor || "#00070E" }; 
    color: ${ styles?.color || "#B4BBC7" };    
    cursor: pointer;
    padding: ${ styles?.padding || "6px 14px" };   
    text-align: ${ styles?.textAlign || "left" };     
    margin: ${ styles?.margin || "4px 0" };     
    border-radius: ${ styles?.borderRadius || "4px" };     
    font-size: ${ styles?.fontSize || "9px" };     
    font-weight: ${ styles?.fontWeight || "500" };     
    &:hover {
      background-color: ${ styles?.hoverColor || "#232C38" };
    }
  `}      
`; 

const StyledFilterContent = styled.div`
  ${({styles}) => `
    display: flex;
    flex-wrap: wrap;
    margin-bottom: 5px;
    margin-left: 10px;
    justify-content: ${ styles?.justifyContent || "start" };
    align-items: ${ styles?.alignItems || "center" };  
    padding:  ${ styles?.padding || "0 0 5px" };           
  `}      
`;

const StyledDescription = styled.div`
  ${({styles}) => `
    text-align: ${ styles?.textAlign || "right" };
    font-size: ${ styles?.fontSize || "9px" };
    font-weight: ${ styles?.fontWeight || "100" };
    padding: ${ styles?.padding || "10px 10px 5px" };       
    background-color: ${ styles?.backgroundColor || "#00070E" };
    color: ${ styles?.color || "#7A808A" };       
  `}
`

const StyledFilterWrapper = styled.div`  
  ${({styles}) => `
    display: block;
    justify-content: ${ styles?.justifyContent || "center" };
    align-items: ${ styles?.alignItems || "center" };  
    padding:  ${ styles?.padding || "0 0 5px" };       
    background-color: ${ styles?.backgroundColor || "#00070E" };    
    border-radius: ${ styles?.borderRadius || "4px" };    
  `}      
`
const StyledCount = styled.div`
  color: white;
  font-weight: 400;  
`
type SelectedNetworks = {
  networkCount: number;
  exchangeCount: number;
  type: string;
}

const SearchDescription: FC<SelectedNetworks> = (props: SelectedNetworks) => {  
  const { networkCount, exchangeCount, type } = props;
  let desc;

  if (networkCount === 0 && exchangeCount === 0) {
    desc = 'Searching all networks and exchanges'
  } else {
    if (type === 'network')
      desc = <div style={{display: 'flex', justifyContent: 'right'}}>Searching&nbsp;<StyledCount>{networkCount} network(s)</StyledCount>&nbsp;within&nbsp;<StyledCount>{exchangeCount} exchange(s)</StyledCount></div>
    else      
      desc = <div style={{display: 'flex', justifyContent: 'right'}}>Searching&nbsp;<StyledCount>{exchangeCount} exchange(s)</StyledCount>&nbsp;within&nbsp;<StyledCount>{networkCount} network(s)</StyledCount></div>
  }

  return (
    <>
      {desc}
    </>   
  )
}

export const SearchFilters = () => {
  const { networkMap, exchangeMap  } = useSelector((state:RootState) => state);
  const renderProps = useContext(TokenSearchContext);  
  const { customSearchFilter } = renderProps;
  const exchangesActive = Object.values(networkMap).filter(b => b).length !== 0;
  
  const networkCount = Object.values(networkMap).filter(b=>b).length
  const exchangeCount = Object.values(exchangeMap).filter(b=>b).length
  
  const networkTitle = customSearchFilter?.network?.title || 'Select Network(s)'
  const exchangeTitle = customSearchFilter?.exchange?.title || 'Select Exchange(s)'
  // RENDERING.
  return (
    <FilterWrapper styles={customSearchFilter?.wrapper}>
      <Accordion allowZeroExpanded>
        <AccordionItem>
          <AccordionItemHeading>
            <AccordionItemButton>
              <StyledFilterHeader styles={customSearchFilter?.network?.header}>
                <span>{networkTitle}</span>
                <FilterNetworkAll />
              </StyledFilterHeader>            
            </AccordionItemButton>
          </AccordionItemHeading>
          <AccordionItemPanel>            
            <StyledFilterWrapper styles={customSearchFilter?.network?.wrapper}>
              <StyledFilterContent styles={customSearchFilter?.network?.content}>                                         
                <FilterNetworkSelectors />              
              </StyledFilterContent>                                        
              <StyledDescription styles={customSearchFilter?.network?.description}>
                <SearchDescription 
                  networkCount={networkCount}
                  exchangeCount={exchangeCount}
                  type={'network'}
                />
              </StyledDescription>              
            </StyledFilterWrapper>
          </AccordionItemPanel> 
        </AccordionItem>
      </Accordion>
      {exchangesActive && 
        <Accordion allowZeroExpanded>
          <AccordionItem>
            <AccordionItemHeading>
              <AccordionItemButton>
                <StyledFilterHeader styles={customSearchFilter?.exchange?.header}>
                  <span>{exchangeTitle}</span>
                  <FilterExchangeAll />
                </StyledFilterHeader>            
              </AccordionItemButton>
            </AccordionItemHeading>
            <AccordionItemPanel>            
              <StyledFilterWrapper styles={customSearchFilter?.exchange?.wrapper}>
                <StyledFilterContent styles={customSearchFilter?.exchange?.content}>                                         
                  <FilterExchangeSelectors />
                </StyledFilterContent>                                                        
                <StyledDescription styles={customSearchFilter?.exchange?.description}>
                  <SearchDescription 
                    networkCount={networkCount}
                    exchangeCount={exchangeCount}
                    type={'exchange'}
                  />
                </StyledDescription>              
              </StyledFilterWrapper>
            </AccordionItemPanel> 
          </AccordionItem>
        </Accordion>
  }
    </FilterWrapper>
  );
}

export default SearchFilters