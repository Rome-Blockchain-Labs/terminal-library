import React, { forwardRef, useContext, useState, useMemo } from "react";
import useInfiniteScroll from "react-infinite-scroll-hook";
import styled from "styled-components";

import { useSelector, useDispatch } from "react-redux";
import TokenSearchContext from "../Context/TokenSearch";
import { RootState } from "../redux/store";
import Button from "./Button";
import UnCheckedIcon from "../icons/unchecked";
import { setViewResult, loadMore } from "../redux/tokenSearchSlice";
import ResultDetail, { StyledGridRow } from "./ResultDetail";
import DropdownSection from "./DropdownSection";
import { IconsType } from "./types";

const StyledResult = styled(DropdownSection)`
  ${({ styleOverrides }) => `
    position: relative;
    background: ${styleOverrides?.background || "#00070E"};
    border-radius: ${styleOverrides?.borderRadius || "4px"};
  `}
`;

const StyledLoading = styled.div`
  ${({ styleOverrides }) => `
    position: relative;
    display: flex;
    justify-content: center;  
    padding: 10px;
    color: ${styleOverrides?.color || "white"};
    font-size: ${styleOverrides?.fontSize || "0.75rem"};      
  `}
`;

const StyledResultTitle = styled.div`
  ${({ styleOverrides }) => `    
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: ${styleOverrides?.color || "#fff"};
    font-size: ${styleOverrides?.fontSize || "0.75rem"};      
    padding: ${styleOverrides?.padding || "10px;"};      
    margin: ${styleOverrides?.margin || "0"};      
    > span {
      font-size: ${styleOverrides?.fontSize2 || "0.75rem"};      
    }
  `}
`;

const StyledResultContent = styled.div`
  ${({ styleOverrides }) => `
    width: ${styleOverrides?.width || "100%"};
    height: ${styleOverrides?.height || "500px"};
    color: ${styleOverrides?.color || "#FFF"};
    display: ${styleOverrides?.display || "block"};
    font-size: ${styleOverrides?.fontSize || "0.875rem"};      
    font-family: ${styleOverrides?.fontFamily || "'Montserrat', monospace"};  
    overflow: auto;
    box-sizing: border-box;
  `}

  .result-content-responsive {
    width: fit-content;
    min-width: 100%;
  }

  .header {
    background-color: #7a808a;
    color: #ffffff;
    font-size: 0.75rem;
    font-weight: bold;
    padding: 10px 0;

    > div {
      text-align: center;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    > :last-child {
      grid-column: 4 / -1;
    }
  }
`;

type Loading = {
  loading: boolean;
};

const SearchResult = (props: Loading, ref) => {
  const dispatch = useDispatch();
  const renderProps = useContext(TokenSearchContext);
  const { customResult, customLoading } = renderProps;
  const { suggestions, searchText, isLoading, suggestionRendered } =
    useSelector((state: RootState) => state);
  const [currentIndex, setCurrentIndex] = useState(-1);

  const hasNextPage = useMemo(
    () => suggestionRendered.length < suggestions.length,
    [suggestions, suggestionRendered]
  );

  const [sentryRef] = useInfiniteScroll({
    loading: isLoading,
    hasNextPage,
    onLoadMore: () => dispatch(loadMore()),
  });

  const notFoundTitle = customLoading?.notFoundTitle
    ? customLoading.notFoundTitle
    : "No results found";
  const loadingTitle = customLoading?.loadingTitle
    ? customLoading.loadingTitle
    : "Searching...";

  const handleClose = () => {
    dispatch(setViewResult(false));
  };
  const logoIcons: IconsType = {};
  renderProps.networks?.forEach((network) => {
    logoIcons[network.id] = network.icon;
    network.exchanges?.forEach((exchange) => {
      logoIcons[exchange.name] = exchange.icon;
    });
  });

  if (props.loading) {
    return (
      <StyledResult>
        <StyledLoading styleOverrides={customLoading}>
          {loadingTitle}
        </StyledLoading>
      </StyledResult>
    );
  }

  return (
    <StyledResult className="search-result-wrapper" ref={ref}>
      <StyledResultTitle styleOverrides={customResult?.title}>
        <div>
          Search Results <span>({suggestions.length} Results Found)</span>
        </div>
        <Button onClick={handleClose}>
          Close&nbsp;
          <UnCheckedIcon width={7} height={7} />
        </Button>
      </StyledResultTitle>
      <StyledResultContent
        styleOverrides={customResult?.content}
        className="search-result-content"
      >
        <div className="result-content-responsive">
          <StyledGridRow className={`header ${currentIndex === 0 && "b-none"}`}>
            <div>Pair</div>
            <div>Network</div>
            <div>Exchange</div>
            <div></div>
          </StyledGridRow>
          {suggestionRendered.map((suggestions, index) => (
            <ResultDetail
              suggestions={suggestionRendered}
              index={index}
              key={`token-detail-${index}`}
              currentIndex={currentIndex}
              handleDetail={setCurrentIndex}
              logoIcons={logoIcons}
            />
          ))}
          {!!searchText && !suggestionRendered.length && (
            <StyledLoading styleOverrides={customLoading}>
              {notFoundTitle}
            </StyledLoading>
          )}
          {hasNextPage && <div ref={sentryRef}>loading....</div>}
        </div>
      </StyledResultContent>
    </StyledResult>
  );
};

export { StyledGridRow };

export default forwardRef(SearchResult);
