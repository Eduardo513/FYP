import { zipProto } from '../../internal/patching/operator/zip';
declare module '../../internal/Observable' {
    interface Observable<T> {
        zip: typeof zipProto;
    }
}
