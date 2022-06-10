import React, { FC, useEffect, useState } from "react";
import DefaultIcon from "../icons/default";
import { TokenIconType } from "./types";

const getTokenLogoURL = (address: string, network: string) => {
  switch (network) {
    case 'avalanche':
      return `https://raw.githubusercontent.com/ava-labs/bridge-tokens/main/avalanche-tokens/${address}/logo.png`;
    case 'moonriver':
      return `https://raw.githubusercontent.com/solarbeamio/solarbeam-tokenlist/main/assets/moonriver/${address}/logo.png`;
    case 'bnb':
      return `https://pancakeswap.finance/images/tokens/${address}.png`
    default:
      return `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/${address}/logo.png`
  }
};

const TokenIcon: FC<TokenIconType> = ({ network, token, size = 28 }) => {
  const { image, address } = token;
  const [error, setError] = useState(true);
  const tokenImageUrl = image || getTokenLogoURL(address, network);

  useEffect(() => {
    checkIfImageExists(tokenImageUrl);
  }, [tokenImageUrl]);

  const checkIfImageExists = (url: string) => {
    if (!url) return;

    const img = new Image();
    img.src = url;

    if (img.complete) {
      setError(false);
    } else {
      img.onload = () => {
        setError(false);
      };

      img.onerror = () => {
        setError(true);
      };
    }
  };

  return !error ? (
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
