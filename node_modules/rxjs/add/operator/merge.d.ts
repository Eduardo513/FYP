import { merge } from '../../internal/patching/operator/merge';
declare module '../../internal/Observable' {
    interface Observable<T> {
        merge: typeof merge;
    }
}
