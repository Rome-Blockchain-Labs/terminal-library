import React, { useContext, FC, useEffect, useState } from "react"
import { useDispatch, useSelector } from 'react-redux';
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
import Button from "./Button";
import DownIcon from "../icons/down";
import UpIcon from "../icons/up";
import { RootState } from "../redux/store";
import TokenSearchContext from '../Context/TokenSearch';
import { setViewResult } from '../redux/tokenSearchSlice';


const FilterWrapper = styled.div`  
  ${({styleOverrides}) => `    
    .accordion__button {
      position: relative;
    }
    background-color: ${ styleOverrides?.backgroundColor || "#00070E" };
    border-radius: ${ styleOverrides?.borderRadius || "4px" };

    .accordion__panel {    
      border: ${ styleOverrides?.contentBorder || "0" };       
      border-radius: ${ styleOverrides?.contentBorderRadius || "0" }; 
      margin:  ${ styleOverrides?.margin || "0" };
    }
  `}  
`;

const StyledFilterHeader = styled.div`  
  ${({styleOverrides}) => `
    display: ${ styleOverrides?.display || "flex" };
    justify-content: ${ styleOverrides?.justifyContent || "space-between" };
    align-items: ${ styleOverrides?.alignItems || "center" };
    width: ${ styleOverrides?.width || "auto" };
    border: ${ styleOverrides?.border || "none" }; 
    background-color: ${ styleOverrides?.backgroundColor || "#00070E" }; 
    color: ${ styleOverrides?.color || "#B4BBC7" };    
    cursor: pointer;
    padding: ${ styleOverrides?.padding || "6px 14px" };   
    text-align: ${ styleOverrides?.textAlign || "left" };     
    margin: ${ styleOverrides?.margin || "5px 0 0" };     
    border-radius: ${ styleOverrides?.borderRadius || "4px" };     
    font-size: ${ styleOverrides?.fontSize || "9px" };     
    font-weight: ${ styleOverrides?.fontWeight || "500" };     
    &:hover {
      background-color: ${ styleOverrides?.hoverColor || "#232C38" };
    }
  `}      
`;

const StyledFilterHeaderActionWrapper = styled.div`
    margin-left: 10px;
    display: flex;
    align-items: center;
`;

const StyledFilterContent = styled.div`
  ${({styleOverrides}) => `
    display: flex;
    flex-wrap: wrap;
    margin-bottom: 5px;
    margin-left: 10px;
    justify-content: ${ styleOverrides?.justifyContent || "start" };
    align-items: ${ styleOverrides?.alignItems || "center" };  
    padding:  ${ styleOverrides?.padding || "0 0 5px" };           
  `}      
`;

const StyledDescription = styled.div`
  ${({styleOverrides}) => `
    text-align: ${ styleOverrides?.textAlign || "right" };
    font-size: ${ styleOverrides?.fontSize || "9px" };
    font-weight: ${ styleOverrides?.fontWeight || "100" };
    padding: ${ styleOverrides?.padding || "10px 10px 5px" };       
    background-color: ${ styleOverrides?.backgroundColor || "#00070E" };
    color: ${ styleOverrides?.color || "#7A808A" };       
  `}
`

const StyledFilterWrapper = styled.div`  
  ${({styleOverrides}) => `
    display: block;
    justify-content: ${ styleOverrides?.justifyContent || "center" };
    align-items: ${ styleOverrides?.alignItems || "center" };  
    padding:  ${ styleOverrides?.padding || "0 0 5px" };       
    background-color: ${ styleOverrides?.backgroundColor || "#00070E" };    
    border-radius: ${ styleOverrides?.borderRadius || "4px" };    
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


type AccordionToggleButtonProps = {
  isOpen: boolean;
  onClick: () => void;
}
const AccordionToggleButton: FC<AccordionToggleButtonProps> = ({ isOpen, onClick }) => {
  return (
    <Button className="accordion-toggle" onClick={onClick}>
      {isOpen ? (
        <>
          <span>Close</span>
          <DownIcon width={8} height={8} />
        </>
      ) : (
        <>
          <span>Open</span>
          <UpIcon width={8} height={8} />
        </>
      )}
      
    </Button>
  )
}

export const SearchFilters = (): JSX.Element => {
  const dispatch = useDispatch();
  const { networkMap, exchangeMap, searchText  } = useSelector((state:RootState) => state);
  const renderProps = useContext(TokenSearchContext);  
  const { customSearchFilter } = renderProps;
  const exchangesActive = Object.values(networkMap).filter(b => b).length !== 0;
  
  const networkCount = Object.values(networkMap).filter(b=>b).length
  const exchangeCount = Object.values(exchangeMap).filter(b=>b).length
  
  const networkTitle = customSearchFilter?.fitler?.network || 'Select Network(s)'
  const exchangeTitle = customSearchFilter?.fitler?.exchange || 'Select Exchange(s)'

  const [isNetworkMapExpanded, setIsNetworkMapExpanded] = useState(true);
  const [isExchangeMapExpanded, setIsExchangeMapExpanded] = useState(false);

  useEffect(() => {    
    (Object.keys(networkMap).length > 0 ||
    Object.keys(exchangeMap).length > 0) && searchText.length > 0 &&
    dispatch(setViewResult(true));
  }, [networkMap, exchangeMap, searchText])

  // RENDERING.
  return (
    <FilterWrapper styleOverrides={customSearchFilter?.wrapper}>
      <Accordion allowMultipleExpanded allowZeroExpanded>
        <AccordionItem dangerouslySetExpanded={isNetworkMapExpanded}>
          <AccordionItemHeading>
            <AccordionItemButton>
              <StyledFilterHeader styleOverrides={customSearchFilter?.fitler?.header}>
                <span>{networkTitle}</span>
                <StyledFilterHeaderActionWrapper>
                  <FilterNetworkAll />
                  <AccordionToggleButton isOpen={isNetworkMapExpanded} onClick={() => setIsNetworkMapExpanded(!isNetworkMapExpanded)} />
                </StyledFilterHeaderActionWrapper>
              </StyledFilterHeader>
            </AccordionItemButton>
          </AccordionItemHeading>
          <AccordionItemPanel>            
            <StyledFilterWrapper styleOverrides={customSearchFilter?.fitler?.wrapper}>
              <StyledFilterContent styleOverrides={customSearchFilter?.fitler?.content}>                                         
                <FilterNetworkSelectors />              
              </StyledFilterContent>                                        
              <StyledDescription styleOverrides={customSearchFilter?.fitler?.description}>
                <SearchDescription 
                  networkCount={networkCount}
                  exchangeCount={exchangeCount}
                  type={'network'}
                />
              </StyledDescription>              
            </StyledFilterWrapper>
          </AccordionItemPanel> 
        </AccordionItem>
        { exchangesActive && <AccordionItem dangerouslySetExpanded={isExchangeMapExpanded}>
            <AccordionItemHeading>
              <AccordionItemButton>
                <StyledFilterHeader styleOverrides={customSearchFilter?.fitler?.header}>
                  <span>{exchangeTitle}</span>
                  <StyledFilterHeaderActionWrapper>
                    <FilterExchangeAll />
                    <AccordionToggleButton isOpen={isExchangeMapExpanded} onClick={() => setIsExchangeMapExpanded(!isExchangeMapExpanded)} />
                  </StyledFilterHeaderActionWrapper>
                </StyledFilterHeader>            
              </AccordionItemButton>
            </AccordionItemHeading>
            <AccordionItemPanel>            
              <StyledFilterWrapper styleOverrides={customSearchFilter?.fitler?.wrapper}>
                <StyledFilterContent styleOverrides={customSearchFilter?.fitler?.content}>                                         
                  <FilterExchangeSelectors />
                </StyledFilterContent>                                                        
                <StyledDescription styleOverrides={customSearchFilter?.fitler?.description}>
                  <SearchDescription 
                    networkCount={networkCount}
                    exchangeCount={exchangeCount}
                    type={'exchange'}
                  />
                </StyledDescription>              
              </StyledFilterWrapper>
            </AccordionItemPanel> 
          </AccordionItem>
      }
      </Accordion>        
    </FilterWrapper>
  );
}

export default SearchFilters