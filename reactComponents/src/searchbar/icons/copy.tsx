import React, { FC } from 'react';
import SVGIcon from './abstract';

import { IIconProps } from '.';

const CopyIcon: FC<IIconProps> = ({ height, width }) => (
  <SVGIcon 
    height={height ?? 11}
    width={width ?? 16}
    viewBox={`0 0 11 16`}>
    <g transform='translate(0)' fill="#B7BEC9">
      <rect width="8.25" height="12.375" rx="2" transform="matrix(-1 0 0 1 11 2.75)" fill="#B4BBC7"/>
      <path fillRule="evenodd" clipRule="evenodd" d="M6.25 0C7.35457 0 8.25 0.895429 8.25 2V2.0625H4.0625C2.95793 2.0625 2.06251 2.95793 2.06251 4.0625V12.375H2.00001C0.895437 12.375 6.67572e-06 11.4796 6.67572e-06 10.375V2C6.67572e-06 0.895431 0.895436 0 2.00001 0H6.25Z" fill="#B4BBC7"/>
    </g>
  </SVGIcon>    
)

export default CopyIcon;
