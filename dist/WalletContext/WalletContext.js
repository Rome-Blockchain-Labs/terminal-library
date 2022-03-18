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
exports.useWallets = exports.WalletsContextProvider = void 0;
// @ts-nocheck //todo fix
const react_1 = __importDefault(require("react"));
const core_1 = require("@web3-react/core");
const injected_connector_1 = require("@web3-react/injected-connector");
const react_2 = require("react");
const react_device_detect_1 = require("react-device-detect");
const constants_1 = require("./constants");
const constants_2 = require("./constants");
const injectedProvider = new injected_connector_1.InjectedConnector({});
const defaultState = {
    active: false,
    cancelWalletChangePrompt: () => {
        return {};
    },
    chainId: 43114,
    connectToWallet: () => {
        console.log('hello');
        return {};
    },
    disconnectFromWallet: () => {
        return {};
    },
    isOnNetwork: () => false,
    /** promptWalletChange
     * no argument should open all wallets for selection, followed by network selection
     * When given a networkName argument:
     * if currentWallet supports network, change network
     * if currentWallet doesn't support network, show UI to select from wallet supporting the network
     * **/
    promptWalletChange: () => {
        return {};
    },
    promptingWalletChange: false,
    switchNetwork: () => {
        return {};
    },
    walletName: 'metamask',
    library: null,
};
const WalletsContext = (0, react_2.createContext)(defaultState);
const WalletsContextProvider = (props) => {
    const { activate, active, chainId, deactivate, library } = (0, core_1.useWeb3React)();
    const [promptingWalletChange, setPromptingWalletChange] = (0, react_2.useState)(false);
    const promptWalletChange = () => setPromptingWalletChange(true);
    const cancelWalletChangePrompt = () => setPromptingWalletChange(false);
    (0, react_2.useEffect)(() => {
        injectedProvider.isAuthorized().then((isAuthorized) => {
            var _a;
            if (isAuthorized || (react_device_detect_1.isMobile && window.ethereum)) {
                activate(injectedProvider);
                // next line is a for for: https://giters.com/NoahZinsmeister/web3-react/issues/257
                (_a = window === null || window === void 0 ? void 0 : window.ethereum) === null || _a === void 0 ? void 0 : _a.removeAllListeners(['networkChanged']);
            }
        });
    }, [activate]);
    const isOnNetwork = (expectedNetworkName) => (0, constants_2.getChainIdByNetworkName)(expectedNetworkName) === chainId;
    const switchNetwork = (networkName) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        if (!active || !networkName) {
            promptWalletChange();
        }
        else {
            console.log(networkName);
            //todo make this more generic -- ie switch network for non evm
            yield ((_a = window === null || window === void 0 ? void 0 : window.ethereum) === null || _a === void 0 ? void 0 : _a.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: (0, constants_1.getChainHexByNetworkName)(networkName) }],
            }).catch((err) => {
                var _a;
                console.log(err);
                const { blockExplorerUrl, chainHex, name, nativeCurrency, rpcUrl } = (0, constants_1.getNetworkByNetworkName)(networkName);
                (_a = window === null || window === void 0 ? void 0 : window.ethereum) === null || _a === void 0 ? void 0 : _a.request({
                    method: 'wallet_addEthereumChain',
                    params: [
                        {
                            blockExplorerUrls: [blockExplorerUrl],
                            chainId: chainHex,
                            chainName: name,
                            nativeCurrency,
                            rpcUrls: [rpcUrl],
                        },
                    ],
                });
            }));
            cancelWalletChangePrompt();
        }
    });
    const connectToWallet = (wallet) => __awaiter(void 0, void 0, void 0, function* () {
        var _b;
        console.log('connecting');
        //todo handle more wallets
        yield activate(injectedProvider);
        // next line is a for for: https://giters.com/NoahZinsmeister/web3-react/issues/257
        (_b = window === null || window === void 0 ? void 0 : window.ethereum) === null || _b === void 0 ? void 0 : _b.removeAllListeners(['networkChanged']);
        cancelWalletChangePrompt();
        switchNetwork('Ethereum');
    });
    const disconnectFromWallet = () => deactivate();
    return (react_1.default.createElement(WalletsContext.Provider, { value: {
            active,
            cancelWalletChangePrompt,
            chainId,
            connectToWallet,
            disconnectFromWallet,
            isOnNetwork,
            promptWalletChange,
            promptingWalletChange,
            switchNetwork,
            walletName: 'metamask',
            library,
        } }, props.children));
};
exports.WalletsContextProvider = WalletsContextProvider;
function useWallets() {
    const context = (0, react_2.useContext)(WalletsContext);
    if (context === undefined) {
        throw new Error('useWallets must be used within a useWalletsProvider');
    }
    return context;
}
exports.useWallets = useWallets;
