import { using as staticUsing } from '../../internal/observable/using';
declare module '../../internal/Observable' {
    namespace Observable {
        let using: typeof staticUsing;
    }
}
