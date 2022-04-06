"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_redux_1 = require("react-redux");
const react_virtualized_1 = require("react-virtualized");
const styled_components_1 = __importDefault(require("styled-components"));
const SearchResultRow_1 = __importDefault(require("./SearchResultRow"));
const NilFoundContainer = styled_components_1.default.div `
  width: 50%;
  margin-left: 25%;
  margin-right: 25%;
  margin-top: -5px;
  position: relative;
  background-color: #1c646c;
  z-index: 100;
  color: rgba(0, 0, 0, 0.87);
  height: 60px;
  text-align: center;
  color: white;
  font-weight: bolder;
  display: flex;
  align-items: center;
  justify-content: center;
`;
const SearchDropdown = (props) => {
    const { suggestions, searchText } = (0, react_redux_1.useSelector)((state) => state);
    const filteredSuggestions = suggestions
        .slice()
        .sort((pair1, pair2) => pair2.volumeUSD - pair1.volumeUSD);
    if (props.loading) {
        return react_1.default.createElement(NilFoundContainer, null, "Loading...");
    }
    if (!!searchText && !filteredSuggestions.length) {
        return react_1.default.createElement(NilFoundContainer, null, "No pairs found...");
    }
    return (react_1.default.createElement("div", { style: { display: 'flex', height: '240px', marginTop: '20px' } },
        react_1.default.createElement("div", { style: { flex: '1 1 auto' } },
            react_1.default.createElement(react_virtualized_1.AutoSizer, null, ({ height, width }) => {
                return (react_1.default.createElement(react_virtualized_1.List, { height: height, overscanRowCount: 3, rowCount: filteredSuggestions.length, rowHeight: 40, rowRenderer: (props) => (react_1.default.createElement(SearchResultRow_1.default, Object.assign({ suggestions: filteredSuggestions }, props))), width: width }));
            }))));
};
exports.default = SearchDropdown;
