import React, { FC, memo } from 'react';
import SVGIcon from './abstract';

import { IIconProps } from '.';

const DefaultIcon: FC<IIconProps> = ({ height, width }) => (
  <SVGIcon 
    height={height ?? 16}
    width={width ?? 16}
    viewBox="0 0 16 16">
    
    <g transform='translate(0)'>
      <path d="M7.97 15.94C12.3717 15.94 15.94 12.3717 15.94 7.97C15.94 3.56829 12.3717 0 7.97 0C3.56829 0 0 3.56829 0 7.97C0 12.3717 3.56829 15.94 7.97 15.94Z" fill="white"/>      
    </g>
  </SVGIcon>    
)

export default memo(DefaultIcon);
