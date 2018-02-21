import { multicast } from '../../internal/patching/operator/multicast';
declare module '../../internal/Observable' {
    interface Observable<T> {
        multicast: typeof multicast;
    }
}
