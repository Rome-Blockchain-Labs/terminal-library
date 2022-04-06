"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const react_redux_1 = require("react-redux");
const styled_components_1 = __importDefault(require("styled-components"));
const tokenSearchSlice_1 = require("../redux/tokenSearchSlice");
const icon_search_svg_1 = __importDefault(require("./icon-search.svg"));
const config_1 = require("./helpers/config");
const PairField = styled_components_1.default.div `
  display: block;
  margin-left: auto;
  margin-right: auto;
  position: relative;
  border-color: #067c82;
  border-style: solid;
  border-width: 2px;
  border-radius: 30px;
  background: #08333c;
  padding: 11px 15px;
  font-size: 15px;
  color: #ffffff;
  font-family: 'Fira Code', monospace;

  @media only screen and (max-width: 990px) {
    width: 100%;
  }

  @media only screen and (max-width: 769px) {
    width: 100%;
  }
`;
const StyledInput = styled_components_1.default.input `
  width: 100%;
  border: none;
  background-color: inherit;
  color: #ffffff;
  //width: auto;
`;
const HideOnSmallScreen = styled_components_1.default.img `
  width: 30px;
  cursor: pointer;
  float: right;
  position: absolute;
  right: 22px;
  top: 9px;
  @media only screen and (max-width: 990px) {
    display: none;
  }
`;
const SearchInput = () => {
    const dispatch = (0, react_redux_1.useDispatch)();
    const { searchText, networkMap, exchangeMap } = (0, react_redux_1.useSelector)((state) => state);
    const isSelecting = (0, react_redux_1.useSelector)((state) => state === null || state === void 0 ? void 0 : state.isSelecting);
    const isLoading = (0, react_redux_1.useSelector)((state) => state.isLoading);
    const fetchError = (0, react_redux_1.useSelector)((state) => state === null || state === void 0 ? void 0 : state.fetchError);
    const selectedPair = (0, react_redux_1.useSelector)((state) => state === null || state === void 0 ? void 0 : state.selectedPair);
    // Updates the datasets of the results.
    (0, react_1.useEffect)(() => {
        // Ensure that the search text fulfills the minimum lenght requirement.
        if (searchText.length >= config_1.minStringSearch) {
            dispatch((0, tokenSearchSlice_1.searchTokenPairs)(searchText));
        }
    }, [dispatch, searchText, networkMap, exchangeMap]);
    // RENDERING.
    return (react_1.default.createElement(PairField, { onClick: () => dispatch((0, tokenSearchSlice_1.startSelecting)()) },
        react_1.default.createElement(StyledInput, { placeholder: 'Select a token pair', autocomplete: 'off', onChange: e => dispatch((0, tokenSearchSlice_1.setSearchText)(e.target.value)) }),
        react_1.default.createElement(HideOnSmallScreen, { alt: '', src: icon_search_svg_1.default, onClick: () => dispatch((0, tokenSearchSlice_1.toggleSelecting)()) })));
};
exports.default = SearchInput;
// const selectedPairText = selectedPair && combinePairText(selectedPair);
// const onClick = () => dispatch(startSelecting());
// const onKeyDown = (e) => e.code === 'Escape' && dispatch(stopSelecting());
// //todo throw to a global error boundary
// if (fetchError) {
//   return (
//     <PairField>
//       <StyledInput
//         autocomplete={'off'}
//         style={{ color: 'red' }}
//         value={'Something went wrong..'}
//         onChange={() => {}}
//       />
//     </PairField>
//   );
// }
// let value;
// if (isSelecting) {
//   value = searchText;
// } else {
//   value = selectedPairText || 'Select a token pair..';
// }
// const combinePairText = (pair) => {
//   if (pair.token0?.symbol && pair.token1?.symbol && pair.id) {
//     const miniAddress = pair.id.slice(0, 8) + '...' + pair.id.slice(-8);
//     return pair.token0?.symbol + '/' + pair.token1?.symbol + '/' + miniAddress;
//   }
//   return '';
// };
