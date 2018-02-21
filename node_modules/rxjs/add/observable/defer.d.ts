import { defer as staticDefer } from '../../internal/observable/defer';
declare module '../../internal/Observable' {
    namespace Observable {
        let defer: typeof staticDefer;
    }
}
