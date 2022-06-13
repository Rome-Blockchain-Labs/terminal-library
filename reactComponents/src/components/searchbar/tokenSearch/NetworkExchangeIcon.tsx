import React, { FC } from "react";
import { Logo } from "./Logo";
import { NetworkExchangeIconType } from "./types";

const NetworkExchangeIcon: FC<NetworkExchangeIconType> = ({
  label,
  icon,
  size = 20,
  grayscaleFilter,
}) => {
  const Component: any = icon;

  if (!Component) {
    return (
      <Logo
        label={label}
        width={size}
        height={size}
        grayscaleFilter={grayscaleFilter}
      />
    );
  }

  return <Component width={size} height={size} />;
};

export default NetworkExchangeIcon;
