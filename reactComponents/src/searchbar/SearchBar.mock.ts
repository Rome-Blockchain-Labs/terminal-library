import { ExchangeName, NetworkId } from '../types';

const MOCK_NETWORKS = [
  {
    id: 'avalanche' as NetworkId,
    name: 'Avalanche',
    exchanges: [{
      name: 'pangolin' as ExchangeName
    }]
  },
  {
    id: 'bsc' as NetworkId,
    name: 'BNB Chain',
    icon: null,
    exchanges: [
      {
        name: 'biswap' as ExchangeName
      },
      {
        name: 'pancakeswap' as ExchangeName
      },
      {
        name: 'mdex' as ExchangeName
      }
    ]
  },
  {
    id: 'moonriver' as NetworkId,
    name: 'Moonriver',
    icon: null,
    exchanges: [
      {
        id: 'solarbeam-moonriver',
        name: 'solarbeam' as ExchangeName
      }
    ]
  },
  {
    id: 'metis' as NetworkId,
    name: 'Metis',
    icon: null,
    exchanges: [
      {
        name: 'netswap' as ExchangeName
      },
      {
        name: 'hermesprotocol' as ExchangeName
      }
    ]
  },
  {
    id: 'ethereum' as NetworkId,
    name: 'Ethereum',
    icon: null,
    exchanges: [
      {
        name: 'sushiswap' as ExchangeName
      },
      {
        name: 'uniswapv2' as ExchangeName
      },
      {
        name: 'uniswapv3' as ExchangeName
      }
    ]
  },
  {
    id: 'moonbeam' as NetworkId,
    name: 'Moonbeam',
    icon: null,
    exchanges: [
      {
        name: 'beamswap' as ExchangeName
      }
    ]
  },
  {
    id: 'polygon' as NetworkId,
    name: 'Polygon',
    icon: null,
    exchanges: [
      {
        name: 'sushiswap' as ExchangeName
      },      
      {
        name: 'uniswapv3' as ExchangeName
      }
    ]
  }
];

export default MOCK_NETWORKS;
