import { mergeMap } from '../../internal/patching/operator/mergeMap';
declare module '../../internal/Observable' {
    interface Observable<T> {
        flatMap: typeof mergeMap;
        mergeMap: typeof mergeMap;
    }
}
