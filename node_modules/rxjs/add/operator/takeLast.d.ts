import { takeLast } from '../../internal/patching/operator/takeLast';
declare module '../../internal/Observable' {
    interface Observable<T> {
        takeLast: typeof takeLast;
    }
}
