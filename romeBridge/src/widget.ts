import {
  RomeEventHandler,
  RomeEventType,
  TerminalBridgeReadyEvent,
} from "./types";

class WidgetBridge {
  widgetId = null;

  init() {
    this.subscribe<TerminalBridgeReadyEvent>(
      TerminalBridgeReadyEvent.TYPE,
      (data) => {
        this.widgetId = data.payload.widgetId;
        this.namespaceCookiesStorage(data.payload.widgetName)
      }
    );
  }

  /**
   * There may be potential issues if the widget wants to use storage/cookies before it is initialized
   * As it won't be on the namespace yet.
   *
   * A workaround for this would be for the widget to call this function directly with the prefix hardcoded
   *
   * A longer term solution to explore as a fix may be to pass the prefix to the widget via url params
   * **/
  namespaceCookiesStorage(prefix:string){
    const widgetNamespace = `${prefix}-`
    /** override storage's setItem/getItem **/
    const set = window.localStorage.setItem
    const get = window.localStorage.getItem
    Storage.prototype.setItem = function() {
      arguments[0] = widgetNamespace+arguments[0]
      set.apply(this,arguments)
    }
    Storage.prototype.getItem = function() {
      arguments[0] = widgetNamespace+arguments[0]
      return get.apply(this, arguments)
    }
    /** Override the native way that the value of the document.cookie is returned/set **/
    var cookieDesc = Object.getOwnPropertyDescriptor(Document.prototype, 'cookie') ||
      Object.getOwnPropertyDescriptor(HTMLDocument.prototype, 'cookie');
    if (cookieDesc && cookieDesc.configurable) {
      Object.defineProperty(document, 'cookie', {
        get: function () {
          const cookiesStr = cookieDesc.get.call(document);
          const nameSpacedCookiesArr = cookiesStr.split(";").filter(s=>s.trim().startsWith(widgetNamespace))
          const cookiesArr = nameSpacedCookiesArr.map(s=>s.trim().slice(widgetNamespace.length))
          return cookiesArr.join(";")
        },
        set: function (cookieStr) {
          const attributes = cookieStr.split(";")
          const keyVal = attributes.filter(att=>!["expires=","path=","domain=","max-age=","secure","samesite","__Secure","__Host"].some(arg=>att.trim().startsWith(arg)))[0]
          if (!keyVal) throw new Error("Trying to set invalid cookie"+cookieStr)
          const [ key, val ] = keyVal.split("=")
          const replacement = `${widgetNamespace}${key}=${val}`
          const newCookie = cookieStr.replace(keyVal, replacement)
          cookieDesc.set.call(document, newCookie);
        },
        enumerable: true,
        configurable: true,
      })
    }
  }

  emit(type: RomeEventType, payload: any) {
    window.parent.postMessage(
      { payload: payload, type: type, widgetId: this.widgetId },
      "*"
    );
  }

  subscribe<T>(type: RomeEventType, handler: RomeEventHandler<T>) {
    window.addEventListener("message", (event) => {
      if (type !== event.data.type) return;

      handler(event.data);
    });
  }
}

export const widgetBridge = new WidgetBridge();
