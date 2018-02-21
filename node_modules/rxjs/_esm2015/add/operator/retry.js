import { Observable } from '../../internal/Observable';
import { retry } from '../../internal/patching/operator/retry';
Observable.prototype.retry = retry;
//# sourceMappingURL=retry.js.map