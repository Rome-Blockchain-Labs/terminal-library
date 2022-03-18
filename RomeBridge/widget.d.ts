import { RomeEventHandler, RomeEventType } from "./types";
declare class RomeBridge {
    widgetId: null;
    constructor();
    emit(type: RomeEventType, payload: any): void;
    subscribe<T>(type: RomeEventType, handler: RomeEventHandler<T>): void;
}
export declare const romeBridge: RomeBridge;
export default romeBridge;
