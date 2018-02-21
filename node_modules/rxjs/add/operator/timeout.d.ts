import { timeout } from '../../internal/patching/operator/timeout';
declare module '../../internal/Observable' {
    interface Observable<T> {
        timeout: typeof timeout;
    }
}
