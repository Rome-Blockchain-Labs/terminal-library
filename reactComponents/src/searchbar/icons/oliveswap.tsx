import React, { FC, memo } from 'react';
import SVGIcon from './abstract';

import { IIconProps } from '.';

const OliveSwapIcon: FC<IIconProps> = ({ height, width }) => (
  <SVGIcon 
    height={height ?? 16}
    width={width ?? 16}
    viewBox="0 0 384 384">
    
    <g transform='translate(0)'>
      <circle cx="192" cy="192" r="192" fill="#B18856"/>
      <path d="M309.715 205.053C305.937 173.745 290.134 142.934 265.486 118.185C240.737 93.4365 209.926 77.7325 178.618 73.9562C146.911 70.1799 118.486 78.9263 98.6073 98.7051C78.7284 118.484 69.982 146.909 73.8584 178.716C77.6347 210.023 93.4388 240.834 118.088 265.583C142.837 290.33 173.648 306.034 204.955 309.813C209.825 310.408 214.696 310.706 219.367 310.706C245.21 310.706 268.168 301.861 284.866 285.064C304.845 265.185 313.589 236.76 309.715 205.053V205.053Z" fill="#8BC34A"/>
      <path d="M166.093 102.78C160.229 97.0145 151.384 95.2256 141.146 97.7116C131.704 100.096 122.064 105.761 113.913 113.912C96.2212 131.704 91.3512 154.564 102.782 166.093C106.955 170.266 112.721 172.255 119.081 172.255C130.213 172.255 143.632 166.191 154.862 154.86C163.012 146.811 168.777 137.169 171.163 127.727C173.647 117.49 171.858 108.644 166.093 102.78V102.78Z" fill="#558B2F"/>
      <path d="M219.468 310.608C214.796 310.608 209.926 310.31 205.056 309.713C173.748 305.936 142.935 290.233 118.188 265.484C93.4392 240.735 77.7352 209.924 73.9589 178.616C70.0825 146.909 78.9273 118.484 98.706 98.6054C118.487 78.7283 147.012 69.9818 178.716 73.8583C210.024 77.6346 240.837 93.3385 265.584 118.086C290.333 142.835 306.037 173.646 309.813 204.955C313.69 236.66 304.845 265.087 285.065 284.964C268.169 301.762 245.309 310.608 219.468 310.608ZM164.305 83.0015C141.048 83.0015 120.572 90.8526 105.764 105.761C88.1706 123.354 80.3195 148.899 83.7974 177.522C87.3771 206.644 102.086 235.368 125.244 258.526C148.402 281.684 177.126 296.395 206.248 299.973C234.873 303.551 260.317 295.7 278.009 278.006C295.7 260.315 303.453 234.871 299.973 206.247C296.395 177.125 281.687 148.402 258.528 125.243C235.37 102.085 206.647 87.3747 177.524 83.7968C172.953 83.1998 168.58 83.0015 164.305 83.0015V83.0015Z" fill="black"/>
      <path d="M286.356 221.851C283.674 221.851 281.486 219.764 281.388 217.079C280.194 190.641 266.976 162.811 244.912 140.847C242.922 138.86 242.922 135.778 244.912 133.789C246.899 131.802 249.98 131.802 251.967 133.789C275.723 157.545 290.034 187.66 291.326 216.582C291.427 219.365 289.339 221.653 286.556 221.751C286.456 221.851 286.456 221.851 286.356 221.851V221.851Z" fill="black"/>
      <path d="M119.181 172.255C112.72 172.255 107.055 170.266 102.88 166.093C91.3511 154.564 96.2211 131.704 113.912 113.912C122.064 105.761 131.704 99.9974 141.047 97.7116C151.284 95.2256 160.229 97.0145 165.995 102.78C171.758 108.545 173.647 117.49 171.063 127.727C168.777 137.169 163.012 146.811 154.962 154.96C143.632 166.191 130.312 172.255 119.181 172.255H119.181ZM149.794 106.556C147.408 106.556 145.122 106.955 143.431 107.352C135.879 109.241 127.827 114.111 120.97 120.968C107.652 134.286 102.582 151.779 109.838 159.035C117.094 166.291 134.587 161.223 147.905 147.903C154.762 141.045 159.632 132.994 161.521 125.341C162.515 121.465 163.41 114.211 159.037 109.838C156.551 107.352 153.073 106.556 149.794 106.556V106.556Z" fill="black"/>
    </g>
  </SVGIcon>    
)

export default memo(OliveSwapIcon);
