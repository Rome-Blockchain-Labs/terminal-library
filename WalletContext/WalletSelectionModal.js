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
const react_1 = __importStar(require("react"));
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const twin_macro_1 = __importDefault(require("twin.macro"));
const use_onclickoutside_1 = __importDefault(require("use-onclickoutside"));
// import MetamaskLogo from './images/logos/MetamaskLogo'
const WalletContext_1 = require("./WalletContext");
const ExtraWidgetDivider = twin_macro_1.default.div `border-b border-solid border-gray-400 ml-3 mr-3 mt-1.5 mb-3.5`;
const HoverBox = (props) => {
    const { onClick, text } = props;
    return (react_1.default.createElement("div", { tw: "flex items-center min-w-[100px] min-h-[100px] rounded border border-solid border-gray-400 p-3 cursor-pointer justify-center text-center text-lg hover:bg-gray-400 hover:font-bold grayscale hover:grayscale-0 transition m-5", onClick: onClick },
        react_1.default.createElement("div", null,
            react_1.default.createElement("div", { tw: "m-auto mb-3 w-auto max-w-min" }, props.children),
            react_1.default.createElement("div", null, text))));
};
const WalletBox = (props) => {
    const { walletName } = props;
    const { connectToWallet } = (0, WalletContext_1.useWallets)();
    return (react_1.default.createElement(HoverBox, { text: walletName.toUpperCase(), onClick: () => connectToWallet('metamask') }, props.children));
};
const WalletSelectionModal = (props) => {
    const { active, cancelWalletChangePrompt, promptingWalletChange, switchNetwork, } = (0, WalletContext_1.useWallets)();
    console.log(promptingWalletChange);
    const ref = (0, react_1.useRef)(null);
    (0, use_onclickoutside_1.default)(ref, cancelWalletChangePrompt);
    if (!promptingWalletChange) {
        return null;
    }
    if (!active) {
        return (react_1.default.createElement(react_1.default.Fragment, null,
            react_1.default.createElement("div", { tw: "absolute top-0 z-20 w-full h-full bg-black bg-opacity-80" }),
            react_1.default.createElement("div", { tw: "absolute top-0 w-full h-full z-30 flex justify-center items-center" },
                react_1.default.createElement("div", { ref: ref, tw: "bg-dark-400 max-w-xl w-full p-7 rounded-xl text-gray-100 flex flex-col items-center" },
                    react_1.default.createElement("div", { tw: "flex justify-between text-yellow-400 pb-4 w-full" },
                        react_1.default.createElement("div", { tw: "flex-grow " }, "CONNECT TO WALLET"),
                        react_1.default.createElement("button", { onClick: cancelWalletChangePrompt })),
                    react_1.default.createElement("div", { tw: "flex" },
                        react_1.default.createElement(WalletBox, { walletName: 'metamask' }, "Metamask")),
                    react_1.default.createElement("div", { tw: "mt-5 text-lg" }, "By connecting, I accept the Wallet's Terms of Service")))));
    }
    return (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement("div", { tw: "absolute top-0 z-20 w-full h-full bg-black bg-opacity-80" }),
        react_1.default.createElement("div", { tw: "absolute top-0 w-full h-full z-30 flex justify-center items-center" },
            react_1.default.createElement("div", { ref: ref, tw: "bg-dark-400 max-w-xl w-full p-7 rounded-xl text-gray-100 flex flex-col items-center" },
                react_1.default.createElement("div", { tw: "flex justify-between text-yellow-400 pb-4 w-full" },
                    react_1.default.createElement("div", { tw: "flex-grow text-center" }, "SELECT A METAMASK NETWORK"),
                    react_1.default.createElement("button", { onClick: cancelWalletChangePrompt })),
                react_1.default.createElement("div", { tw: "flex" },
                    react_1.default.createElement(HoverBox, { text: 'Avalanche', onClick: () => switchNetwork('Avalanche') }, "Avalanche"),
                    react_1.default.createElement(HoverBox, { text: 'BSC', onClick: () => switchNetwork('BSC') }, "BSC"),
                    react_1.default.createElement(HoverBox, { text: 'Rinkeby', onClick: () => switchNetwork('Rinkeby') }, "Rinkeby"))))));
};
exports.default = WalletSelectionModal;
