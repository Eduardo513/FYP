import { repeatWhen } from '../../internal/patching/operator/repeatWhen';
declare module '../../internal/Observable' {
    interface Observable<T> {
        repeatWhen: typeof repeatWhen;
    }
}
