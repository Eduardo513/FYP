import { max } from '../../internal/patching/operator/max';
declare module '../../internal/Observable' {
    interface Observable<T> {
        max: typeof max;
    }
}
