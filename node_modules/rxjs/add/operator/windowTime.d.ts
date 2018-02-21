import { windowTime } from '../../internal/patching/operator/windowTime';
declare module '../../internal/Observable' {
    interface Observable<T> {
        windowTime: typeof windowTime;
    }
}
