import { timeoutWith } from '../../internal/patching/operator/timeoutWith';
declare module '../../internal/Observable' {
    interface Observable<T> {
        timeoutWith: typeof timeoutWith;
    }
}
