import { switchMapTo } from '../../internal/patching/operator/switchMapTo';
declare module '../../internal/Observable' {
    interface Observable<T> {
        switchMapTo: typeof switchMapTo;
    }
}
