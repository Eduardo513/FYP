import { scan } from '../../internal/patching/operator/scan';
declare module '../../internal/Observable' {
    interface Observable<T> {
        scan: typeof scan;
    }
}
