import { Observable } from '../../internal/Observable';
import { publishReplay } from '../../internal/patching/operator/publishReplay';
Observable.prototype.publishReplay = publishReplay;
//# sourceMappingURL=publishReplay.js.map