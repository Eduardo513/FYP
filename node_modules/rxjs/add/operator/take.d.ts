import { take } from '../../internal/patching/operator/take';
declare module '../../internal/Observable' {
    interface Observable<T> {
        take: typeof take;
    }
}
