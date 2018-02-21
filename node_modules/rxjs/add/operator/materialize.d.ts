import { materialize } from '../../internal/patching/operator/materialize';
declare module '../../internal/Observable' {
    interface Observable<T> {
        materialize: typeof materialize;
    }
}
