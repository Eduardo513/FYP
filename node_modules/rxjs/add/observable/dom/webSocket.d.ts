import { webSocket as staticWebSocket } from '../../../internal/observable/dom/webSocket';
declare module '../../../internal/Observable' {
    namespace Observable {
        let webSocket: typeof staticWebSocket;
    }
}
