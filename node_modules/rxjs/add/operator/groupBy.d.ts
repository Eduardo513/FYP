import { groupBy } from '../../internal/patching/operator/groupBy';
declare module '../../internal/Observable' {
    interface Observable<T> {
        groupBy: typeof groupBy;
    }
}
