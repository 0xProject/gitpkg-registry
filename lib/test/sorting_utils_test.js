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
describe('sortingUtils', () => {
    describe('#sortOrdersByFeeAdjustedRate', () => {
        const feeRate = new utils_1.BigNumber(1); // ZRX costs 1 unit of takerAsset per 1 unit of ZRX
        // rate: 2 takerAsset / makerAsset
        const testOrder1 = test_order_factory_1.testOrderFactory.generateTestSignedOrder({
            makerAssetAmount: new utils_1.BigNumber(100),
            takerAssetAmount: new utils_1.BigNumber(200),
        });
        // rate: 1 takerAsset / makerAsset
        const testOrder2 = test_order_factory_1.testOrderFactory.generateTestSignedOrder({
            makerAssetAmount: new utils_1.BigNumber(100),
            takerAssetAmount: new utils_1.BigNumber(100),
        });
        // rate: 2.5 takerAsset / makerAsset
        const testOrder3 = test_order_factory_1.testOrderFactory.generateTestSignedOrder({
            makerAssetAmount: new utils_1.BigNumber(100),
            takerAssetAmount: new utils_1.BigNumber(200),
            takerFee: new utils_1.BigNumber(50),
        });
        it('correctly sorts by fee adjusted rate when feeRate is Provided', () => __awaiter(this, void 0, void 0, function* () {
            const orders = [testOrder1, testOrder2, testOrder3];
            const sortedOrders = src_1.sortingUtils.sortOrdersByFeeAdjustedRate(orders, feeRate);
            expect(sortedOrders).to.deep.equal([testOrder2, testOrder1, testOrder3]);
        }));
        it('correctly sorts by fee adjusted rate when no feeRate is Provided', () => __awaiter(this, void 0, void 0, function* () {
            const orders = [testOrder1, testOrder2, testOrder3];
            const sortedOrders = src_1.sortingUtils.sortOrdersByFeeAdjustedRate(orders);
            expect(sortedOrders).to.deep.equal([testOrder2, testOrder1, testOrder3]);
        }));
    });
    describe('#sortFeeOrdersByFeeAdjustedRate', () => {
        // rate: 200 takerAsset / makerAsset
        const testOrder1 = test_order_factory_1.testOrderFactory.generateTestSignedOrder({
            makerAssetAmount: new utils_1.BigNumber(100),
            takerAssetAmount: new utils_1.BigNumber(200),
            takerFee: new utils_1.BigNumber(99),
        });
        // rate: 1 takerAsset / makerAsset
        const testOrder2 = test_order_factory_1.testOrderFactory.generateTestSignedOrder({
            makerAssetAmount: new utils_1.BigNumber(100),
            takerAssetAmount: new utils_1.BigNumber(100),
        });
        // rate: 4 takerAsset / makerAsset
        const testOrder3 = test_order_factory_1.testOrderFactory.generateTestSignedOrder({
            makerAssetAmount: new utils_1.BigNumber(100),
            takerAssetAmount: new utils_1.BigNumber(200),
            takerFee: new utils_1.BigNumber(50),
        });
        it('correctly sorts by fee adjusted rate', () => __awaiter(this, void 0, void 0, function* () {
            const orders = [testOrder1, testOrder2, testOrder3];
            const sortedOrders = src_1.sortingUtils.sortFeeOrdersByFeeAdjustedRate(orders);
            expect(sortedOrders).to.deep.equal([testOrder2, testOrder3, testOrder1]);
        }));
    });
});
//# sourceMappingURL=sorting_utils_test.js.map