import { fromEventPattern as staticFromEventPattern } from '../../internal/observable/fromEventPattern';
declare module '../../internal/Observable' {
    namespace Observable {
        let fromEventPattern: typeof staticFromEventPattern;
    }
}
