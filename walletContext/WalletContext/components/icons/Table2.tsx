import React, { FC, memo } from 'react'

import { IIconProps, SVG, TransitionPath } from '.'

export const Table2Icon: FC<IIconProps> = memo(
  ({ active, activeColor, color, height, width }) => (
    <SVG
      height={height ?? 11.141}
      hoverColor={activeColor}
      viewBox="0 0 11.14 11.141"
      width={width ?? 11.14}
      xmlns="http://www.w3.org/2000/svg"
    >
      <TransitionPath
        d="M474.073,790.086h-7.657a1.744,1.744,0,0,0-1.742,1.742v7.657a1.744,1.744,0,0,0,1.742,1.742h7.657a1.743,1.743,0,0,0,1.741-1.742v-7.657A1.743,1.743,0,0,0,474.073,790.086Zm.809,1.742v2.086h-5.448v-2.9h4.639A.811.811,0,0,1,474.882,791.828Zm-8.466-.811H468.5v2.9h-2.9v-2.086A.811.811,0,0,1,466.416,791.018Zm-.811,8.467v-4.639h2.9V800.3h-2.086A.811.811,0,0,1,465.606,799.485Zm8.467.81h-4.639v-5.449h5.448v4.639A.81.81,0,0,1,474.073,800.3Z"
        data-name="Path 2026"
        fill={active ? activeColor : color}
        id="Path_2026"
        transform="translate(-464.674 -790.086)"
      />
    </SVG>
  )
)
