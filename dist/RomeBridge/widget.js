"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.romeBridge = void 0;
const types_1 = require("./types");
class RomeBridge {
    constructor() {
        this.widgetId = null;
        this.subscribe(types_1.TerminalBridgeReadyEvent.TYPE, (data) => {
            this.widgetId = data.payload.widgetId;
        });
    }
    emit(type, payload) {
        window.parent.postMessage({ payload: payload, type: type, widgetId: this.widgetId }, '*');
    }
    subscribe(type, handler) {
        window.addEventListener('message', (event) => {
            if (type !== event.data.type)
                return;
            handler(event.data);
        });
    }
    ;
}
exports.romeBridge = new RomeBridge();
window.romeBridge = exports.romeBridge;
exports.default = exports.romeBridge;
