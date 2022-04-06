"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
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
exports.TokenSearch = void 0;
const react_1 = __importStar(require("react"));
const react_redux_1 = require("react-redux");
const tokenSearchSlice_1 = require("../redux/tokenSearchSlice");
const SearchInput_1 = __importDefault(require("./SearchInput"));
const SearchResult_1 = __importDefault(require("./SearchResult"));
const SearchFilters_1 = __importDefault(require("./SearchFilters"));
const TokenSearch = () => {
    const dispatch = (0, react_redux_1.useDispatch)();
    const { isSelecting, isLoading } = (0, react_redux_1.useSelector)((state) => state);
    const searchRef = (0, react_1.useRef)();
    (0, react_1.useEffect)(() => {
        window.onmousedown = (e) => {
            var _a;
            if (!((_a = searchRef === null || searchRef === void 0 ? void 0 : searchRef.current) === null || _a === void 0 ? void 0 : _a.contains(e.target))) {
                dispatch((0, tokenSearchSlice_1.stopSelecting)());
            }
        };
    }, [dispatch]);
    return (react_1.default.createElement("div", { ref: searchRef },
        react_1.default.createElement(SearchInput_1.default, null),
        react_1.default.createElement(SearchFilters_1.default, null),
        isSelecting && react_1.default.createElement(SearchResult_1.default, { loading: isLoading })));
};
exports.TokenSearch = TokenSearch;
exports.default = exports.TokenSearch;
