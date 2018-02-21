import { subscribeOn } from '../../internal/patching/operator/subscribeOn';
declare module '../../internal/Observable' {
    interface Observable<T> {
        subscribeOn: typeof subscribeOn;
    }
}
