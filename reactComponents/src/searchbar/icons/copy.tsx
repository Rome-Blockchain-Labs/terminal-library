import React, { FC } from 'react';
import SVGIcon from './abstract';

import { IIconProps } from '.';

const CopyIcon: FC<IIconProps> = ({ height, width }) => (
  <SVGIcon 
    height={height ?? 24}
    width={width ?? 24}
    viewBox={`0 0 24 24`}>
    <g transform='translate(0)' fill="#B7BEC9">
      <path d="M0 0h24v24H0z" fill="none"/>
      <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z" />
    </g>
  </SVGIcon>    
)

export default CopyIcon;
