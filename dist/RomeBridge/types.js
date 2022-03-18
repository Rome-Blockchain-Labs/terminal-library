"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WidgetUpdateButtonStatusEvent = exports.TerminalBridgeReadyEvent = exports.TerminalClickButtonEvent = exports.RomeEvent = exports.RomeEventType = void 0;
var RomeEventType;
(function (RomeEventType) {
    RomeEventType["TERMINAL_CLICK_BUTTON"] = "rome.terminal.click_button";
    RomeEventType["TERMINAL_BRIDGE_READY"] = "rome.terminal.bridge_ready";
    RomeEventType["WIDGET_UPDATE_BUTTON_STATUS"] = "rome.widget.update_button_status";
})(RomeEventType = exports.RomeEventType || (exports.RomeEventType = {}));
class RomeEvent {
    constructor(payload) {
        this.payload = payload;
    }
}
exports.RomeEvent = RomeEvent;
class TerminalClickButtonEvent extends RomeEvent {
    constructor() {
        super(...arguments);
        this.type = RomeEventType.TERMINAL_CLICK_BUTTON;
    }
}
exports.TerminalClickButtonEvent = TerminalClickButtonEvent;
TerminalClickButtonEvent.TYPE = RomeEventType.TERMINAL_CLICK_BUTTON;
class TerminalBridgeReadyEvent extends RomeEvent {
    constructor() {
        super(...arguments);
        this.type = RomeEventType.TERMINAL_BRIDGE_READY;
    }
}
exports.TerminalBridgeReadyEvent = TerminalBridgeReadyEvent;
TerminalBridgeReadyEvent.TYPE = RomeEventType.TERMINAL_BRIDGE_READY;
class WidgetUpdateButtonStatusEvent extends RomeEvent {
    constructor() {
        super(...arguments);
        this.type = RomeEventType.WIDGET_UPDATE_BUTTON_STATUS;
    }
}
exports.WidgetUpdateButtonStatusEvent = WidgetUpdateButtonStatusEvent;
WidgetUpdateButtonStatusEvent.TYPE = RomeEventType.WIDGET_UPDATE_BUTTON_STATUS;
