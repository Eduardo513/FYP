import { windowToggle } from '../../internal/patching/operator/windowToggle';
declare module '../../internal/Observable' {
    interface Observable<T> {
        windowToggle: typeof windowToggle;
    }
}
