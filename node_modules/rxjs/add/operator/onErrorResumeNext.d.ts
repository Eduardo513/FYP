import { onErrorResumeNext } from '../../internal/patching/operator/onErrorResumeNext';
declare module '../../internal/Observable' {
    interface Observable<T> {
        onErrorResumeNext: typeof onErrorResumeNext;
    }
}
