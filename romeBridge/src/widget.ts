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
      }
    );
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
