import { startWith } from '../../internal/patching/operator/startWith';
declare module '../../internal/Observable' {
    interface Observable<T> {
        startWith: typeof startWith;
    }
}
