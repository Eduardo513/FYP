import { toArray } from '../../internal/patching/operator/toArray';
declare module '../../internal/Observable' {
    interface Observable<T> {
        toArray: typeof toArray;
    }
}
