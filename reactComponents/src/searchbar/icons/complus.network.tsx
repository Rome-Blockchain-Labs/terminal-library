import React, { FC, memo } from 'react';
import SVGIcon from './abstract';

import { IIconProps } from '.';

const ComplusNetworkIcon: FC<IIconProps> = ({ height, width }) => (
  <SVGIcon 
    height={height ?? 16}
    width={width ?? 16}
    viewBox="0 0 400 400">
    
    <g transform='translate(0)'>
      <polygon fill="#BB263B" points="312.6,13.1 87.4,13.1 87.4,160.6 161.8,160.6 161.8,86.8 238.2,86.8 238.2,160.6 312.6,160.6 "/>
      <polygon fill="#BB263B" points="87.4,386.9 312.6,386.9 312.6,239.4 238.2,239.4 238.2,313.2 161.8,313.2 161.8,239.4 87.4,239.4 "/>      
    </g>
  </SVGIcon>    
)

export default memo(ComplusNetworkIcon);
