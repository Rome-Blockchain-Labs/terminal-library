import React, { useContext, FC } from 'react';
import styled from 'styled-components';
import DefaultIcon from '../icons/default';
import { Logo } from './Logo';
import { firstAndLast } from './helpers/firstAndLast';
import { intToWords } from './helpers/intToWords';
import TokenSearchContext from '../Context/TokenSearch';

import DownIcon from '../icons/down';
import UpIcon from '../icons/up';
import { ActionType, DetailType } from './types';
const imageSize = 26;

const StyledDetailList = styled.div`
  ${({ styleOverrides }) => `
    display: ${styleOverrides?.container?.display || 'grid'};
    grid-gap: 5px;
    align-items: ${styleOverrides?.container?.alignItems || 'center'};    
    justify-content: space-between;
    padding: ${styleOverrides?.container?.padding || '5px 0'};    
    background: transparent;
    border-bottom: ${styleOverrides?.container?.borderbottom || '1px solid #474F5C'};    
    grid-template-columns: ${styleOverrides?.container?.gridTemplateColumns || '19% 1% 19% 10% 10% 23% 14%'}; 
    
    border-radius: ${styleOverrides?.button?.borderRadius || '4px'};
    position: relative;
    font-size: ${styleOverrides?.token?.fontSize || '10px'};
    color: ${styleOverrides?.token?.color || '#B4BBC7'};

    .token {      
      grid-template-columns: 16px 100px; 
      padding: ${styleOverrides?.token?.padding || '0 5px'};  
      .address {
        position: relative;
        padding-left: 5px;
        > span {
          display: none;
          font-size: 8px;
          margin-top: 5px;
          span {
            color: ${styleOverrides?.token?.color || '#B4BBC7'};
          }
        }
      } 
    }

    &.active {
      background: #474F5C;
      color: white;
      padding: 24px 0;
      grid-template-columns: 19% 1% 19% 10% 10% 38% 0%;
      .token {
        font-weight: ${styleOverrides?.token?.fontWeight || '600'};      
        .address {
          font-size: 12px;
          > span {
            display: block;
          }
        }
        svg {
          width: 26px;
          height: 26px;
          margin-top: -10px;
        }
      }
    }
    .capitalize {
      text-transform: capitalize;
    }
    .text-white {
      color: white;
    }
    .icon-label {
      display: flex;   
      align-items: center;
      > span {
        padding-left: 5px;
        display: block;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;  
        flex: 1;
      }
    }
    .text-line-1 {
      display: block;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;  
      flex: 1;
    }
    .flex-center {
      display: flex;
      align-items: center;
    }  
    .flex-1 {
       flex: 1;
    }
    .gap-5 {
      gap: 20px;
    }
    .gap-2 {
      gap: 8px;
    }
    & .detail {
      padding: ${styleOverrides?.detail?.padding || '3px'};
    }
    
    > button {      
      display: flex;
      align-items: center;
      justify-content: center;
      justify-self: right;
      border-color: ${styleOverrides?.button?.borderColor || '#474F5C'};      
      background-color: ${styleOverrides?.button?.backgroundColor || '#474F5C'};      
      color: ${styleOverrides?.button?.color || '#7A808A'};      
      border-radius: ${styleOverrides?.button?.borderRadius || '4px'};     
      
      border-width: 0;      
      cursor: pointer;
      padding: ${styleOverrides?.button?.padding || '6px 8px !important'};
      width: ${styleOverrides?.button?.width || 'auto'};
      &.down {
        position: absolute;
        top: 0;
        right: 0;
        background: transparent;
      }
      &:hover {
        background-color: ${styleOverrides?.button?.hoverBackColor || '#232C38'};      
      }    
    }
    .actions {
      display: flex;
      flex: 1;
      gap: 12px;
      justify-content: center;
      align-items: center;
      flex-wrap: wrap;
    }
    &:not(.active):hover {
      cursor: pointer; 
      color: rgb(193,255,0);
      .token, .pair, button, strong {
        color: rgb(193,255,0);
      }      
    }
  `}
`;

const StyledAction = styled.div`
  cursor: pointer;
  padding: 10;
`;

const Action = (props: ActionType) => {
  const { component, detail } = props;
  const Component: any = component;
  return (
    <StyledAction>
      <Component detail={detail} />
    </StyledAction>
  );
};

export const ResultDetail: FC<DetailType> = (props: DetailType) => {
  const { index, suggestions, handleDetail, currentIndex, logoIcons } = props;
  const renderProps = useContext(TokenSearchContext);
  const { customActions, customTokenDetail } = renderProps;

  const selectedPair = suggestions[index];

  const tokenImage = (token) => {
    if (token?.image)
      return <img alt={token?.symbol} src={token?.image} style={{ borderRadius: '50%' }} width={imageSize} />;
    else return <DefaultIcon />;
  };

  return (
    <StyledDetailList
      styleOverrides={customTokenDetail?.list}
      onClick={() => (currentIndex !== index ? handleDetail(index) : '')}
      className={currentIndex === index ? 'active' : ''}>
      <div className="token icon-label">
        {tokenImage(selectedPair.token0)}
        <div className="flex-1 address text-line-1">
          <div className="text-line-1">{selectedPair.token0.name}</div>
          <span className="text-line-1">
            <span>Address:</span> <strong>{firstAndLast(selectedPair.token0.address)}</strong>
          </span>
        </div>
      </div>
      /
      <div className="token icon-label">
        {tokenImage(selectedPair.token1)}
        <div className="flex-1 address text-line-1">
          <div>{selectedPair.token1.name}</div>
          <span>
            <span>Address:</span> <strong>{firstAndLast(selectedPair.token1.address)}</strong>
          </span>
        </div>
      </div>
      <div className="logo icon-label">
        {logoIcons[selectedPair.network] ?? <Logo label={selectedPair.network} width={12} height={12} />}
        <span className="capitalize">{selectedPair.network}</span>
      </div>
      <div className="logo icon-label">
        {logoIcons[selectedPair.exchange] ?? <Logo label={selectedPair.exchange} width={12} height={12} />}
        <span className="capitalize">{selectedPair.exchange}</span>
      </div>
      <div className="pair flex-center gap-5">
        <div>
          Volume: <strong className="text-white">{intToWords(selectedPair.volumeUSD)}</strong>
        </div>

        {currentIndex === index && (
          <div className="actions">
            {customActions &&
              customActions.map((action) => (
                <Action
                  key={`action-${action.index}`}
                  component={action.component}
                  detail={selectedPair}></Action>
              ))}
          </div>
        )}
      </div>
      <button
        onClick={() => handleDetail(currentIndex === index ? null : index)}
        className={currentIndex === index ? 'down' : 'up'}>
        {currentIndex !== index ? (
          <>
            <span>Details </span>
            <DownIcon width={7} height={7} />
          </>
        ) : (
          <>
            <span>Close </span>
            <UpIcon height={7} width={7} />
          </>
        )}
      </button>
    </StyledDetailList>
  );
};
export default ResultDetail;
