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
const sorting_utils_1 = require("../src/utils/sorting_utils");
const chai_setup_1 = require("./utils/chai_setup");
const test_order_factory_1 = require("./utils/test_order_factory");
chai_setup_1.chaiSetup.configure();
const expect = chai.expect;
const FAKE_ERC20_TAKER_ASSET_DATA = '0xf47261b02222222222222222222222222222222222222222222222222222222222222222';
const FAKE_ERC20_MAKER_ASSET_DATA = '0xf47261b01111111111111111111111111111111111111111111111111111111111111111';
describe('sortingUtils', () => {
    describe('#sortOrders', () => {
        // rate: 2 takerAsset / makerAsset
        const testOrder1 = test_order_factory_1.testOrderFactory.generateTestSignedOrder({
            makerAssetAmount: new utils_1.BigNumber(100),
            takerAssetAmount: new utils_1.BigNumber(200),
            takerAssetData: FAKE_ERC20_TAKER_ASSET_DATA,
            makerAssetData: FAKE_ERC20_MAKER_ASSET_DATA,
        });
        // rate: 1 takerAsset / makerAsset
        const testOrder2 = test_order_factory_1.testOrderFactory.generateTestSignedOrder({
            makerAssetAmount: new utils_1.BigNumber(100),
            takerAssetAmount: new utils_1.BigNumber(100),
            takerAssetData: FAKE_ERC20_TAKER_ASSET_DATA,
            makerAssetData: FAKE_ERC20_MAKER_ASSET_DATA,
        });
        // rate: 2.5 takerAsset / makerAsset
        const testOrder3 = test_order_factory_1.testOrderFactory.generateTestSignedOrder({
            makerAssetAmount: new utils_1.BigNumber(100),
            takerAssetAmount: new utils_1.BigNumber(250),
            takerAssetData: FAKE_ERC20_TAKER_ASSET_DATA,
            makerAssetData: FAKE_ERC20_MAKER_ASSET_DATA,
        });
        // rate: 2 takerAsset / makerAsset
        const testOrderWithFeeInTakerAsset1 = test_order_factory_1.testOrderFactory.generateTestSignedOrder({
            makerAssetAmount: new utils_1.BigNumber(100),
            takerAssetAmount: new utils_1.BigNumber(100),
            takerFee: new utils_1.BigNumber(100),
            takerFeeAssetData: FAKE_ERC20_TAKER_ASSET_DATA,
            takerAssetData: FAKE_ERC20_TAKER_ASSET_DATA,
            makerAssetData: FAKE_ERC20_MAKER_ASSET_DATA,
        });
        // rate: 1 takerAsset / makerAsset
        const testOrderWithFeeInTakerAsset2 = test_order_factory_1.testOrderFactory.generateTestSignedOrder({
            makerAssetAmount: new utils_1.BigNumber(100),
            takerAssetAmount: new utils_1.BigNumber(50),
            takerFee: new utils_1.BigNumber(50),
            takerFeeAssetData: FAKE_ERC20_TAKER_ASSET_DATA,
            takerAssetData: FAKE_ERC20_TAKER_ASSET_DATA,
            makerAssetData: FAKE_ERC20_MAKER_ASSET_DATA,
        });
        // rate: 2.5 takerAsset / makerAsset
        const testOrderWithFeeInTakerAsset3 = test_order_factory_1.testOrderFactory.generateTestSignedOrder({
            makerAssetAmount: new utils_1.BigNumber(100),
            takerAssetAmount: new utils_1.BigNumber(200),
            takerFee: new utils_1.BigNumber(50),
            takerFeeAssetData: FAKE_ERC20_TAKER_ASSET_DATA,
            takerAssetData: FAKE_ERC20_TAKER_ASSET_DATA,
            makerAssetData: FAKE_ERC20_MAKER_ASSET_DATA,
        });
        // rate: 2 takerAsset / makerAsset
        const testOrderWithFeeInMakerAsset1 = test_order_factory_1.testOrderFactory.generateTestSignedOrder({
            makerAssetAmount: new utils_1.BigNumber(200),
            takerAssetAmount: new utils_1.BigNumber(200),
            takerFee: new utils_1.BigNumber(100),
            takerFeeAssetData: FAKE_ERC20_MAKER_ASSET_DATA,
            takerAssetData: FAKE_ERC20_TAKER_ASSET_DATA,
            makerAssetData: FAKE_ERC20_MAKER_ASSET_DATA,
        });
        // rate: 1 takerAsset / makerAsset
        const testOrderWithFeeInMakerAsset2 = test_order_factory_1.testOrderFactory.generateTestSignedOrder({
            makerAssetAmount: new utils_1.BigNumber(150),
            takerAssetAmount: new utils_1.BigNumber(100),
            takerFee: new utils_1.BigNumber(50),
            takerFeeAssetData: FAKE_ERC20_MAKER_ASSET_DATA,
            takerAssetData: FAKE_ERC20_TAKER_ASSET_DATA,
            makerAssetData: FAKE_ERC20_MAKER_ASSET_DATA,
        });
        // rate: 2.5 takerAsset / makerAsset
        const testOrderWithFeeInMakerAsset3 = test_order_factory_1.testOrderFactory.generateTestSignedOrder({
            makerAssetAmount: new utils_1.BigNumber(150),
            takerAssetAmount: new utils_1.BigNumber(250),
            takerFee: new utils_1.BigNumber(50),
            takerFeeAssetData: FAKE_ERC20_MAKER_ASSET_DATA,
            takerAssetData: FAKE_ERC20_TAKER_ASSET_DATA,
            makerAssetData: FAKE_ERC20_MAKER_ASSET_DATA,
        });
        it('correctly sorts by fee adjusted rate (feeless orders)', () => __awaiter(this, void 0, void 0, function* () {
            const orders = [testOrder1, testOrder2, testOrder3];
            const sortedOrders = sorting_utils_1.sortingUtils.sortOrders(orders);
            expect(sortedOrders).to.deep.equal([testOrder2, testOrder1, testOrder3]);
        }));
        it('correctly sorts by fee adjusted rate (takerAsset denominated fee orders)', () => __awaiter(this, void 0, void 0, function* () {
            const orders = [
                testOrderWithFeeInTakerAsset1,
                testOrderWithFeeInTakerAsset2,
                testOrderWithFeeInTakerAsset3,
            ];
            const sortedOrders = sorting_utils_1.sortingUtils.sortOrders(orders);
            expect(sortedOrders).to.deep.equal([
                testOrderWithFeeInTakerAsset2,
                testOrderWithFeeInTakerAsset1,
                testOrderWithFeeInTakerAsset3,
            ]);
        }));
        it('correctly sorts by fee adjusted rate (makerAsset denominated fee orders)', () => __awaiter(this, void 0, void 0, function* () {
            const orders = [
                testOrderWithFeeInMakerAsset1,
                testOrderWithFeeInMakerAsset2,
                testOrderWithFeeInMakerAsset3,
            ];
            const sortedOrders = sorting_utils_1.sortingUtils.sortOrders(orders);
            expect(sortedOrders).to.deep.equal([
                testOrderWithFeeInMakerAsset2,
                testOrderWithFeeInMakerAsset1,
                testOrderWithFeeInMakerAsset3,
            ]);
        }));
        it('correctly sorts by fee adjusted rate (mixed orders)', () => __awaiter(this, void 0, void 0, function* () {
            const orders = [testOrderWithFeeInMakerAsset1, testOrderWithFeeInTakerAsset2, testOrder3];
            const sortedOrders = sorting_utils_1.sortingUtils.sortOrders(orders);
            expect(sortedOrders).to.deep.equal([
                testOrderWithFeeInTakerAsset2,
                testOrderWithFeeInMakerAsset1,
                testOrder3,
            ]);
        }));
    });
});
//# sourceMappingURL=sorting_utils_test.js.map