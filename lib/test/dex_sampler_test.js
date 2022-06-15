"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const contract_addresses_1 = require("@0x/contract-addresses");
const contracts_test_utils_1 = require("@0x/contracts-test-utils");
const protocol_utils_1 = require("@0x/protocol-utils");
const utils_1 = require("@0x/utils");
const _ = require("lodash");
const sampler_1 = require("../src/utils/market_operation_utils/sampler");
const types_1 = require("../src/utils/market_operation_utils/types");
const mock_sampler_contract_1 = require("./utils/mock_sampler_contract");
const utils_2 = require("./utils/utils");
const CHAIN_ID = 1;
const EMPTY_BYTES32 = '0x0000000000000000000000000000000000000000000000000000000000000000';
// tslint:disable: custom-no-magic-numbers
describe('DexSampler tests', () => {
    const MAKER_TOKEN = (0, contracts_test_utils_1.randomAddress)();
    const TAKER_TOKEN = (0, contracts_test_utils_1.randomAddress)();
    const chainId = contract_addresses_1.ChainId.Mainnet;
    const wethAddress = (0, contract_addresses_1.getContractAddressesForChainOrThrow)(CHAIN_ID).etherToken;
    const exchangeProxyAddress = (0, contract_addresses_1.getContractAddressesForChainOrThrow)(CHAIN_ID).exchangeProxy;
    const tokenAdjacencyGraph = { default: [wethAddress] };
    describe('getSampleAmounts()', () => {
        const FILL_AMOUNT = (0, contracts_test_utils_1.getRandomInteger)(1, 1e18);
        const NUM_SAMPLES = 16;
        it('generates the correct number of amounts', () => {
            const amounts = (0, sampler_1.getSampleAmounts)(FILL_AMOUNT, NUM_SAMPLES);
            (0, contracts_test_utils_1.expect)(amounts).to.be.length(NUM_SAMPLES);
        });
        it('first amount is nonzero', () => {
            const amounts = (0, sampler_1.getSampleAmounts)(FILL_AMOUNT, NUM_SAMPLES);
            (0, contracts_test_utils_1.expect)(amounts[0]).to.not.bignumber.eq(0);
        });
        it('last amount is the fill amount', () => {
            const amounts = (0, sampler_1.getSampleAmounts)(FILL_AMOUNT, NUM_SAMPLES);
            (0, contracts_test_utils_1.expect)(amounts[NUM_SAMPLES - 1]).to.bignumber.eq(FILL_AMOUNT);
        });
        it('can generate a single amount', () => {
            const amounts = (0, sampler_1.getSampleAmounts)(FILL_AMOUNT, 1);
            (0, contracts_test_utils_1.expect)(amounts).to.be.length(1);
            (0, contracts_test_utils_1.expect)(amounts[0]).to.bignumber.eq(FILL_AMOUNT);
        });
        it('generates ascending amounts', () => {
            const amounts = (0, sampler_1.getSampleAmounts)(FILL_AMOUNT, NUM_SAMPLES);
            for (const i of _.times(NUM_SAMPLES).slice(1)) {
                const prev = amounts[i - 1];
                const amount = amounts[i];
                (0, contracts_test_utils_1.expect)(prev).to.bignumber.lt(amount);
            }
        });
    });
    function createOrder(overrides) {
        const o = {
            order: Object.assign({ salt: (0, utils_2.generatePseudoRandomSalt)(), expiry: (0, contracts_test_utils_1.getRandomInteger)(0, Math.pow(2, 64)), makerToken: MAKER_TOKEN, takerToken: TAKER_TOKEN, makerAmount: (0, contracts_test_utils_1.getRandomInteger)(1, 1e18), takerAmount: (0, contracts_test_utils_1.getRandomInteger)(1, 1e18), takerTokenFeeAmount: contracts_test_utils_1.constants.ZERO_AMOUNT, chainId: CHAIN_ID, pool: EMPTY_BYTES32, feeRecipient: utils_1.NULL_ADDRESS, sender: utils_1.NULL_ADDRESS, maker: utils_1.NULL_ADDRESS, taker: utils_1.NULL_ADDRESS, verifyingContract: exchangeProxyAddress }, overrides),
            signature: { v: 1, r: utils_1.hexUtils.random(), s: utils_1.hexUtils.random(), signatureType: protocol_utils_1.SignatureType.EthSign },
            type: protocol_utils_1.FillQuoteTransformerOrderType.Limit,
        };
        return o;
    }
    const ORDERS = _.times(4, () => createOrder());
    const SIMPLE_ORDERS = ORDERS.map(o => _.omit(o.order, ['chainId', 'verifyingContract']));
    describe('operations', () => {
        it('getLimitOrderFillableMakerAssetAmounts()', () => __awaiter(void 0, void 0, void 0, function* () {
            const expectedFillableAmounts = ORDERS.map(() => (0, contracts_test_utils_1.getRandomInteger)(0, 100e18));
            const sampler = new mock_sampler_contract_1.MockSamplerContract({
                getLimitOrderFillableMakerAssetAmounts: (orders, signatures) => {
                    (0, contracts_test_utils_1.expect)(orders).to.deep.eq(SIMPLE_ORDERS);
                    (0, contracts_test_utils_1.expect)(signatures).to.deep.eq(ORDERS.map(o => o.signature));
                    return expectedFillableAmounts;
                },
            });
            const dexOrderSampler = new sampler_1.DexOrderSampler(chainId, sampler, undefined, undefined, undefined, undefined, () => __awaiter(void 0, void 0, void 0, function* () { return undefined; }));
            const [fillableAmounts] = yield dexOrderSampler.executeAsync(dexOrderSampler.getLimitOrderFillableMakerAmounts(ORDERS, exchangeProxyAddress));
            (0, contracts_test_utils_1.expect)(fillableAmounts).to.deep.eq(expectedFillableAmounts);
        }));
        it('getLimitOrderFillableTakerAssetAmounts()', () => __awaiter(void 0, void 0, void 0, function* () {
            const expectedFillableAmounts = ORDERS.map(() => (0, contracts_test_utils_1.getRandomInteger)(0, 100e18));
            const sampler = new mock_sampler_contract_1.MockSamplerContract({
                getLimitOrderFillableTakerAssetAmounts: (orders, signatures) => {
                    (0, contracts_test_utils_1.expect)(orders).to.deep.eq(SIMPLE_ORDERS);
                    (0, contracts_test_utils_1.expect)(signatures).to.deep.eq(ORDERS.map(o => o.signature));
                    return expectedFillableAmounts;
                },
            });
            const dexOrderSampler = new sampler_1.DexOrderSampler(chainId, sampler, undefined, undefined, undefined, undefined, () => __awaiter(void 0, void 0, void 0, function* () { return undefined; }));
            const [fillableAmounts] = yield dexOrderSampler.executeAsync(dexOrderSampler.getLimitOrderFillableTakerAmounts(ORDERS, exchangeProxyAddress));
            (0, contracts_test_utils_1.expect)(fillableAmounts).to.deep.eq(expectedFillableAmounts);
        }));
        it('getLiquidityProviderSellQuotes()', () => __awaiter(void 0, void 0, void 0, function* () {
            const expectedMakerToken = (0, contracts_test_utils_1.randomAddress)();
            const expectedTakerToken = (0, contracts_test_utils_1.randomAddress)();
            const poolAddress = (0, contracts_test_utils_1.randomAddress)();
            const gasCost = 123;
            const sampler = new mock_sampler_contract_1.MockSamplerContract({
                sampleSellsFromLiquidityProvider: (providerAddress, takerToken, makerToken, _fillAmounts) => {
                    (0, contracts_test_utils_1.expect)(providerAddress).to.eq(poolAddress);
                    (0, contracts_test_utils_1.expect)(takerToken).to.eq(expectedTakerToken);
                    (0, contracts_test_utils_1.expect)(makerToken).to.eq(expectedMakerToken);
                    return [(0, contracts_test_utils_1.toBaseUnitAmount)(1001)];
                },
            });
            const dexOrderSampler = new sampler_1.DexOrderSampler(chainId, sampler, undefined, undefined, undefined, {
                [poolAddress]: { tokens: [expectedMakerToken, expectedTakerToken], gasCost },
            }, () => __awaiter(void 0, void 0, void 0, function* () { return undefined; }));
            const [result] = yield dexOrderSampler.executeAsync(dexOrderSampler.getSellQuotes([types_1.ERC20BridgeSource.LiquidityProvider], expectedMakerToken, expectedTakerToken, [(0, contracts_test_utils_1.toBaseUnitAmount)(1000)]));
            (0, contracts_test_utils_1.expect)(result).to.deep.equal([
                [
                    {
                        source: 'LiquidityProvider',
                        output: (0, contracts_test_utils_1.toBaseUnitAmount)(1001),
                        input: (0, contracts_test_utils_1.toBaseUnitAmount)(1000),
                        fillData: { poolAddress, gasCost },
                    },
                ],
            ]);
        }));
        it('getLiquidityProviderBuyQuotes()', () => __awaiter(void 0, void 0, void 0, function* () {
            const expectedMakerToken = (0, contracts_test_utils_1.randomAddress)();
            const expectedTakerToken = (0, contracts_test_utils_1.randomAddress)();
            const poolAddress = (0, contracts_test_utils_1.randomAddress)();
            const gasCost = 321;
            const sampler = new mock_sampler_contract_1.MockSamplerContract({
                sampleBuysFromLiquidityProvider: (providerAddress, takerToken, makerToken, _fillAmounts) => {
                    (0, contracts_test_utils_1.expect)(providerAddress).to.eq(poolAddress);
                    (0, contracts_test_utils_1.expect)(takerToken).to.eq(expectedTakerToken);
                    (0, contracts_test_utils_1.expect)(makerToken).to.eq(expectedMakerToken);
                    return [(0, contracts_test_utils_1.toBaseUnitAmount)(999)];
                },
            });
            const dexOrderSampler = new sampler_1.DexOrderSampler(chainId, sampler, undefined, undefined, undefined, {
                [poolAddress]: { tokens: [expectedMakerToken, expectedTakerToken], gasCost },
            }, () => __awaiter(void 0, void 0, void 0, function* () { return undefined; }));
            const [result] = yield dexOrderSampler.executeAsync(dexOrderSampler.getBuyQuotes([types_1.ERC20BridgeSource.LiquidityProvider], expectedMakerToken, expectedTakerToken, [(0, contracts_test_utils_1.toBaseUnitAmount)(1000)]));
            (0, contracts_test_utils_1.expect)(result).to.deep.equal([
                [
                    {
                        source: 'LiquidityProvider',
                        output: (0, contracts_test_utils_1.toBaseUnitAmount)(999),
                        input: (0, contracts_test_utils_1.toBaseUnitAmount)(1000),
                        fillData: { poolAddress, gasCost },
                    },
                ],
            ]);
        }));
        it('getUniswapSellQuotes()', () => __awaiter(void 0, void 0, void 0, function* () {
            const expectedTakerToken = (0, contracts_test_utils_1.randomAddress)();
            const expectedMakerToken = (0, contracts_test_utils_1.randomAddress)();
            const expectedTakerFillAmounts = (0, sampler_1.getSampleAmounts)(new utils_1.BigNumber(100e18), 10);
            const expectedMakerFillAmounts = (0, sampler_1.getSampleAmounts)(new utils_1.BigNumber(100e18), 10);
            const sampler = new mock_sampler_contract_1.MockSamplerContract({
                sampleSellsFromUniswap: (_router, takerToken, makerToken, fillAmounts) => {
                    (0, contracts_test_utils_1.expect)(takerToken).to.eq(expectedTakerToken);
                    (0, contracts_test_utils_1.expect)(makerToken).to.eq(expectedMakerToken);
                    (0, contracts_test_utils_1.expect)(fillAmounts).to.deep.eq(expectedTakerFillAmounts);
                    return expectedMakerFillAmounts;
                },
            });
            const dexOrderSampler = new sampler_1.DexOrderSampler(chainId, sampler, undefined, undefined, undefined, undefined, () => __awaiter(void 0, void 0, void 0, function* () { return undefined; }));
            const [fillableAmounts] = yield dexOrderSampler.executeAsync(dexOrderSampler.getUniswapSellQuotes((0, contracts_test_utils_1.randomAddress)(), expectedMakerToken, expectedTakerToken, expectedTakerFillAmounts));
            (0, contracts_test_utils_1.expect)(fillableAmounts).to.deep.eq(expectedMakerFillAmounts);
        }));
        it('getUniswapV2SellQuotes()', () => __awaiter(void 0, void 0, void 0, function* () {
            const expectedTakerToken = (0, contracts_test_utils_1.randomAddress)();
            const expectedMakerToken = (0, contracts_test_utils_1.randomAddress)();
            const expectedTakerFillAmounts = (0, sampler_1.getSampleAmounts)(new utils_1.BigNumber(100e18), 10);
            const expectedMakerFillAmounts = (0, sampler_1.getSampleAmounts)(new utils_1.BigNumber(100e18), 10);
            const sampler = new mock_sampler_contract_1.MockSamplerContract({
                sampleSellsFromUniswapV2: (_router, path, fillAmounts) => {
                    (0, contracts_test_utils_1.expect)(path).to.deep.eq([expectedMakerToken, expectedTakerToken]);
                    (0, contracts_test_utils_1.expect)(fillAmounts).to.deep.eq(expectedTakerFillAmounts);
                    return expectedMakerFillAmounts;
                },
            });
            const dexOrderSampler = new sampler_1.DexOrderSampler(chainId, sampler, undefined, undefined, undefined, undefined, () => __awaiter(void 0, void 0, void 0, function* () { return undefined; }));
            const [fillableAmounts] = yield dexOrderSampler.executeAsync(dexOrderSampler.getUniswapV2SellQuotes(utils_1.NULL_ADDRESS, [expectedMakerToken, expectedTakerToken], expectedTakerFillAmounts));
            (0, contracts_test_utils_1.expect)(fillableAmounts).to.deep.eq(expectedMakerFillAmounts);
        }));
        it('getUniswapBuyQuotes()', () => __awaiter(void 0, void 0, void 0, function* () {
            const expectedTakerToken = (0, contracts_test_utils_1.randomAddress)();
            const expectedMakerToken = (0, contracts_test_utils_1.randomAddress)();
            const expectedTakerFillAmounts = (0, sampler_1.getSampleAmounts)(new utils_1.BigNumber(100e18), 10);
            const expectedMakerFillAmounts = (0, sampler_1.getSampleAmounts)(new utils_1.BigNumber(100e18), 10);
            const sampler = new mock_sampler_contract_1.MockSamplerContract({
                sampleBuysFromUniswap: (_router, takerToken, makerToken, fillAmounts) => {
                    (0, contracts_test_utils_1.expect)(takerToken).to.eq(expectedTakerToken);
                    (0, contracts_test_utils_1.expect)(makerToken).to.eq(expectedMakerToken);
                    (0, contracts_test_utils_1.expect)(fillAmounts).to.deep.eq(expectedMakerFillAmounts);
                    return expectedTakerFillAmounts;
                },
            });
            const dexOrderSampler = new sampler_1.DexOrderSampler(chainId, sampler, undefined, undefined, undefined, undefined, () => __awaiter(void 0, void 0, void 0, function* () { return undefined; }));
            const [fillableAmounts] = yield dexOrderSampler.executeAsync(dexOrderSampler.getUniswapBuyQuotes((0, contracts_test_utils_1.randomAddress)(), expectedMakerToken, expectedTakerToken, expectedMakerFillAmounts));
            (0, contracts_test_utils_1.expect)(fillableAmounts).to.deep.eq(expectedTakerFillAmounts);
        }));
        it('getSellQuotes()', () => __awaiter(void 0, void 0, void 0, function* () {
            const expectedTakerToken = (0, contracts_test_utils_1.randomAddress)();
            const expectedMakerToken = (0, contracts_test_utils_1.randomAddress)();
            const sources = [types_1.ERC20BridgeSource.Uniswap, types_1.ERC20BridgeSource.UniswapV2];
            const ratesBySource = {
                [types_1.ERC20BridgeSource.Uniswap]: (0, contracts_test_utils_1.getRandomFloat)(0, 100),
                [types_1.ERC20BridgeSource.UniswapV2]: (0, contracts_test_utils_1.getRandomFloat)(0, 100),
            };
            const expectedTakerFillAmounts = (0, sampler_1.getSampleAmounts)(new utils_1.BigNumber(100e18), 3);
            let uniswapRouter;
            let uniswapV2Router;
            const sampler = new mock_sampler_contract_1.MockSamplerContract({
                sampleSellsFromUniswap: (router, takerToken, makerToken, fillAmounts) => {
                    uniswapRouter = router;
                    (0, contracts_test_utils_1.expect)(takerToken).to.eq(expectedTakerToken);
                    (0, contracts_test_utils_1.expect)(makerToken).to.eq(expectedMakerToken);
                    (0, contracts_test_utils_1.expect)(fillAmounts).to.deep.eq(expectedTakerFillAmounts);
                    return fillAmounts.map(a => a.times(ratesBySource[types_1.ERC20BridgeSource.Uniswap]).integerValue());
                },
                sampleSellsFromUniswapV2: (router, path, fillAmounts) => {
                    uniswapV2Router = router;
                    if (path.length === 2) {
                        (0, contracts_test_utils_1.expect)(path).to.deep.eq([expectedTakerToken, expectedMakerToken]);
                    }
                    else if (path.length === 3) {
                        (0, contracts_test_utils_1.expect)(path).to.deep.eq([expectedTakerToken, wethAddress, expectedMakerToken]);
                    }
                    else {
                        (0, contracts_test_utils_1.expect)(path).to.have.lengthOf.within(2, 3);
                    }
                    (0, contracts_test_utils_1.expect)(fillAmounts).to.deep.eq(expectedTakerFillAmounts);
                    return fillAmounts.map(a => a.times(ratesBySource[types_1.ERC20BridgeSource.UniswapV2]).integerValue());
                },
            });
            const dexOrderSampler = new sampler_1.DexOrderSampler(chainId, sampler, undefined, undefined, tokenAdjacencyGraph, undefined, () => __awaiter(void 0, void 0, void 0, function* () { return undefined; }));
            const [quotes] = yield dexOrderSampler.executeAsync(dexOrderSampler.getSellQuotes(sources, expectedMakerToken, expectedTakerToken, expectedTakerFillAmounts));
            const expectedQuotes = sources.map(s => expectedTakerFillAmounts.map(a => ({
                source: s,
                input: a,
                output: a.times(ratesBySource[s]).integerValue(),
                fillData: (() => {
                    if (s === types_1.ERC20BridgeSource.UniswapV2) {
                        return {
                            router: uniswapV2Router,
                            tokenAddressPath: [expectedTakerToken, expectedMakerToken],
                        };
                    }
                    // TODO jacob pass through
                    if (s === types_1.ERC20BridgeSource.Uniswap) {
                        return { router: uniswapRouter };
                    }
                    return {};
                })(),
            })));
            const uniswapV2ETHQuotes = [
                expectedTakerFillAmounts.map(a => ({
                    source: types_1.ERC20BridgeSource.UniswapV2,
                    input: a,
                    output: a.times(ratesBySource[types_1.ERC20BridgeSource.UniswapV2]).integerValue(),
                    fillData: {
                        router: uniswapV2Router,
                        tokenAddressPath: [expectedTakerToken, wethAddress, expectedMakerToken],
                    },
                })),
            ];
            //  extra quote for Uniswap V2, which provides a direct quote (tokenA -> tokenB) AND an ETH quote (tokenA -> ETH -> tokenB)
            const additionalSourceCount = 1;
            (0, contracts_test_utils_1.expect)(quotes).to.have.lengthOf(sources.length + additionalSourceCount);
            (0, contracts_test_utils_1.expect)(quotes).to.deep.eq(expectedQuotes.concat(uniswapV2ETHQuotes));
        }));
        it('getBuyQuotes()', () => __awaiter(void 0, void 0, void 0, function* () {
            const expectedTakerToken = (0, contracts_test_utils_1.randomAddress)();
            const expectedMakerToken = (0, contracts_test_utils_1.randomAddress)();
            const sources = [types_1.ERC20BridgeSource.Uniswap, types_1.ERC20BridgeSource.UniswapV2];
            const ratesBySource = {
                [types_1.ERC20BridgeSource.Uniswap]: (0, contracts_test_utils_1.getRandomFloat)(0, 100),
                [types_1.ERC20BridgeSource.UniswapV2]: (0, contracts_test_utils_1.getRandomFloat)(0, 100),
            };
            const expectedMakerFillAmounts = (0, sampler_1.getSampleAmounts)(new utils_1.BigNumber(100e18), 3);
            let uniswapRouter;
            let uniswapV2Router;
            const sampler = new mock_sampler_contract_1.MockSamplerContract({
                sampleBuysFromUniswap: (router, takerToken, makerToken, fillAmounts) => {
                    uniswapRouter = router;
                    (0, contracts_test_utils_1.expect)(takerToken).to.eq(expectedTakerToken);
                    (0, contracts_test_utils_1.expect)(makerToken).to.eq(expectedMakerToken);
                    (0, contracts_test_utils_1.expect)(fillAmounts).to.deep.eq(expectedMakerFillAmounts);
                    return fillAmounts.map(a => a.times(ratesBySource[types_1.ERC20BridgeSource.Uniswap]).integerValue());
                },
                sampleBuysFromUniswapV2: (router, path, fillAmounts) => {
                    uniswapV2Router = router;
                    if (path.length === 2) {
                        (0, contracts_test_utils_1.expect)(path).to.deep.eq([expectedTakerToken, expectedMakerToken]);
                    }
                    else if (path.length === 3) {
                        (0, contracts_test_utils_1.expect)(path).to.deep.eq([expectedTakerToken, wethAddress, expectedMakerToken]);
                    }
                    else {
                        (0, contracts_test_utils_1.expect)(path).to.have.lengthOf.within(2, 3);
                    }
                    (0, contracts_test_utils_1.expect)(fillAmounts).to.deep.eq(expectedMakerFillAmounts);
                    return fillAmounts.map(a => a.times(ratesBySource[types_1.ERC20BridgeSource.UniswapV2]).integerValue());
                },
            });
            const dexOrderSampler = new sampler_1.DexOrderSampler(chainId, sampler, undefined, undefined, tokenAdjacencyGraph, undefined, () => __awaiter(void 0, void 0, void 0, function* () { return undefined; }));
            const [quotes] = yield dexOrderSampler.executeAsync(dexOrderSampler.getBuyQuotes(sources, expectedMakerToken, expectedTakerToken, expectedMakerFillAmounts));
            const expectedQuotes = sources.map(s => expectedMakerFillAmounts.map(a => ({
                source: s,
                input: a,
                output: a.times(ratesBySource[s]).integerValue(),
                fillData: (() => {
                    if (s === types_1.ERC20BridgeSource.UniswapV2) {
                        return {
                            router: uniswapV2Router,
                            tokenAddressPath: [expectedTakerToken, expectedMakerToken],
                        };
                    }
                    if (s === types_1.ERC20BridgeSource.Uniswap) {
                        return { router: uniswapRouter };
                    }
                    return {};
                })(),
            })));
            const uniswapV2ETHQuotes = [
                expectedMakerFillAmounts.map(a => ({
                    source: types_1.ERC20BridgeSource.UniswapV2,
                    input: a,
                    output: a.times(ratesBySource[types_1.ERC20BridgeSource.UniswapV2]).integerValue(),
                    fillData: {
                        router: uniswapV2Router,
                        tokenAddressPath: [expectedTakerToken, wethAddress, expectedMakerToken],
                    },
                })),
            ];
            //  extra quote for Uniswap V2, which provides a direct quote (tokenA -> tokenB) AND an ETH quote (tokenA -> ETH -> tokenB)
            (0, contracts_test_utils_1.expect)(quotes).to.have.lengthOf(sources.length + 1);
            (0, contracts_test_utils_1.expect)(quotes).to.deep.eq(expectedQuotes.concat(uniswapV2ETHQuotes));
        }));
        describe('batched operations', () => {
            it('getLimitOrderFillableMakerAssetAmounts(), getLimitOrderFillableTakerAssetAmounts()', () => __awaiter(void 0, void 0, void 0, function* () {
                const expectedFillableTakerAmounts = ORDERS.map(() => (0, contracts_test_utils_1.getRandomInteger)(0, 100e18));
                const expectedFillableMakerAmounts = ORDERS.map(() => (0, contracts_test_utils_1.getRandomInteger)(0, 100e18));
                const sampler = new mock_sampler_contract_1.MockSamplerContract({
                    getLimitOrderFillableMakerAssetAmounts: (orders, signatures) => {
                        (0, contracts_test_utils_1.expect)(orders).to.deep.eq(SIMPLE_ORDERS);
                        (0, contracts_test_utils_1.expect)(signatures).to.deep.eq(ORDERS.map(o => o.signature));
                        return expectedFillableMakerAmounts;
                    },
                    getLimitOrderFillableTakerAssetAmounts: (orders, signatures) => {
                        (0, contracts_test_utils_1.expect)(orders).to.deep.eq(SIMPLE_ORDERS);
                        (0, contracts_test_utils_1.expect)(signatures).to.deep.eq(ORDERS.map(o => o.signature));
                        return expectedFillableTakerAmounts;
                    },
                });
                const dexOrderSampler = new sampler_1.DexOrderSampler(chainId, sampler, undefined, undefined, undefined, undefined, () => __awaiter(void 0, void 0, void 0, function* () { return undefined; }));
                const [fillableMakerAmounts, fillableTakerAmounts] = yield dexOrderSampler.executeAsync(dexOrderSampler.getLimitOrderFillableMakerAmounts(ORDERS, exchangeProxyAddress), dexOrderSampler.getLimitOrderFillableTakerAmounts(ORDERS, exchangeProxyAddress));
                (0, contracts_test_utils_1.expect)(fillableMakerAmounts).to.deep.eq(expectedFillableMakerAmounts);
                (0, contracts_test_utils_1.expect)(fillableTakerAmounts).to.deep.eq(expectedFillableTakerAmounts);
            }));
        });
    });
});
// tslint:disable-next-line: max-file-line-count
//# sourceMappingURL=dex_sampler_test.js.map