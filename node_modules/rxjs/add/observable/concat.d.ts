import { concat as concatStatic } from '../../internal/observable/concat';
declare module '../../internal/Observable' {
    namespace Observable {
        let concat: typeof concatStatic;
    }
}
