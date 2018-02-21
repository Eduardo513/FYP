import { skip } from '../../internal/patching/operator/skip';
declare module '../../internal/Observable' {
    interface Observable<T> {
        skip: typeof skip;
    }
}
