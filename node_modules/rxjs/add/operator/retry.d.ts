import { retry } from '../../internal/patching/operator/retry';
declare module '../../internal/Observable' {
    interface Observable<T> {
        retry: typeof retry;
    }
}
