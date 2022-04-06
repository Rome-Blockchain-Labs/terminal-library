import React from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';

import { setPair } from '../redux/tokenSearchSlice';
import { firstAndLast } from './helpers/firstAndLast';
import { intToWords } from './helpers/intToWords';

const imageSize = 26;

const NumberFont = styled.span`
  font-family: 'Fira Code', monospace;
`;

const Ellipsis = styled.div`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;
const MiniEllipsis = styled.span`
  font-weight: bold;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 85px;
  display: inline-block;
  vertical-align: middle;
  text-transform: uppercase;
  font-size: 1rem;
`;

const MainRow = styled.div`
  border-bottom: 1px dotted #15b3b0;
  border-radius: 0;
  font-size: 9px;
  :hover {
    background-color: #1c646c;
  }
`;

const VirtualizedRow = (props) => {
  const { index, style, suggestions } = props;
  const selectedPair = suggestions[index];
  const dispatch = useDispatch();
  const rowHeight = props.parent.props.rowHeight;

  const onClick = (event) => {
    event.preventDefault();
    if (selectedPair && selectedPair.token0 && selectedPair.token1) {
      dispatch(setPair({ selectedPair }));
    }
  };

  const truncatedPair = firstAndLast(selectedPair.id);
  const truncatedToken0 = firstAndLast(selectedPair.token0.id);
  const truncatedToken1 = firstAndLast(selectedPair.token1.id);

  const mobileMode = !(rowHeight < 120);
  if (mobileMode) {
    return (
      <div style={style} onClick={onClick}>
        <MainRow style={{ textAlign: 'center' }}>
          <span style={{ display: 'inline-block', fontWeight: 'bold' }}>
            <img
              alt={''}
              src={selectedPair.token0.image}
              style={{ borderRadius: '50%' }}
              width={imageSize}
            />{' '}
            <MiniEllipsis>{selectedPair.token0.symbol} /</MiniEllipsis>{' '}
            {selectedPair.token1.image && (
              <img
                alt={''}
                src={selectedPair.token1.image}
                style={{ borderRadius: '50%' }}
                width={imageSize}
              />
            )}{' '}
            <MiniEllipsis>{selectedPair.token1.symbol}</MiniEllipsis>
          </span>
          <br />
          <div>
            Pair volume:
            <NumberFont>{intToWords(selectedPair.volumeUSD)}</NumberFont>
          </div>

          <div>
            Pair: <NumberFont>{truncatedPair}</NumberFont>
          </div>
          <div>
            First token: <NumberFont>{truncatedToken0}</NumberFont>
          </div>
          <div>
            Second token: <NumberFont>{truncatedToken1}</NumberFont>
          </div>
        </MainRow>
      </div>
    );
  }

  return (
    <div style={style} onClick={onClick}>
      <MainRow style={{ height: rowHeight }}>
        <div
          style={{
            display: 'flex',
            gap: '15px',
            height: '100%',
            width: '100%',
          }}
        >
          <div
            style={{
              alignItems: 'center',
              display: 'flex',
              gap: '3px',
              maxWidth: '120px',
              width: '100%',
            }}
          >
            <div style={{ alignItems: 'center', display: 'flex', flex: '1' }}>
              {selectedPair.token1.image && (
                <img
                  alt={selectedPair.token0.symbol}
                  src={selectedPair.token0.image}
                  style={{ borderRadius: '50%' }}
                  width={imageSize}
                />
              )}{' '}
              <MiniEllipsis>{selectedPair.token0.symbol} </MiniEllipsis>
            </div>
            <div style={{ alignItems: 'center', display: 'flex', flex: '1' }}>
              <span>{' / '}</span>
              <span>&nbsp;</span>
              {selectedPair.token1.image && (
                <img
                  alt={selectedPair.token1.symbol}
                  src={selectedPair.token1.image}
                  style={{ borderRadius: '50%' }}
                  width={imageSize}
                />
              )}
              <span>&nbsp;</span>
              <MiniEllipsis>{selectedPair.token1.symbol}</MiniEllipsis>
            </div>
          </div>

          <div
            style={{
              alignItems: 'center',
              display: 'flex',
              flex: 1,
              gap: '10px',
            }}
          >
            <div style={{ whiteSpace: 'nowrap' }}>
              <div>Pair Volume:</div>
              <div>Pair:</div>
            </div>
            <div>
              <Ellipsis>
                <NumberFont>{intToWords(selectedPair.volumeUSD)}</NumberFont>
              </Ellipsis>

              <Ellipsis>
                <NumberFont>{truncatedPair}</NumberFont>
              </Ellipsis>
            </div>
          </div>

          <div style={{ alignItems: 'center', display: 'flex', gap: '10px' }}>
            <div style={{ whiteSpace: 'nowrap' }}>
              <div>First Token:</div>
              <div>Second Token:</div>
            </div>
            <div>
              <div>
                <Ellipsis>
                  <NumberFont>{truncatedToken0}</NumberFont>
                </Ellipsis>
              </div>
              <div>
                <Ellipsis>
                  <NumberFont>{truncatedToken1}</NumberFont>
                </Ellipsis>
              </div>
            </div>
          </div>
        </div>
      </MainRow>
    </div>
  );
};
export default VirtualizedRow;
