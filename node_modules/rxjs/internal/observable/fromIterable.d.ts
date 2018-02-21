import { Observable } from '../Observable';
import { IScheduler } from '../Scheduler';
export declare function fromIterable<T>(input: Iterable<T>, scheduler: IScheduler): Observable<T>;
