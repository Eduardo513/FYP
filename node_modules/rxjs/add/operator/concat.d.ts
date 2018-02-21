import { concat } from '../../internal/patching/operator/concat';
declare module '../../internal/Observable' {
    interface Observable<T> {
        concat: typeof concat;
    }
}
