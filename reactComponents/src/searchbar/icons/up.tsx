import React, { FC, memo } from 'react';
import SVGIcon from './abstract';

import { IIconProps } from '.';

const UpIcon: FC<IIconProps> = ({ height, width }) => (
  <SVGIcon 
    height={height ?? 7}
    width={width ?? 4}
    viewBox="0 0 7 4">
    <g transform='translate(0)'>
      <path d="M6 3.5L3.50551 1L1 3.5" stroke="#7A808A" strokeLinecap="round" transform="translate(0)"/>              
    </g>
  </SVGIcon>    
)


export default memo(UpIcon);