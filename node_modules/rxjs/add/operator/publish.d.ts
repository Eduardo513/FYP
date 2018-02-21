import { publish } from '../../internal/patching/operator/publish';
declare module '../../internal/Observable' {
    interface Observable<T> {
        publish: typeof publish;
    }
}
