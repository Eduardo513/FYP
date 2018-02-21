import { takeWhile } from '../../internal/patching/operator/takeWhile';
declare module '../../internal/Observable' {
    interface Observable<T> {
        takeWhile: typeof takeWhile;
    }
}
