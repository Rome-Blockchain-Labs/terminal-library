"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.romeBridgeFactory = exports.RomeBridgeFactory = exports.RomeBridge = void 0;
class RomeBridge {
    constructor(widgetId) {
        this.widgetId = widgetId;
    }
    setIframeWindow(iframeWindow) {
        this.iframeWindow = iframeWindow;
    }
    emit(event) {
        if (!this.iframeWindow)
            throw new Error('Invalid window object');
        this.iframeWindow.postMessage(Object.assign(Object.assign({}, event), { widgetId: this.widgetId }), '*');
    }
    subscribe(type, handler) {
        window.addEventListener('message', (event) => {
            if (event.data.widgetId !== this.widgetId)
                return;
            if (event.data.type !== type)
                return;
            handler(event.data);
        });
    }
}
exports.RomeBridge = RomeBridge;
class RomeBridgeFactory {
    constructor() {
        this.bridges = {};
    }
    getBridge(widgetId) {
        if (this.bridges[widgetId]) {
            return this.bridges[widgetId];
        }
        const bridge = new RomeBridge(widgetId);
        this.bridges[widgetId] = bridge;
        return bridge;
    }
    removeBridge(widgetId) {
        delete this.bridges[widgetId];
    }
}
exports.RomeBridgeFactory = RomeBridgeFactory;
exports.romeBridgeFactory = new RomeBridgeFactory();
exports.default = exports.romeBridgeFactory;
