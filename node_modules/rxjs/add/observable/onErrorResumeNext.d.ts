import { onErrorResumeNext as staticOnErrorResumeNext } from '../../internal/observable/onErrorResumeNext';
declare module '../../internal/Observable' {
    namespace Observable {
        let onErrorResumeNext: typeof staticOnErrorResumeNext;
    }
}
