import { expand } from '../../internal/patching/operator/expand';
declare module '../../internal/Observable' {
    interface Observable<T> {
        expand: typeof expand;
    }
}
