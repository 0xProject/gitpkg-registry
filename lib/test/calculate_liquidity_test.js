"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai = require("chai");
const _ = require("lodash");
require("mocha");
const calculate_liquidity_1 = require("../src/utils/calculate_liquidity");
const chai_setup_1 = require("./utils/chai_setup");
const test_orders_1 = require("./utils/test_orders");
const utils_1 = require("./utils/utils");
chai_setup_1.chaiSetup.configure();
const expect = chai.expect;
const { SIGNED_ORDERS_WITH_FILLABLE_AMOUNTS_FEELESS, SIGNED_ORDERS_WITH_FILLABLE_AMOUNTS_FEE_IN_MAKER_ASSET, SIGNED_ORDERS_WITH_FILLABLE_AMOUNTS_FEE_IN_TAKER_ASSET, } = test_orders_1.testOrders;
// tslint:disable:custom-no-magic-numbers
describe('#calculateLiquidity', () => {
    it('should provide correct liquidity result with feeless orders', () => {
        const prunedSignedOrders = SIGNED_ORDERS_WITH_FILLABLE_AMOUNTS_FEELESS;
        const { makerAssetAvailableInBaseUnits, takerAssetAvailableInBaseUnits } = calculate_liquidity_1.calculateLiquidity(prunedSignedOrders);
        expect(makerAssetAvailableInBaseUnits).to.bignumber.eq(utils_1.baseUnitAmount(11));
        expect(takerAssetAvailableInBaseUnits).to.bignumber.eq(utils_1.baseUnitAmount(9));
    });
    it('should provide correct liquidity result with orders with takerFees in takerAsset', () => {
        const prunedSignedOrders = SIGNED_ORDERS_WITH_FILLABLE_AMOUNTS_FEE_IN_TAKER_ASSET;
        const { makerAssetAvailableInBaseUnits, takerAssetAvailableInBaseUnits } = calculate_liquidity_1.calculateLiquidity(prunedSignedOrders);
        expect(makerAssetAvailableInBaseUnits).to.bignumber.eq(utils_1.baseUnitAmount(11));
        expect(takerAssetAvailableInBaseUnits).to.bignumber.eq(utils_1.baseUnitAmount(15));
    });
    it('should provide correct liquidity result with orders with takerFees in makerAsset', () => {
        const prunedSignedOrders = SIGNED_ORDERS_WITH_FILLABLE_AMOUNTS_FEE_IN_MAKER_ASSET;
        const { makerAssetAvailableInBaseUnits, takerAssetAvailableInBaseUnits } = calculate_liquidity_1.calculateLiquidity(prunedSignedOrders);
        expect(makerAssetAvailableInBaseUnits).to.bignumber.eq(utils_1.baseUnitAmount(5));
        expect(takerAssetAvailableInBaseUnits).to.bignumber.eq(utils_1.baseUnitAmount(9));
    });
    it('should provide correct liquidity result with mixed orders with fees and no fees', () => {
        const prunedSignedOrders = _.concat(SIGNED_ORDERS_WITH_FILLABLE_AMOUNTS_FEE_IN_MAKER_ASSET, SIGNED_ORDERS_WITH_FILLABLE_AMOUNTS_FEE_IN_TAKER_ASSET, SIGNED_ORDERS_WITH_FILLABLE_AMOUNTS_FEELESS);
        const { makerAssetAvailableInBaseUnits, takerAssetAvailableInBaseUnits } = calculate_liquidity_1.calculateLiquidity(prunedSignedOrders);
        expect(makerAssetAvailableInBaseUnits).to.bignumber.eq(utils_1.baseUnitAmount(27));
        expect(takerAssetAvailableInBaseUnits).to.bignumber.eq(utils_1.baseUnitAmount(33));
    });
});
//# sourceMappingURL=calculate_liquidity_test.js.map