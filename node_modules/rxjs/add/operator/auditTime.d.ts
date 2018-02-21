import { auditTime } from '../../internal/patching/operator/auditTime';
declare module '../../internal/Observable' {
    interface Observable<T> {
        auditTime: typeof auditTime;
    }
}
