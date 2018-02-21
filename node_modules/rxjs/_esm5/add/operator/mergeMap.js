/** PURE_IMPORTS_START .._.._internal_Observable,.._.._internal_patching_operator_mergeMap PURE_IMPORTS_END */
import { Observable } from '../../internal/Observable';
import { mergeMap } from '../../internal/patching/operator/mergeMap';
Observable.prototype.mergeMap = mergeMap;
Observable.prototype.flatMap = mergeMap;
//# sourceMappingURL=mergeMap.js.map
