import React from 'react';
import { NetworkName } from './constants';
declare const NetworkAwareWalletIconWithTooltip: (props: {
    expectedNetworkName: NetworkName;
    active?: boolean;
    tooltipId?: string;
}) => React.ReactElement<any, string | React.JSXElementConstructor<any>>;
export default NetworkAwareWalletIconWithTooltip;
