import { timestamp } from '../../internal/patching/operator/timestamp';
declare module '../../internal/Observable' {
    interface Observable<T> {
        timestamp: typeof timestamp;
    }
}
