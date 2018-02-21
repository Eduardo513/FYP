import { last } from '../../internal/patching/operator/last';
declare module '../../internal/Observable' {
    interface Observable<T> {
        last: typeof last;
    }
}
