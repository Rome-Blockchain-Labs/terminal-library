import { FC } from 'react';
export { Accordion, AccordionItem, AccordionItemButton, AccordionItemHeading, AccordionItemPanel } from 'react-accessible-accordion';

declare type RenderProps = {
    customWrapper?: object;
    customSearchInput?: object;
    customSearchFilter?: object;
    customChip?: object;
    customResult?: object;
    customTokenDetail?: object;
    customLoading?: object;
    customActions?: any;
    customAllChip?: object;
};

declare const SearchBar: FC<RenderProps>;

export { RenderProps, SearchBar };
