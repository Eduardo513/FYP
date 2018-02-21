import { single } from '../../internal/patching/operator/single';
declare module '../../internal/Observable' {
    interface Observable<T> {
        single: typeof single;
    }
}
