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