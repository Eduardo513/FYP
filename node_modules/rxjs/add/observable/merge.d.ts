import { merge as mergeStatic } from '../../internal/observable/merge';
declare module '../../internal/Observable' {
    namespace Observable {
        let merge: typeof mergeStatic;
    }
}
