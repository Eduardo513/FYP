import { bufferTime } from '../../internal/patching/operator/bufferTime';
declare module '../../internal/Observable' {
    interface Observable<T> {
        bufferTime: typeof bufferTime;
    }
}
