"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const constants_1 = require("../../src/constants");
const order_factory_1 = require("../../src/order_factory");
const CHAIN_ID = 1337;
const BASE_TEST_ORDER = order_factory_1.orderFactory.createOrder(constants_1.constants.NULL_ADDRESS, constants_1.constants.ZERO_AMOUNT, constants_1.constants.NULL_ERC20_ASSET_DATA, constants_1.constants.ZERO_AMOUNT, constants_1.constants.NULL_ERC20_ASSET_DATA, constants_1.constants.NULL_ADDRESS, CHAIN_ID);
const BASE_TEST_SIGNED_ORDER = Object.assign({}, BASE_TEST_ORDER, { signature: constants_1.constants.NULL_BYTES });
exports.testOrderFactory = {
    generateTestSignedOrder(partialOrder) {
        return transformObject(BASE_TEST_SIGNED_ORDER, partialOrder);
    },
    generateTestSignedOrders(partialOrder, numOrders) {
        const baseTestOrders = _.map(_.range(numOrders), () => BASE_TEST_SIGNED_ORDER);
        return _.map(baseTestOrders, order => transformObject(order, partialOrder));
    },
};
function transformObject(input, transformation) {
    const copy = _.cloneDeep(input);
    return _.assign(copy, transformation);
}
//# sourceMappingURL=test_order_factory.js.map