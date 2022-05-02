import React, { FC, memo } from 'react';
import SVGIcon from './abstract';

import { IIconProps } from '.';

const ResetIcon: FC<IIconProps> = ({ height, width }) => (
  <SVGIcon 
  height={height ?? 9}
  width={width ?? 9}
  viewBox="0 0 9 9">
    <g transform='translate(0)'>
      <path d="M1 4.05747C1.25047 2.1328 3.01695 0.779376 4.94163 1.02985C6.8663 1.28032 8.22412 3.0468 7.96925 4.97147C7.71878 6.89615 5.9523 8.25397 4.02763 7.9991C2.76648 7.83212 1.68989 6.99722 1.21971 5.81517M1 8.01228V5.81517H3.19712" stroke="#B4BBC7" strokeLinecap="round" strokeLinejoin="round"/>
    </g>  
  </SVGIcon> 
)

export default memo(ResetIcon);
