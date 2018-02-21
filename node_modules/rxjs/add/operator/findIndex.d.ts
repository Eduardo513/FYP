import { findIndex } from '../../internal/patching/operator/findIndex';
declare module '../../internal/Observable' {
    interface Observable<T> {
        findIndex: typeof findIndex;
    }
}
