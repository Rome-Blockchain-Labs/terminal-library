import React, { FC } from 'react';
import SVGIcon from './abstract';

import { IIconProps } from '.';

const SearchIcon: FC<IIconProps> = ({ height, width }) => (
  <SVGIcon 
    height={height ?? 18}
    width={width ?? 18}
    viewBox="0 0 18 18">
    <g transform='translate(0)'>
      <circle cx="7.4" cy="7.4" r="6.4" stroke="#7A808A" />
        <path
          d="M7.39995 4.20001C6.97972 4.20001 6.56361 4.28278 6.17536 4.4436C5.78712 4.60441 5.43436 4.84012 5.13721 5.13727C4.84006 5.43442 4.60435 5.78718 4.44354 6.17543C4.28272 6.56367 4.19995 6.97978 4.19995 7.40001"
          data-name="Search icon"
          id="Search_icon"     
          stroke="#7A808A"   
        />
        <path d="M17 17L13.8 13.8" stroke="#7A808A" />
    </g>
  </SVGIcon>
)

export default SearchIcon