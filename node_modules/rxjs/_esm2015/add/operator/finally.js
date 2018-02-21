import { Observable } from '../../internal/Observable';
import { _finally } from '../../internal/patching/operator/finally';
Observable.prototype.finally = _finally;
Observable.prototype._finally = _finally;
//# sourceMappingURL=finally.js.map