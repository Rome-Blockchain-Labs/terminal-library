import { SVGProps } from 'react'

interface CloseProps extends SVGProps<SVGSVGElement> {
  size?: number
  fill?: string
}

function Close({ fill = '#CBD2D0', size = 20, ...props }: CloseProps) {
  return (
    <svg
      fill="none"
      height={size}
      viewBox="0 0 20 20"
      width={size}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <rect
        fill={fill}
        height="25.2022"
        rx="1.40024"
        transform="rotate(45 18.0195 0)"
        width="2.80049"
        x="18.0195"
      />
      <rect
        fill={fill}
        height="25.2022"
        rx="1.40024"
        transform="matrix(-0.707107 0.707107 0.707107 0.707107 1.98022 0)"
        width="2.80049"
      />
    </svg>
  )
}

export default Close
