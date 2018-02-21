import { withLatestFrom } from '../../internal/patching/operator/withLatestFrom';
declare module '../../internal/Observable' {
    interface Observable<T> {
        withLatestFrom: typeof withLatestFrom;
    }
}
