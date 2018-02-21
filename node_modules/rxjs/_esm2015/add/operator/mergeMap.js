import { Observable } from '../../internal/Observable';
import { mergeMap } from '../../internal/patching/operator/mergeMap';
Observable.prototype.mergeMap = mergeMap;
Observable.prototype.flatMap = mergeMap;
//# sourceMappingURL=mergeMap.js.map