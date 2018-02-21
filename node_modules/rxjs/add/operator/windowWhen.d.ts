import { windowWhen } from '../../internal/patching/operator/windowWhen';
declare module '../../internal/Observable' {
    interface Observable<T> {
        windowWhen: typeof windowWhen;
    }
}
