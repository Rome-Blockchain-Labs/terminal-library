import { FC, ReactNode } from 'react';

export interface IconsType { [key: string]: ReactNode; }

export type ActionType = {
    component?: FC<any>,
    detail?: any
}

export type DetailType = {
    index: number;
    suggestions: any;
    handleDetail: any;
    currentIndex : number;
    logoIcons: IconsType
}

export type PairTokenIconType = {
    token: any;
    size?: number;
};

export type NetworkExchangeIconType = {
    icon?: any,
    size?: number;
    label?: string;
    grayscaleFilter?: any;
};