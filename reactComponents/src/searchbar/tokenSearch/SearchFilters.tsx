import React, { useContext, FC, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { omitBy } from "lodash";
import styled from "styled-components";
import {
  Accordion,
  AccordionItem,
  AccordionItemHeading,
  AccordionItemButton,
  AccordionItemPanel,
} from "react-accessible-accordion";
import {
  FilterNetworkAll,
  FilterNetworkSelectors,
} from "./SearchFiltersNetworkSelectors";
import {
  FilterExchangeAll,
  FilterExchangeSelectors,
} from "./SearchFiltersExchangeSelectors";
import Button from "./Button";
import DownIcon from "../icons/down";
import UpIcon from "../icons/up";
import DropdownSection from "./DropdownSection";
import { RootState } from "../redux/store";
import TokenSearchContext from "../Context/TokenSearch";
import { setViewResult, stopSelecting } from "../redux/tokenSearchSlice";

const FilterWrapper = styled(DropdownSection)`
  ${({ styleOverrides }) => `    
    background-color: ${styleOverrides?.backgroundColor || "#00070E"};
    border-radius: ${styleOverrides?.borderRadius || "4px"};

    .accordion__button {
      position: relative;
    }

    .accordion__panel {
      border: ${styleOverrides?.contentBorder || "0"};       
      border-radius: ${styleOverrides?.contentBorderRadius || "0"}; 
      margin:  ${styleOverrides?.margin || "0"};
    }
  `}
`;

const StyledFilterHeader = styled.div`
  ${({ styleOverrides }) => `
    display: ${styleOverrides?.display || "flex"};
    justify-content: ${styleOverrides?.justifyContent || "space-between"};
    align-items: ${styleOverrides?.alignItems || "center"};
    width: ${styleOverrides?.width || "auto"};
    border: ${styleOverrides?.border || "none"}; 
    background-color: ${styleOverrides?.backgroundColor || "#00070E"}; 
    color: ${styleOverrides?.color || "#fff"};    
    cursor: pointer;
    padding: ${styleOverrides?.padding || "10px"};   
    text-align: ${styleOverrides?.textAlign || "left"};     
    font-size: ${styleOverrides?.fontSize || "0.75rem"};     
    font-weight: ${styleOverrides?.fontWeight || "500"};
  `}
`;

const StyledFilterHeaderActionWrapper = styled.div`
  margin-left: 10px;
  display: flex;
  align-items: center;

  button {
    margin-left: 8px;
  }
`;

const StyledFilterContent = styled.div`
  ${({ styleOverrides }) => `
    display: flex;
    flex-wrap: wrap;
    margin-bottom: 5px;
    margin-left: 10px;
    justify-content: ${styleOverrides?.justifyContent || "start"};
    align-items: ${styleOverrides?.alignItems || "center"};  
    padding:  ${styleOverrides?.padding || "0 0 5px"};
  `}
`;

const StyledDescription = styled.div`
  ${({ styleOverrides }) => `
    text-align: ${styleOverrides?.textAlign || "right"};
    font-size: ${styleOverrides?.fontSize || "0.75rem"};
    padding: ${styleOverrides?.padding || "10px 10px 5px"};       
    background-color: ${styleOverrides?.backgroundColor || "#00070E"};
    color: ${styleOverrides?.color || "#c4c5c7"};       
  `}
`;

const StyledFilterWrapper = styled.div`
  ${({ styleOverrides }) => `
    display: block;
    justify-content: ${styleOverrides?.justifyContent || "center"};
    align-items: ${styleOverrides?.alignItems || "center"};  
    padding:  ${styleOverrides?.padding || "0 0 5px"};       
    background-color: ${styleOverrides?.backgroundColor || "#00070E"};    
    border-radius: ${styleOverrides?.borderRadius || "4px"};    
  `}
`;
const StyledCount = styled.div`
  color: white;
  font-weight: 400;
`;
type SelectedNetworks = {
  networkCount: number;
  exchangeCount: number;
};

const SearchDescription: FC<SelectedNetworks> = (props: SelectedNetworks) => {
  const { networkCount, exchangeCount } = props;
  let desc;

  if (networkCount === 0) {
    desc = "Searching all networks and exchanges";
  } else {
    desc = (
      <div style={{ display: "flex", justifyContent: "right" }}>
        Searching&nbsp;
        {exchangeCount > 0 ? (
          <StyledCount>
            {exchangeCount} exchange{exchangeCount > 1 ? "s" : ""}
          </StyledCount>
        ) : (
          "all exchanges"
        )}
        &nbsp;within&nbsp;
        <StyledCount>
          {networkCount} network{networkCount > 1 ? "s" : ""}
        </StyledCount>
      </div>
    );
  }

  return <>{desc}</>;
};

type AccordionToggleButtonProps = {
  isOpen: boolean;
  onClick: () => void;
};
const AccordionToggleButton: FC<AccordionToggleButtonProps> = ({
  isOpen,
  onClick,
}) => {
  return (
    <Button className="accordion-toggle" onClick={onClick}>
      {isOpen ? (
        <>
          <span>Close</span>
          <UpIcon width={8} height={8} />
        </>
      ) : (
        <>
          <span>Open</span>
          <DownIcon width={8} height={8} />
        </>
      )}
    </Button>
  );
};

export const SearchFilters = (): JSX.Element => {
  const dispatch = useDispatch();
  const { networkMap, exchangeMap, searchText, viewResult } = useSelector(
    (state: RootState) => state
  );
  const renderProps = useContext(TokenSearchContext);
  const { customSearchFilter } = renderProps;
  const exchangesActive =
    Object.values(networkMap).filter((b) => b).length !== 0;

  const networkIds: string[] = Object.keys(omitBy(networkMap, (b) => !b));
  const exchangeIds: string[] =
    Object.keys(omitBy(exchangeMap, (b) => !b)) || [];

  const networkCount = networkIds.length;
  const exchangeCount = exchangeIds.length;

  const totalExchangeCount = exchangeIds.length;

  const networkTitle =
    customSearchFilter?.content?.network || "Select Network(s)";
  const exchangeTitle =
    customSearchFilter?.content?.exchange || "Select Exchange(s)";

  const [isNetworkMapExpanded, setIsNetworkMapExpanded] = useState(false);
  const [isExchangeMapExpanded, setIsExchangeMapExpanded] = useState(false);

  useEffect(() => {
    if (
      Object.keys(networkMap).length > 0 &&
      Object.keys(exchangeMap).length > 0 &&
      searchText.length > 0
    ) {
      dispatch(setViewResult(true));
    }

    if (Object.keys(networkMap).length > 0) {
      setIsNetworkMapExpanded(true);
      setIsExchangeMapExpanded(true);
    }
  }, [networkMap, exchangeMap, searchText]);

  function handleKeyDown(e: KeyboardEvent) {
    if (e.code === 'Escape') {
      dispatch(setViewResult(false));
      dispatch(stopSelecting());
    }
  }

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    }
  }, []);

  // RENDERING.
  return (
    <FilterWrapper styleOverrides={customSearchFilter?.wrapper}>
      <Accordion allowMultipleExpanded>
        <AccordionItem dangerouslySetExpanded={isNetworkMapExpanded}>
          <AccordionItemHeading>
            <AccordionItemButton>
              <StyledFilterHeader
                styleOverrides={customSearchFilter?.content?.header}
                onClick={() => setIsNetworkMapExpanded(!isNetworkMapExpanded)}
              >
                <span>{networkTitle}</span>
                <StyledFilterHeaderActionWrapper>
                  <FilterNetworkAll />
                  <AccordionToggleButton
                    isOpen={isNetworkMapExpanded}
                    onClick={() =>
                      setIsNetworkMapExpanded(!isNetworkMapExpanded)
                    }
                  />
                </StyledFilterHeaderActionWrapper>
              </StyledFilterHeader>
            </AccordionItemButton>
          </AccordionItemHeading>
          <AccordionItemPanel>
            <StyledFilterWrapper
              styleOverrides={customSearchFilter?.content?.wrapper}
            >
              <StyledFilterContent
                styleOverrides={customSearchFilter?.content?.content}
              >
                <FilterNetworkSelectors />
              </StyledFilterContent>
            </StyledFilterWrapper>
          </AccordionItemPanel>
        </AccordionItem>
        {exchangesActive && (
          <AccordionItem dangerouslySetExpanded={isExchangeMapExpanded}>
            <AccordionItemHeading>
              <AccordionItemButton>
                <StyledFilterHeader
                  styleOverrides={customSearchFilter?.content?.header}
                  onClick={() =>
                    setIsExchangeMapExpanded(!isExchangeMapExpanded)
                  }
                >
                  <span>{exchangeTitle}</span>
                  <StyledFilterHeaderActionWrapper>
                    <FilterExchangeAll />
                    <AccordionToggleButton
                      isOpen={isExchangeMapExpanded}
                      onClick={() =>
                        setIsExchangeMapExpanded(!isExchangeMapExpanded)
                      }
                    />
                  </StyledFilterHeaderActionWrapper>
                </StyledFilterHeader>
              </AccordionItemButton>
            </AccordionItemHeading>
            <AccordionItemPanel>
              <StyledFilterWrapper
                styleOverrides={customSearchFilter?.content?.wrapper}
              >
                <StyledFilterContent
                  styleOverrides={customSearchFilter?.content?.content}
                >
                  <FilterExchangeSelectors />
                </StyledFilterContent>
              </StyledFilterWrapper>
            </AccordionItemPanel>
          </AccordionItem>
        )}
      </Accordion>
      {viewResult && (
        <StyledDescription
          styleOverrides={customSearchFilter?.content?.description}
        >
          <SearchDescription
            networkCount={networkCount}
            exchangeCount={exchangeCount || totalExchangeCount}
          />
        </StyledDescription>
      )}
    </FilterWrapper>
  );
};

export default SearchFilters;
