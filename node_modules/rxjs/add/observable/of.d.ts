import { of as staticOf } from '../../internal/observable/of';
declare module '../../internal/Observable' {
    namespace Observable {
        let of: typeof staticOf;
    }
}
