"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const order_factory_1 = require("@0x/order-utils/lib/src/order_factory");
const _ = require("lodash");
const constants_1 = require("../../src/constants");
const CHAIN_ID = 1337;
const BASE_TEST_ORDER = order_factory_1.orderFactory.createOrder(constants_1.constants.NULL_ADDRESS, constants_1.constants.ZERO_AMOUNT, constants_1.constants.NULL_ERC20_ASSET_DATA, constants_1.constants.ZERO_AMOUNT, constants_1.constants.NULL_ERC20_ASSET_DATA, constants_1.constants.NULL_ADDRESS, CHAIN_ID);
const BASE_TEST_SIGNED_ORDER = Object.assign({}, BASE_TEST_ORDER, { signature: constants_1.constants.NULL_BYTES });
const BASE_TEST_PRUNED_SIGNED_ORDER = Object.assign({}, BASE_TEST_SIGNED_ORDER, { fillableMakerAssetAmount: constants_1.constants.ZERO_AMOUNT, fillableTakerAssetAmount: constants_1.constants.ZERO_AMOUNT, fillableTakerFeeAmount: constants_1.constants.ZERO_AMOUNT });
exports.testOrderFactory = {
    generateTestSignedOrder(partialOrder) {
        return transformObject(BASE_TEST_SIGNED_ORDER, partialOrder);
    },
    generateIdenticalTestSignedOrders(partialOrder, numOrders) {
        const baseTestOrders = _.map(_.range(numOrders), () => BASE_TEST_SIGNED_ORDER);
        return _.map(baseTestOrders, order => transformObject(order, partialOrder));
    },
    generateTestSignedOrders(partialOrders) {
        return _.map(partialOrders, partialOrder => transformObject(BASE_TEST_SIGNED_ORDER, partialOrder));
    },
    generateTestSignedOrderWithFillableAmounts(partialOrder) {
        return transformObject(BASE_TEST_PRUNED_SIGNED_ORDER, partialOrder);
    },
    generateIdenticalTestSignedOrdersWithFillableAmounts(partialOrder, numOrders) {
        const baseTestOrders = _.map(_.range(numOrders), () => BASE_TEST_PRUNED_SIGNED_ORDER);
        return _.map(baseTestOrders, (baseOrder) => transformObject(baseOrder, partialOrder));
    },
    generateTestSignedOrdersWithFillableAmounts(partialOrders) {
        return _.map(partialOrders, (partialOrder) => transformObject(BASE_TEST_PRUNED_SIGNED_ORDER, partialOrder));
    },
};
function transformObject(input, transformation) {
    const copy = _.cloneDeep(input);
    return _.assign(copy, transformation);
}
//# sourceMappingURL=test_order_factory.js.map