"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const WalletContext_1 = require("./WalletContext");
/**
 * This component is currently un-used but will be used soon to:
 * 1) hide components that should not render when they are connected to the wrong network
 * 2) Link to a modal to change the network
 * **/
const NetworkSwitchRender = (props) => {
    const { customComponent, expectedNetworkName } = props;
    const wallets = (0, WalletContext_1.useWallets)();
    const onClick = () => __awaiter(void 0, void 0, void 0, function* () {
        if (wallets.isOnNetwork(expectedNetworkName)) {
            wallets.promptWalletChange();
        }
        else {
            wallets.switchNetwork(expectedNetworkName);
        }
    });
    if (wallets.isOnNetwork(expectedNetworkName)) {
        return props.children;
    }
    else if (customComponent) {
        return react_1.default.cloneElement(customComponent, {
            expectedNetworkName,
            onClick,
        });
    }
    else {
        return react_1.default.createElement("button", { onClick: onClick }, "Switch network default");
    }
};
exports.default = NetworkSwitchRender;
