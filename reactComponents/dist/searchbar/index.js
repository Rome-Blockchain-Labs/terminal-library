"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
require("./App.css");
const react_redux_1 = require("react-redux");
const store_1 = require("./redux/store");
const tokenSearch_1 = __importDefault(require("./tokenSearch"));
function Index() {
    return (react_1.default.createElement("div", { className: "App" },
        react_1.default.createElement(react_redux_1.Provider, { store: store_1.store },
            react_1.default.createElement("br", null),
            react_1.default.createElement("br", null),
            react_1.default.createElement("br", null),
            react_1.default.createElement("br", null),
            react_1.default.createElement("br", null),
            react_1.default.createElement("br", null),
            react_1.default.createElement("br", null),
            react_1.default.createElement("br", null),
            react_1.default.createElement("div", { style: { width: "500px", margin: "auto", border: "solid" } },
                react_1.default.createElement(tokenSearch_1.default, null)))));
}
exports.default = Index;
