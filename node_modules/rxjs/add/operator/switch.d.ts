import { _switch } from '../../internal/patching/operator/switch';
declare module '../../internal/Observable' {
    interface Observable<T> {
        switch: typeof _switch;
        _switch: typeof _switch;
    }
}
