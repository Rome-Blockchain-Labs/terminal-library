import React, {FC} from 'react';
import DefaultIcon from '../icons/default';
import KyberIcon from '../icons/kyber';
import PangolinIcon from '../icons/pangolin';
import SushiIcon from '../icons/sushi';
import TraderIcon from '../icons/trader';
import BscIcon from '../icons/bsc';
import AvalancheIcon from '../icons/avalanche';
import MoonBeamIcon from '../icons/moonbeam';
import MoonRiverIcon from '../icons/moonriver';
import ApeSwapIcon from '../icons/apeswap';
import BabySwapIcon from '../icons/babyswap';
import BiSwapIcon from '../icons/biswap';
import EllipsisFinanceIcon from '../icons/ellipsis.finance';
import SafeSwapIcon from '../icons/safeswap';
import BaquetteIcon from '../icons/baguette';
import PancakeIcon from '../icons/pancake';
import CanaryIcon from '../icons/canary';
import ComplusNetworkIcon from '../icons/complus.network';
import ElkFinanceIcon from '../icons/elk.finance';
import LydiaFinanceIcon from '../icons/lydia.finance';
import OliveSwapIcon from '../icons/oliveswap';
import PandaSwapIcon from '../icons/pandaswap';
import YetiSwapIcon from '../icons/yetiswap';
import ZeroExchangeIcon from '../icons/zero.exchange';
import BeamSwapIcon from '../icons/beamswap';
import SolarBeamIcon from '../icons/solarbeam';
import StellaSwapIcon from '../icons/stellaswap';
import SolarFlareIcon from '../icons/solar.flare'
import MdexIcon from '../icons/mdex';

type LogoType = {
  label: any;
  grayscaleFilter?: any;
  width?: number;
  height?: number;
}

export const Logo: FC<LogoType> = ({label, width, height, grayscaleFilter}) => {  
  let result;
  switch(label) {
    // networks
    case 'bsc':
      result = <BscIcon width={width} height={height} />
      break;
    case 'avalanche':
      result = <AvalancheIcon width={width} height={height} />
      break;
    
    case 'kyberdmm':
      result = <KyberIcon width={width} height={height} />
      break
    case 'pangolin':
      result = <PangolinIcon width={width} height={height} />
        break
    case 'sushiswap':
      result = <SushiIcon width={width} height={height} />
        break
    case 'traderjoe':
      result = <TraderIcon width={width} height={height} />
        break
    case 'mdex':
      result = <MdexIcon width={width} height={height} />
        break
    case 'Select All':
      result = <></>
      break;
    case 'moonbeam':
      result = <MoonBeamIcon width={width} height={height} />
      break;
    case 'moonriver':   
      result = <MoonRiverIcon width={width} height={height} />
      break; 
    case 'apeswap':
      result = <ApeSwapIcon width={width} height={height} />
      break;
    case 'babyswap':
      result = <BabySwapIcon width={width} height={height} />
      break;
    case 'biswap':
      result = <BiSwapIcon width={width} height={height} />
      break;
    case 'ellipsis.finance':
      result = <EllipsisFinanceIcon width={width} height={height} />
      break;
    case 'pancakeswap':
      result = <PancakeIcon width={width} height={height} />
      break;
    case 'safeswap':
      result = <SafeSwapIcon width={width} height={height} />
      break;
    case 'baguette':
      result = <BaquetteIcon width={width} height={height} />
      break;
    case 'canary':
      result = <CanaryIcon width={width} height={height} />;
      break;
    case 'complusnetwork':
      result = <ComplusNetworkIcon width={width} height={height} />;
      break;
    case 'elkfinance':
      result = <ElkFinanceIcon width={width} height={height} />;
      break;
    case 'lydiafinance':
      result = <LydiaFinanceIcon width={width} height={height} />;
      break;
    case 'oliveswap':
      result = <OliveSwapIcon width={width} height={height} />;
      break;
    case 'pandaswap':
      result = <PandaSwapIcon width={width} height={height} />;
      break;
    case 'yetiswap':
      result = <YetiSwapIcon width={width} height={height} />;
      break;
    case 'zeroexchange':  
      result = <ZeroExchangeIcon width={width} height={height} />;
      break;     
    case 'beamswap':
      result = <BeamSwapIcon width={width} height={height} />;
      break;
    case 'solarflare':
      result = <SolarFlareIcon width={width} height={height} />;
      break;
    case 'stellaswap':
      result = <StellaSwapIcon width={width} height={height} />;
      break;
    case 'solarbeam':
      result = <SolarBeamIcon width={width} height={height} />;
      break;
    default:
      result = <DefaultIcon width={width} height={height} />
      break;
  }
  
  return <div style={{filter: `grayscale(${grayscaleFilter})`}}>
    {result}
  </div>
}

export default Logo;