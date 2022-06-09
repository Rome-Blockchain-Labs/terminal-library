import React, { FC } from "react";
import DefaultIcon from "../icons/default";
import { TokenIconType } from "./types";

const getTokenLogoURL = (address: string) => {
  return `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/${address}/logo.png`;
};

const TokenIcon: FC<TokenIconType> = ({ token, size = 28 }) => {
  const tokenImageUrl =
    token.image || getTokenLogoURL(token.address.toUpperCase());

  return tokenImageUrl ? (
    <img
      alt={token?.symbol}
      src={tokenImageUrl}
      style={{ borderRadius: "50%" }}
      width={size}
      height={size}
    />
  ) : (
    <DefaultIcon width={size} height={size} />
  );
};


export default TokenIcon;
