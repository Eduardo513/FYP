"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Observable_1 = require("../../internal/Observable");
var retry_1 = require("../../internal/patching/operator/retry");
Observable_1.Observable.prototype.retry = retry_1.retry;
//# sourceMappingURL=retry.js.map