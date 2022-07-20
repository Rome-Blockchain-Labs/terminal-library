import React, { FC } from 'react';
import SVGIcon from './abstract';

import { IIconProps } from '.';

const DownIcon: FC<IIconProps> = ({ height, width }) => (
  <SVGIcon 
    height={height ?? 7}
    width={width ?? 5}
    viewBox="0 0 7 5">    
    <g transform='translate(0)'>
      <path d="M1 1L3.49449 3.5L6 1" stroke="#7A808A" strokeLinecap="round" transform="translate(0)"/>                   
    </g>
  </SVGIcon>    
)

export default DownIcon;
