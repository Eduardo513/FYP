import { map } from '../../internal/patching/operator/map';
declare module '../../internal/Observable' {
    interface Observable<T> {
        map: typeof map;
    }
}
