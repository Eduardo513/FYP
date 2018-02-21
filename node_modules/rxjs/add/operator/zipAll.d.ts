import { zipAll } from '../../internal/patching/operator/zipAll';
declare module '../../internal/Observable' {
    interface Observable<T> {
        zipAll: typeof zipAll;
    }
}
