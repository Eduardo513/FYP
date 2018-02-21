import { repeat } from '../../internal/patching/operator/repeat';
declare module '../../internal/Observable' {
    interface Observable<T> {
        repeat: typeof repeat;
    }
}
