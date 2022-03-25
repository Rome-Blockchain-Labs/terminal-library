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
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// src/widget.ts
var widget_exports = {};
__export(widget_exports, {
  default: () => widget_default,
  romeBridge: () => romeBridge
});

// src/types.ts
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
var RomeBridge = class {
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
var romeBridge = new RomeBridge();
var widget_default = romeBridge;

// src/terminal.ts
var terminal_exports = {};
__export(terminal_exports, {
  RomeBridge: () => RomeBridge2,
  RomeBridgeFactory: () => RomeBridgeFactory,
  default: () => terminal_default,
  romeBridgeFactory: () => romeBridgeFactory
});
var RomeBridge2 = class {
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
var RomeBridgeFactory = class {
  constructor() {
    this.bridges = {};
  }
  getBridge(widgetId) {
    if (this.bridges[widgetId]) {
      return this.bridges[widgetId];
    }
    const bridge = new RomeBridge2(widgetId);
    this.bridges[widgetId] = bridge;
    return bridge;
  }
  removeBridge(widgetId) {
    delete this.bridges[widgetId];
  }
};
var romeBridgeFactory = new RomeBridgeFactory();
var terminal_default = romeBridgeFactory;
export {
  widget_exports as client,
  terminal_exports as terminal
};
//# sourceMappingURL=index.js.map