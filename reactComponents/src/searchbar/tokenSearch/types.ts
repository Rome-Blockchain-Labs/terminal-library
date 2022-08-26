import { FC, ReactNode } from 'react';
import { ActionComponentType, NetworkId } from '../../types';
import { Token, TokenPair } from '../redux/types';

export interface IconsType { [key: string]: ReactNode; }


export type ActionType = {
    component?: FC<ActionComponentType>,
    detail?: TokenPair
}

export type DetailType = {
    index: number;
    suggestions: any;
    handleDetail: any;
    currentIndex : number;
    logoIcons: IconsType
}

export type TokenIconType = {
    network: NetworkId;
    token: Token;
    size?: number;
};

export type NetworkExchangeIconType = {
    icon?: any,
    size?: number;
    label?: string;
    grayscaleFilter?: 0 | 1;
    active?: boolean;
};