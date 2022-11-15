var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));

// src/types.ts
var RomeEventType = /* @__PURE__ */ ((RomeEventType3) => {
  RomeEventType3["TERMINAL_CLICK_BUTTON"] = "rome.terminal.click_button";
  RomeEventType3["TERMINAL_BRIDGE_READY"] = "rome.terminal.bridge_ready";
  RomeEventType3["WIDGET_UPDATE_BUTTON_STATUS"] = "rome.widget.update_button_status";
  RomeEventType3["WIDGET_GOOGLE_ANALYTICS_EVENT"] = "rome.widget.google_analytics_event";
  RomeEventType3["WIDGET_GENERIC_MESSAGE"] = "rome.widget.generic_message";
  return RomeEventType3;
})(RomeEventType || {});
var RomeEvent = class {
  constructor(payload) {
    this.payload = payload;
  }
};
var TerminalClickButtonEvent = class extends RomeEvent {
  constructor() {
    super(...arguments);
    this.type = "rome.terminal.click_button" /* TERMINAL_CLICK_BUTTON */;
  }
};
TerminalClickButtonEvent.TYPE = "rome.terminal.click_button" /* TERMINAL_CLICK_BUTTON */;
var TerminalBridgeReadyEvent = class extends RomeEvent {
  constructor() {
    super(...arguments);
    this.type = "rome.terminal.bridge_ready" /* TERMINAL_BRIDGE_READY */;
  }
};
TerminalBridgeReadyEvent.TYPE = "rome.terminal.bridge_ready" /* TERMINAL_BRIDGE_READY */;
var WidgetUpdateButtonStatusEvent = class extends RomeEvent {
  constructor() {
    super(...arguments);
    this.type = "rome.widget.update_button_status" /* WIDGET_UPDATE_BUTTON_STATUS */;
  }
};
WidgetUpdateButtonStatusEvent.TYPE = "rome.widget.update_button_status" /* WIDGET_UPDATE_BUTTON_STATUS */;

// src/widget.ts
var WidgetBridge = class {
  constructor() {
    this.widgetId = null;
  }
  init() {
    this.subscribe(TerminalBridgeReadyEvent.TYPE, (data) => {
      this.widgetId = data.payload.widgetId;
    });
  }
  emit(type, payload) {
    window.parent.postMessage({ payload, type, widgetId: this.widgetId }, "*");
  }
  subscribe(type, handler) {
    window.addEventListener("message", (event) => {
      if (type !== event.data.type)
        return;
      handler(event.data);
    });
  }
};
var widgetBridge = new WidgetBridge();

// src/terminal.ts
var TerminalBridge = class {
  constructor(widgetId) {
    this.widgetId = widgetId;
  }
  setIframeWindow(iframeWindow) {
    this.iframeWindow = iframeWindow;
  }
  emit(event) {
    if (!this.iframeWindow)
      throw new Error("Invalid window object");
    this.iframeWindow.postMessage(__spreadProps(__spreadValues({}, event), { widgetId: this.widgetId }), "*");
  }
  subscribe(type, handler) {
    window.addEventListener("message", (event) => {
      if (event.data.widgetId !== this.widgetId)
        return;
      if (event.data.type !== type)
        return;
      handler(event.data);
    });
  }
};
var TerminalBridgeFactory = class {
  constructor() {
    this.bridges = {};
  }
  getBridge(widgetId) {
    if (this.bridges[widgetId]) {
      return this.bridges[widgetId];
    }
    const bridge = new TerminalBridge(widgetId);
    this.bridges[widgetId] = bridge;
    return bridge;
  }
  removeBridge(widgetId) {
    delete this.bridges[widgetId];
  }
};
var terminalBridgeFactory = new TerminalBridgeFactory();
export {
  RomeEvent,
  RomeEventType,
  TerminalBridge,
  TerminalBridgeFactory,
  TerminalBridgeReadyEvent,
  TerminalClickButtonEvent,
  WidgetUpdateButtonStatusEvent,
  terminalBridgeFactory,
  widgetBridge
};
//# sourceMappingURL=index.js.map