import React, { FC, memo } from 'react';
import { IIconProps } from '.';

const StellaSwapIcon: FC<IIconProps> = memo(
  ({ active, activeColor, color, height, width }) => (
    <svg
      height={height ?? 16}
      width={width ?? 16}
      viewBox="0 0 400 400"        
      fill="none"
    >      
      <g transform='translate(0)'>
        <circle fill="#301748" cx="200" cy="199.1" r="194.9"/>
        <linearGradient id="SVGID_1_" gradientUnits="userSpaceOnUse" x1="11109.6904" y1="189.3136" x2="11412.6572" y2="189.3136" gradientTransform="matrix(-1 0 0 -1 11484.75 400)">
          <stop offset="0" style={{stopColor: `#E2107B`}} />
          <stop offset="1" style={{stopColor: `#301748`}} />          
        </linearGradient>
        <path style={{fill: `url(#SVGID_1_)`}} d="M207.4,328.9c-6.6-6.1-12.8-12.6-18.5-19.5c-13.6-17.5-43.9-48.3-51.4-55.9c-8.7-8.8-17.4-17.7-26-26.7
          c-1.3-1.3-3.3-2.8-2.1-5c1.2-2.2,3.6-1.8,5.7-1.7c0.9,0.1,1.9,0.3,2.7,0.6c6.2,2.4,12.3,4.9,18.5,7.4c12.3,5,24.3,10.1,36.7,14.8
          c7.4,2.8,10.6,0,9.2-7.8c-1.2-6.5-2.8-12.9-4.6-19.3c-1.5-5.4,1.6-11,7-12.5c0.5-0.1,1-0.2,1.6-0.3c2.5-0.4,5.1-0.4,7.6-0.6
          c2.5-0.2,5.1-0.8,6.2-3.8c1-2.7,0.1-5.7-2.1-7.4c-8.4-8.1-16.6-16.2-24.9-24.4c-20.8-20.5-41.5-41-62.2-61.5
          C98.4,93.3,86.1,81.2,73.9,69.1c-1.2-1.2-2.5-2.2-1.5-4.1s2.6-1.6,4.2-1.3c5.1,1,8.8,4.7,12.8,7.4c10.7,7.4,21.9,14,32.8,21
          c7.6,4.8,15.3,9.5,22.9,14.4c7.6,4.9,14.7,9.7,22.2,14.5c10.7,6.8,21.5,13.4,32.2,20.2c11.5,7.3,23,14.8,34.4,22.3
          c2.1,1.4,4,2.1,6.2,0.1c2.2-1.9,1.9-3.9,0.9-6.5c-2.3-6.2-6.6-11.1-8.2-17.4c-0.6-2.1-1-4.1,1-5.7c1.7-1.4,4.1-1.5,5.9-0.3
          c7.8,3.7,15.3,7.8,22.7,12.3c8.9,5.6,18.2,10.6,27.8,14.9c15.6,7.4,30.5,16.1,45.3,24.9c8.1,5.2,15.2,11.9,20.6,19.9
          c4.3,5.9,7.9,12.3,10.7,19c4,9.8,6.6,20,7.9,30.5c2.4,18.7-4.4,42.7-13.1,55.6c-7.4,11.7-17.1,21.8-28.5,29.8
          c-7.7,5.2-15.9,9.5-24.6,12.8c-9.1,3.6-18.5,4.1-28.5,4.5c-0.8,0.1-1.6,0.1-2.5,0C256.6,356.6,236.2,353.7,207.4,328.9z
          M341.7,266.5c0.7-33.6-26-61.5-59.7-62.2c-0.6,0-1.2,0-1.9,0c-32.9,0.2-60,27.1-60.1,62.6c0,29.1,28.3,61.5,60.5,59.5
          C313.8,327.8,341.5,297.7,341.7,266.5z"/>
        <linearGradient id="SVGID_00000179647521726871257740000015064218755421354396_" gradientUnits="userSpaceOnUse" x1="11332.2012" y1="212.6705" x2="11350.5742" y2="212.6705" gradientTransform="matrix(-1 0 0 -1 11484.75 400)">
          <stop offset="0" style={{stopColor: `#E2107B`}} />
          <stop offset="1" style={{stopColor: `#301748`}} />
          <stop offset="1" style={{stopColor: `#0D1126`}} />
        </linearGradient>
        <path style={{fill:`url(#SVGID_00000179647521726871257740000015064218755421354396_)`}} d="M134.3,187.3c0,5.2,4,9.5,9.2,9.6
          c5.1,0,9.1-4.2,9.1-9.2c0-0.2,0-0.4,0-0.6c-0.2-5.2-4.4-9.3-9.6-9.4C137.9,178.1,134.1,182.3,134.3,187.3z"/>
        <linearGradient id="SVGID_00000102512321202755739380000006902697473436652699_" gradientUnits="userSpaceOnUse" x1="11302.877" y1="339.0115" x2="11321.7012" y2="339.0115" gradientTransform="matrix(-1 0 0 -1 11484.75 400)">
          <stop offset="0" style={{stopColor: `#E2107B`}} />
          <stop offset="1" style={{stopColor: `#301748`}} />
          <stop offset="1" style={{stopColor: `#0D1126`}} />
        </linearGradient>
        <path style={{fill:`url(#SVGID_00000102512321202755739380000006902697473436652699_)`}} d="M173,70c5.6,0,8.9-3.6,8.8-9.2
          c-0.3-4.8-4.2-8.7-9.1-8.9c-4.1,0-9.7,5.2-9.8,9.1C163.3,66.3,167.8,70.3,173,70z"/>
        <linearGradient id="SVGID_00000039129237823542455810000013466356786325873588_" gradientUnits="userSpaceOnUse" x1="11411.9697" y1="247.7285" x2="11428.959" y2="247.7285" gradientTransform="matrix(-1 0 0 -1 11484.75 400)">
        <stop offset="0" style={{stopColor: `#E2107B`}} />
          <stop offset="1" style={{stopColor: `#301748`}} />
          <stop offset="1" style={{stopColor: `#0D1126`}} />
        </linearGradient>
        <path style={{fill:`url(#SVGID_00000039129237823542455810000013466356786325873588_)`}} d="M72.7,152.2c0.2-4.4-3.2-8.2-7.6-8.4
          c-0.3,0-0.5,0-0.8,0c-4.6,0.4-8.3,4.2-8.5,8.8c0.3,4.5,4,8,8.5,8.2c4.5,0.2,8.3-3.4,8.5-7.9C72.8,152.6,72.8,152.4,72.7,152.2z"/>
        <linearGradient id="SVGID_00000057129531663735334810000000943885206532706221_" gradientUnits="userSpaceOnUse" x1="11110.2441" y1="98.411" x2="11261.5781" y2="156.7504" gradientTransform="matrix(-1 0 0 -1 11484.75 400)">
          <stop offset="0" style={{stopColor: `#0D1126`}} />
          <stop offset="0" style={{stopColor: `#301748`}} />
          <stop offset="1" style={{stopColor: `#E2107B`}} />
        </linearGradient>
        <path style={{fill:`url(#SVGID_00000057129531663735334810000000943885206532706221_)`}} d="M280.6,326.3c33.2,1.5,61-28.6,61.2-59.8
          c0.7-33.6-26-61.5-59.7-62.2c-0.6,0-1.2,0-1.9,0c-32.9,0.2-60,27.1-60.1,62.6C220,296,248.4,328.3,280.6,326.3z"/>
      </g>    
    </svg>
  )
);

export default StellaSwapIcon;