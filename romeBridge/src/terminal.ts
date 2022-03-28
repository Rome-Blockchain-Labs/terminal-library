import { RomeEvent, RomeEventHandler, RomeEventType } from "./types";

export class TerminalBridge {
  iframeWindow: any;
  widgetId: string;

  constructor(widgetId: string) {
    this.widgetId = widgetId;
  }

  setIframeWindow(iframeWindow: any) {
    this.iframeWindow = iframeWindow;
  }

  emit(event: RomeEvent) {
    if (!this.iframeWindow) throw new Error("Invalid window object");

    this.iframeWindow.postMessage({ ...event, widgetId: this.widgetId }, "*");
  }

  subscribe<T>(type: RomeEventType, handler: RomeEventHandler<T>) {
    window.addEventListener("message", (event) => {
      if (event.data.widgetId !== this.widgetId) return;
      if (event.data.type !== type) return;

      handler(event.data);
    });
  }
}

type TerminalBridgeMap = { [key: string]: TerminalBridge };

export class TerminalBridgeFactory {
  bridges: TerminalBridgeMap;

  constructor() {
    this.bridges = {};
  }

  getBridge(widgetId: string): TerminalBridge {
    if (this.bridges[widgetId]) {
      return this.bridges[widgetId];
    }

    const bridge = new TerminalBridge(widgetId);
    this.bridges[widgetId] = bridge;

    return bridge;
  }

  removeBridge(widgetId: string) {
    delete this.bridges[widgetId];
  }
}

export const terminalBridgeFactory = new TerminalBridgeFactory();
