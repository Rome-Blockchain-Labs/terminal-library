declare enum RomeEventType {
    TERMINAL_CLICK_BUTTON = "rome.terminal.click_button",
    TERMINAL_BRIDGE_READY = "rome.terminal.bridge_ready",
    WIDGET_UPDATE_BUTTON_STATUS = "rome.widget.update_button_status",
    WIDGET_GOOGLE_ANALYTICS_EVENT = "rome.widget.google_analytics_event",
    WIDGET_ANALYTICS_TRANSACTION_EVENT = "rome.widget.analytics_transaction_event",
    WIDGET_GENERIC_MESSAGE = "rome.widget.generic_message"
}
declare class RomeEvent {
    type: RomeEventType | undefined;
    payload: any;
    constructor(payload: any);
}
declare type RomeEventHandler<T> = (event: T) => void;
declare class TerminalClickButtonEvent extends RomeEvent {
    static TYPE: RomeEventType;
    type: RomeEventType;
}
declare class TerminalBridgeReadyEvent extends RomeEvent {
    static TYPE: RomeEventType;
    type: RomeEventType;
}
declare class WidgetUpdateButtonStatusEvent extends RomeEvent {
    static TYPE: RomeEventType;
    type: RomeEventType;
}

declare type BridgeAnalyticsEventData = {
    [key: string]: string;
};
declare type BridgeAnalyticsTxEventData = {
    chain_id: string;
    token_address: string;
    token_amount_w_decimals: string;
    [key: string]: string;
};
declare class WidgetBridge {
    widgetId: any;
    init(): void;
    emit(type: RomeEventType, payload: any): void;
    sendAnalyticsEvent(event: string, data: BridgeAnalyticsEventData): void;
    sendAnalyticsTxEvent(event: string, txData: BridgeAnalyticsTxEventData): void;
    subscribe<T>(type: RomeEventType, handler: RomeEventHandler<T>): void;
}
declare const widgetBridge: WidgetBridge;

declare class TerminalBridge {
    iframeWindow: any;
    widgetId: string;
    constructor(widgetId: string);
    setIframeWindow(iframeWindow: any): void;
    emit(event: RomeEvent): void;
    subscribe<T>(type: RomeEventType, handler: RomeEventHandler<T>): void;
}
declare type TerminalBridgeMap = {
    [key: string]: TerminalBridge;
};
declare class TerminalBridgeFactory {
    bridges: TerminalBridgeMap;
    constructor();
    getBridge(widgetId: string): TerminalBridge;
    removeBridge(widgetId: string): void;
}
declare const terminalBridgeFactory: TerminalBridgeFactory;

export { BridgeAnalyticsEventData, BridgeAnalyticsTxEventData, RomeEvent, RomeEventHandler, RomeEventType, TerminalBridge, TerminalBridgeFactory, TerminalBridgeReadyEvent, TerminalClickButtonEvent, WidgetUpdateButtonStatusEvent, terminalBridgeFactory, widgetBridge };
