import { Observable } from '../../internal/Observable';
import { subscribeOn } from '../../internal/patching/operator/subscribeOn';
Observable.prototype.subscribeOn = subscribeOn;
//# sourceMappingURL=subscribeOn.js.map