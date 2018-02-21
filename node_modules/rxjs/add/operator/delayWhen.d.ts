import { delayWhen } from '../../internal/patching/operator/delayWhen';
declare module '../../internal/Observable' {
    interface Observable<T> {
        delayWhen: typeof delayWhen;
    }
}
