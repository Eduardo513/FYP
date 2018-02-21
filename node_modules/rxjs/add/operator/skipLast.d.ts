import { skipLast } from '../../internal/patching/operator/skipLast';
declare module '../../internal/Observable' {
    interface Observable<T> {
        skipLast: typeof skipLast;
    }
}
