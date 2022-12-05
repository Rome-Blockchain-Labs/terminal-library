export enum RomeEventType {
  TERMINAL_CLICK_BUTTON = "rome.terminal.click_button",
  TERMINAL_BRIDGE_READY = "rome.terminal.bridge_ready",

  WIDGET_UPDATE_BUTTON_STATUS = "rome.widget.update_button_status",
  WIDGET_GOOGLE_ANALYTICS_EVENT = "rome.widget.google_analytics_event",
  WIDGET_ANALYTICS_TRANSACTION_EVENT = "rome.widget.analytics_transaction_event",
  WIDGET_GENERIC_MESSAGE = "rome.widget.generic_message",
  WIDGET_WALLET_CONNECT_EVENT = "rome.widget.wallet_connect_event",
  WIDGET_WALLET_DISCONNECT_EVENT = "rome.widget.wallet_disconnect_event",
}

export class RomeEvent {
  public type: RomeEventType | undefined;
  public payload: any;

  constructor(payload: any) {
    this.payload = payload;
  }
}

export type RomeEventHandler<T> = (event: T) => void;

export class TerminalClickButtonEvent extends RomeEvent {
  static TYPE: RomeEventType = RomeEventType.TERMINAL_CLICK_BUTTON;
  public type: RomeEventType = RomeEventType.TERMINAL_CLICK_BUTTON;
}

export class TerminalBridgeReadyEvent extends RomeEvent {
  static TYPE: RomeEventType = RomeEventType.TERMINAL_BRIDGE_READY;
  public type: RomeEventType = RomeEventType.TERMINAL_BRIDGE_READY;
}

export class WidgetUpdateButtonStatusEvent extends RomeEvent {
  static TYPE: RomeEventType = RomeEventType.WIDGET_UPDATE_BUTTON_STATUS;
  public type: RomeEventType = RomeEventType.WIDGET_UPDATE_BUTTON_STATUS;
}

export class WidgetWalletConnectEvent extends RomeEvent {
  static TYPE: RomeEventType = RomeEventType.WIDGET_WALLET_CONNECT_EVENT;
  public TYPE: RomeEventType = RomeEventType.WIDGET_WALLET_CONNECT_EVENT;
}

export class WidgetWalletDisconnectEvent extends RomeEvent {
  static TYPE: RomeEventType = RomeEventType.WIDGET_WALLET_DISCONNECT_EVENT;
  public TYPE: RomeEventType = RomeEventType.WIDGET_WALLET_DISCONNECT_EVENT;
}
