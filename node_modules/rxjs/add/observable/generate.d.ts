import { generate as staticGenerate } from '../../internal/observable/generate';
declare module '../../internal/Observable' {
    namespace Observable {
        let generate: typeof staticGenerate;
    }
}
