import { windowCount } from '../../internal/patching/operator/windowCount';
declare module '../../internal/Observable' {
    interface Observable<T> {
        windowCount: typeof windowCount;
    }
}
