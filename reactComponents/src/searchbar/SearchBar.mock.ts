import { ExchangeName, NetworkId } from '../types';

const MOCK_NETWORKS = [
  {
    id: 'avalanche' as NetworkId,
    name: 'Avalanche',
    exchanges: [{
      name: 'pangolin' as ExchangeName,
      title: 'Pangolin'
    }]
  },
  {
    id: 'bsc' as NetworkId,
    name: 'BNB Chain',
    icon: null,
    exchanges: [
      {
        name: 'biswap' as ExchangeName,
        title:'BiSwap'
      },
      {
        name: 'pancakeswap' as ExchangeName,
        title:'PancakeSwap'
      },
      {
        name: 'mdex' as ExchangeName,
        title:'MDEX'
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
        name: 'solarbeam' as ExchangeName,
        title:'SolarBeam'
      }
    ]
  },
  {
    id: 'metis' as NetworkId,
    name: 'Metis',
    icon: null,
    exchanges: [
      {
        name: 'netswap' as ExchangeName,
        title:'Netswap'
      },
      {
        name: 'hermesprotocol' as ExchangeName,
        title:'Hermes'
      }
    ]
  },
  {
    id: 'ethereum' as NetworkId,
    name: 'Ethereum',
    icon: null,
    exchanges: [
      {
        name: 'sushiswap' as ExchangeName,
        title:"Sushi"
      },
      {
        name: 'uniswapv2' as ExchangeName,
        title:'Uniswap V2'
      },
      {
        name: 'uniswapv3' as ExchangeName,
        title:'Uniswap V3'
      }
    ]
  },
  {
    id: 'moonbeam' as NetworkId,
    name: 'Moonbeam',
    icon: null,
    exchanges: [
      {
        name: 'beamswap' as ExchangeName,
        title:'BeamSwap'
      }
    ]
  },
  {
    id: 'polygon' as NetworkId,
    name: 'Polygon',
    icon: null,
    exchanges: [
      {
        name: 'sushiswap' as ExchangeName,
        title:"Sushi"
      },      
      {
        name: 'uniswapv3' as ExchangeName,
        title:'Uniswap V3'
      }
    ]
  }
];

export default MOCK_NETWORKS;
