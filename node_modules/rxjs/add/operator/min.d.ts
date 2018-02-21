import { min } from '../../internal/patching/operator/min';
declare module '../../internal/Observable' {
    interface Observable<T> {
        min: typeof min;
    }
}
