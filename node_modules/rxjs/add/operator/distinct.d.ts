import { distinct } from '../../internal/patching/operator/distinct';
declare module '../../internal/Observable' {
    interface Observable<T> {
        distinct: typeof distinct;
    }
}
