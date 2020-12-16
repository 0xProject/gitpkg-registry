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
const subproviders_1 = require("@0x/subproviders");
const utils_1 = require("@0x/utils");
const chai = require("chai");
require("mocha");
const TypeMoq = require("typemoq");
const src_1 = require("../src");
const constants_1 = require("../src/constants");
const chai_setup_1 = require("./utils/chai_setup");
const mocks_1 = require("./utils/mocks");
const test_order_factory_1 = require("./utils/test_order_factory");
const utils_2 = require("./utils/utils");
chai_setup_1.chaiSetup.configure();
const expect = chai.expect;
const FAKE_SRA_URL = 'https://fakeurl.com';
const FAKE_TAKER_ASSET_DATA = '0xf47261b00000000000000000000000001dc4c1cefef38a777b15aa20260a54e584b16c48';
const FAKE_MAKER_ASSET_DATA = '0xf47261b00000000000000000000000009f5B0C7e1623793bF0620569b9749e79DF6D0bC5';
const TOKEN_DECIMALS = 18;
const DAI_ASSET_DATA = '0xf47261b000000000000000000000000089d24a6b4ccb1b6faa2625fe562bdd9a23260359"';
const WETH_ASSET_DATA = '0xf47261b0000000000000000000000000c02aaa39b223fe8d0a0e5c4f27ead9083c756cc2';
const WETH_DECIMALS = constants_1.constants.ETHER_TOKEN_DECIMALS;
const ZERO = new utils_1.BigNumber(0);
const assetsToAssetPairItems = (makerAssetData, takerAssetData) => {
    const defaultAssetPairItem = {
        minAmount: ZERO,
        maxAmount: ZERO,
        precision: TOKEN_DECIMALS,
    };
    return [
        {
            assetDataA: Object.assign({}, defaultAssetPairItem, { assetData: makerAssetData }),
            assetDataB: Object.assign({}, defaultAssetPairItem, { assetData: takerAssetData }),
        },
        {
            assetDataA: Object.assign({}, defaultAssetPairItem, { assetData: takerAssetData }),
            assetDataB: Object.assign({}, defaultAssetPairItem, { assetData: makerAssetData }),
        },
    ];
};
const expectLiquidityResult = (web3Provider, orderbook, orders, expectedLiquidityResult) => __awaiter(this, void 0, void 0, function* () {
    const mockedSwapQuoter = mocks_1.mockedSwapQuoterWithFillableAmounts(web3Provider, orderbook, FAKE_MAKER_ASSET_DATA, WETH_ASSET_DATA, orders);
    const liquidityResult = yield mockedSwapQuoter.object.getLiquidityForMakerTakerAssetDataPairAsync(FAKE_MAKER_ASSET_DATA, WETH_ASSET_DATA);
    expect(liquidityResult).to.deep.equal(expectedLiquidityResult);
});
// tslint:disable:custom-no-magic-numbers
describe('SwapQuoter', () => {
    describe('getLiquidityForMakerTakerAssetDataPairAsync', () => {
        const mockWeb3Provider = TypeMoq.Mock.ofType(subproviders_1.Web3ProviderEngine);
        const mockOrderbook = mocks_1.orderbookMock();
        beforeEach(() => {
            mockWeb3Provider.reset();
            mockOrderbook.reset();
        });
        afterEach(() => {
            mockWeb3Provider.verifyAll();
            mockOrderbook.verifyAll();
        });
        describe('validation', () => {
            it('should ensure takerAssetData is a string', () => __awaiter(this, void 0, void 0, function* () {
                const swapQuoter = src_1.SwapQuoter.getSwapQuoterForStandardRelayerAPIUrl(mockWeb3Provider.object, FAKE_SRA_URL);
                expect(swapQuoter.getLiquidityForMakerTakerAssetDataPairAsync(FAKE_MAKER_ASSET_DATA, false)).to.be.rejectedWith('Expected takerAssetData to be of type string, encountered: false');
            }));
            it('should ensure makerAssetData is a string', () => __awaiter(this, void 0, void 0, function* () {
                const swapQuoter = src_1.SwapQuoter.getSwapQuoterForStandardRelayerAPIUrl(mockWeb3Provider.object, FAKE_SRA_URL);
                expect(swapQuoter.getLiquidityForMakerTakerAssetDataPairAsync(false, FAKE_TAKER_ASSET_DATA)).to.be.rejectedWith('Expected makerAssetData to be of type string, encountered: false');
            }));
        });
        describe('asset pair not supported', () => {
            it('should return 0s when no asset pair are supported', () => __awaiter(this, void 0, void 0, function* () {
                mocks_1.mockAvailableAssetDatas(mockOrderbook, []);
                const swapQuoter = new src_1.SwapQuoter(mockWeb3Provider.object, mockOrderbook.object);
                const liquidityResult = yield swapQuoter.getLiquidityForMakerTakerAssetDataPairAsync(FAKE_MAKER_ASSET_DATA, FAKE_TAKER_ASSET_DATA);
                expect(liquidityResult).to.deep.equal({
                    makerAssetAvailableInBaseUnits: new utils_1.BigNumber(0),
                    takerAssetAvailableInBaseUnits: new utils_1.BigNumber(0),
                });
            }));
            it('should return 0s when only other asset pair supported', () => __awaiter(this, void 0, void 0, function* () {
                mocks_1.mockAvailableAssetDatas(mockOrderbook, assetsToAssetPairItems(FAKE_MAKER_ASSET_DATA, DAI_ASSET_DATA));
                const swapQuoter = new src_1.SwapQuoter(mockWeb3Provider.object, mockOrderbook.object);
                const liquidityResult = yield swapQuoter.getLiquidityForMakerTakerAssetDataPairAsync(FAKE_MAKER_ASSET_DATA, FAKE_TAKER_ASSET_DATA);
                expect(liquidityResult).to.deep.equal({
                    makerAssetAvailableInBaseUnits: new utils_1.BigNumber(0),
                    takerAssetAvailableInBaseUnits: new utils_1.BigNumber(0),
                });
            }));
        });
        describe('assetData is supported', () => {
            // orders
            const sellTenTokensFor10Weth = test_order_factory_1.testOrderFactory.generateTestSignedOrder({
                makerAssetAmount: utils_2.baseUnitAmount(10),
                takerAssetAmount: utils_2.baseUnitAmount(10, WETH_DECIMALS),
                chainId: 42,
            });
            beforeEach(() => {
                mocks_1.mockAvailableAssetDatas(mockOrderbook, assetsToAssetPairItems(WETH_ASSET_DATA, FAKE_MAKER_ASSET_DATA));
            });
            it('should return 0s when no orders available', () => __awaiter(this, void 0, void 0, function* () {
                const orders = [];
                const expectedResult = {
                    makerAssetAvailableInBaseUnits: new utils_1.BigNumber(0),
                    takerAssetAvailableInBaseUnits: new utils_1.BigNumber(0),
                };
                yield expectLiquidityResult(mockWeb3Provider.object, mockOrderbook.object, orders, expectedResult);
            }));
            it('should return correct computed value when orders provided with full fillableAmounts', () => __awaiter(this, void 0, void 0, function* () {
                const orders = [
                    Object.assign({}, sellTenTokensFor10Weth, {
                        fillableMakerAssetAmount: sellTenTokensFor10Weth.makerAssetAmount,
                        fillableTakerAssetAmount: sellTenTokensFor10Weth.takerAssetAmount,
                        fillableTakerFeeAmount: constants_1.constants.ZERO_AMOUNT,
                    }),
                    Object.assign({}, sellTenTokensFor10Weth, {
                        fillableMakerAssetAmount: sellTenTokensFor10Weth.makerAssetAmount,
                        fillableTakerAssetAmount: sellTenTokensFor10Weth.takerAssetAmount,
                        fillableTakerFeeAmount: constants_1.constants.ZERO_AMOUNT,
                    }),
                ];
                const expectedMakerAssetAvailable = orders[0].makerAssetAmount.plus(orders[1].makerAssetAmount);
                const expectedTakerAssetAvailable = orders[0].takerAssetAmount.plus(orders[1].takerAssetAmount);
                const expectedResult = {
                    makerAssetAvailableInBaseUnits: expectedMakerAssetAvailable,
                    takerAssetAvailableInBaseUnits: expectedTakerAssetAvailable,
                };
                yield expectLiquidityResult(mockWeb3Provider.object, mockOrderbook.object, orders, expectedResult);
            }));
            it('should return correct computed value with one partial fillableAmounts', () => __awaiter(this, void 0, void 0, function* () {
                const orders = [
                    Object.assign({}, sellTenTokensFor10Weth, {
                        fillableMakerAssetAmount: utils_2.baseUnitAmount(1),
                        fillableTakerAssetAmount: utils_2.baseUnitAmount(0.5, WETH_DECIMALS),
                        fillableTakerFeeAmount: constants_1.constants.ZERO_AMOUNT,
                    }),
                ];
                const expectedResult = {
                    makerAssetAvailableInBaseUnits: utils_2.baseUnitAmount(1),
                    takerAssetAvailableInBaseUnits: utils_2.baseUnitAmount(0.5, WETH_DECIMALS),
                };
                yield expectLiquidityResult(mockWeb3Provider.object, mockOrderbook.object, orders, expectedResult);
            }));
            it('should return correct computed value with multiple orders and fillable amounts', () => __awaiter(this, void 0, void 0, function* () {
                const orders = [
                    Object.assign({}, sellTenTokensFor10Weth, {
                        fillableMakerAssetAmount: utils_2.baseUnitAmount(1),
                        fillableTakerAssetAmount: utils_2.baseUnitAmount(0.5, WETH_DECIMALS),
                        fillableTakerFeeAmount: constants_1.constants.ZERO_AMOUNT,
                    }),
                    Object.assign({}, sellTenTokensFor10Weth, {
                        fillableMakerAssetAmount: utils_2.baseUnitAmount(3),
                        fillableTakerAssetAmount: utils_2.baseUnitAmount(3, WETH_DECIMALS),
                        fillableTakerFeeAmount: constants_1.constants.ZERO_AMOUNT,
                    }),
                ];
                const expectedResult = {
                    makerAssetAvailableInBaseUnits: utils_2.baseUnitAmount(4),
                    takerAssetAvailableInBaseUnits: utils_2.baseUnitAmount(3.5, WETH_DECIMALS),
                };
                yield expectLiquidityResult(mockWeb3Provider.object, mockOrderbook.object, orders, expectedResult);
            }));
            it('should return 0s when no amounts fillable', () => __awaiter(this, void 0, void 0, function* () {
                const orders = [
                    Object.assign({}, sellTenTokensFor10Weth, {
                        fillableMakerAssetAmount: constants_1.constants.ZERO_AMOUNT,
                        fillableTakerAssetAmount: constants_1.constants.ZERO_AMOUNT,
                        fillableTakerFeeAmount: constants_1.constants.ZERO_AMOUNT,
                    }),
                    Object.assign({}, sellTenTokensFor10Weth, {
                        fillableMakerAssetAmount: constants_1.constants.ZERO_AMOUNT,
                        fillableTakerAssetAmount: constants_1.constants.ZERO_AMOUNT,
                        fillableTakerFeeAmount: constants_1.constants.ZERO_AMOUNT,
                    }),
                ];
                const expectedResult = {
                    makerAssetAvailableInBaseUnits: constants_1.constants.ZERO_AMOUNT,
                    takerAssetAvailableInBaseUnits: constants_1.constants.ZERO_AMOUNT,
                };
                yield expectLiquidityResult(mockWeb3Provider.object, mockOrderbook.object, orders, expectedResult);
            }));
        });
    });
});
//# sourceMappingURL=swap_quoter_test.js.map