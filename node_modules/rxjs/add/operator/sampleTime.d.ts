import { sampleTime } from '../../internal/patching/operator/sampleTime';
declare module '../../internal/Observable' {
    interface Observable<T> {
        sampleTime: typeof sampleTime;
    }
}
