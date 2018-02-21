"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Observable_1 = require("../../internal/Observable");
var concat_1 = require("../../internal/patching/operator/concat");
Observable_1.Observable.prototype.concat = concat_1.concat;
//# sourceMappingURL=concat.js.map