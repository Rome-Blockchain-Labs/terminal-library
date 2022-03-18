export declare enum RomeEventType {
    TERMINAL_CLICK_BUTTON = "rome.terminal.click_button",
    TERMINAL_BRIDGE_READY = "rome.terminal.bridge_ready",
    WIDGET_UPDATE_BUTTON_STATUS = "rome.widget.update_button_status"
}
export declare class RomeEvent {
    type: RomeEventType | undefined;
    payload: any;
    constructor(payload: any);
}
export declare type RomeEventHandler<T> = (event: T) => void;
export declare class TerminalClickButtonEvent extends RomeEvent {
    static TYPE: RomeEventType;
    type: RomeEventType;
}
export declare class TerminalBridgeReadyEvent extends RomeEvent {
    static TYPE: RomeEventType;
    type: RomeEventType;
}
export declare class WidgetUpdateButtonStatusEvent extends RomeEvent {
    static TYPE: RomeEventType;
    type: RomeEventType;
}
