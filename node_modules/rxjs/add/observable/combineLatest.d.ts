import { combineLatest as combineLatestStatic } from '../../internal/observable/combineLatest';
declare module '../../internal/Observable' {
    namespace Observable {
        let combineLatest: typeof combineLatestStatic;
    }
}
