export enum RomeEventType {
  TERMINAL_CLICK_BUTTON = "rome.terminal.click_button",
  TERMINAL_BRIDGE_READY = "rome.terminal.bridge_ready",

  WIDGET_UPDATE_BUTTON_STATUS = "rome.widget.update_button_status",
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
