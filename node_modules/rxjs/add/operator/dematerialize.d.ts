import { dematerialize } from '../../internal/patching/operator/dematerialize';
declare module '../../internal/Observable' {
    interface Observable<T> {
        dematerialize: typeof dematerialize;
    }
}
