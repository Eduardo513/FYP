import { shareReplay } from '../../internal/patching/operator/shareReplay';
declare module '../../internal/Observable' {
    interface Observable<T> {
        shareReplay: typeof shareReplay;
    }
}
