import { SVGProps } from 'react'

interface EthereumLogoProps extends SVGProps<SVGSVGElement> {
  size?: number
}

function EthereumLogo({ size = 41, ...props }: EthereumLogoProps) {
  return (
    <svg
      fill="none"
      height={size}
      style={{ flexShrink: 0 }}
      viewBox="0 0 43 44"
      width={size}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M21.5 43.5742C33.3741 43.5742 43 33.9483 43 22.0742C43 10.2001 33.3741 0.574219 21.5 0.574219C9.6259 0.574219 0 10.2001 0 22.0742C0 33.9483 9.6259 43.5742 21.5 43.5742Z"
        fill="white"
      />
      <g clipPath="url(#clip0)">
        <path
          d="M21.7349 5.09277L11.1582 22.6442L21.7349 17.8369V5.09277Z"
          fill="#8A92B2"
        />
        <path
          d="M21.7349 17.8364L11.1582 22.6437L21.7349 28.8972V17.8364Z"
          fill="#62688F"
        />
        <path
          d="M32.3189 22.6442L21.7402 5.09277V17.8369L32.3189 22.6442Z"
          fill="#62688F"
        />
        <path
          d="M21.7402 28.8972L32.3189 22.6437L21.7402 17.8364V28.8972Z"
          fill="#454A75"
        />
        <path
          d="M11.1582 24.6558L21.7349 39.5615V30.9054L11.1582 24.6558Z"
          fill="#8A92B2"
        />
        <path
          d="M21.7402 30.9054V39.5615L32.3248 24.6558L21.7402 30.9054Z"
          fill="#62688F"
        />
      </g>
      <defs>
        <clipPath id="clip0">
          <rect
            fill="white"
            height="41.0455"
            transform="translate(0 0.574219)"
            width="41.0455"
          />
        </clipPath>
      </defs>
    </svg>
  )
}

export default EthereumLogo
