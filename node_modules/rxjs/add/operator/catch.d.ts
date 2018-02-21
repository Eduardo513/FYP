import { _catch } from '../../internal/patching/operator/catch';
declare module '../../internal/Observable' {
    interface Observable<T> {
        catch: typeof _catch;
        _catch: typeof _catch;
    }
}
