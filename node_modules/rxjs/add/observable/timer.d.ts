import { timer as staticTimer } from '../../internal/observable/timer';
declare module '../../internal/Observable' {
    namespace Observable {
        let timer: typeof staticTimer;
    }
}
