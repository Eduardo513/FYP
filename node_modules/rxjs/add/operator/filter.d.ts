import { filter } from '../../internal/patching/operator/filter';
declare module '../../internal/Observable' {
    interface Observable<T> {
        filter: typeof filter;
    }
}
