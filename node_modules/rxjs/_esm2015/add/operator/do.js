import { Observable } from '../../internal/Observable';
import { _do } from '../../internal/patching/operator/do';
Observable.prototype.do = _do;
Observable.prototype._do = _do;
//# sourceMappingURL=do.js.map