import { skipUntil } from '../../internal/patching/operator/skipUntil';
declare module '../../internal/Observable' {
    interface Observable<T> {
        skipUntil: typeof skipUntil;
    }
}
