"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const test_order_factory_1 = require("./test_order_factory");
const utils_1 = require("./utils");
// tslint:disable:custom-no-magic-numbers
const FAKE_ERC20_TAKER_ASSET_DATA = '0xf47261b02222222222222222222222222222222222222222222222222222222222222222';
const FAKE_ERC20_MAKER_ASSET_DATA = '0xf47261b01111111111111111111111111111111111111111111111111111111111111111';
const PARTIAL_ORDER = {
    takerAssetData: FAKE_ERC20_TAKER_ASSET_DATA,
    makerAssetData: FAKE_ERC20_MAKER_ASSET_DATA,
};
const PARTIAL_ORDER_FEE_IN_TAKER_ASSET = Object.assign({
    takerFeeAssetData: FAKE_ERC20_TAKER_ASSET_DATA,
}, PARTIAL_ORDER);
const PARTIAL_ORDER_FEE_IN_MAKER_ASSET = Object.assign({
    takerFeeAssetData: FAKE_ERC20_MAKER_ASSET_DATA,
}, PARTIAL_ORDER);
const PARTIAL_ORDERS_WITH_FILLABLE_AMOUNTS_FEELESS = [
    Object.assign({
        takerAssetAmount: utils_1.baseUnitAmount(1),
        makerAssetAmount: utils_1.baseUnitAmount(6),
        fillableTakerAssetAmount: utils_1.baseUnitAmount(1),
        fillableMakerAssetAmount: utils_1.baseUnitAmount(6),
    }, PARTIAL_ORDER),
    Object.assign({
        takerAssetAmount: utils_1.baseUnitAmount(10),
        makerAssetAmount: utils_1.baseUnitAmount(4),
        fillableTakerAssetAmount: utils_1.baseUnitAmount(5),
        fillableMakerAssetAmount: utils_1.baseUnitAmount(2),
    }, PARTIAL_ORDER),
    Object.assign({
        takerAssetAmount: utils_1.baseUnitAmount(6),
        makerAssetAmount: utils_1.baseUnitAmount(6),
        fillableTakerAssetAmount: utils_1.baseUnitAmount(3),
        fillableMakerAssetAmount: utils_1.baseUnitAmount(3),
    }, PARTIAL_ORDER),
];
const PARTIAL_ORDERS_WITH_FILLABLE_AMOUNTS_FEE_IN_TAKER_ASSET = [
    Object.assign({
        takerAssetAmount: utils_1.baseUnitAmount(1),
        makerAssetAmount: utils_1.baseUnitAmount(6),
        takerFee: utils_1.baseUnitAmount(3),
        fillableTakerAssetAmount: utils_1.baseUnitAmount(1),
        fillableMakerAssetAmount: utils_1.baseUnitAmount(6),
        fillableTakerFeeAmount: utils_1.baseUnitAmount(3),
    }, PARTIAL_ORDER_FEE_IN_TAKER_ASSET),
    Object.assign({
        takerAssetAmount: utils_1.baseUnitAmount(10),
        makerAssetAmount: utils_1.baseUnitAmount(4),
        takerFee: utils_1.baseUnitAmount(2),
        fillableTakerAssetAmount: utils_1.baseUnitAmount(5),
        fillableMakerAssetAmount: utils_1.baseUnitAmount(2),
        fillableTakerFeeAmount: utils_1.baseUnitAmount(1),
    }, PARTIAL_ORDER_FEE_IN_TAKER_ASSET),
    Object.assign({
        takerAssetAmount: utils_1.baseUnitAmount(6),
        makerAssetAmount: utils_1.baseUnitAmount(6),
        takerFee: utils_1.baseUnitAmount(4),
        fillableTakerAssetAmount: utils_1.baseUnitAmount(3),
        fillableMakerAssetAmount: utils_1.baseUnitAmount(3),
        fillableTakerFeeAmount: utils_1.baseUnitAmount(2),
    }, PARTIAL_ORDER_FEE_IN_TAKER_ASSET),
];
const PARTIAL_ORDERS_WITH_FILLABLE_AMOUNTS_FEE_IN_MAKER_ASSET = [
    Object.assign({
        takerAssetAmount: utils_1.baseUnitAmount(5),
        makerAssetAmount: utils_1.baseUnitAmount(2),
        takerFee: utils_1.baseUnitAmount(1),
        fillableTakerAssetAmount: utils_1.baseUnitAmount(5),
        fillableMakerAssetAmount: utils_1.baseUnitAmount(2),
        fillableTakerFeeAmount: utils_1.baseUnitAmount(1),
    }, PARTIAL_ORDER_FEE_IN_MAKER_ASSET),
    Object.assign({
        takerAssetAmount: utils_1.baseUnitAmount(2),
        makerAssetAmount: utils_1.baseUnitAmount(12),
        takerFee: utils_1.baseUnitAmount(6),
        fillableTakerAssetAmount: utils_1.baseUnitAmount(1),
        fillableMakerAssetAmount: utils_1.baseUnitAmount(6),
        fillableTakerFeeAmount: utils_1.baseUnitAmount(3),
    }, PARTIAL_ORDER_FEE_IN_MAKER_ASSET),
    Object.assign({
        takerAssetAmount: utils_1.baseUnitAmount(3),
        makerAssetAmount: utils_1.baseUnitAmount(3),
        takerFee: utils_1.baseUnitAmount(2),
        fillableTakerAssetAmount: utils_1.baseUnitAmount(3),
        fillableMakerAssetAmount: utils_1.baseUnitAmount(3),
        fillableTakerFeeAmount: utils_1.baseUnitAmount(2),
    }, PARTIAL_ORDER_FEE_IN_MAKER_ASSET),
];
const SIGNED_ORDERS_WITH_FILLABLE_AMOUNTS_FEELESS = test_order_factory_1.testOrderFactory.generateTestSignedOrdersWithFillableAmounts(PARTIAL_ORDERS_WITH_FILLABLE_AMOUNTS_FEELESS);
const SIGNED_ORDERS_WITH_FILLABLE_AMOUNTS_FEE_IN_TAKER_ASSET = test_order_factory_1.testOrderFactory.generateTestSignedOrdersWithFillableAmounts(PARTIAL_ORDERS_WITH_FILLABLE_AMOUNTS_FEE_IN_TAKER_ASSET);
const SIGNED_ORDERS_WITH_FILLABLE_AMOUNTS_FEE_IN_MAKER_ASSET = test_order_factory_1.testOrderFactory.generateTestSignedOrdersWithFillableAmounts(PARTIAL_ORDERS_WITH_FILLABLE_AMOUNTS_FEE_IN_MAKER_ASSET);
exports.testOrders = {
    SIGNED_ORDERS_WITH_FILLABLE_AMOUNTS_FEELESS,
    SIGNED_ORDERS_WITH_FILLABLE_AMOUNTS_FEE_IN_TAKER_ASSET,
    SIGNED_ORDERS_WITH_FILLABLE_AMOUNTS_FEE_IN_MAKER_ASSET,
};
//# sourceMappingURL=test_orders.js.map