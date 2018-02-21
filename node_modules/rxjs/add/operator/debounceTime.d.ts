import { debounceTime } from '../../internal/patching/operator/debounceTime';
declare module '../../internal/Observable' {
    interface Observable<T> {
        debounceTime: typeof debounceTime;
    }
}
