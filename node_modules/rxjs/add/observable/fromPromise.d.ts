import { fromPromise as staticFromPromise } from '../../internal/observable/fromPromise';
declare module '../../internal/Observable' {
    namespace Observable {
        let fromPromise: typeof staticFromPromise;
    }
}
