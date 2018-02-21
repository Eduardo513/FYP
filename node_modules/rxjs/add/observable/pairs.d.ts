import { pairs as staticPairs } from '../../internal/observable/pairs';
declare module '../../internal/Observable' {
    namespace Observable {
        let pairs: typeof staticPairs;
    }
}
