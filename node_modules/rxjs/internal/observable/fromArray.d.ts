import { Observable } from '../Observable';
import { IScheduler } from '../Scheduler';
export declare function fromArray<T>(input: ArrayLike<T>, scheduler?: IScheduler): Observable<T>;
