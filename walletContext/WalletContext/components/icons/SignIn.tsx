import React, { FC, memo } from 'react'
import { styled } from 'twin.macro'

import { IIconProps, TransitionPath } from '.'

const StyledSvg = styled.svg<{ activeColor?: string }>`
  &:hover {
    path {
      ${({ activeColor }) =>
        activeColor &&
        `
        fill: ${activeColor};
      `}
    }
  }
`

export const SignInIcon: FC<IIconProps> = memo(
  ({ active, activeColor, color, height, width }) => {
    return (
      <StyledSvg
        css={[]}
        height={height ?? 19.426}
        viewBox="0 0 20.546 19.426"
        width={width ?? 20.546}
        xmlns="http://www.w3.org/2000/svg"
      >
        <g
          data-name="Group 5621"
          id="Group_5621"
          transform="translate(1077.454 547.979) rotate(180)"
        >
          <g data-name="Group 5619" id="Group_5619">
            <TransitionPath
              d="M1067.741,547.979H1059.9a3,3,0,0,1-2.99-2.992V531.544a3,3,0,0,1,2.99-2.991h7.843a2.994,2.994,0,0,1,2.99,2.991v2.24a.75.75,0,0,1-1.5,0v-2.24a1.492,1.492,0,0,0-1.49-1.491H1059.9a1.493,1.493,0,0,0-1.49,1.491v13.443a1.493,1.493,0,0,0,1.49,1.492h7.843a1.492,1.492,0,0,0,1.49-1.492v-2.24a.75.75,0,0,1,1.5,0v2.24A2.994,2.994,0,0,1,1067.741,547.979Z"
              data-name="Path 5081"
              fill={active ? activeColor : color}
              id="Path_5081"
            />
          </g>
          <g data-name="Group 5620" id="Group_5620">
            <TransitionPath
              d="M1065.5,542.377a.744.744,0,0,1-.53-.22l-3.357-3.357-.045-.048a.753.753,0,0,1,.041-1.017l0,0,3.359-3.359a.75.75,0,0,1,1.06,1.061l-2.08,2.081H1076.7a.75.75,0,0,1,0,1.5H1063.95l2.08,2.081a.75.75,0,0,1-.53,1.28Z"
              data-name="Path 5082"
              fill={active ? activeColor : color}
              id="Path_5082"
            />
          </g>
        </g>
      </StyledSvg>
    )
  }
)
