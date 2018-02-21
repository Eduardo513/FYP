import { bufferToggle } from '../../internal/patching/operator/bufferToggle';
declare module '../../internal/Observable' {
    interface Observable<T> {
        bufferToggle: typeof bufferToggle;
    }
}
