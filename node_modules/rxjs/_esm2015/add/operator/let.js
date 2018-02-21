import { Observable } from '../../internal/Observable';
import { letProto } from '../../internal/patching/operator/let';
Observable.prototype.let = letProto;
Observable.prototype.letBind = letProto;
//# sourceMappingURL=let.js.map