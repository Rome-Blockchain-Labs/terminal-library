"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FilterNetworkSelectors = exports.FilterNetworkAll = void 0;
const react_1 = __importDefault(require("react"));
const react_redux_1 = require("react-redux");
const lodash_1 = require("lodash");
const tokenSearchSlice_1 = require("../redux/tokenSearchSlice");
const config_1 = require("./helpers/config");
const Chip_1 = require("../Components/Chip");
const FilterNetworkAll = () => {
    const dispatch = (0, react_redux_1.useDispatch)();
    const { exchangeMap, networkMap } = (0, react_redux_1.useSelector)((state) => state);
    const networkAll = Object.values((0, lodash_1.omitBy)(networkMap, b => !b)).length === 0;
    const exchangeNamesActive = Object.keys((0, lodash_1.omitBy)(exchangeMap, b => !b));
    // RENDERING.
    return react_1.default.createElement(Chip_1.Chip, { name: 'AllNetworks', label: 'All', checked: networkAll, onChange: e => {
            dispatch((0, tokenSearchSlice_1.setNetworkMapAll)({ networkNames: config_1.networkNames, networkAll: networkAll }));
            dispatch((0, tokenSearchSlice_1.setExchangeMapAll)({ exchangeNames: exchangeNamesActive, exchangeAll: false }));
        } });
};
exports.FilterNetworkAll = FilterNetworkAll;
const FilterNetworkSelectors = () => {
    const dispatch = (0, react_redux_1.useDispatch)();
    const { networkMap } = (0, react_redux_1.useSelector)((state) => state);
    // Function generating the HTML element of the network.
    const networkElement = networkName => {
        // RENDERING.
        return react_1.default.createElement(Chip_1.Chip, { key: networkName, name: networkName, label: networkName, checked: networkMap[networkName] || false, onChange: e => dispatch((0, tokenSearchSlice_1.setNetworkMap)({ networkName, checked: e.target.checked })) });
    };
    // RENDERING.
    return react_1.default.createElement(react_1.default.Fragment, null, config_1.networkNames.map((networkName) => networkElement(networkName)));
};
exports.FilterNetworkSelectors = FilterNetworkSelectors;
