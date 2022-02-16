import React, { FC, memo } from 'react'

import { IIconProps, TransitionPath } from '.'

export const GravityDexIcon: FC<IIconProps> = memo(
  ({ active, activeColor, color, height, width }) => (
    <svg
      height={height ? height : '13.725'}
      viewBox="0 0 9.12 13.725"
      width={width ? width : '9.12'}
      xmlns="http://www.w3.org/2000/svg"
    >
      <TransitionPath
        d="M4.976 4.866C2.883 2.059 2.031 1.182 1.076.897a3.582 3.582 0 0 0 .012.919 28.451 28.451 0 0 0 .991 3.177 22.008 22.008 0 0 0 3.683 6A15.928 15.928 0 0 0 7.199 12.4a4.841 4.841 0 0 0 .742.463l.149-.071a12.788 12.788 0 0 0-.147-1.365A17.742 17.742 0 0 0 6.06 6.712c-.324-.6-.327-.6.146-1.192.031.021.075.036.093.066a18.84 18.84 0 0 1 2.415 5.779 5.173 5.173 0 0 1 .035 1.651.665.665 0 0 1-.99.552 5.154 5.154 0 0 1-1.309-.787 17.217 17.217 0 0 1-3.486-4.372 19.565 19.565 0 0 1-2.559-6 5.069 5.069 0 0 1-.1-1.487C.373.176.871-.091 1.552.222a4.539 4.539 0 0 1 .976.61 14.523 14.523 0 0 1 2.707 3.081c.287.405-.187.59-.259.953zM6.264 1.416a1.428 1.428 0 1 1 1.437 1.45 1.427 1.427 0 0 1-1.437-1.45zM7.705.772a.658.658 0 1 0 0 1.315.644.644 0 0 0 .643-.656.655.655 0 0 0-.643-.658zM2.852 12.308a1.426 1.426 0 1 1-1.423-1.453 1.433 1.433 0 0 1 1.423 1.453zm-.769-.019a.658.658 0 0 0-.65-.655.647.647 0 0 0-.66.639.655.655 0 1 0 1.309.016z"
        fill={active ? activeColor : color}
      />
      <TransitionPath
        d="M7.189 3.14 4.201 8.308c-.519-.648-.519-.648-.138-1.307l2.45-4.242zM2.641 10.993l-.654-.39.93-1.614c.534.622.535.622.165 1.26-.141.244-.287.485-.441.744z"
        fill={active ? activeColor : color}
      />
    </svg>
  )
)
