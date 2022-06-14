import { ExchangeName, NetworkId } from "../../types";

const MOCK_NETWORKS = [
  {
    id: "avalanche" as NetworkId,
    name: "Avalanche",
    exchanges: [{
      name: "pangolin" as ExchangeName
    }]
  },
  {
    id: "bsc" as NetworkId,
    name: "BNB Chain",
    icon: null,
    exchanges: [
      { name: "biswap" as ExchangeName }, { name: "pancakeswap" as ExchangeName }, { name: "mdex" as ExchangeName }
    ]
  }
];

export default MOCK_NETWORKS;
