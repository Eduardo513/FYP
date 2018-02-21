import { Observable } from '../../internal/Observable';
import { onErrorResumeNext } from '../../internal/patching/operator/onErrorResumeNext';
Observable.prototype.onErrorResumeNext = onErrorResumeNext;
//# sourceMappingURL=onErrorResumeNext.js.map