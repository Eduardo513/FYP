import { empty as staticEmpty } from '../../internal/observable/empty';
declare module '../../internal/Observable' {
    namespace Observable {
        let empty: typeof staticEmpty;
    }
}
