
import React, { useContext } from 'react';
import styled from 'styled-components'
 
import {
  Accordion,
  AccordionItem,
  AccordionItemHeading,
  AccordionItemButton,
  AccordionItemPanel,
} from 'react-accessible-accordion';
import { firstAndLast, capitalizeFirstLetter } from './helpers/firstAndLast';
import { intToWords } from './helpers/intToWords';
import TokenSearchContext from '../Context/TokenSearch';
const imageSize = 26;

const DetailWrapper = styled.div`
  .accordion__button: hover {
    cursor: pointer;
  }
`;

const StyledHeader = styled.div`
  display: grid;
  grid-auto-flow: column;
  gap: 10px;
  padding: ${ props => props?.styles?.padding || "10px" };
  color: ${ props => props?.styles?.color || "black" };
  background: ${ props => props?.styles?.background || "green" };
  '&:hover': {

  }
`
const StyeldPanel = styled.div`
  display: grid;
  grid-auto-flow: column;
  gap: 10px;
  padding: ${ props => props?.styles?.padding || "10px" };
  color: ${ props => props?.styles?.color || "black" };
  background: ${ props => props?.styles?.background || "white" };  
`

const StyledActionWrapper = styled.div`
  display: flex;  
  margin-top: 10px;  
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
export const TokenPairDetail = (props) => {
  const { index, suggestions } = props;
  const renderProps = useContext(TokenSearchContext);  
  const { customTokenDetail, customActions } = renderProps;

  const selectedPair = suggestions[index];
   const tokenImage = (token) => {
    return token?.image && (
      <img
      alt={token?.symbol}
      src={token?.image}
      style={{ borderRadius: '50%' }}
      width={imageSize}
    />
    )
  } 
  return (
  <DetailWrapper>
    <Accordion allowZeroExpanded>
      <AccordionItem key={selectedPair.id}>
        <AccordionItemHeading>
          <AccordionItemButton>
            <StyledHeader styles={customTokenDetail?.styles?.header}>
              <div>
                <div>{selectedPair.network.toUpperCase()} - {capitalizeFirstLetter(selectedPair.exchange)} - </div>
                <div>Volume: {intToWords(selectedPair.volumeUSD)}</div>
              </div>
              <div>
                {tokenImage(selectedPair.token0)}{selectedPair.token0.name} - 
                {tokenImage(selectedPair.token1)}{selectedPair.token1.name}
              </div>
            </StyledHeader>
          </AccordionItemButton>
        </AccordionItemHeading>
        <AccordionItemPanel>          
          <StyeldPanel styles={customTokenDetail?.styles?.panel}>
            <div>
              <div><b>Pair Address:</b> {selectedPair.id}</div>
              <div><b>{tokenImage(selectedPair.token0)} token0 address: </b>{firstAndLast(selectedPair.token0.address)}</div>
              <div><b>{tokenImage(selectedPair.token1)} token1 address: </b>{firstAndLast(selectedPair.token1.address)}</div>
            </div>
            <div>
              <div><b>{selectedPair.network.toUpperCase()}</b></div>
              <div><b>{capitalizeFirstLetter(selectedPair.exchange)}</b></div>
              <StyledActionWrapper>
                {
                  customActions.map((action) => <Action key={`action-${action.index}`} component={action.component} detail={selectedPair}></Action>)
                }
              </StyledActionWrapper>
            </div>            
          </StyeldPanel>          
        </AccordionItemPanel>        
      </AccordionItem>
    </Accordion>
    </DetailWrapper>
  );
}
export default TokenPairDetail