import { bindCallback as staticBindCallback } from '../../internal/observable/bindCallback';
declare module '../../internal/Observable' {
    namespace Observable {
        let bindCallback: typeof staticBindCallback;
    }
}
