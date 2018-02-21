import { reduce } from '../../internal/patching/operator/reduce';
declare module '../../internal/Observable' {
    interface Observable<T> {
        reduce: typeof reduce;
    }
}
