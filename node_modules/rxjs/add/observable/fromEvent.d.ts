import { fromEvent as staticFromEvent } from '../../internal/observable/fromEvent';
declare module '../../internal/Observable' {
    namespace Observable {
        let fromEvent: typeof staticFromEvent;
    }
}
