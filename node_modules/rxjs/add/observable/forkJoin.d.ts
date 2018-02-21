import { forkJoin as staticForkJoin } from '../../internal/observable/forkJoin';
declare module '../../internal/Observable' {
    namespace Observable {
        let forkJoin: typeof staticForkJoin;
    }
}
