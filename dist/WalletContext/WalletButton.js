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
const WalletButton = () => {
    const wallets = (0, WalletContext_1.useWallets)();
    const onConnect = () => __awaiter(void 0, void 0, void 0, function* () { return wallets.promptWalletChange(); });
    const onDisconnect = () => __awaiter(void 0, void 0, void 0, function* () { return wallets.disconnectFromWallet(); });
    if (wallets.active) {
        // const tooltipText = `You are currently connected to ${getNetworkNameFromChainId(
        //   wallets.chainId || 1
        // )} on ${wallets.walletName}`
        return (
        // <MouseoverTooltip text={tooltipText}>
        react_1.default.createElement("div", { tw: 'flex items-center', onClick: onDisconnect },
            react_1.default.createElement("span", { tw: "text-yellow-400" }, "DISCONNECT"))
        // </MouseoverTooltip>
        );
    }
    return (react_1.default.createElement("div", { tw: 'flex items-center', onClick: onConnect },
        react_1.default.createElement("span", { tw: 'text-gray-200' }, "CONNECT WALLET")));
};
exports.default = WalletButton;
