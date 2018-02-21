import { combineLatest } from '../../internal/patching/operator/combineLatest';
declare module '../../internal/Observable' {
    interface Observable<T> {
        combineLatest: typeof combineLatest;
    }
}
