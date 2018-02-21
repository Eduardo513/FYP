import { exhaustMap } from '../../internal/patching/operator/exhaustMap';
declare module '../../internal/Observable' {
    interface Observable<T> {
        exhaustMap: typeof exhaustMap;
    }
}
