import { concatMapTo } from '../../internal/patching/operator/concatMapTo';
declare module '../../internal/Observable' {
    interface Observable<T> {
        concatMapTo: typeof concatMapTo;
    }
}
