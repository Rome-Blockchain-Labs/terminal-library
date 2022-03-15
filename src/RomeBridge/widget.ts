
import { RomeEventHandler, RomeEventType, TerminalBridgeReadyEvent } from "./types";

class RomeBridge {
  widgetId = null;

  constructor() {
    this.subscribe<TerminalBridgeReadyEvent>(TerminalBridgeReadyEvent.TYPE, (data) => {
      this.widgetId = data.payload.widgetId;
    });
  }

  emit(type: RomeEventType, payload: any) {
    window.parent.postMessage(
      { payload: payload, type: type, widgetId: this.widgetId },
      '*'
    );
  }

  subscribe<T>(type: RomeEventType, handler: RomeEventHandler<T>) {
    window.addEventListener('message', (event) => {
      if (type !== event.data.type) return;

      handler(event.data);
    });
  };
}

export const romeBridge = new RomeBridge();
(window as any).romeBridge = romeBridge;

export default romeBridge;
