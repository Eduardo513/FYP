import { AjaxCreationMethod } from '../../../internal/observable/dom/AjaxObservable';
declare module '../../../internal/Observable' {
    namespace Observable {
        let ajax: AjaxCreationMethod;
    }
}
