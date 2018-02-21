import { mergeScan } from '../../internal/patching/operator/mergeScan';
declare module '../../internal/Observable' {
    interface Observable<T> {
        mergeScan: typeof mergeScan;
    }
}
