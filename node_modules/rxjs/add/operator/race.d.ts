import { race } from '../../internal/patching/operator/race';
declare module '../../internal/Observable' {
    interface Observable<T> {
        race: typeof race;
    }
}
