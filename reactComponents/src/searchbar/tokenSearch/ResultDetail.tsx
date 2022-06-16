import React, { FC, useContext } from "react";
import styled from "styled-components";
import { intToWords } from "./helpers/intToWords";
import TokenSearchContext from "../Context/TokenSearch";
import NetworkExchangeIcon from "./NetworkExchangeIcon";
import CopyButton from "./CopyButton";
import TokenIcon from "./TokenIcon";
import Button from "./Button";
import DownIcon from "../icons/down";
import UpIcon from "../icons/up";
import { ActionType, DetailType } from "./types";
import { humanizeNetwork, humanizeExchange } from "./helpers/humanize";

const imageSize = 28;
const StyledGridRow = styled.div`
  display: grid;
  grid-gap: 10px;
  grid-template-columns:
    minmax(100px, 1.66fr)
    minmax(60px, 1fr)
    minmax(60px, 1fr)
    minmax(60px, 1fr);
  grid-auto-flow: row;
  grid-auto-rows: auto;
  align-items: center;
`;

const StyledDetailList = styled(StyledGridRow)`
  ${({ styleOverrides }) => `
    padding: ${styleOverrides?.container?.padding || "10px 0"};
    background: transparent;
    border-bottom: ${
      styleOverrides?.container?.borderbottom || "1px solid #474F5C"
    };    
    grid-auto-flow: row;
    position: relative;
    font-size: ${styleOverrides?.token?.fontSize || "0.75rem"};
    color: ${styleOverrides?.token?.color || "#B4BBC7"};

    .pair-tokens {
      display: grid;
      grid-template-columns: 40px 40px;
      grid-gap: 10px;
      align-items: center;
      justify-content: center;
      padding: 5px;

      .token {      
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        gap: 5px;
      }
    }

    &.active {
      .details{
        grid-column: 1 / -1;
        padding: 0 20px;
        gap: 20px;
        flex-wrap: wrap;
        
        .details-pair-tokens {
          width: 50%;
          max-width: 340px;

          .single-token {
            margin-bottom: 10px;

            .details-token-and-address {
              width: calc(100% - 60px);
            }

            button {
              margin-left: 5px;
            }
          }
        }

        .volumn-label {
          font-size: 0.875rem;
          color: #B4BBC7;
        }
      }      
    } 

    .capitalize {
      text-transform: capitalize;
    }

    .uppercase {
      text-transform: uppercase;
    }

    .text-white {
      color: white;
    }
    .icon-label {
      display: flex;   
      align-items: center;
      justify-content: center;
      flex-wrap: wrap;
      > span {
        padding-left: 5px;
        display: block;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
    .text-line-1 {
      display: block;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;  
      width: 100%;
    }
    .flex-center {
      display: flex;
      align-items: center;
    }    
    & .detail {
      padding: ${styleOverrides?.detail?.padding || "3px"};
    }
    
    > button {      
      justify-self: right;
      margin-right: 10px;
      
      &:hover {
        background-color: ${
          styleOverrides?.button?.hoverBackColor || "#232C38"
        };      
      }    
    }
    .actions {
      flex-shrink: 0;
      flex: auto;
      display: flex;      
      gap: 10px;
      justify-content: flex-start;
      align-items: center;
      flex-wrap: wrap;
    }
    &:not(.active):hover {
      cursor: pointer; 
      color: #C1FF00;
      .token, .pair, button, strong {
        color: #C1FF00;
      }      
    }

    @media(max-width: 475px) {
      .icon-label {
        flex-direction: column;

        > span {
          padding-left: 0;
          width: 100%;
          text-align: center;
        }
      }
    }
  `}
`;

const Action = (props: ActionType) => {
  const { component, detail } = props;
  const Component: any = component;

  return (
    <Component detail={detail} />
  );
};

export const ResultDetail: FC<DetailType> = (props: DetailType) => {
  const { index, suggestions, handleDetail, currentIndex, logoIcons } = props;
  const renderProps = useContext(TokenSearchContext);
  const { customActions, customTokenDetail } = renderProps;

  const selectedPair = suggestions[index];
  const isActive = index === currentIndex;

  return (
    <StyledDetailList
      styleOverrides={customTokenDetail?.list}
      onClick={() => !isActive && handleDetail(index)}
      className={`${isActive ? "active" : ""} ${
        currentIndex - 1 === index ? "b-none" : ""
      }`}
    >
      <div className="pair-tokens">
        <div className="token">
          <TokenIcon network={selectedPair.network} token={selectedPair.token0} size={imageSize} />
          <div className="text-line-1 uppercase">
            {selectedPair.token0.symbol}
          </div>
        </div>
        <div className="token">
          <TokenIcon network={selectedPair.network} token={selectedPair.token1} size={imageSize} />
          <div className="text-line-1 uppercase">
            {selectedPair.token1.symbol}
          </div>
        </div>
      </div>
      <div className="logo icon-label">
        <NetworkExchangeIcon
          icon={logoIcons[selectedPair.network]}
          size={20}
          label={selectedPair.network}
        />
        <span className="capitalize">
          {humanizeNetwork(selectedPair.network)}
        </span>
      </div>
      <div className="logo icon-label">
        <NetworkExchangeIcon
          icon={logoIcons[selectedPair.exchange]}
          size={20}
          label={selectedPair.exchange}
        />
        <span className="capitalize">
          {humanizeExchange(selectedPair.exchange)}
        </span>
      </div>
      <Button
        onClick={() => handleDetail(isActive ? -1 : index)}
        className={isActive ? "down" : "up"}
      >
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
      </Button>
      {isActive && (
        <div className="details flex-center">
          <div className="details-pair-tokens">
            <div className="flex-center single-token">
              <div className="details-token-and-address">
                <div className="capitalize text-line-1 details-token-name">
                  {selectedPair.token0.name} Adress:
                </div>
                <div className="text-line-1">
                  <strong>{selectedPair.token0.address}</strong>
                </div>
              </div>
              <CopyButton toCopy={selectedPair.token0.address} />
            </div>

            <div className="flex-center single-token">
              <div className="details-token-and-address">
                <div className="capitalize text-line-1 details-token-name">
                  {selectedPair.token1.name} Adress:
                </div>
                <div className="text-line-1">
                  <strong>{selectedPair.token1.address}</strong>
                </div>
              </div>
              <CopyButton toCopy={selectedPair.token1.address} />
            </div>
          </div>
          <div className="text-white volumn-label">
            <strong className="uppercase">Volume:</strong>
            <br />
            <span>{intToWords(selectedPair.volumeUSD)}</span>
          </div>
          <div className="actions">
            {customActions &&
              customActions.map((action, index) => (
                <Action
                  key={`action-${index}`}
                  component={action}
                  detail={selectedPair}
                />
              ))}
          </div>
        </div>
      )}
    </StyledDetailList>
  );
};

export { StyledGridRow };
export default ResultDetail;
