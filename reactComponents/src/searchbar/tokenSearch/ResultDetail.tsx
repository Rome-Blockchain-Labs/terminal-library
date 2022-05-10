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
    background: ${styleOverrides?.container?.background || '#00070E'};
    border-bottom: ${styleOverrides?.container?.borderbottom || '1px solid #474F5C'};    
    grid-template-columns: ${styleOverrides?.container?.gridTemplateColumns || '15% 1% 18% 4% 4% 35% 10%'}; 
    cursor: pointer; 
    & .token {
      display: inherit;
      align-items: center;
      grid-template-columns: 16px 100px; 
      color: ${styleOverrides?.token?.color || '#B4BBC7'};
      font-size: ${styleOverrides?.token?.fontSize || '8px'};
      font-weight: ${styleOverrides?.token?.fontWeight || '600'};      
      padding: ${styleOverrides?.token?.padding || '0 5px'};      
      
      > span {
        padding-left: 5px;
      }
    }

    & .logo {
      padding: 0;
      justify-self: center;
    }

    & .pair {
      color: ${styleOverrides?.pair?.color || '#B4BBC7'};
      font-size: ${styleOverrides?.pair?.fontSize || '7px'};

      & .count {
        display: flex;
      }
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
      font-size: ${styleOverrides?.button?.fontSize || '7px'};
      border-width: 0;      
      cursor: pointer;
      padding: ${styleOverrides?.button?.padding || '3px'};
      width: ${styleOverrides?.button?.width || 'auto'};

      &:hover {
        background-color: ${styleOverrides?.button?.hoverBackColor || '#232C38'};      
      }    
    }
    &:hover {
      color: rgb(193,255,0);;
      .token, .pair, button {
        color: rgb(193,255,0);
      }
    }
  `}
`;

const StyledDetailContent = styled.div`
  ${({ styleOverrides }) => `
    display: ${styleOverrides?.content?.display || 'block'};    
    align-items: ${styleOverrides?.content?.alignItems || 'center'};    
    padding: ${styleOverrides?.content?.padding || '5px'};    
    margin: ${styleOverrides?.content?.margin || '5px 0'};    
    background: ${styleOverrides?.content?.background || '#474F5C'};
    border-bottom: ${styleOverrides?.content?.borderbottom || '1px solid #474F5C'};    
    border-radius: ${styleOverrides?.content?.borderRadius || '4px'};      
    transition: all 1500ms ease;

    & .details {
      display: grid;
      padding: 3px 0;
      font-size: ${styleOverrides?.content?.fontSize || '7px'};

      grid-template-columns: ${styleOverrides?.content?.gridTemplateColumns || '53% 45% 2%'}; 

      & .token {
        display: grid;        
        grid-template-columns: 20px;
        > span {
          padding-left: 5px
        }
        
        & .name {
          align-self: center;          
          font-size: ${styleOverrides?.token?.fontSize || '8px'};
          font-weight: ${styleOverrides?.token?.fontWeight || '600'};          
        }
    
        & .address {
          align-self: center;
          display: flex;
          grid-row: 2;
          grid-column: 2;
          color: #B4BBC7;
          font-size: ${styleOverrides?.address?.fontSize || '7px'};
          padding-bottom: 5px;
          
          > strong {
            color: white;
            padding-left: 5px;
          }
        }
      } 

      & .left {
        & .pair {          
          padding-left: 5px;
        }
      }
      
      & .detail {
        color: #B4BBC7;
        grid-template-columns: 40px 30px 50px;
        display: grid;

        font-size: ${styleOverrides?.content?.detail?.fontSize || '7px'};
        > strong {
          color: white;
        }
      }
      & .up {
        justify-self: flex-end;
        cursor: pointer;
      }

      & .right {
        padding-top: 10px;        

        & .widgets {          
          color: #B4BBC7;
        }

        & .actions {
          padding: 5px 0;

          display: flex;
  
          > div {
            padding-right: 5px;
          }
        }
  
        & .info {
          display: grid;
          grid-template-columns: 40% 55%;          

          & .detail {           
            padding-right: 5px;
            align-items: center;
            grid-template-columns: 40px 30px 50px;
            display: grid;
            
            & .logo {
              padding: 0 10px;
              margin-top: 2px;
            }
          }
        }
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
    <>
      {currentIndex !== index && (
        <StyledDetailList
          styleOverrides={customTokenDetail?.list}
          onClick={() => handleDetail(currentIndex === index ? null : index)}>
          <div className="token">
            {tokenImage(selectedPair.token0)} <span>{selectedPair.token0.name}</span>
          </div>
          /
          <div className="token">
            {tokenImage(selectedPair.token1)} <span>{selectedPair.token1.name}</span>
          </div>
          <div className="logo">
            {logoIcons[selectedPair.network] ?? <Logo label={selectedPair.network} width={12} height={12} />}
          </div>
          <div className="logo">
            {logoIcons[selectedPair.exchange] ?? <Logo label={selectedPair.exchange} width={12} height={12} />}
          </div>
          <div className="pair">
            <div className="detail">
              Pair: <strong>{firstAndLast(selectedPair.id)}</strong>
            </div>
            <div className="count">
              <div className="detail">
                Volume: <strong>{intToWords(selectedPair.volumeUSD)}</strong>
              </div>
            </div>
          </div>
          <button onClick={() => handleDetail(currentIndex === index ? null : index)}>
            <span>Details </span>
            <DownIcon width={7} height={7} />
          </button>
        </StyledDetailList>
      )}
      {currentIndex === index && (
        <StyledDetailContent styleOverrides={customTokenDetail?.details}>
          <div className="details">
            <div className="left">
              <div className="token">
                {tokenImage(selectedPair.token0)}
                <span className="name">{selectedPair.token0.name}</span>
                <span className="address">
                  Address: <strong>{firstAndLast(selectedPair.token0.address)}</strong>
                </span>
              </div>
              <div className="token">
                {tokenImage(selectedPair.token1)}
                <span className="name">{selectedPair.token1.name}</span>
                <span className="address">
                  Address: <strong>{firstAndLast(selectedPair.token1.address)}</strong>
                </span>
              </div>
              <div className="pair">
                <span>Pair Address: </span>
                <strong>{firstAndLast(selectedPair.id)}</strong>
              </div>
            </div>
            <div className="right">
              <div className="widgets">
                <span>Add a Widget:</span>
                <div className="actions">
                  {customActions &&
                    customActions.map((action) => (
                      <Action
                        key={`action-${action.index}`}
                        component={action.component}
                        detail={selectedPair}></Action>
                    ))}
                </div>
              </div>
              <div className="info">
                <div className="detail">
                  <span>Volume :</span> <strong>{intToWords(selectedPair.volumeUSD)}</strong>
                </div>
                <div className="detail">
                  <span>Network: </span>
                  <div className="logo">
                    {logoIcons[selectedPair.network] ?? <Logo label={selectedPair.network} width={10} height={10} />}
                  </div>
                  <strong>{selectedPair.network}</strong>
                </div>
              </div>
              <div className="info">
                <div className="detail"></div>
                <div className="detail">
                  <span>Exchange: </span>
                  <div className="logo">
                    {logoIcons[selectedPair.exchange] ?? <Logo label={selectedPair.exchange} width={10} height={10} />}
                  </div>
                  <strong>{selectedPair.exchange}</strong>
                </div>
              </div>
            </div>
            <div className="up" onClick={() => handleDetail(currentIndex === index ? null : index)}>
              <UpIcon height={7} width={7} />
            </div>
          </div>
        </StyledDetailContent>
      )}
    </>
  );
};
export default ResultDetail;
