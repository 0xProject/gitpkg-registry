"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai = require("chai");
require("mocha");
const fillable_amounts_utils_1 = require("../src/utils/fillable_amounts_utils");
const chai_setup_1 = require("./utils/chai_setup");
const test_order_factory_1 = require("./utils/test_order_factory");
const utils_1 = require("./utils/utils");
chai_setup_1.chaiSetup.configure();
const expect = chai.expect;
// tslint:disable:custom-no-magic-numbers
const FAKE_ERC20_TAKER_ASSET_DATA = '0xf47261b02222222222222222222222222222222222222222222222222222222222222222';
const FAKE_ERC20_MAKER_ASSET_DATA = '0xf47261b01111111111111111111111111111111111111111111111111111111111111111';
const TAKER_ASSET_DENOMINATED_TAKER_FEE_ORDER = test_order_factory_1.testOrderFactory.generateTestSignedOrderWithFillableAmounts({
    takerAssetData: FAKE_ERC20_TAKER_ASSET_DATA,
    makerAssetData: FAKE_ERC20_MAKER_ASSET_DATA,
    takerFeeAssetData: FAKE_ERC20_TAKER_ASSET_DATA,
    takerFee: utils_1.baseUnitAmount(2),
    fillableMakerAssetAmount: utils_1.baseUnitAmount(5),
    fillableTakerAssetAmount: utils_1.baseUnitAmount(10),
    fillableTakerFeeAmount: utils_1.baseUnitAmount(2),
});
const MAKER_ASSET_DENOMINATED_TAKER_FEE_ORDER = test_order_factory_1.testOrderFactory.generateTestSignedOrderWithFillableAmounts({
    takerAssetData: FAKE_ERC20_TAKER_ASSET_DATA,
    makerAssetData: FAKE_ERC20_MAKER_ASSET_DATA,
    takerFeeAssetData: FAKE_ERC20_MAKER_ASSET_DATA,
    takerFee: utils_1.baseUnitAmount(2),
    fillableMakerAssetAmount: utils_1.baseUnitAmount(10),
    fillableTakerAssetAmount: utils_1.baseUnitAmount(5),
    fillableTakerFeeAmount: utils_1.baseUnitAmount(2),
});
describe('fillableAmountsUtils', () => {
    describe('getTakerAssetAmountSwappedAfterOrderFees', () => {
        it('should return fillableTakerAssetAmount if takerFee is not denominated in taker', () => {
            const availableAssetAmount = fillable_amounts_utils_1.fillableAmountsUtils.getTakerAssetAmountSwappedAfterOrderFees(MAKER_ASSET_DENOMINATED_TAKER_FEE_ORDER);
            expect(availableAssetAmount).to.bignumber.eq(MAKER_ASSET_DENOMINATED_TAKER_FEE_ORDER.fillableTakerAssetAmount);
        });
        it('should return fillableTakerAssetAmount + fillableTakerFeeAmount if takerFee is not denominated in maker', () => {
            const availableAssetAmount = fillable_amounts_utils_1.fillableAmountsUtils.getTakerAssetAmountSwappedAfterOrderFees(TAKER_ASSET_DENOMINATED_TAKER_FEE_ORDER);
            expect(availableAssetAmount).to.bignumber.eq(utils_1.baseUnitAmount(12));
        });
    });
    describe('getMakerAssetAmountSwappedAfterOrderFees', () => {
        it('should return fillableMakerAssetAmount if takerFee is not denominated in maker', () => {
            const availableAssetAmount = fillable_amounts_utils_1.fillableAmountsUtils.getMakerAssetAmountSwappedAfterOrderFees(TAKER_ASSET_DENOMINATED_TAKER_FEE_ORDER);
            expect(availableAssetAmount).to.bignumber.eq(TAKER_ASSET_DENOMINATED_TAKER_FEE_ORDER.fillableMakerAssetAmount);
        });
        it('should return fillableMakerAssetAmount - fillableTakerFeeif takerFee is denominated in maker', () => {
            const availableAssetAmount = fillable_amounts_utils_1.fillableAmountsUtils.getMakerAssetAmountSwappedAfterOrderFees(MAKER_ASSET_DENOMINATED_TAKER_FEE_ORDER);
            expect(availableAssetAmount).to.bignumber.eq(utils_1.baseUnitAmount(8));
        });
    });
});
//# sourceMappingURL=fillable_amounts_utils_test.js.map