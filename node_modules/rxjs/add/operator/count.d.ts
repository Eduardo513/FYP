import { count } from '../../internal/patching/operator/count';
declare module '../../internal/Observable' {
    interface Observable<T> {
        count: typeof count;
    }
}
