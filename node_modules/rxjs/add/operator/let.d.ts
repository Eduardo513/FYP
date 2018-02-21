import { letProto } from '../../internal/patching/operator/let';
declare module '../../internal/Observable' {
    interface Observable<T> {
        let: typeof letProto;
        letBind: typeof letProto;
    }
}
