import { RomeEvent, RomeEventHandler, RomeEventType } from "./types";
export declare class RomeBridge {
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
export declare class RomeBridgeFactory {
    bridges: RomeBridgeMap;
    constructor();
    getBridge(widgetId: string): RomeBridge;
    removeBridge(widgetId: string): void;
}
export declare const romeBridgeFactory: RomeBridgeFactory;
export default romeBridgeFactory;
