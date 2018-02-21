import { concatMap } from '../../internal/patching/operator/concatMap';
declare module '../../internal/Observable' {
    interface Observable<T> {
        concatMap: typeof concatMap;
    }
}
