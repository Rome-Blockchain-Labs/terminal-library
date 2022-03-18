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
const twin_macro_1 = require("twin.macro");
const WalletContext_1 = require("./WalletContext");
const NetworkAwareWalletIconWithTooltip = (props) => {
    const { active, expectedNetworkName, tooltipId } = props;
    const wallets = (0, WalletContext_1.useWallets)();
    const onClick = () => __awaiter(void 0, void 0, void 0, function* () {
        if (wallets.isOnNetwork(expectedNetworkName)) {
            wallets.promptWalletChange();
        }
        else {
            wallets.switchNetwork(expectedNetworkName);
        }
    });
    const height = 12;
    const width = 12;
    const color = wallets.isOnNetwork(expectedNetworkName)
        ? (0, twin_macro_1.theme) `colors.green.900`
        : (0, twin_macro_1.theme) `colors.orange.500`;
    const tooltipText = wallets.isOnNetwork(expectedNetworkName)
        ? 'CHANGE WALLET'
        : 'CONNECT WALLET';
    const activeColor = (0, twin_macro_1.theme) `colors.yellow.400`;
    return (react_1.default.createElement("button", { "data-for": tooltipId, "data-tip": tooltipText, tw: "transition mx-1.5", onClick: onClick }, "Icon here version 3"));
};
exports.default = NetworkAwareWalletIconWithTooltip;
