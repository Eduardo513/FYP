import { switchMap } from '../../internal/patching/operator/switchMap';
declare module '../../internal/Observable' {
    interface Observable<T> {
        switchMap: typeof switchMap;
    }
}
