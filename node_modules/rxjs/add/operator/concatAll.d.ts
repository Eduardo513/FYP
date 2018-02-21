import { concatAll } from '../../internal/patching/operator/concatAll';
declare module '../../internal/Observable' {
    interface Observable<T> {
        concatAll: typeof concatAll;
    }
}
