import { timeInterval } from '../../internal/patching/operator/timeInterval';
declare module '../../internal/Observable' {
    interface Observable<T> {
        timeInterval: typeof timeInterval;
    }
}
