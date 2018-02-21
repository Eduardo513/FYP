import { distinctUntilKeyChanged } from '../../internal/patching/operator/distinctUntilKeyChanged';
declare module '../../internal/Observable' {
    interface Observable<T> {
        distinctUntilKeyChanged: typeof distinctUntilKeyChanged;
    }
}
