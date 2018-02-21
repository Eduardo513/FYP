import { _do } from '../../internal/patching/operator/do';
declare module '../../internal/Observable' {
    interface Observable<T> {
        do: typeof _do;
        _do: typeof _do;
    }
}
