import { bufferWhen } from '../../internal/patching/operator/bufferWhen';
declare module '../../internal/Observable' {
    interface Observable<T> {
        bufferWhen: typeof bufferWhen;
    }
}
