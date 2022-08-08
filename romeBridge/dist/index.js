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
      this.namespaceCookiesStorage(data.payload.widgetName);
    });
  }
  namespaceCookiesStorage(prefix) {
    const widgetNamespace = `${prefix}-`;
    const set = window.localStorage.setItem;
    const get = window.localStorage.getItem;
    Storage.prototype.setItem = function() {
      arguments[0] = widgetNamespace + arguments[0];
      set.apply(this, arguments);
    };
    Storage.prototype.getItem = function() {
      arguments[0] = widgetNamespace + arguments[0];
      return get.apply(this, arguments);
    };
    var cookieDesc = Object.getOwnPropertyDescriptor(Document.prototype, "cookie") || Object.getOwnPropertyDescriptor(HTMLDocument.prototype, "cookie");
    if (cookieDesc && cookieDesc.configurable) {
      Object.defineProperty(document, "cookie", {
        get: function() {
          const cookiesStr = cookieDesc.get.call(document);
          const nameSpacedCookiesArr = cookiesStr.split(";").filter((s) => s.trim().startsWith(widgetNamespace));
          const cookiesArr = nameSpacedCookiesArr.map((s) => s.trim().slice(widgetNamespace.length));
          return cookiesArr.join(";");
        },
        set: function(cookieStr) {
          const attributes = cookieStr.split(";");
          const keyVal = attributes.filter((att) => !["expires=", "path=", "domain=", "max-age=", "secure", "samesite", "__Secure", "__Host"].some((arg) => att.trim().startsWith(arg)))[0];
          if (!keyVal)
            throw new Error("Trying to set invalid cookie" + cookieStr);
          const [key, val] = keyVal.split("=");
          const replacement = `${widgetNamespace}${key}=${val}`;
          const newCookie = cookieStr.replace(keyVal, replacement);
          cookieDesc.set.call(document, newCookie);
        },
        enumerable: true,
        configurable: true
      });
    }
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