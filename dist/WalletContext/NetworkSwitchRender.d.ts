import React from 'react';
import { NetworkName } from './constants';
/**
 * This component is currently un-used but will be used soon to:
 * 1) hide components that should not render when they are connected to the wrong network
 * 2) Link to a modal to change the network
 * **/
declare const NetworkSwitchRender: (props: {
    expectedNetworkName: NetworkName;
    customComponent?: React.ComponentElement<any, any>;
    children: any;
}) => any;
export default NetworkSwitchRender;
