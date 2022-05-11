import { FC, ReactNode } from 'react';
export { Accordion, AccordionItem, AccordionItemButton, AccordionItemHeading, AccordionItemPanel } from 'react-accessible-accordion';

declare type CustomWrapperType = {
    backgroundColor?: string;
    borderRadius?: string;
    border?: string;
    button?: {
        borderColor?: string;
        backColor?: string;
        color?: string;
        borderRadius?: string;
        fontSize?: string;
        padding?: string;
        hoverBackColor?: string;
    };
};
declare type CustomSerchInputType = {
    input?: {
        width?: string;
        height?: string;
        border?: string;
        color?: string;
        display?: string;
        borderRadius?: string;
        background?: string;
        padding?: string;
        fontSize?: string;
        fontFamily?: string;
    };
    icon?: {
        right?: string;
        top?: string;
        height?: number;
        width?: number;
        color?: string;
        activeColor?: string;
    };
    placeholder?: string;
};
declare type CustomSearchFilterType = {
    wrapper?: {
        backgroundColor?: string;
        borderRadius?: string;
        toggleColor?: string;
        toggleHeight?: string;
        toggleWidth?: string;
        toggleMarginRight?: string;
        toggleLeft?: string;
        toggleTop?: string;
        toggleBorderBottom?: string;
        toggleBorderRight?: string;
        contentBorder?: string;
        contentBorderRadius?: string;
        margin?: string;
    };
    fitler?: {
        network?: string;
        exchange?: string;
        header?: {
            display?: string;
            justifyContent?: string;
            alignItems?: string;
            width?: string;
            border?: string;
            backgroundColor?: string;
            color?: string;
            padding?: string;
            textAlign?: string;
            margin?: string;
            borderRadius?: string;
            fontSize?: string;
            fontWeight?: string;
            hoverColor?: string;
        };
        wrapper?: {
            justifyContent?: string;
            alignItems?: string;
            padding?: string;
            backgroundColor?: string;
            borderRadius?: string;
        };
        content?: {
            justifyContent?: string;
            alignItems?: string;
            padding?: string;
        };
        description?: {
            textAlign?: string;
            fontSize?: string;
            fontWeight?: string;
            padding?: string;
            backgroundColor?: string;
            color?: string;
        };
    };
};
declare type CustomResultType = {
    title?: {
        color?: string;
        fontSize?: string;
        padding?: string;
        margin?: string;
        fontSize2?: string;
    };
    content?: {
        padding?: string;
        background?: string;
        borderRadius?: string;
        width?: string;
        height?: string;
        border?: string;
        color?: string;
        display?: string;
        borderColor?: string;
        borderStyle?: string;
        borderWidth?: string;
        fontSize?: string;
        fontFamily?: string;
    };
};
declare type CustomLoadingType = {
    loadingTitle?: string;
    notFoundTitle?: string;
    color?: string;
    fontSize?: string;
};
declare type CustomChipType = {
    fontSize?: string;
    fontWeight?: string;
    borderRadius?: string;
    backgroundColor?: string;
    border?: string;
    padding?: string;
    margin?: string;
    defaultColor?: string;
    width?: string;
    height?: string;
    textAlign?: string;
    textTransform?: string;
    gridTemplateColumns?: string;
    justifySelf?: string;
    checkedBorderColor?: string;
    checkedColor?: string;
    checkedBackgroundColor?: string;
};
declare type CustomAllChipType = {
    fontSize?: string;
    fontWeight?: string;
    borderRadius?: string;
    backgroundColor?: string;
    border?: string;
    padding?: string;
    margin?: string;
    defaultColor?: string;
    width?: string;
    height?: string;
    textAlign?: string;
    textTransform?: string;
    gridTemplateColumns?: string;
    justifySelf?: string;
};
declare type CustomTokenDetailType = {
    list?: {
        container?: {
            display?: string;
            alignItems?: string;
            padding?: string;
            background?: string;
            borderBottom?: string;
            gridTemplateColumns?: string;
        };
        token?: {
            color?: string;
            fontSize?: string;
            fontWeight?: string;
            padding?: string;
        };
        pair?: {
            color?: string;
            fontSize?: string;
        };
        detail?: {
            padding?: string;
        };
    };
    details?: {
        content?: {
            display?: string;
            alignItems?: string;
            padding?: string;
            margin?: string;
            background?: string;
            borderBottom?: string;
            borderRadius?: string;
            fontSize?: string;
            gridTemplateColumns?: string;
        };
        token?: {
            fontSize?: string;
            fontWeight?: string;
        };
        address?: {
            fontSize?: string;
        };
        detail?: {
            fontSize?: string;
        };
    };
};
declare type ActionComponentType = {
    index?: number;
    component?: FC;
};
declare type ExchangeType = {
    id: string;
    name: string;
    icon?: ReactNode;
};
declare type NetworkType = {
    id: string;
    name: string;
    icon?: ReactNode;
    exchanges?: Array<ExchangeType>;
};
declare type RenderProps = {
    customWrapper?: CustomWrapperType;
    customSearchInput?: CustomSerchInputType;
    customSearchFilter?: CustomSearchFilterType;
    customChip?: CustomChipType;
    customResult?: CustomResultType;
    customTokenDetail?: CustomTokenDetailType;
    customLoading?: CustomLoadingType;
    customActions?: Array<ActionComponentType>;
    customAllChip?: CustomAllChipType;
    networks: Array<NetworkType>;
};

declare const SearchBar: FC<RenderProps>;

export { RenderProps, SearchBar };
