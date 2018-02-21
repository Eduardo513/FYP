import { throttleTime } from '../../internal/patching/operator/throttleTime';
declare module '../../internal/Observable' {
    interface Observable<T> {
        throttleTime: typeof throttleTime;
    }
}
