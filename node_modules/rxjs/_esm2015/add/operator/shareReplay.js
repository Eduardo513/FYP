import { Observable } from '../../internal/Observable';
import { shareReplay } from '../../internal/patching/operator/shareReplay';
Observable.prototype.shareReplay = shareReplay;
//# sourceMappingURL=shareReplay.js.map