import { sample } from '../../internal/patching/operator/sample';
declare module '../../internal/Observable' {
    interface Observable<T> {
        sample: typeof sample;
    }
}
