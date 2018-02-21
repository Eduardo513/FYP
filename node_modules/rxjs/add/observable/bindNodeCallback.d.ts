import { bindNodeCallback as staticBindNodeCallback } from '../../internal/observable/bindNodeCallback';
declare module '../../internal/Observable' {
    namespace Observable {
        let bindNodeCallback: typeof staticBindNodeCallback;
    }
}
