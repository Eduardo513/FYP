import { sequenceEqual } from '../../internal/patching/operator/sequenceEqual';
declare module '../../internal/Observable' {
    interface Observable<T> {
        sequenceEqual: typeof sequenceEqual;
    }
}
