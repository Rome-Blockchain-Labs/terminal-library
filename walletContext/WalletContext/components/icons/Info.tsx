import React, { FC, memo } from 'react'

import { IIconProps, SVG, TransitionPath } from '.'

export const InfoIcon: FC<IIconProps> = memo(
  ({ active, activeColor, color, height, width }) => (
    <SVG
      height={height ?? 11.101}
      hoverColor={activeColor}
      viewBox="0 0 11.1 11.101"
      width={width ?? 11.1}
      xmlns="http://www.w3.org/2000/svg"
    >
      <g
        data-name="Group 5061"
        id="Group_5061"
        transform="translate(-726.765 -795.069)"
      >
        <g data-name="Group 5058" id="Group_5058">
          <TransitionPath
            d="M732.324,798.276a.621.621,0,0,1-.622-.618.613.613,0,0,1,.613-.617h.009a.617.617,0,1,1,0,1.235Z"
            data-name="Path 1999"
            fill={active ? activeColor : color}
            id="Path_1999"
          />
        </g>
        <g data-name="Group 5059" id="Group_5059">
          <TransitionPath
            d="M733.227,804.212h-.912a.464.464,0,0,1-.463-.463v-3.476H731.4a.464.464,0,1,1,0-.927h.911a.464.464,0,0,1,.464.464v3.475h.448a.464.464,0,0,1,0,.927Z"
            data-name="Path 2000"
            fill={active ? activeColor : color}
            id="Path_2000"
          />
        </g>
        <g data-name="Group 5060" id="Group_5060">
          <TransitionPath
            d="M736.015,806.17h-7.4a1.853,1.853,0,0,1-1.851-1.851v-7.4a1.854,1.854,0,0,1,1.851-1.851h7.4a1.853,1.853,0,0,1,1.85,1.851v7.4A1.852,1.852,0,0,1,736.015,806.17ZM728.616,796a.926.926,0,0,0-.924.924v7.4a.925.925,0,0,0,.924.924h7.4a.925.925,0,0,0,.924-.924v-7.4a.926.926,0,0,0-.924-.924Z"
            data-name="Path 2001"
            fill={active ? activeColor : color}
            id="Path_2001"
          />
        </g>
      </g>
    </SVG>
  )
)
