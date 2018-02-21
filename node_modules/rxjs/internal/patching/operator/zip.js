"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var zip_1 = require("../../observable/zip");
/* tslint:enable:max-line-length */
/**
 * @param observables
 * @return {Observable<R>}
 * @method zip
 * @owner Observable
 */
function zipProto() {
    var observables = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        observables[_i] = arguments[_i];
    }
    return this.lift.call(zip_1.zip.apply(void 0, [this].concat(observables)));
}
exports.zipProto = zipProto;
//# sourceMappingURL=zip.js.map