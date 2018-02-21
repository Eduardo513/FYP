import { Observable } from '../../internal/Observable';
import { retryWhen } from '../../internal/patching/operator/retryWhen';
Observable.prototype.retryWhen = retryWhen;
//# sourceMappingURL=retryWhen.js.map