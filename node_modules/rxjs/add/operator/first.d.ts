import { first } from '../../internal/patching/operator/first';
declare module '../../internal/Observable' {
    interface Observable<T> {
        first: typeof first;
    }
}
