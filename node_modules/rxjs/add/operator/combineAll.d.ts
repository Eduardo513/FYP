import { combineAll } from '../../internal/patching/operator/combineAll';
declare module '../../internal/Observable' {
    interface Observable<T> {
        combineAll: typeof combineAll;
    }
}
