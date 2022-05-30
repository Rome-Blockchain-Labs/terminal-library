import React, { FC, useContext, useState } from 'react';
import styled from 'styled-components';
import DefaultIcon from '../icons/default';
import { Logo } from './Logo';
import { firstAndLast } from './helpers/firstAndLast';
import { intToWords } from './helpers/intToWords';
import TokenSearchContext from '../Context/TokenSearch';

import Button from './Button';
import DownIcon from '../icons/down';
import UpIcon from '../icons/up';
import CopyIcon from '../icons/copy';
import { ActionType, DetailType } from './types';
const imageSize = 26;

const StyledGridRow = styled.div`
  display: grid;
  grid-gap: 10px;
  grid-template-columns:
    minmax(420px, 7fr)
    minmax(120px, 2fr)
    minmax(120px, 2fr)
    minmax(180px, 3fr)
    minmax(60px, 240px);
  grid-auto-flow: row;
  grid-auto-rows: auto;

  &.active {
    grid-template-columns:
      minmax(420px, 7fr)
      minmax(120px, 2fr)
      minmax(120px, 2fr)
      minmax(180px, 3fr)
      minmax(240px, 240px);
  }

  &.b-none {
    border: none !important;
  }

  @media (max-width: 768px) {
    &.active {
      grid-template-columns:
        minmax(420px, 7fr)
        minmax(120px, 2fr)
        minmax(120px, 2fr)
        minmax(180px, 3fr)
        minmax(60px, 1fr);
    }   
  }
`;

const StyledDetailList = styled(StyledGridRow)`
  ${({ styleOverrides }) => `
    padding: ${styleOverrides?.container?.padding || '10px 0'};
    background: transparent;
    border-bottom: ${styleOverrides?.container?.borderbottom || '1px solid #474F5C'};    
    grid-auto-flow: row;
    position: relative;
    font-size: ${styleOverrides?.token?.fontSize || '0.75rem'};
    color: ${styleOverrides?.token?.color || '#B4BBC7'};

    & .pair-token-info {
      display: grid;
      grid-template-columns: 190px 20px 190px;
      grid-gap: 10px;
      align-items: center;
    }

    .token {      
      grid-template-columns: 16px 100px; 
      padding: ${styleOverrides?.token?.padding || '0 5px'};  
      .address {
        position: relative;
        padding-left: 5px;
        > span {
          display: none;
          font-size: 0.75rem;
          margin-top: 5px;
          span {
            color: ${styleOverrides?.token?.color || '#B4BBC7'};
          }
        }
      } 
    }   

    &.active {
      background: #474F5C;
      border-radius: ${styleOverrides?.button?.radius || '4px'};
      color: white;
      padding: 24px 0;

      .token {
        font-weight: ${styleOverrides?.token?.fontWeight || '600'};      
        .address {
          font-size: 0.75rem;
          > span {
            display: block;
          }
        }
        > svg {
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
        top: 3px;
        right: 5px;
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
      justify-content: flex-start;
      align-items: center;
      flex-wrap: wrap;
      margin-right: 10px;
    }
    &:not(.active):hover {
      cursor: pointer; 
      color: rgb(193,255,0);
      .token, .pair, button, strong {
        color: rgb(193,255,0);
      }      
    }
  `}

  @media (max-width: 768px) {
    &.active {
      .pair-token-info {
        grid-row: 1 / 3;
      }

      .actions {
        grid-column: 2 / -1;
        justify-content: flex-end;
      }
    } 
  }
`;

const StyledAction = styled.div`
  cursor: pointer;
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

const StyledCopyButton = styled(Button)`
  ${({ styleOverrides }) => `
    .copy-text {
      margin-left: 4px;
      color: ${styleOverrides?.color || '#F52E2E'};
    }
  `}
`

type AddressCopyButtonProps = {
  onClick: () => void;
  isCopied?: boolean;
}

const AddressCopyButton: FC<AddressCopyButtonProps> = ({ onClick, isCopied }) => {
  return (
    <StyledCopyButton onClick={onClick}>
      <CopyIcon width={14} height={14} />
      {isCopied && (
        <span className="copy-text">Copied!</span>  
      )}
    </StyledCopyButton>
  );
}

export const ResultDetail: FC<DetailType> = (props: DetailType) => {
  const { index, suggestions, handleDetail, currentIndex, logoIcons } = props;
  const renderProps = useContext(TokenSearchContext);
  const { customActions, customTokenDetail } = renderProps;  

  const selectedPair = suggestions[index];

  const [isCopiedToken0Address, setIsCopiedToken0Address] = useState(false);
  const [isCopiedToken1Address, setIsCopiedToken1Address] = useState(false);

  const isActive = index === currentIndex;
  const tokenImage = (token) => {
    if (token?.image)
      return <img alt={token?.symbol} src={token?.image} style={{ borderRadius: '50%' }} width={imageSize} />;
    else return <DefaultIcon />;
  };

  const copyAddress = (address, setIsCopiedAdress) => {
    navigator.clipboard.writeText(address);
    
    setIsCopiedAdress(true);
    setTimeout(() => {
      setIsCopiedAdress(false);
  }, 1000)
  }

  return (
    <StyledDetailList
      styleOverrides={customTokenDetail?.list}
      onClick={() => (!isActive && handleDetail(index))}
      className={`${isActive ? 'active' : ''} ${(currentIndex - 1) === index ? 'b-none' : ''}`}>
      <div className="pair-token-info">
        <div className="token icon-label">
          {tokenImage(selectedPair.token0)}
          <div className="flex-1 address text-line-1">
            <div className="text-line-1">{selectedPair.token0.name}</div>
            <div className="flex-center">
              <div className="text-line-1">
                <span>Address:</span> <strong>{firstAndLast(selectedPair.token0.address)}</strong>                         
              </div>
              {isActive && (
                <AddressCopyButton
                  onClick={() => copyAddress(selectedPair.token0.address, setIsCopiedToken0Address)}
                  isCopied={isCopiedToken0Address}
                />
              )}   
            </div>
            
          </div>
        </div>
        <div className="gap-5">/</div>
        <div className="token icon-label">
          {tokenImage(selectedPair.token1)}
          <div className="flex-1 address text-line-1">
            <div className="text-line-1">{selectedPair.token1.name}</div>
            <div className="flex-center">
              <div className="text-line-1">
                <span>Address:</span> <strong>{firstAndLast(selectedPair.token1.address)}</strong>
              </div>
              {isActive && (
                <AddressCopyButton
                  onClick={() => copyAddress(selectedPair.token1.address, setIsCopiedToken1Address)}
                  isCopied={isCopiedToken1Address}
                />
              )}
            </div>
          </div>
        </div>
      </div>      
      <div className="logo icon-label">
        {logoIcons[selectedPair.network] ?? <Logo label={selectedPair.network} width={16} height={16} />}
        <span className="capitalize">{selectedPair.network}</span>
      </div>
      <div className="logo icon-label">
        {logoIcons[selectedPair.exchange] ?? <Logo label={selectedPair.exchange} width={16} height={16} />}
        <span className="capitalize">{selectedPair.exchange}</span>
      </div>
      <div className="flex-center">
        Volume: <strong className="text-white">{intToWords(selectedPair.volumeUSD)}</strong>
      </div>
      <button
        onClick={() => handleDetail(isActive ? -1 : index)}
        className={isActive ? 'down' : 'up'}>
        {isActive ? (
          <>
            <span>Close </span>
            <UpIcon height={10} width={10} />            
          </>
        ) : (
          <>
            <span>Details </span>
            <DownIcon width={10} height={10} />
          </>
        )}
      </button>
      {isActive && (
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
    </StyledDetailList>
  );
};

export { StyledGridRow };
export default ResultDetail;
