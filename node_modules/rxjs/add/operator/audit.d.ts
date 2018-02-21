import { audit } from '../../internal/patching/operator/audit';
declare module '../../internal/Observable' {
    interface Observable<T> {
        audit: typeof audit;
    }
}
