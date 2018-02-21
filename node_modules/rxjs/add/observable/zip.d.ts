import { zip as zipStatic } from '../../internal/observable/zip';
declare module '../../internal/Observable' {
    namespace Observable {
        let zip: typeof zipStatic;
    }
}
