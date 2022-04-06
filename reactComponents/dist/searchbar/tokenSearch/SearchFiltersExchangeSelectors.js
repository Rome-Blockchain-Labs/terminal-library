"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FilterExchangeSelectors = exports.FilterExchangeAll = void 0;
const react_1 = __importDefault(require("react"));
const lodash_1 = require("lodash");
const react_redux_1 = require("react-redux");
const tokenSearchSlice_1 = require("../redux/tokenSearchSlice");
const config_1 = require("./helpers/config");
const Chip_1 = require("../Components/Chip");
const FilterExchangeAll = () => {
    const dispatch = (0, react_redux_1.useDispatch)();
    const { exchangeMap, networkMap } = (0, react_redux_1.useSelector)((state) => state);
    const exchangeAll = Object.values((0, lodash_1.omitBy)(exchangeMap, b => !b)).length === 0;
    const exchangeNamesActive = (0, config_1.exchangeNames)(Object.keys((0, lodash_1.omitBy)(networkMap, b => !b)));
    // RENDERING.
    return react_1.default.createElement(Chip_1.Chip, { name: 'AllExchanges', label: 'All', checked: exchangeAll, onChange: () => dispatch((0, tokenSearchSlice_1.setExchangeMapAll)({ exchangeNames: exchangeNamesActive, exchangeAll: exchangeAll })) });
};
exports.FilterExchangeAll = FilterExchangeAll;
const FilterExchangeSelectors = () => {
    const dispatch = (0, react_redux_1.useDispatch)();
    const { networkMap, exchangeMap } = (0, react_redux_1.useSelector)((state) => state);
    const exchangeNamesActive = (0, config_1.exchangeNames)(Object.keys((0, lodash_1.omitBy)(networkMap, b => !b)));
    // Function generating the HTML element of the network.
    const exchangeElement = exchangeName => {
        // RENDERING.
        return react_1.default.createElement(Chip_1.Chip, { key: exchangeName, name: exchangeName, label: exchangeName, checked: exchangeMap[exchangeName] || false, onChange: e => dispatch((0, tokenSearchSlice_1.setExchangeMap)({ exchangeName: exchangeName, checked: e.target.checked })) });
    };
    // RENDERING.
    return react_1.default.createElement(react_1.default.Fragment, null, exchangeNamesActive.map(exchangeName => exchangeElement(exchangeName)));
};
exports.FilterExchangeSelectors = FilterExchangeSelectors;
