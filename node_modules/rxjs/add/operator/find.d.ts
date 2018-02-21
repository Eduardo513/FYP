import { find } from '../../internal/patching/operator/find';
declare module '../../internal/Observable' {
    interface Observable<T> {
        find: typeof find;
    }
}
