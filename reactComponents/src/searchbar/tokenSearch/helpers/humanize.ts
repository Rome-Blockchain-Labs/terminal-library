export const humanizeNetwork = (network: string): string => {
  switch (network.toLowerCase()) {
    case "bsc":
      return "BNB Chain";
    default:
      return network;
  }
}  

export const humanizeExchange = (exchange: string): string => {
  switch (exchange.toLowerCase()) {
    case "traderjoe":
      return "Trader Joe";
    case "hermesprotocol":
      return "Hermes"
    default:
      return exchange;
  }
}
