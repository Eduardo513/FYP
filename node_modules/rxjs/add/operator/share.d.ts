import { share } from '../../internal/patching/operator/share';
declare module '../../internal/Observable' {
    interface Observable<T> {
        share: typeof share;
    }
}
