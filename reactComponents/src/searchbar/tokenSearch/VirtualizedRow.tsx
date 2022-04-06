import React from 'react';
import { useDispatch } from 'react-redux';
import { Col, Row } from 'reactstrap';
import styled from 'styled-components';

import { setPair } from '../redux/tokenSearchSlice';
import { firstAndLast } from './helpers/firstAndLast';
import { intToWords } from './helpers/intToWords';

const imageSize = 26;

const NumberFont = styled.span`
  font-family: 'Fira Code', monospace;
  color: white;
`;

const Ellipsis = styled.div`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 250px;
`;
const MiniEllipsis = styled.div`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 85px;
  display: inline-block;
  vertical-align: middle;
`;

const MainRow = styled.div`
  border-bottom: 1px dotted #15b3b0;
  border-radius: 0;
  :hover {
    background-color: #1c646c;
  }
`;

const NoMarginCol = styled(Col)`
  margin: auto;
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
            <img
              alt={''}
              src={selectedPair.token1.image}
              style={{ borderRadius: '50%' }}
              width={imageSize}
            />{' '}
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
        <Row style={{ height: '100%' }}>
          <NoMarginCol>
            <span style={{ fontWeight: 'bold', marginRight: '15px' }}>
              <img
                alt={''}
                src={selectedPair.token0.image}
                style={{ borderRadius: '50%' }}
                width={imageSize}
              />{' '}
              <MiniEllipsis>{selectedPair.token0.symbol} /</MiniEllipsis>{' '}
              <img
                alt={''}
                src={selectedPair.token1.image}
                style={{ borderRadius: '50%' }}
                width={imageSize}
              />{' '}
              <MiniEllipsis>{selectedPair.token1.symbol}</MiniEllipsis>
            </span>
          </NoMarginCol>
          <NoMarginCol>
            <Ellipsis>
              Pair volume:
              <NumberFont style={{ float: 'right' }}>
                {intToWords(selectedPair.volumeUSD)}
              </NumberFont>
            </Ellipsis>
            <Ellipsis>
              Pair:{' '}
              <NumberFont style={{ float: 'right' }}>
                {truncatedPair}
              </NumberFont>
            </Ellipsis>
          </NoMarginCol>
          <NoMarginCol>
            <Ellipsis>
              First token:{' '}
              <NumberFont style={{ float: 'right' }}>
                {truncatedToken0}
              </NumberFont>
            </Ellipsis>
            <Ellipsis>
              Second token:{' '}
              <NumberFont style={{ float: 'right' }}>
                {truncatedToken1}
              </NumberFont>
            </Ellipsis>
          </NoMarginCol>
        </Row>
      </MainRow>
    </div>
  );
};
export default VirtualizedRow;
