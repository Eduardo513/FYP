import { mergeAll } from '../../internal/patching/operator/mergeAll';
declare module '../../internal/Observable' {
    interface Observable<T> {
        mergeAll: typeof mergeAll;
    }
}
