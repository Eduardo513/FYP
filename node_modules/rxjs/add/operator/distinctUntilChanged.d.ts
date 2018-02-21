import { distinctUntilChanged } from '../../internal/patching/operator/distinctUntilChanged';
declare module '../../internal/Observable' {
    interface Observable<T> {
        distinctUntilChanged: typeof distinctUntilChanged;
    }
}
