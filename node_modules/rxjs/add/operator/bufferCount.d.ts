import { bufferCount } from '../../internal/patching/operator/bufferCount';
declare module '../../internal/Observable' {
    interface Observable<T> {
        bufferCount: typeof bufferCount;
    }
}
