import React, { FC } from "react";
import { Logo } from "./Logo";
import { NetworkExchangeIconType } from "./types";

const NetworkExchangeIcon: FC<NetworkExchangeIconType> = ({
  label,
  icon,
  size = 20,
  grayscaleFilter,
  active = false,
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

  return <Component active={active} color="#B4BBC7" width={size} height={size} />;
};

export default NetworkExchangeIcon;
