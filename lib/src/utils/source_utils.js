"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var constants_1 = require("./market_operation_utils/constants");
exports.isCurveSource = function (source) {
    return Object.keys(constants_1.DEFAULT_CURVE_OPTS).includes(source);
};
exports.getCurveInfo = function (source, takerToken, makerToken) {
    var _a = constants_1.DEFAULT_CURVE_OPTS[source], curveAddress = _a.curveAddress, tokens = _a.tokens, version = _a.version;
    var fromTokenIdx = tokens.indexOf(takerToken);
    var toTokenIdx = tokens.indexOf(makerToken);
    return { curveAddress: curveAddress, fromTokenIdx: fromTokenIdx, toTokenIdx: toTokenIdx, version: version };
};
//# sourceMappingURL=source_utils.js.map