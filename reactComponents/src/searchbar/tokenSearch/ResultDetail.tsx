
import React, { useContext, FC } from 'react';
import styled from 'styled-components'
import DefaultIcon from '../icons/default';
import { Logo } from './Logo';
import { firstAndLast } from './helpers/firstAndLast';
import { intToWords } from './helpers/intToWords';
import TokenSearchContext from '../Context/TokenSearch';

import DownIcon from '../icons/down';
import UpIcon from '../icons/up';
const imageSize = 26;

const StyledDetailList = styled.div`  
  ${({styles}) => `
    display: ${ styles?.container?.display || "grid" };
    grid-gap: 5px;
    align-items: ${ styles?.container?.alignItems || "center" };    
    justify-content: space-between;
    padding: ${ styles?.container?.padding || "5px 0" };    
    background: ${ styles?.container?.background || "#00070E" };
    border-bottom: ${ styles?.container?.borderbottom || "1px solid #474F5C" };    
    grid-template-columns: ${styles?.container?.gridTemplateColumn || "18% 1% 18% 5% 6% 37% 10%"}; 

    & .token {
      display: inherit;
      align-items: center;
      grid-template-columns: 20px 100px; 
      color: ${ styles?.token?.background || "#B4BBC7" };
      font-size: ${ styles?.token?.fontSize || "12px" };
      font-weight: ${ styles?.token?.fontWeight || "600" };      
      padding: 0 13px;
      
      > span {
        padding-left: 5px;
      }
    }

    & .logo {
      padding: 0;
      justify-self: center;
    }

    & .pair {
      color: ${ styles?.pair?.color || "#B4BBC7" };
      font-size: ${ styles?.pair?.fontSize || "8px" };

      & .count {
        display: flex;
      }
    }

    & .detail {
      padding: ${ styles?.detail?.padding || "3px" };
    }
    
    > button {      
      display: flex;
      align-items: center;
      justify-content: center;

      border-color: ${ styles?.button?.borderColor || "#474F5C" };      
      background-color: ${ styles?.button?.backgroundColor || "#474F5C" };      
      color: ${ styles?.button?.color || "#7A808A" };      
      border-radius: ${ styles?.button?.borderRadius || "4px" };      
      font-size: ${ styles?.button?.fontSize || "10px" };
      border-width: 0;      
      cursor: pointer;
      padding: ${ styles?.button?.padding || "3px" };

      &:hover {
        background-color: ${ styles?.button?.hoverBackColor || "#232C38" };      
      }    

      & .icon {
        padding-top: 3px;
        padding-left: 3px;
      }
    }
  `}    
`;

const StyledDetailContent = styled.div`
  ${({styles}) => `
    display: ${ styles?.content?.display || "block" };    
    align-items: ${ styles?.content?.alignItems || "center" };    
    padding: ${ styles?.content?.padding || "5px 13px" };    
    margin: ${ styles?.content?.margin || "5px 0" };    
    background: ${ styles?.content?.background || "#474F5C" };
    border-bottom: ${ styles?.content?.borderbottom || "1px solid #474F5C" };    
    border-radius: ${ styles?.content?.borderRadius || "4px" };      
    transition: all 1500ms ease;

    & .details {
      display: grid;
      padding: 7px 0;
      font-size: ${ styles?.content?.address?.fontSize || "10px" };

      grid-template-columns: ${styles?.content?.gridTemplateColumn || "52% 48% 1%"}; 

      & .token {
        display: grid;
        gap: 5px;
        grid-template-columns: 20px;

        & .name {
          align-self: center;          
          font-size: ${ styles?.content?.token?.fontSize || "12px" };
          font-weight: ${ styles?.content?.token?.fontWeight || "600" };
          padding-left: 5px;
        }
    
        & .address {
          align-self: center;
          display: flex;
          grid-row: 2;
          grid-column: 2;
          color: #B4BBC7;
          font-size: ${ styles?.content?.address?.fontSize || "10px" };
          padding-bottom: 10px;
          padding-left: 5px;

          > strong {
            color: white;
            padding-left: 7px;
          }
        }
      } 

      & .left {
        & .detail {
          display: grid;
          grid-template-columns: 85px 150px;
          padding-left: 0;
        }
      }
      
      & .detail {
        color: #B4BBC7;
        font-size: ${ styles?.content?.detail?.fontSize || "10px" };
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
          padding-bottom: 8px;
          color: #B4BBC7;
        }

        & .actions {
          padding: 10px 0;

          display: flex;
  
          > div {
            padding-right: 10px;
          }
        }
  
        & .info {
          display: grid;
          grid-template-columns: 50% 50%;
          padding: 1px 0;

          & .detail {
            display: flex;
            padding-right: 5px;
            align-items: center;

            & .logo {
              padding: 0 10px;
              margin-top: 2px;
            }
          }
        }
      }     
    } 
  `}
`

const StyledAction = styled.div`
  cursor: pointer;
  padding: 10;
`
const Action = (props) => {
  const { component, detail } = props
  const Component = component
  return (
    <StyledAction>
      <Component detail={detail}/>
    </StyledAction>
  )    
}

export type DetailType = {
  index: number;
  suggestions: object;
  handleDetail: any;
  currentIndex : number;
}

export const ResultDetail: FC<DetailType> = (props: DetailType) => {
  const { index, suggestions, handleDetail, currentIndex } = props;
  const renderProps = useContext(TokenSearchContext);  
  const { customActions } = renderProps;

  const selectedPair = suggestions[index];
  
  const tokenImage = (token) => {
    if (token?.image) 
    return (
      <img
      alt={token?.symbol}
      src={token?.image}
      style={{ borderRadius: '50%' }}
      width={imageSize}
    />)
    else
      return <DefaultIcon />
  }    

  return (
    <>     
    { currentIndex !== index && 
      <StyledDetailList>              
      <div className='token'>
        {tokenImage(selectedPair.token0)} <span>{selectedPair.token0.name}</span>
      </div>    
      /  
      <div className='token'>
        {tokenImage(selectedPair.token1)} <span>{selectedPair.token1.name}</span>
      </div>     
      <div className='logo'>
        <Logo label={selectedPair.network} />
      </div>
      <div className='logo'>
        <Logo label={selectedPair.exchange} />
      </div>
      <div className='pair'>
        <div className='detail'>
          Pair: <strong>{firstAndLast(selectedPair.id)}</strong>
        </div>
        <div className='count'>
          <div className='detail'>
            Volume: <strong>{intToWords(selectedPair.volumeUSD)}</strong>
          </div>
          <div className='detail'>
            Holders: <strong><i>[Coming Soon]</i></strong>
          </div>
        </div>
      </div>
      <button onClick={() => handleDetail(currentIndex === index ? null : index)}>
        Details 
        <div className='icon'>
          <DownIcon width={12} height={12} />
        </div>
      </button>
      </StyledDetailList>
    }
    {
      currentIndex === index && 
      <StyledDetailContent>
        <div className='details'>
          <div className='left'>
            <div className='token'>
              {tokenImage(selectedPair.token0)} 
              <span className='name'>{selectedPair.token0.name}</span>
              <span className='address'>Address: <strong>{firstAndLast(selectedPair.token0.address)}</strong></span>
            </div>
            <div className='token'>
              {tokenImage(selectedPair.token1)} 
              <span className='name'>{selectedPair.token1.name}</span>
              <span className='address'>Address: <strong>{firstAndLast(selectedPair.token1.address)}</strong></span>
            </div>
            <div className='detail'>
              Pair Address: <strong>{firstAndLast(selectedPair.id)}</strong>
            </div>
          </div>
          <div className='right'>
            <div className='widgets'>
              <span>Add a Widget:</span>
              <div className='actions'>
                {
                  customActions && customActions.map((action) => <Action key={`action-${action.index}`} component={action.component} detail={selectedPair}></Action>)
                }
              </div>
            </div>
            <div className='info'>
              <div className='detail'>
                Volume : <strong>{intToWords(selectedPair.volumeUSD)}</strong>
              </div>
              <div className='detail'>
                Network: 
                <div className='logo'>
                  <Logo label={selectedPair.network} />
                </div>
                <strong>{selectedPair.network}</strong>
              </div>
            </div>
            <div className='info'>
              <div className='detail'>
                Holders: <strong><i>[Coming Soon]</i></strong>
              </div>
              <div className='detail'>
                Exchange: 
                <div className='logo'>
                  <Logo label={selectedPair.exchange} />
                </div>
                <strong>{selectedPair.exchange}</strong>
              </div>
            </div>
          </div>          
          <div className='up' onClick={() => handleDetail(currentIndex === index ? null : index)}>
            <UpIcon height={12} width={12} />
          </div>
        </div>        
      </StyledDetailContent>
    }
    </>
  );
}
export default ResultDetail