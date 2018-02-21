import { mapTo } from '../../internal/patching/operator/mapTo';
declare module '../../internal/Observable' {
    interface Observable<T> {
        mapTo: typeof mapTo;
    }
}
