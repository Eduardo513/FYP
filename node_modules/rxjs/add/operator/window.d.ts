import { window } from '../../internal/patching/operator/window';
declare module '../../internal/Observable' {
    interface Observable<T> {
        window: typeof window;
    }
}
