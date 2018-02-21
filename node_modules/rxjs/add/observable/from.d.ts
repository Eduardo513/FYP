import { from as staticFrom } from '../../internal/observable/from';
declare module '../../internal/Observable' {
    namespace Observable {
        let from: typeof staticFrom;
    }
}
