import React, { FC, memo } from 'react'

import { IIconProps, TransitionPath } from '.'

export const SushiswapIcon: FC<IIconProps> = memo(
  ({ active, activeColor, color, height, width }) => (
    <svg
      height={height ?? 14.585}
      viewBox="0 0 15.925 14.585"
      width={width ?? 15.925}
      xmlns="http://www.w3.org/2000/svg"
    >
      <TransitionPath
        d="M11.333 2.305C7.941-.09 4.349-.688 3.284.842L.224 5.299l.019.013c-.769 1.306.334 3.512 2.546 5.554a2.9 2.9 0 0 0 1.559-.978 7.88 7.88 0 0 1 1.089-1 1.32 1.32 0 0 1 .973-.328c.466 0 1 .465 1.863 1.6s2.062 1.463 2.794.865c.067-.066.133-.066.2-.133a3.386 3.386 0 0 0 .61-.57c-.178-.054-.382-.108-.544-.162-.066 0-.066-.066-.066-.133s.066-.066.133-.066c.123.041.27.082.412.123.07.02.138.04.2.061a6.916 6.916 0 0 0 .358-.554 8.894 8.894 0 0 1-1.208-.345 14.141 14.141 0 0 1-3.289-1.745 15.114 15.114 0 0 1-2.941-2.6C3.68 3.424 3.165 2.014 3.749 1.18l.008-.009c.94-1.317 4.191-.65 7.309 1.539a12.155 12.155 0 0 1 4.013 4.292 2.128 2.128 0 0 1 .577.1 2.522 2.522 0 0 1 0 2.2c.999-1.543-.864-4.736-4.323-6.997zm-8.448 0c.067-.066.133 0 .133.066a1.3 1.3 0 0 1 .066.466c.067.067 0 .133-.066.133-.066.066-.133 0-.133-.066a1.694 1.694 0 0 0-.133-.466c.001-.067.062-.067.133-.133zm4.723 5.987c-.067 0-.133.066-.2 0a12.659 12.659 0 0 1-3.7-3.748 8.5 8.5 0 0 1-.554-1.041c0-.066 0-.066.066-.133s.133 0 .133.067a8.788 8.788 0 0 0 .661 1.178 12.354 12.354 0 0 0 3.6 3.478c-.006.065.061.132-.006.198z"
        fill={active ? activeColor : color}
      />
      <TransitionPath
        d="M6.642 3.133c-.01.012-.022.023-.031.036-.466.665.465 2.062 2 3.126 1.6 1.064 3.193 1.4 3.659.732.009-.012.013-.027.021-.04.406-.679-.516-2.042-2.017-3.086-1.571-1.044-3.133-1.385-3.632-.768zM15.657 7.094a2.13 2.13 0 0 0-.577-.1 2.145 2.145 0 0 1 .132 1.99c-.007.012-.013.025-.021.037-.464.663-1.505.83-2.82.56a9.079 9.079 0 0 1-.358.554l.052.016c.067 0 .067.067.067.133s-.067.066-.133.066l-.117-.037a3.386 3.386 0 0 1-.61.57c-.067.066-.133.066-.2.133-.732.6-1.929.266-2.794-.865s-1.4-1.6-1.863-1.6a1.32 1.32 0 0 0-.973.328 7.88 7.88 0 0 0-1.089 1 2.9 2.9 0 0 1-1.559.978 17.335 17.335 0 0 0 1.758 1.417c3.359 2.371 6.912 2.98 8.015 1.507l.034.023 3.06-4.523a2.522 2.522 0 0 0-.004-2.187zm-1.463 3.459a6.554 6.554 0 0 1-1.6-.067.133.133 0 1 1 0-.266 6.434 6.434 0 0 0 1.6.066.133.133 0 0 1 0 .266z"
        fill={active ? activeColor : color}
      />
    </svg>
  )
)
