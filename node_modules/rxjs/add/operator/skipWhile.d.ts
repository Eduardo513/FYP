import { skipWhile } from '../../internal/patching/operator/skipWhile';
declare module '../../internal/Observable' {
    interface Observable<T> {
        skipWhile: typeof skipWhile;
    }
}
