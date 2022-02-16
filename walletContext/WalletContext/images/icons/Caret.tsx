import { SVGProps } from 'react'

interface CaretProps extends SVGProps<SVGSVGElement> {
  size?: number
  fill?: string
  rotate?: string
}

function Caret({ fill = 'black', rotate, size = 16, ...props }: CaretProps) {
  return (
    <svg
      fill="none"
      height={size}
      style={{ transform: rotate ? `rotate(${rotate})` : 'initial' }}
      viewBox="0 0 16 16"
      width={size}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        clipRule="evenodd"
        d="M7.75677 11.8992C7.89108 12.0335 8.10883 12.0335 8.24314 11.8992L14.5659 5.57648C14.7002 5.44217 14.7002 5.22442 14.5659 5.09011L13.7113 4.2355C13.577 4.10119 13.3592 4.10119 13.2249 4.2355L8.24314 9.21727C8.10883 9.35158 7.89108 9.35158 7.75677 9.21727L2.775 4.23549C2.64069 4.10119 2.42294 4.10119 2.28863 4.2355L1.43402 5.09011C1.29971 5.22442 1.29971 5.44217 1.43402 5.57648L7.75677 11.8992Z"
        fill={fill}
        fillRule="evenodd"
      />
    </svg>
  )
}

export default Caret
