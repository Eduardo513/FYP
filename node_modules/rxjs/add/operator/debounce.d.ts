import { debounce } from '../../internal/patching/operator/debounce';
declare module '../../internal/Observable' {
    interface Observable<T> {
        debounce: typeof debounce;
    }
}
