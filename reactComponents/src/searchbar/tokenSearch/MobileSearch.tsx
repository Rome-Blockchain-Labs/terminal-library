import React, { FC } from 'react';
import { useDispatch, useSelector, RootStateOrAny } from 'react-redux';
import styled from 'styled-components';
import { stopSelecting, setViewResult } from '../redux/tokenSearchSlice';
import MobileSearchInput from './MobileSearchInput';
import SearchResult from './SearchResult';
import SearchFilters from './SearchFilters';
import UnCheckedIcon from '../icons/unchecked';
import { RenderProps } from '../../types';

const MobileSearchWrapper = styled.div`
  width: 100%;
  position: relative;
  box-sizing: border-box;
`;

const MobileSearchPopup = styled.div`
  position: fixed;  
  width: 100%;
  height: 100%;
  z-index: 2; 
  top: 0;
  left: 0;

  ${({ styleOverrides }) => `
    background-color: ${styleOverrides?.backgroundColor || '#2F3542'};    
  `}
`;

const MobileSearchPopupInner = styled.div`
  position: relative;
  padding: 15px;
  box-sizing: border-box;
  height: 100%;
`;

const MobileSearchPopupHeader = styled.div`
  display: flex;
  justify-content: flex-end;
`

const MobileSearchPopupBody = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;

  .search-result-wrapper {
    display: flex;
    flex-direction: column;
    height: 100%;

    .search-result-content {
      flex: auto;
    }
  }  
`

const MobileSearchPopupClose = styled.div`
  cursor: pointer;
  width: 35px;
  height: 35px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #262A35;
  color: #B4BBC7;
  border-radius: 50%;
`;

const MobileSearchTitle = styled.h1`
  color: #FFFFFF;
  font-size: 28px;
  margin: 0;
  line-height: 1.5;
`

const MobileSearchbar: FC<RenderProps> = (renderProps: RenderProps) => {
  const dispatch = useDispatch();
  const { customWrapper } = renderProps;
  const { isSelecting, isLoading, viewResult } = useSelector((state: RootStateOrAny) => state);

  const searchTitle = "Find what you want";

  const closeResultPanel = () => {
    dispatch(stopSelecting());
    dispatch(setViewResult(false));
  };

  return (
    <MobileSearchWrapper>
      <MobileSearchInput />
      {isSelecting && (
        <MobileSearchPopup styleOverrides={customWrapper}>          
          <MobileSearchPopupInner styleOverrides={customWrapper}>
            <MobileSearchPopupHeader>
              <MobileSearchPopupClose onClick={closeResultPanel}>
                <UnCheckedIcon width={16} height={16} />
              </MobileSearchPopupClose>
            </MobileSearchPopupHeader>

            <MobileSearchPopupBody>
              <MobileSearchTitle>{searchTitle}</MobileSearchTitle>
              <MobileSearchInput searchable={true} resetable={true} />
              <SearchFilters />
              {viewResult && <SearchResult loading={isLoading} />}
            </MobileSearchPopupBody>
          </MobileSearchPopupInner>          
        </MobileSearchPopup>
      )}      
    </MobileSearchWrapper>
  )

  
};

export default MobileSearchbar;