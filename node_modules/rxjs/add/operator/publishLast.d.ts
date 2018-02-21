import { publishLast } from '../../internal/patching/operator/publishLast';
declare module '../../internal/Observable' {
    interface Observable<T> {
        publishLast: typeof publishLast;
    }
}
