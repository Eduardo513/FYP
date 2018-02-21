import { elementAt } from '../../internal/patching/operator/elementAt';
declare module '../../internal/Observable' {
    interface Observable<T> {
        elementAt: typeof elementAt;
    }
}
