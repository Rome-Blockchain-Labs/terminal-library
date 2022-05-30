import React, { useContext, useState, FC, useMemo } from 'react';
import useInfiniteScroll from 'react-infinite-scroll-hook';
import styled from 'styled-components';

import { useSelector, useDispatch } from 'react-redux';
import TokenSearchContext from '../Context/TokenSearch';
import { RootState } from '../redux/store';
import UnCheckedIcon from '../icons/unchecked';
import { setViewResult, loadMore } from '../redux/tokenSearchSlice';
import ResultDetail, { StyledGridRow } from './ResultDetail';
import { IconsType } from './types';

const StyledResult = styled.div`
  background-color: inherit;
  margin-left: auto;
  margin-right: auto;
  position: relative;
`;

const StyledLoading = styled.div`
  ${({ styleOverrides }) => `
    position: relative;
    display: flex;
    justify-content: center;  
    margin: 10px;
    color: ${styleOverrides?.color || 'white'};
    font-size: ${styleOverrides?.fontSize || '0.75rem'};      
  `}
`;

const StyledResultTitle = styled.div`
  ${({ styleOverrides }) => `    
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: ${styleOverrides?.color || '#fff'};
    font-size: ${styleOverrides?.fontSize || '0.75rem'};      
    padding: ${styleOverrides?.padding || '7px 14px 2px;'};      
    margin: ${styleOverrides?.margin || '0'};      
    > span {
      font-size: ${styleOverrides?.fontSize2 || '0.75rem'};      
    }
  `}
`;

const StyledResultContent = styled.div`
  ${({ styleOverrides }) => `
    padding: ${styleOverrides?.padding || '14px'};
    background: ${styleOverrides?.background || '#00070E'};
    border-radius: ${styleOverrides?.borderRadius || '4px'};        
    width: ${styleOverrides?.width || '100%'};
    height: ${styleOverrides?.height || '300px'};
    border: ${styleOverrides?.border || '1px solid grey'};   
    color: ${styleOverrides?.color || '#FFF'};
    display: ${styleOverrides?.display || 'block'};   
    border-color: ${styleOverrides?.borderColor || '#474F5C'};  
    border-style: ${styleOverrides?.borderStyle || 'solid'};  
    border-width: ${styleOverrides?.borderWidth || '1px'};      
    font-size: ${styleOverrides?.fontSize || '0.875rem'};      
    font-family: ${styleOverrides?.fontFamily || "'Fira Code', monospace"};  
    overflow: auto;
    box-sizing: border-box;
  `}

  .result-content-responsive {
    width: fit-content;
    min-width: 100%;
  }

  .header {    
    border-bottom: 1px solid #474f5c;
    color: #b4bbc7;
    font-size: 0.75rem;
    font-weight: bold;
    padding-bottom: 10px;

    div {
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

const SearchResult: FC<Loading> = (props: Loading) => {
  const dispatch = useDispatch();
  const renderProps = useContext(TokenSearchContext);
  const { customResult, customLoading } = renderProps;
  const { suggestions, searchText, isLoading, suggestionRendered } = useSelector((state: RootState) => state);
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

  if (props.loading) {
    const loadingTitle = customLoading?.loadingTitle ? customLoading.loadingTitle : 'Searching...';
    return <StyledLoading styleOverrides={customLoading}>{loadingTitle}</StyledLoading>;
  }

  const notFoundTitle = customLoading?.notFoundTitle ? customLoading.notFoundTitle : 'No results found';

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

  return (
    <StyledResult>
      <StyledResultTitle styleOverrides={customResult?.title}>
        <div>
          Search Results <span>({suggestions.length} Results Found)</span>
        </div>
        <button onClick={handleClose}>
          Close&nbsp;
          <UnCheckedIcon width={7} height={7} />
        </button>
      </StyledResultTitle>
      <StyledResultContent styleOverrides={customResult?.content}>
        <div className="result-content-responsive">
          <StyledGridRow className={`header ${currentIndex === 0 && 'b-none'}`}>
            <div>Pair</div>
            <div>Network</div>
            <div>Exchange</div>
            <div>Details</div>
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
            <StyledLoading styleOverrides={customLoading}>{notFoundTitle}</StyledLoading>
          )}
          {hasNextPage && <div ref={sentryRef}>loading....</div>}
        </div>
      </StyledResultContent>
    </StyledResult>
  );
};

export { StyledGridRow };

export default SearchResult;
