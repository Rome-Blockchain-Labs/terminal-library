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

export enum Wallet {
  INJECTED = "INJECTED",
  METAMASK = "METAMASK",
  COINBASE = "COINBASE",
  WALLET_CONNECT = "WALLET_CONNECT",
  FORTMATIC = "FORTMATIC",
  NETWORK = "NETWORK",
  GNOSIS_SAFE = "GNOSIS_SAFE",
}

export type BridgeWalletConnectEventData = {
  wallet: Wallet;
  address: string;
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

  sendWalletConnectEvent(event: string, data: BridgeWalletConnectEventData) {
    this.emit(RomeEventType.WIDGET_WALLET_CONNECT_EVENT, {
      data,
      event,
    });
  }

  sendWalletDisconnectEvent(event: string) {
    this.emit(RomeEventType.WIDGET_WALLET_DISCONNECT_EVENT, {
      event,
    });
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
