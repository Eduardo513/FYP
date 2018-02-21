import { exhaust } from '../../internal/patching/operator/exhaust';
declare module '../../internal/Observable' {
    interface Observable<T> {
        exhaust: typeof exhaust;
    }
}
