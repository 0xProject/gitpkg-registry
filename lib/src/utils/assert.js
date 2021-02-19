"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = require("@0x/assert");
exports.assert = Object.assign({}, assert_1.assert, { isValidOrderbook(variableName, orderFetcher) {
        assert_1.assert.isFunction(`${variableName}.getOrdersAsync`, orderFetcher.getOrdersAsync.bind(orderFetcher));
        assert_1.assert.isFunction(`${variableName}.getBatchOrdersAsync`, orderFetcher.getBatchOrdersAsync.bind(orderFetcher));
    },
    isValidPercentage(variableName, percentage) {
        exports.assert.isNumber(variableName, percentage);
        exports.assert.assert(percentage >= 0 && percentage <= 1, `Expected ${variableName} to be between 0 and 1, but is ${percentage}`);
    } });
//# sourceMappingURL=assert.js.map