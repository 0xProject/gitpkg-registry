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
const chai_setup_1 = require("./utils/chai_setup");
const test_order_factory_1 = require("./utils/test_order_factory");
chai_setup_1.chaiSetup.configure();
const expect = chai.expect;
describe('rateUtils', () => {
    const testOrder = test_order_factory_1.testOrderFactory.generateTestSignedOrder({
        makerAssetAmount: new utils_1.BigNumber(100),
        takerAssetAmount: new utils_1.BigNumber(100),
        takerFee: new utils_1.BigNumber(20),
    });
    describe('#getFeeAdjustedRateOfOrder', () => {
        it('throws when feeRate is less than zero', () => __awaiter(this, void 0, void 0, function* () {
            const feeRate = new utils_1.BigNumber(-1);
            expect(() => src_1.rateUtils.getFeeAdjustedRateOfOrder(testOrder, feeRate)).to.throw('Expected feeRate: -1 to be greater than or equal to 0');
        }));
        it('correctly calculates fee adjusted rate when feeRate is provided', () => __awaiter(this, void 0, void 0, function* () {
            const feeRate = new utils_1.BigNumber(2); // ZRX costs 2 units of takerAsset per 1 unit of ZRX
            const feeAdjustedRate = src_1.rateUtils.getFeeAdjustedRateOfOrder(testOrder, feeRate);
            // the order actually takes 100 + (2 * 20) takerAsset units to fill 100 units of makerAsset
            expect(feeAdjustedRate).to.bignumber.equal(new utils_1.BigNumber(1.4));
        }));
        it('correctly calculates fee adjusted rate when no feeRate is provided', () => __awaiter(this, void 0, void 0, function* () {
            const feeAdjustedRate = src_1.rateUtils.getFeeAdjustedRateOfOrder(testOrder);
            // because no feeRate was provided we just assume 0 fees
            // the order actually takes 100 takerAsset units to fill 100 units of makerAsset
            expect(feeAdjustedRate).to.bignumber.equal(new utils_1.BigNumber(1));
        }));
    });
    describe('#getFeeAdjustedRateOfFeeOrder', () => {
        it('throws when takerFee exceeds makerAssetAmount', () => __awaiter(this, void 0, void 0, function* () {
            const badOrder = test_order_factory_1.testOrderFactory.generateTestSignedOrder({
                makerAssetAmount: new utils_1.BigNumber(100),
                takerFee: new utils_1.BigNumber(101),
            });
            expect(() => src_1.rateUtils.getFeeAdjustedRateOfFeeOrder(badOrder)).to.throw('Expected takerFee: "101" to be less than makerAssetAmount: "100"');
        }));
        it('correctly calculates fee adjusted rate', () => __awaiter(this, void 0, void 0, function* () {
            const feeAdjustedRate = src_1.rateUtils.getFeeAdjustedRateOfFeeOrder(testOrder);
            // the order actually takes 100 takerAsset units to fill (100 - 20) units of makerAsset
            expect(feeAdjustedRate).to.bignumber.equal(new utils_1.BigNumber(1.25));
        }));
    });
});
//# sourceMappingURL=rate_utils_test.js.map