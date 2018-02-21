import { delay } from '../../internal/patching/operator/delay';
declare module '../../internal/Observable' {
    interface Observable<T> {
        delay: typeof delay;
    }
}
