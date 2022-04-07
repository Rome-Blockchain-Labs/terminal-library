
import React from "react"
import 'twin.macro';
import 'styled-components/macro'
 
import {
  Accordion,
  AccordionItem,
  AccordionItemHeading,
  AccordionItemButton,
  AccordionItemPanel,
} from 'react-accessible-accordion';
import { firstAndLast, capitalizeFirstLetter } from './helpers/firstAndLast';
import { intToWords } from './helpers/intToWords';
const imageSize = 26;

export const TokenPairDetail = (props) => {
  const { index, suggestions } = props;
    
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
    <Accordion allowZeroExpanded>
      <AccordionItem key={selectedPair.id}>
        <AccordionItemHeading>
          <AccordionItemButton tw="cursor-pointer">
            <div tw="grid grid-flow-col hover:border-dotted p-4 gap-4">
              <div tw="row-span-2 text-gray-900">
                <div>{selectedPair.network.toUpperCase()} - {capitalizeFirstLetter(selectedPair.exchange)} - </div>
                <div tw="text-[12px]">Volume: {intToWords(selectedPair.volumeUSD)}</div>
              </div>
              <div tw="row-span-1 pl-2 font-bold">
                {tokenImage(selectedPair.token0)}{selectedPair.token0.name} - 
                {tokenImage(selectedPair.token1)}{selectedPair.token1.name}
              </div>
            </div>
          </AccordionItemButton>
        </AccordionItemHeading>
        <AccordionItemPanel>          
          <div tw="grid grid-rows-3 grid-flow-col gap-4 m-4">
            <div tw="row-span-3">
              <div><span tw="font-bold">Pair Address:</span> {selectedPair.id}</div>
              <div><span tw="font-bold">{tokenImage(selectedPair.token0)} token0 address: </span>{firstAndLast(selectedPair.token0.address)}</div>
              <div><span tw="font-bold">{tokenImage(selectedPair.token1)} token1 address: </span>{firstAndLast(selectedPair.token1.address)}</div>
            </div>
            <div tw="row-span-2">
              <div tw="font-bold">{selectedPair.network.toUpperCase()}</div>
              <div tw="font-bold">{capitalizeFirstLetter(selectedPair.exchange)} </div>
            </div>            
          </div>
          
        </AccordionItemPanel>        
      </AccordionItem>
    </Accordion>
  );
}
export default TokenPairDetail