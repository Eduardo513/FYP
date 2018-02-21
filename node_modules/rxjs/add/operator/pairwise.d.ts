import { pairwise } from '../../internal/patching/operator/pairwise';
declare module '../../internal/Observable' {
    interface Observable<T> {
        pairwise: typeof pairwise;
    }
}
