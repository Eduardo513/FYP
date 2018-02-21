import { every } from '../../internal/patching/operator/every';
declare module '../../internal/Observable' {
    interface Observable<T> {
        every: typeof every;
    }
}
