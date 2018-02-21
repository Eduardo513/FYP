import { takeUntil } from '../../internal/patching/operator/takeUntil';
declare module '../../internal/Observable' {
    interface Observable<T> {
        takeUntil: typeof takeUntil;
    }
}
