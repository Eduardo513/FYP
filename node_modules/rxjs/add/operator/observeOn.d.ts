import { observeOn } from '../../internal/patching/operator/observeOn';
declare module '../../internal/Observable' {
    interface Observable<T> {
        observeOn: typeof observeOn;
    }
}
