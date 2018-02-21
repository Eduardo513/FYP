import { throttle } from '../../internal/patching/operator/throttle';
declare module '../../internal/Observable' {
    interface Observable<T> {
        throttle: typeof throttle;
    }
}
