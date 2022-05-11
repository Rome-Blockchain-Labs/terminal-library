import React, { useContext, FC, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { omitBy } from 'lodash';
import styled from 'styled-components';
import {
  Accordion,
  AccordionItem,
  AccordionItemHeading,
  AccordionItemButton,
  AccordionItemPanel,
} from 'react-accessible-accordion';
import { FilterNetworkAll, FilterNetworkSelectors } from './SearchFiltersNetworkSelectors';
import { FilterExchangeAll, FilterExchangeSelectors } from './SearchFiltersExchangeSelectors';
import { RootState } from '../redux/store';
import TokenSearchContext from '../Context/TokenSearch';
import { setViewResult } from '../redux/tokenSearchSlice';

const FilterWrapper = styled.div`
  ${({ styleOverrides }) => `    
    .accordion__button {
      position: relative;
    }
    background-color: ${styleOverrides?.backgroundColor || '#00070E'};
    border-radius: ${styleOverrides?.borderRadius || '4px'};

    .accordion__button:first-child:after {
      display: block;    
      content: '';
      position: absolute;    
      transform: rotate(-45deg);  
      
      color: ${styleOverrides?.toggleColor || '#B4BBC7'};
      height: ${styleOverrides?.toggleHeight || '7px'};
      width: ${styleOverrides?.toggleWidth || '7px'};
      margin-right: ${styleOverrides?.toggleMarginRight || '0'};    
      left: ${styleOverrides?.toggleLeft || 'calc(50% - 3.5px);'};    
      top: ${styleOverrides?.toggleTop || 'calc(50% - 4.9px);'};    
      border-bottom: ${styleOverrides?.toggleBorderBottom || '2px solid currentColor'}; 
      border-right: ${styleOverrides?.toggleBorderRight || '2px solid currentColor'}; 
      transform: rotate(45deg);
       
    }

    .accordion__button[aria-expanded='true']:first-child:after,
    .accordion__button[aria-selected='true']:first-child:after {
      transform: rotate(-135deg);
    }

    .accordion__panel {    
      border: ${styleOverrides?.contentBorder || '0'};       
      border-radius: ${styleOverrides?.contentBorderRadius || '0'}; 
      margin:  ${styleOverrides?.margin || '0'};
    }
  `}
`;

const StyledFilterHeader = styled.div`
  ${({ styleOverrides }) => `
    display: ${styleOverrides?.display || 'flex'};
    justify-content: ${styleOverrides?.justifyContent || 'space-between'};
    align-items: ${styleOverrides?.alignItems || 'center'};
    width: ${styleOverrides?.width || 'auto'};
    border: ${styleOverrides?.border || 'none'}; 
    background-color: ${styleOverrides?.backgroundColor || '#00070E'}; 
    color: ${styleOverrides?.color || '#fff'};    
    cursor: pointer;
    padding: ${styleOverrides?.padding || '6px 14px'};   
    text-align: ${styleOverrides?.textAlign || 'left'};     
    margin: ${styleOverrides?.margin || '5px 0 0'};     
    border-radius: ${styleOverrides?.borderRadius || '4px'};     
    font-size: ${styleOverrides?.fontSize || '13px'};     
    font-weight: ${styleOverrides?.fontWeight || '500'};     
    &:hover {
      background-color: ${styleOverrides?.hoverColor || '#232C38'};
    }
  `}
`;

const StyledFilterContent = styled.div`
  ${({ styleOverrides }) => `
    display: flex;
    flex-wrap: wrap;
    margin-bottom: 5px;
    margin-left: 10px;
    justify-content: ${styleOverrides?.justifyContent || 'start'};
    align-items: ${styleOverrides?.alignItems || 'center'};  
    padding:  ${styleOverrides?.padding || '0 0 5px'};           
  `}
`;

const StyledDescription = styled.div`
  ${({ styleOverrides }) => `
    text-align: ${styleOverrides?.textAlign || 'right'};
    font-size: ${styleOverrides?.fontSize || '12px'};
    font-weight: ${styleOverrides?.fontWeight || '100'};
    padding: ${styleOverrides?.padding || '10px 10px 5px'};       
    background-color: ${styleOverrides?.backgroundColor || '#00070E'};
    color: ${styleOverrides?.color || '#7A808A'};       
  `}
`;

const StyledFilterWrapper = styled.div`
  ${({ styleOverrides }) => `
    display: block;
    justify-content: ${styleOverrides?.justifyContent || 'center'};
    align-items: ${styleOverrides?.alignItems || 'center'};  
    padding:  ${styleOverrides?.padding || '0 0 5px'};       
    background-color: ${styleOverrides?.backgroundColor || '#00070E'};    
    border-radius: ${styleOverrides?.borderRadius || '4px'};    
  `}
`;
const StyledCount = styled.div`
  color: white;
  font-weight: 400;
`;
type SelectedNetworks = {
  networkCount: number;
  exchangeCount: number;
  type: string;
};

const SearchDescription: FC<SelectedNetworks> = (props: SelectedNetworks) => {
  const { networkCount, exchangeCount, type } = props;
  let desc;

  if (networkCount === 0 && exchangeCount === 0) {
    desc = 'Searching all networks and exchanges';
  } else {
    if (type === 'network')
      desc = (
        <div style={{ display: 'flex', justifyContent: 'right' }}>
          Searching&nbsp;
          <StyledCount>
            {networkCount} network{networkCount > 1 ? 's' : ''}
          </StyledCount>
          {exchangeCount > 0 && (
            <>
              &nbsp;within&nbsp;
              <StyledCount>
                {exchangeCount} exchange{exchangeCount > 1 ? 's' : ''}
              </StyledCount>
            </>
          )}
        </div>
      );
    else
      desc = (
        <div style={{ display: 'flex', justifyContent: 'right' }}>
          Searching&nbsp;
          <StyledCount>
            {exchangeCount} exchange{exchangeCount > 1 ? 's' : ''}
          </StyledCount>
          &nbsp;within&nbsp;
          <StyledCount>
            {networkCount} network{networkCount > 1 ? 's' : ''}
          </StyledCount>
        </div>
      );
  }

  return <>{desc}</>;
};

export const SearchFilters = (): JSX.Element => {
  const dispatch = useDispatch();
  const { networkMap, exchangeMap, searchText } = useSelector((state: RootState) => state);
  const renderProps = useContext(TokenSearchContext);
  const { customSearchFilter, networks } = renderProps;
  const exchangesActive = Object.values(networkMap).filter((b) => b).length !== 0;

  let networkIds: string[] = Object.keys(omitBy(networkMap, (b) => !b));
  const exchangeIds: string[] = Object.keys(omitBy(exchangeMap, (b) => !b)) || [];

  if (!networkIds.length) {
    networkIds = networks?.map((network) => network.id) || [];
  }
  const networkCount = networkIds.length;
  
  const exchangeCount = exchangeIds.length;

  if (!exchangeIds.length) {
    networks?.forEach((network) => {
      if (networkIds.includes(network.id)) {
        network.exchanges?.forEach((exchange) => {
          exchangeIds.push(exchange.id);
        });
      }
    });
  }
  const totalExchangeCount = exchangeIds.length;
  
  const networkTitle = customSearchFilter?.content?.network || 'Select Network(s)';
  const exchangeTitle = customSearchFilter?.content?.exchange || 'Select Exchange(s)';

  useEffect(() => {
    (Object.keys(networkMap).length > 0 || Object.keys(exchangeMap).length > 0) &&
      searchText.length > 0 &&
      dispatch(setViewResult(true));
  }, [networkMap, exchangeMap, searchText]);

  // RENDERING.
  return (
    <FilterWrapper styleOverrides={customSearchFilter?.wrapper}>
      <Accordion allowMultipleExpanded allowZeroExpanded>
        <AccordionItem>
          <AccordionItemHeading>
            <AccordionItemButton>
              <StyledFilterHeader styleOverrides={customSearchFilter?.content?.header}>
                <span>{networkTitle}</span>
                <FilterNetworkAll />
              </StyledFilterHeader>
            </AccordionItemButton>
          </AccordionItemHeading>
          <AccordionItemPanel>
            <StyledFilterWrapper styleOverrides={customSearchFilter?.content?.wrapper}>
              <StyledFilterContent styleOverrides={customSearchFilter?.content?.content}>
                <FilterNetworkSelectors />
              </StyledFilterContent>
              <StyledDescription styleOverrides={customSearchFilter?.content?.description}>
                <SearchDescription
                  networkCount={networkCount}
                  exchangeCount={exchangeCount}
                  type={'network'}
                />
              </StyledDescription>
            </StyledFilterWrapper>
          </AccordionItemPanel>
        </AccordionItem>
        {exchangesActive && (
          <AccordionItem>
            <AccordionItemHeading>
              <AccordionItemButton>
                <StyledFilterHeader styleOverrides={customSearchFilter?.content?.header}>
                  <span>{exchangeTitle}</span>
                  <FilterExchangeAll />
                </StyledFilterHeader>
              </AccordionItemButton>
            </AccordionItemHeading>
            <AccordionItemPanel>
              <StyledFilterWrapper styleOverrides={customSearchFilter?.content?.wrapper}>
                <StyledFilterContent styleOverrides={customSearchFilter?.content?.content}>
                  <FilterExchangeSelectors />
                </StyledFilterContent>
                <StyledDescription styleOverrides={customSearchFilter?.content?.description}>
                  <SearchDescription
                    networkCount={networkCount}
                    exchangeCount={exchangeCount || totalExchangeCount}
                    type={'exchange'}
                  />
                </StyledDescription>
              </StyledFilterWrapper>
            </AccordionItemPanel>
          </AccordionItem>
        )}
      </Accordion>
    </FilterWrapper>
  );
};

export default SearchFilters;
