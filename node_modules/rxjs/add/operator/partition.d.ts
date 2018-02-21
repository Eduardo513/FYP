import { partition } from '../../internal/patching/operator/partition';
declare module '../../internal/Observable' {
    interface Observable<T> {
        partition: typeof partition;
    }
}
