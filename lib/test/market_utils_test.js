"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("@0x/utils");
const chai = require("chai");
require("mocha");
const src_1 = require("../src");
const constants_1 = require("../src/constants");
const chai_setup_1 = require("./utils/chai_setup");
const test_order_factory_1 = require("./utils/test_order_factory");
chai_setup_1.chaiSetup.configure();
const expect = chai.expect;
// tslint:disable: no-unused-expression
describe('marketUtils', () => {
    describe('#findOrdersThatCoverTakerAssetFillAmount', () => {
        describe('no orders', () => {
            it('returns empty and unchanged remainingFillAmount', () => __awaiter(this, void 0, void 0, function* () {
                const fillAmount = new utils_1.BigNumber(10);
                const { resultOrders, remainingFillAmount } = src_1.marketUtils.findOrdersThatCoverTakerAssetFillAmount([], fillAmount);
                expect(resultOrders).to.be.empty;
                expect(remainingFillAmount).to.be.bignumber.equal(fillAmount);
            }));
        });
        describe('orders are completely fillable', () => {
            // generate three signed orders each with 10 units of makerAsset, 30 total
            const takerAssetAmount = new utils_1.BigNumber(10);
            const inputOrders = test_order_factory_1.testOrderFactory.generateTestSignedOrders({
                takerAssetAmount,
            }, 3);
            it('returns input orders and zero remainingFillAmount when input exactly matches requested fill amount', () => __awaiter(this, void 0, void 0, function* () {
                // try to fill 20 units of makerAsset
                // include 10 units of slippageBufferAmount
                const fillAmount = new utils_1.BigNumber(20);
                const slippageBufferAmount = new utils_1.BigNumber(10);
                const { resultOrders, remainingFillAmount } = src_1.marketUtils.findOrdersThatCoverTakerAssetFillAmount(inputOrders, fillAmount, {
                    slippageBufferAmount,
                });
                expect(resultOrders).to.be.deep.equal(inputOrders);
                expect(remainingFillAmount).to.be.bignumber.equal(constants_1.constants.ZERO_AMOUNT);
            }));
            it('returns input orders and zero remainingFillAmount when input has more than requested fill amount', () => __awaiter(this, void 0, void 0, function* () {
                // try to fill 15 units of makerAsset
                // include 10 units of slippageBufferAmount
                const fillAmount = new utils_1.BigNumber(15);
                const slippageBufferAmount = new utils_1.BigNumber(10);
                const { resultOrders, remainingFillAmount } = src_1.marketUtils.findOrdersThatCoverTakerAssetFillAmount(inputOrders, fillAmount, {
                    slippageBufferAmount,
                });
                expect(resultOrders).to.be.deep.equal(inputOrders);
                expect(remainingFillAmount).to.be.bignumber.equal(constants_1.constants.ZERO_AMOUNT);
            }));
            it('returns input orders and non-zero remainingFillAmount when input has less than requested fill amount', () => __awaiter(this, void 0, void 0, function* () {
                // try to fill 30 units of makerAsset
                // include 5 units of slippageBufferAmount
                const fillAmount = new utils_1.BigNumber(30);
                const slippageBufferAmount = new utils_1.BigNumber(5);
                const { resultOrders, remainingFillAmount } = src_1.marketUtils.findOrdersThatCoverTakerAssetFillAmount(inputOrders, fillAmount, {
                    slippageBufferAmount,
                });
                expect(resultOrders).to.be.deep.equal(inputOrders);
                expect(remainingFillAmount).to.be.bignumber.equal(new utils_1.BigNumber(5));
            }));
            it('returns first order and zero remainingFillAmount when requested fill amount is exactly covered by the first order', () => __awaiter(this, void 0, void 0, function* () {
                // try to fill 10 units of makerAsset
                const fillAmount = new utils_1.BigNumber(10);
                const { resultOrders, remainingFillAmount } = src_1.marketUtils.findOrdersThatCoverTakerAssetFillAmount(inputOrders, fillAmount);
                expect(resultOrders).to.be.deep.equal([inputOrders[0]]);
                expect(remainingFillAmount).to.be.bignumber.equal(constants_1.constants.ZERO_AMOUNT);
            }));
            it('returns first two orders and zero remainingFillAmount when requested fill amount is over covered by the first two order', () => __awaiter(this, void 0, void 0, function* () {
                // try to fill 15 units of makerAsset
                const fillAmount = new utils_1.BigNumber(15);
                const { resultOrders, remainingFillAmount } = src_1.marketUtils.findOrdersThatCoverTakerAssetFillAmount(inputOrders, fillAmount);
                expect(resultOrders).to.be.deep.equal([inputOrders[0], inputOrders[1]]);
                expect(remainingFillAmount).to.be.bignumber.equal(constants_1.constants.ZERO_AMOUNT);
            }));
        });
        describe('orders are partially fillable', () => {
            // generate three signed orders each with 10 units of makerAsset, 30 total
            const takerAssetAmount = new utils_1.BigNumber(10);
            const inputOrders = test_order_factory_1.testOrderFactory.generateTestSignedOrders({
                takerAssetAmount,
            }, 3);
            // generate remainingFillableMakerAssetAmounts that cover different partial fill scenarios
            // 1. order is completely filled already
            // 2. order is partially fillable
            // 3. order is completely fillable
            const remainingFillableTakerAssetAmounts = [constants_1.constants.ZERO_AMOUNT, new utils_1.BigNumber(5), takerAssetAmount];
            it('returns last two orders and non-zero remainingFillAmount when trying to fill original takerAssetAmounts', () => __awaiter(this, void 0, void 0, function* () {
                // try to fill 30 units of takerAsset
                const fillAmount = new utils_1.BigNumber(30);
                const { resultOrders, remainingFillAmount } = src_1.marketUtils.findOrdersThatCoverTakerAssetFillAmount(inputOrders, fillAmount, {
                    remainingFillableTakerAssetAmounts,
                });
                expect(resultOrders).to.be.deep.equal([inputOrders[1], inputOrders[2]]);
                expect(remainingFillAmount).to.be.bignumber.equal(new utils_1.BigNumber(15));
            }));
            it('returns last two orders and zero remainingFillAmount when trying to fill exactly takerAssetAmounts remaining', () => __awaiter(this, void 0, void 0, function* () {
                // try to fill 15 units of takerAsset
                const fillAmount = new utils_1.BigNumber(15);
                const { resultOrders, remainingFillAmount } = src_1.marketUtils.findOrdersThatCoverTakerAssetFillAmount(inputOrders, fillAmount, {
                    remainingFillableTakerAssetAmounts,
                });
                expect(resultOrders).to.be.deep.equal([inputOrders[1], inputOrders[2]]);
                expect(remainingFillAmount).to.be.bignumber.equal(new utils_1.BigNumber(0));
            }));
        });
    });
    describe('#findOrdersThatCoverMakerAssetFillAmount', () => {
        describe('no orders', () => {
            it('returns empty and unchanged remainingFillAmount', () => __awaiter(this, void 0, void 0, function* () {
                const fillAmount = new utils_1.BigNumber(10);
                const { resultOrders, remainingFillAmount } = src_1.marketUtils.findOrdersThatCoverMakerAssetFillAmount([], fillAmount);
                expect(resultOrders).to.be.empty;
                expect(remainingFillAmount).to.be.bignumber.equal(fillAmount);
            }));
        });
        describe('orders are completely fillable', () => {
            // generate three signed orders each with 10 units of makerAsset, 30 total
            const makerAssetAmount = new utils_1.BigNumber(10);
            const inputOrders = test_order_factory_1.testOrderFactory.generateTestSignedOrders({
                makerAssetAmount,
            }, 3);
            it('returns input orders and zero remainingFillAmount when input exactly matches requested fill amount', () => __awaiter(this, void 0, void 0, function* () {
                // try to fill 20 units of makerAsset
                // include 10 units of slippageBufferAmount
                const fillAmount = new utils_1.BigNumber(20);
                const slippageBufferAmount = new utils_1.BigNumber(10);
                const { resultOrders, remainingFillAmount } = src_1.marketUtils.findOrdersThatCoverMakerAssetFillAmount(inputOrders, fillAmount, {
                    slippageBufferAmount,
                });
                expect(resultOrders).to.be.deep.equal(inputOrders);
                expect(remainingFillAmount).to.be.bignumber.equal(constants_1.constants.ZERO_AMOUNT);
            }));
            it('returns input orders and zero remainingFillAmount when input has more than requested fill amount', () => __awaiter(this, void 0, void 0, function* () {
                // try to fill 15 units of makerAsset
                // include 10 units of slippageBufferAmount
                const fillAmount = new utils_1.BigNumber(15);
                const slippageBufferAmount = new utils_1.BigNumber(10);
                const { resultOrders, remainingFillAmount } = src_1.marketUtils.findOrdersThatCoverMakerAssetFillAmount(inputOrders, fillAmount, {
                    slippageBufferAmount,
                });
                expect(resultOrders).to.be.deep.equal(inputOrders);
                expect(remainingFillAmount).to.be.bignumber.equal(constants_1.constants.ZERO_AMOUNT);
            }));
            it('returns input orders and non-zero remainingFillAmount when input has less than requested fill amount', () => __awaiter(this, void 0, void 0, function* () {
                // try to fill 30 units of makerAsset
                // include 5 units of slippageBufferAmount
                const fillAmount = new utils_1.BigNumber(30);
                const slippageBufferAmount = new utils_1.BigNumber(5);
                const { resultOrders, remainingFillAmount } = src_1.marketUtils.findOrdersThatCoverMakerAssetFillAmount(inputOrders, fillAmount, {
                    slippageBufferAmount,
                });
                expect(resultOrders).to.be.deep.equal(inputOrders);
                expect(remainingFillAmount).to.be.bignumber.equal(new utils_1.BigNumber(5));
            }));
            it('returns first order and zero remainingFillAmount when requested fill amount is exactly covered by the first order', () => __awaiter(this, void 0, void 0, function* () {
                // try to fill 10 units of makerAsset
                const fillAmount = new utils_1.BigNumber(10);
                const { resultOrders, remainingFillAmount } = src_1.marketUtils.findOrdersThatCoverMakerAssetFillAmount(inputOrders, fillAmount);
                expect(resultOrders).to.be.deep.equal([inputOrders[0]]);
                expect(remainingFillAmount).to.be.bignumber.equal(constants_1.constants.ZERO_AMOUNT);
            }));
            it('returns first two orders and zero remainingFillAmount when requested fill amount is over covered by the first two order', () => __awaiter(this, void 0, void 0, function* () {
                // try to fill 15 units of makerAsset
                const fillAmount = new utils_1.BigNumber(15);
                const { resultOrders, remainingFillAmount } = src_1.marketUtils.findOrdersThatCoverMakerAssetFillAmount(inputOrders, fillAmount);
                expect(resultOrders).to.be.deep.equal([inputOrders[0], inputOrders[1]]);
                expect(remainingFillAmount).to.be.bignumber.equal(constants_1.constants.ZERO_AMOUNT);
            }));
        });
        describe('orders are partially fillable', () => {
            // generate three signed orders each with 10 units of makerAsset, 30 total
            const makerAssetAmount = new utils_1.BigNumber(10);
            const inputOrders = test_order_factory_1.testOrderFactory.generateTestSignedOrders({
                makerAssetAmount,
            }, 3);
            // generate remainingFillableMakerAssetAmounts that cover different partial fill scenarios
            // 1. order is completely filled already
            // 2. order is partially fillable
            // 3. order is completely fillable
            const remainingFillableMakerAssetAmounts = [constants_1.constants.ZERO_AMOUNT, new utils_1.BigNumber(5), makerAssetAmount];
            it('returns last two orders and non-zero remainingFillAmount when trying to fill original makerAssetAmounts', () => __awaiter(this, void 0, void 0, function* () {
                // try to fill 30 units of makerAsset
                const fillAmount = new utils_1.BigNumber(30);
                const { resultOrders, remainingFillAmount } = src_1.marketUtils.findOrdersThatCoverMakerAssetFillAmount(inputOrders, fillAmount, {
                    remainingFillableMakerAssetAmounts,
                });
                expect(resultOrders).to.be.deep.equal([inputOrders[1], inputOrders[2]]);
                expect(remainingFillAmount).to.be.bignumber.equal(new utils_1.BigNumber(15));
            }));
        });
    });
    describe('#findFeeOrdersThatCoverFeesForTargetOrders', () => {
        // generate three signed fee orders each with 10 units of ZRX, 30 total
        const zrxAmount = new utils_1.BigNumber(10);
        const inputFeeOrders = test_order_factory_1.testOrderFactory.generateTestSignedOrders({
            makerAssetAmount: zrxAmount,
        }, 3);
        describe('no target orders', () => {
            it('returns empty and zero remainingFeeAmount', () => __awaiter(this, void 0, void 0, function* () {
                const { resultFeeOrders, remainingFeeAmount } = src_1.marketUtils.findFeeOrdersThatCoverFeesForTargetOrders([], inputFeeOrders);
                expect(resultFeeOrders).to.be.empty;
                expect(remainingFeeAmount).to.be.bignumber.equal(constants_1.constants.ZERO_AMOUNT);
            }));
        });
        describe('no fee orders', () => {
            // generate three signed orders each with 10 units of makerAsset, 30 total
            // each signed order requires 10 units of takerFee
            const makerAssetAmount = new utils_1.BigNumber(10);
            const takerFee = new utils_1.BigNumber(10);
            const inputOrders = test_order_factory_1.testOrderFactory.generateTestSignedOrders({
                makerAssetAmount,
                takerFee,
            }, 3);
            // generate remainingFillableMakerAssetAmounts that equal the makerAssetAmount
            const remainingFillableMakerAssetAmounts = [makerAssetAmount, makerAssetAmount, makerAssetAmount];
            it('returns empty and non-zero remainingFeeAmount', () => __awaiter(this, void 0, void 0, function* () {
                const { resultFeeOrders, remainingFeeAmount } = src_1.marketUtils.findFeeOrdersThatCoverFeesForTargetOrders(inputOrders, [], {
                    remainingFillableMakerAssetAmounts,
                });
                expect(resultFeeOrders).to.be.empty;
                expect(remainingFeeAmount).to.be.bignumber.equal(new utils_1.BigNumber(30));
            }));
        });
        describe('target orders have no fees', () => {
            // generate three signed orders each with 10 units of makerAsset, 30 total
            const makerAssetAmount = new utils_1.BigNumber(10);
            const inputOrders = test_order_factory_1.testOrderFactory.generateTestSignedOrders({
                makerAssetAmount,
            }, 3);
            it('returns empty and zero remainingFeeAmount', () => __awaiter(this, void 0, void 0, function* () {
                const { resultFeeOrders, remainingFeeAmount } = src_1.marketUtils.findFeeOrdersThatCoverFeesForTargetOrders(inputOrders, inputFeeOrders);
                expect(resultFeeOrders).to.be.empty;
                expect(remainingFeeAmount).to.be.bignumber.equal(constants_1.constants.ZERO_AMOUNT);
            }));
        });
        describe('target orders require fees and are completely fillable', () => {
            // generate three signed orders each with 10 units of makerAsset, 30 total
            // each signed order requires 10 units of takerFee
            const makerAssetAmount = new utils_1.BigNumber(10);
            const takerFee = new utils_1.BigNumber(10);
            const inputOrders = test_order_factory_1.testOrderFactory.generateTestSignedOrders({
                makerAssetAmount,
                takerFee,
            }, 3);
            it('returns input fee orders and zero remainingFeeAmount', () => __awaiter(this, void 0, void 0, function* () {
                const { resultFeeOrders, remainingFeeAmount } = src_1.marketUtils.findFeeOrdersThatCoverFeesForTargetOrders(inputOrders, inputFeeOrders);
                expect(resultFeeOrders).to.be.deep.equal(inputFeeOrders);
                expect(remainingFeeAmount).to.be.bignumber.equal(constants_1.constants.ZERO_AMOUNT);
            }));
        });
        describe('target orders require fees and are partially fillable', () => {
            // generate three signed orders each with 10 units of makerAsset, 30 total
            // each signed order requires 10 units of takerFee
            const makerAssetAmount = new utils_1.BigNumber(10);
            const takerFee = new utils_1.BigNumber(10);
            const inputOrders = test_order_factory_1.testOrderFactory.generateTestSignedOrders({
                makerAssetAmount,
                takerFee,
            }, 3);
            // generate remainingFillableMakerAssetAmounts that cover different partial fill scenarios
            // 1. order is completely filled already
            // 2. order is partially fillable
            // 3. order is completely fillable
            const remainingFillableMakerAssetAmounts = [constants_1.constants.ZERO_AMOUNT, new utils_1.BigNumber(5), makerAssetAmount];
            it('returns first two input fee orders and zero remainingFeeAmount', () => __awaiter(this, void 0, void 0, function* () {
                const { resultFeeOrders, remainingFeeAmount } = src_1.marketUtils.findFeeOrdersThatCoverFeesForTargetOrders(inputOrders, inputFeeOrders, {
                    remainingFillableMakerAssetAmounts,
                });
                expect(resultFeeOrders).to.be.deep.equal([inputFeeOrders[0], inputFeeOrders[1]]);
                expect(remainingFeeAmount).to.be.bignumber.equal(constants_1.constants.ZERO_AMOUNT);
            }));
        });
        describe('target orders require more fees than available', () => {
            // generate three signed orders each with 10 units of makerAsset, 30 total
            // each signed order requires 20 units of takerFee
            const makerAssetAmount = new utils_1.BigNumber(10);
            const takerFee = new utils_1.BigNumber(20);
            const inputOrders = test_order_factory_1.testOrderFactory.generateTestSignedOrders({
                makerAssetAmount,
                takerFee,
            }, 3);
            it('returns input fee orders and non-zero remainingFeeAmount', () => __awaiter(this, void 0, void 0, function* () {
                const { resultFeeOrders, remainingFeeAmount } = src_1.marketUtils.findFeeOrdersThatCoverFeesForTargetOrders(inputOrders, inputFeeOrders);
                expect(resultFeeOrders).to.be.deep.equal(inputFeeOrders);
                expect(remainingFeeAmount).to.be.bignumber.equal(new utils_1.BigNumber(30));
            }));
        });
    });
});
//# sourceMappingURL=market_utils_test.js.map