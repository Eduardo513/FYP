import { retryWhen } from '../../internal/patching/operator/retryWhen';
declare module '../../internal/Observable' {
    interface Observable<T> {
        retryWhen: typeof retryWhen;
    }
}
