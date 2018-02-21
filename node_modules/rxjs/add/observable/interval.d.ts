import { interval as staticInterval } from '../../internal/observable/interval';
declare module '../../internal/Observable' {
    namespace Observable {
        let interval: typeof staticInterval;
    }
}
