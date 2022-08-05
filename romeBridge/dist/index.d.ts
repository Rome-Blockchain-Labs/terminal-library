declare enum RomeEventType {
    TERMINAL_CLICK_BUTTON = "rome.terminal.click_button",
    TERMINAL_BRIDGE_READY = "rome.terminal.bridge_ready",
    WIDGET_UPDATE_BUTTON_STATUS = "rome.widget.update_button_status",
    WIDGET_GOOGLE_ANALYTICS_EVENT = "rome.widget.google_analytics_event",
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

declare class WidgetBridge {
    widgetId: any;
    init(): void;
    /**
     * There may be potential issues if the widget wants to use storage/cookies before it is initialized
     * As it won't be on the namespace yet.
     *
     * A workaround for this would be for the widget to call this function directly with the prefix hardcoded
     *
     * A longer term solution to explore as a fix may be to pass the prefix to the widget via url params
     * **/
    namespaceCookiesStorage(prefix: string): void;
    emit(type: RomeEventType, payload: any): void;
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

export { RomeEvent, RomeEventHandler, RomeEventType, TerminalBridge, TerminalBridgeFactory, TerminalBridgeReadyEvent, TerminalClickButtonEvent, WidgetUpdateButtonStatusEvent, terminalBridgeFactory, widgetBridge };
