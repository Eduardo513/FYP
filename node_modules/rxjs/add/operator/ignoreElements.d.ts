import { ignoreElements } from '../../internal/patching/operator/ignoreElements';
declare module '../../internal/Observable' {
    interface Observable<T> {
        ignoreElements: typeof ignoreElements;
    }
}
