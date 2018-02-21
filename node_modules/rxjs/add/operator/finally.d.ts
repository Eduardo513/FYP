import { _finally } from '../../internal/patching/operator/finally';
declare module '../../internal/Observable' {
    interface Observable<T> {
        finally: typeof _finally;
        _finally: typeof _finally;
    }
}
