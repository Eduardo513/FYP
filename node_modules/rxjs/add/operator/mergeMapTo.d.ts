import { mergeMapTo } from '../../internal/patching/operator/mergeMapTo';
declare module '../../internal/Observable' {
    interface Observable<T> {
        flatMapTo: typeof mergeMapTo;
        mergeMapTo: typeof mergeMapTo;
    }
}
