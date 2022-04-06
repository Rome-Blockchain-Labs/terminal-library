"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchFilters = void 0;
const react_1 = __importDefault(require("react"));
const react_redux_1 = require("react-redux");
const react_accessible_accordion_1 = require("react-accessible-accordion");
const SearchFiltersNetworkSelectors_1 = require("./SearchFiltersNetworkSelectors");
const SearchFiltersExchangeSelectors_1 = require("./SearchFiltersExchangeSelectors");
const SearchFilters = () => {
    const { isSelecting, networkMap } = (0, react_redux_1.useSelector)((state) => state);
    const exchangesActive = Object.values(networkMap).filter(b => b).length !== 0;
    // RENDERING.
    return (react_1.default.createElement(react_accessible_accordion_1.Accordion, { allowZeroExpanded: true },
        react_1.default.createElement(react_accessible_accordion_1.AccordionItem, null,
            react_1.default.createElement(react_accessible_accordion_1.AccordionItemHeading, null,
                react_1.default.createElement(react_accessible_accordion_1.AccordionItemButton, null, "Filter Networks: search")),
            react_1.default.createElement(react_accessible_accordion_1.AccordionItemPanel, null,
                react_1.default.createElement(SearchFiltersNetworkSelectors_1.FilterNetworkAll, null),
                react_1.default.createElement(SearchFiltersNetworkSelectors_1.FilterNetworkSelectors, null)),
            react_1.default.createElement(react_accessible_accordion_1.AccordionItemPanel, null,
                exchangesActive &&
                    react_1.default.createElement(SearchFiltersExchangeSelectors_1.FilterExchangeAll, null),
                exchangesActive &&
                    react_1.default.createElement(SearchFiltersExchangeSelectors_1.FilterExchangeSelectors, null)))));
};
exports.SearchFilters = SearchFilters;
exports.default = exports.SearchFilters;
