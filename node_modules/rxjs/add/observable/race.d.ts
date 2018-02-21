import { race as staticRace } from '../../internal/observable/race';
declare module '../../internal/Observable' {
    namespace Observable {
        let race: typeof staticRace;
    }
}
