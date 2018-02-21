import { isEmpty } from '../../internal/patching/operator/isEmpty';
declare module '../../internal/Observable' {
    interface Observable<T> {
        isEmpty: typeof isEmpty;
    }
}
