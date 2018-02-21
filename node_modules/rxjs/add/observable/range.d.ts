import { range as staticRange } from '../../internal/observable/range';
declare module '../../internal/Observable' {
    namespace Observable {
        let range: typeof staticRange;
    }
}
