import React, { FC, useEffect, useState } from "react";
import DefaultIcon from "../icons/defaultIcon";
import { TokenIconType } from "./types";

const getTokenLogoURL = (address: string, network: string) => {
  return `https://storage.googleapis.com/romenet-token-logos/${network}/${address.toLowerCase()}/logo.png`;
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
