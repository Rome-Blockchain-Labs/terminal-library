"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_redux_1 = require("react-redux");
const styled_components_1 = __importDefault(require("styled-components"));
const tokenSearchSlice_1 = require("../redux/tokenSearchSlice");
const firstAndLast_1 = require("./helpers/firstAndLast");
const intToWords_1 = require("./helpers/intToWords");
const imageSize = 26;
const NumberFont = styled_components_1.default.span `
  font-family: 'Fira Code', monospace;
`;
const Ellipsis = styled_components_1.default.div `
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;
const MiniEllipsis = styled_components_1.default.span `
  font-weight: bold;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 85px;
  display: inline-block;
  vertical-align: middle;
  text-transform: uppercase;
  font-size: 1rem;
`;
const MainRow = styled_components_1.default.div `
  border-bottom: 1px dotted #15b3b0;
  border-radius: 0;
  font-size: 9px;
  :hover {
    background-color: #1c646c;
  }
`;
const VirtualizedRow = (props) => {
    const { index, style, suggestions } = props;
    const selectedPair = suggestions[index];
    const dispatch = (0, react_redux_1.useDispatch)();
    const rowHeight = props.parent.props.rowHeight;
    const onClick = (event) => {
        event.preventDefault();
        if (selectedPair && selectedPair.token0 && selectedPair.token1) {
            dispatch((0, tokenSearchSlice_1.setPair)({ selectedPair }));
        }
    };
    const truncatedPair = (0, firstAndLast_1.firstAndLast)(selectedPair.id);
    const truncatedToken0 = (0, firstAndLast_1.firstAndLast)(selectedPair.token0.id);
    const truncatedToken1 = (0, firstAndLast_1.firstAndLast)(selectedPair.token1.id);
    const mobileMode = !(rowHeight < 120);
    if (mobileMode) {
        return (react_1.default.createElement("div", { style: style, onClick: onClick },
            react_1.default.createElement(MainRow, { style: { textAlign: 'center' } },
                react_1.default.createElement("span", { style: { display: 'inline-block', fontWeight: 'bold' } },
                    react_1.default.createElement("img", { alt: '', src: selectedPair.token0.image, style: { borderRadius: '50%' }, width: imageSize }),
                    ' ',
                    react_1.default.createElement(MiniEllipsis, null,
                        selectedPair.token0.symbol,
                        " /"),
                    ' ',
                    selectedPair.token1.image && (react_1.default.createElement("img", { alt: '', src: selectedPair.token1.image, style: { borderRadius: '50%' }, width: imageSize })),
                    ' ',
                    react_1.default.createElement(MiniEllipsis, null, selectedPair.token1.symbol)),
                react_1.default.createElement("br", null),
                react_1.default.createElement("div", null,
                    "Pair volume:",
                    react_1.default.createElement(NumberFont, null, (0, intToWords_1.intToWords)(selectedPair.volumeUSD))),
                react_1.default.createElement("div", null,
                    "Pair: ",
                    react_1.default.createElement(NumberFont, null, truncatedPair)),
                react_1.default.createElement("div", null,
                    "First token: ",
                    react_1.default.createElement(NumberFont, null, truncatedToken0)),
                react_1.default.createElement("div", null,
                    "Second token: ",
                    react_1.default.createElement(NumberFont, null, truncatedToken1)))));
    }
    return (react_1.default.createElement("div", { style: style, onClick: onClick },
        react_1.default.createElement(MainRow, { style: { height: rowHeight } },
            react_1.default.createElement("div", { style: {
                    display: 'flex',
                    gap: '15px',
                    height: '100%',
                    width: '100%',
                } },
                react_1.default.createElement("div", { style: {
                        alignItems: 'center',
                        display: 'flex',
                        gap: '3px',
                        maxWidth: '120px',
                        width: '100%',
                    } },
                    react_1.default.createElement("div", { style: { alignItems: 'center', display: 'flex', flex: '1' } },
                        selectedPair.token1.image && (react_1.default.createElement("img", { alt: selectedPair.token0.symbol, src: selectedPair.token0.image, style: { borderRadius: '50%' }, width: imageSize })),
                        ' ',
                        react_1.default.createElement(MiniEllipsis, null,
                            selectedPair.token0.symbol,
                            " ")),
                    react_1.default.createElement("div", { style: { alignItems: 'center', display: 'flex', flex: '1' } },
                        react_1.default.createElement("span", null, ' / '),
                        react_1.default.createElement("span", null, "\u00A0"),
                        selectedPair.token1.image && (react_1.default.createElement("img", { alt: selectedPair.token1.symbol, src: selectedPair.token1.image, style: { borderRadius: '50%' }, width: imageSize })),
                        react_1.default.createElement("span", null, "\u00A0"),
                        react_1.default.createElement(MiniEllipsis, null, selectedPair.token1.symbol))),
                react_1.default.createElement("div", { style: {
                        alignItems: 'center',
                        display: 'flex',
                        flex: 1,
                        gap: '10px',
                    } },
                    react_1.default.createElement("div", { style: { whiteSpace: 'nowrap' } },
                        react_1.default.createElement("div", null, "Pair Volume:"),
                        react_1.default.createElement("div", null, "Pair:")),
                    react_1.default.createElement("div", null,
                        react_1.default.createElement(Ellipsis, null,
                            react_1.default.createElement(NumberFont, null, (0, intToWords_1.intToWords)(selectedPair.volumeUSD))),
                        react_1.default.createElement(Ellipsis, null,
                            react_1.default.createElement(NumberFont, null, truncatedPair)))),
                react_1.default.createElement("div", { style: { alignItems: 'center', display: 'flex', gap: '10px' } },
                    react_1.default.createElement("div", { style: { whiteSpace: 'nowrap' } },
                        react_1.default.createElement("div", null, "First Token:"),
                        react_1.default.createElement("div", null, "Second Token:")),
                    react_1.default.createElement("div", null,
                        react_1.default.createElement("div", null,
                            react_1.default.createElement(Ellipsis, null,
                                react_1.default.createElement(NumberFont, null, truncatedToken0))),
                        react_1.default.createElement("div", null,
                            react_1.default.createElement(Ellipsis, null,
                                react_1.default.createElement(NumberFont, null, truncatedToken1)))))))));
};
exports.default = VirtualizedRow;
