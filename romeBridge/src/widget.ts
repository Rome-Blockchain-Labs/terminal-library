import {
  RomeEventHandler,
  RomeEventType,
  TerminalBridgeReadyEvent,
} from "./types";

export type BridgeAnalyticsEventData = { [key: string]: string };
export type BridgeAnalyticsTxEventData = {
  chain_id: string;
  token_address: string;
  token_amount_w_decimals: string;
  [key: string]: string;
};

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

  sendAnalyticsEvent(event: string, data: BridgeAnalyticsEventData) {
    this.emit(RomeEventType.WIDGET_GOOGLE_ANALYTICS_EVENT, {
      data,
      event,
    });
  }
  sendAnalyticsTxEvent(event: string, txData: BridgeAnalyticsTxEventData) {
    this.emit(RomeEventType.WIDGET_ANALYTICS_TRANSACTION_EVENT, {
      txData,
      event,
    });
  }

  subscribe<T>(type: RomeEventType, handler: RomeEventHandler<T>) {
    window.addEventListener("message", (event) => {
      if (type !== event.data.type) return;

      handler(event.data);
    });
  }
}

export const widgetBridge = new WidgetBridge();
