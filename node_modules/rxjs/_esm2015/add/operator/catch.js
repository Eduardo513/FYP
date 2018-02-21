import { Observable } from '../../internal/Observable';
import { _catch } from '../../internal/patching/operator/catch';
Observable.prototype.catch = _catch;
Observable.prototype._catch = _catch;
//# sourceMappingURL=catch.js.map