import { publishReplay } from '../../internal/patching/operator/publishReplay';
declare module '../../internal/Observable' {
    interface Observable<T> {
        publishReplay: typeof publishReplay;
    }
}
