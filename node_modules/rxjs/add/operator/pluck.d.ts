import { pluck } from '../../internal/patching/operator/pluck';
declare module '../../internal/Observable' {
    interface Observable<T> {
        pluck: typeof pluck;
    }
}
