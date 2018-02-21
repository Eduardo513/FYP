import { publishBehavior } from '../../internal/patching/operator/publishBehavior';
declare module '../../internal/Observable' {
    interface Observable<T> {
        publishBehavior: typeof publishBehavior;
    }
}
