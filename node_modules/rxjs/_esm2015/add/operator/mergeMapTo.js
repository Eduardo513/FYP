import { Observable } from '../../internal/Observable';
import { mergeMapTo } from '../../internal/patching/operator/mergeMapTo';
Observable.prototype.flatMapTo = mergeMapTo;
Observable.prototype.mergeMapTo = mergeMapTo;
//# sourceMappingURL=mergeMapTo.js.map