declare enum RomeEventType {
    TERMINAL_CLICK_BUTTON = "rome.terminal.click_button",
    TERMINAL_BRIDGE_READY = "rome.terminal.bridge_ready",
    WIDGET_UPDATE_BUTTON_STATUS = "rome.widget.update_button_status"
}
declare class RomeEvent {
    type: RomeEventType | undefined;
    payload: any;
    constructor(payload: any);
}
declare type RomeEventHandler<T> = (event: T) => void;

declare class RomeBridge$1 {
    widgetId: null;
    init(): void;
    emit(type: RomeEventType, payload: any): void;
    subscribe<T>(type: RomeEventType, handler: RomeEventHandler<T>): void;
}
declare const romeBridge: RomeBridge$1;

declare const widget_romeBridge: typeof romeBridge;
declare namespace widget {
  export {
    romeBridge as default,
    widget_romeBridge as romeBridge,
  };
}

declare class RomeBridge {
    iframeWindow: any;
    widgetId: string;
    constructor(widgetId: string);
    setIframeWindow(iframeWindow: any): void;
    emit(event: RomeEvent): void;
    subscribe<T>(type: RomeEventType, handler: RomeEventHandler<T>): void;
}
declare type RomeBridgeMap = {
    [key: string]: RomeBridge;
};
declare class RomeBridgeFactory {
    bridges: RomeBridgeMap;
    constructor();
    getBridge(widgetId: string): RomeBridge;
    removeBridge(widgetId: string): void;
}
declare const romeBridgeFactory: RomeBridgeFactory;

type terminal_RomeBridge = RomeBridge;
declare const terminal_RomeBridge: typeof RomeBridge;
type terminal_RomeBridgeFactory = RomeBridgeFactory;
declare const terminal_RomeBridgeFactory: typeof RomeBridgeFactory;
declare const terminal_romeBridgeFactory: typeof romeBridgeFactory;
declare namespace terminal {
  export {
    romeBridgeFactory as default,
    terminal_RomeBridge as RomeBridge,
    terminal_RomeBridgeFactory as RomeBridgeFactory,
    terminal_romeBridgeFactory as romeBridgeFactory,
  };
}

export { terminal as Terminal, widget as Widget };
