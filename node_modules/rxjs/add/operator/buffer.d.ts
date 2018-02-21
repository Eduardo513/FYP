import { buffer } from '../../internal/patching/operator/buffer';
declare module '../../internal/Observable' {
    interface Observable<T> {
        buffer: typeof buffer;
    }
}
