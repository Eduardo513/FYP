import { defaultIfEmpty } from '../../internal/patching/operator/defaultIfEmpty';
declare module '../../internal/Observable' {
    interface Observable<T> {
        defaultIfEmpty: typeof defaultIfEmpty;
    }
}
