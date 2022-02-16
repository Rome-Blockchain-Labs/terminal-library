import { SVGProps } from 'react'

interface InfoProps extends SVGProps<SVGSVGElement> {
  size?: number
  fill?: string
}

function Info({ fill = 'black', size = 18, ...props }: InfoProps) {
  return (
    <svg
      fill="none"
      height={size}
      transform="rotate(-180 0 0)"
      viewBox="0 0 18 18"
      width={size}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <circle
        cx="8.99963"
        cy="9.00004"
        r="7.5"
        stroke={fill}
        strokeWidth="1.5"
        transform="rotate(-180 8.99963 9.00004)"
      />
      <rect
        fill={fill}
        height="5.5"
        rx="0.75"
        width="1.5"
        x="8.24988"
        y="4.74977"
      />
      <circle cx="8.99988" cy="12.75" fill={fill} r="0.75" />
    </svg>
  )
}

export default Info
