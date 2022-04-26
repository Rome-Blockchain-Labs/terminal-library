import React, { FC, memo } from 'react';
import { IIconProps } from '.';

const ComplusNetworkIcon: FC<IIconProps> = memo(
  ({ active, activeColor, color, height, width }) => (
    <svg
      height={height ?? 16}
      width={width ?? 16}
      viewBox="0 0 400 400"        
      fill="none"
    >      
    <g transform='translate(0)'>
      <polygon fill="#BB263B" points="312.6,13.1 87.4,13.1 87.4,160.6 161.8,160.6 161.8,86.8 238.2,86.8 238.2,160.6 312.6,160.6 "/>
      <polygon fill="#BB263B" points="87.4,386.9 312.6,386.9 312.6,239.4 238.2,239.4 238.2,313.2 161.8,313.2 161.8,239.4 87.4,239.4 "/>
    </g>    
    </svg>
  )
);

export default ComplusNetworkIcon;