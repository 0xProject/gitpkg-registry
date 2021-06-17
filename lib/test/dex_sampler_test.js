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
    const MAKER_TOKEN = contracts_test_utils_1.randomAddress();
    const TAKER_TOKEN = contracts_test_utils_1.randomAddress();
    const chainId = contract_addresses_1.ChainId.Mainnet;
    const wethAddress = contract_addresses_1.getContractAddressesForChainOrThrow(CHAIN_ID).etherToken;
    const exchangeProxyAddress = contract_addresses_1.getContractAddressesForChainOrThrow(CHAIN_ID).exchangeProxy;
    const tokenAdjacencyGraph = { default: [wethAddress] };
    describe('getSampleAmounts()', () => {
        const FILL_AMOUNT = contracts_test_utils_1.getRandomInteger(1, 1e18);
        const NUM_SAMPLES = 16;
        it('generates the correct number of amounts', () => {
            const amounts = sampler_1.getSampleAmounts(FILL_AMOUNT, NUM_SAMPLES);
            contracts_test_utils_1.expect(amounts).to.be.length(NUM_SAMPLES);
        });
        it('first amount is nonzero', () => {
            const amounts = sampler_1.getSampleAmounts(FILL_AMOUNT, NUM_SAMPLES);
            contracts_test_utils_1.expect(amounts[0]).to.not.bignumber.eq(0);
        });
        it('last amount is the fill amount', () => {
            const amounts = sampler_1.getSampleAmounts(FILL_AMOUNT, NUM_SAMPLES);
            contracts_test_utils_1.expect(amounts[NUM_SAMPLES - 1]).to.bignumber.eq(FILL_AMOUNT);
        });
        it('can generate a single amount', () => {
            const amounts = sampler_1.getSampleAmounts(FILL_AMOUNT, 1);
            contracts_test_utils_1.expect(amounts).to.be.length(1);
            contracts_test_utils_1.expect(amounts[0]).to.bignumber.eq(FILL_AMOUNT);
        });
        it('generates ascending amounts', () => {
            const amounts = sampler_1.getSampleAmounts(FILL_AMOUNT, NUM_SAMPLES);
            for (const i of _.times(NUM_SAMPLES).slice(1)) {
                const prev = amounts[i - 1];
                const amount = amounts[i];
                contracts_test_utils_1.expect(prev).to.bignumber.lt(amount);
            }
        });
    });
    function createOrder(overrides) {
        const o = {
            order: Object.assign({ salt: utils_2.generatePseudoRandomSalt(), expiry: contracts_test_utils_1.getRandomInteger(0, Math.pow(2, 64)), makerToken: MAKER_TOKEN, takerToken: TAKER_TOKEN, makerAmount: contracts_test_utils_1.getRandomInteger(1, 1e18), takerAmount: contracts_test_utils_1.getRandomInteger(1, 1e18), takerTokenFeeAmount: contracts_test_utils_1.constants.ZERO_AMOUNT, chainId: CHAIN_ID, pool: EMPTY_BYTES32, feeRecipient: utils_1.NULL_ADDRESS, sender: utils_1.NULL_ADDRESS, maker: utils_1.NULL_ADDRESS, taker: utils_1.NULL_ADDRESS, verifyingContract: exchangeProxyAddress }, overrides),
            signature: { v: 1, r: utils_1.hexUtils.random(), s: utils_1.hexUtils.random(), signatureType: protocol_utils_1.SignatureType.EthSign },
            type: protocol_utils_1.FillQuoteTransformerOrderType.Limit,
        };
        return o;
    }
    const ORDERS = _.times(4, () => createOrder());
    const SIMPLE_ORDERS = ORDERS.map(o => _.omit(o.order, ['chainId', 'verifyingContract']));
    describe('operations', () => {
        it('getLimitOrderFillableMakerAssetAmounts()', () => __awaiter(void 0, void 0, void 0, function* () {
            const expectedFillableAmounts = ORDERS.map(() => contracts_test_utils_1.getRandomInteger(0, 100e18));
            const sampler = new mock_sampler_contract_1.MockSamplerContract({
                getLimitOrderFillableMakerAssetAmounts: (orders, signatures) => {
                    contracts_test_utils_1.expect(orders).to.deep.eq(SIMPLE_ORDERS);
                    contracts_test_utils_1.expect(signatures).to.deep.eq(ORDERS.map(o => o.signature));
                    return expectedFillableAmounts;
                },
            });
            const dexOrderSampler = new sampler_1.DexOrderSampler(chainId, sampler, undefined, undefined, undefined, undefined, () => __awaiter(void 0, void 0, void 0, function* () { return undefined; }));
            const [fillableAmounts] = yield dexOrderSampler.executeAsync(dexOrderSampler.getLimitOrderFillableMakerAmounts(ORDERS, exchangeProxyAddress));
            contracts_test_utils_1.expect(fillableAmounts).to.deep.eq(expectedFillableAmounts);
        }));
        it('getLimitOrderFillableTakerAssetAmounts()', () => __awaiter(void 0, void 0, void 0, function* () {
            const expectedFillableAmounts = ORDERS.map(() => contracts_test_utils_1.getRandomInteger(0, 100e18));
            const sampler = new mock_sampler_contract_1.MockSamplerContract({
                getLimitOrderFillableTakerAssetAmounts: (orders, signatures) => {
                    contracts_test_utils_1.expect(orders).to.deep.eq(SIMPLE_ORDERS);
                    contracts_test_utils_1.expect(signatures).to.deep.eq(ORDERS.map(o => o.signature));
                    return expectedFillableAmounts;
                },
            });
            const dexOrderSampler = new sampler_1.DexOrderSampler(chainId, sampler, undefined, undefined, undefined, undefined, () => __awaiter(void 0, void 0, void 0, function* () { return undefined; }));
            const [fillableAmounts] = yield dexOrderSampler.executeAsync(dexOrderSampler.getLimitOrderFillableTakerAmounts(ORDERS, exchangeProxyAddress));
            contracts_test_utils_1.expect(fillableAmounts).to.deep.eq(expectedFillableAmounts);
        }));
        it('getKyberSellQuotes()', () => __awaiter(void 0, void 0, void 0, function* () {
            const expectedTakerToken = contracts_test_utils_1.randomAddress();
            const expectedMakerToken = contracts_test_utils_1.randomAddress();
            const expectedTakerFillAmounts = sampler_1.getSampleAmounts(new utils_1.BigNumber(100e18), 10);
            const expectedMakerFillAmounts = sampler_1.getSampleAmounts(new utils_1.BigNumber(100e18), 10);
            const sampler = new mock_sampler_contract_1.MockSamplerContract({
                sampleSellsFromKyberNetwork: (_reserveOffset, takerToken, makerToken, fillAmounts) => {
                    contracts_test_utils_1.expect(takerToken).to.eq(expectedTakerToken);
                    contracts_test_utils_1.expect(makerToken).to.eq(expectedMakerToken);
                    contracts_test_utils_1.expect(fillAmounts).to.deep.eq(expectedTakerFillAmounts);
                    return ['0x', '0x', [], expectedMakerFillAmounts];
                },
            });
            const dexOrderSampler = new sampler_1.DexOrderSampler(chainId, sampler, undefined, undefined, undefined, undefined, () => __awaiter(void 0, void 0, void 0, function* () { return undefined; }));
            const [results] = yield dexOrderSampler.executeAsync(dexOrderSampler.getKyberSellQuotes({ hintHandler: contracts_test_utils_1.randomAddress(), networkProxy: contracts_test_utils_1.randomAddress(), weth: contracts_test_utils_1.randomAddress() }, new utils_1.BigNumber(0), expectedMakerToken, expectedTakerToken, expectedTakerFillAmounts));
            contracts_test_utils_1.expect(results.samples).to.deep.eq(expectedMakerFillAmounts);
        }));
        it('getLiquidityProviderSellQuotes()', () => __awaiter(void 0, void 0, void 0, function* () {
            const expectedMakerToken = contracts_test_utils_1.randomAddress();
            const expectedTakerToken = contracts_test_utils_1.randomAddress();
            const poolAddress = contracts_test_utils_1.randomAddress();
            const gasCost = 123;
            const sampler = new mock_sampler_contract_1.MockSamplerContract({
                sampleSellsFromLiquidityProvider: (providerAddress, takerToken, makerToken, _fillAmounts) => {
                    contracts_test_utils_1.expect(providerAddress).to.eq(poolAddress);
                    contracts_test_utils_1.expect(takerToken).to.eq(expectedTakerToken);
                    contracts_test_utils_1.expect(makerToken).to.eq(expectedMakerToken);
                    return [[new utils_1.BigNumber(gasCost)], [contracts_test_utils_1.toBaseUnitAmount(1001)]];
                },
            });
            const dexOrderSampler = new sampler_1.DexOrderSampler(chainId, sampler, undefined, undefined, undefined, {
                [poolAddress]: { tokens: [expectedMakerToken, expectedTakerToken], gasCost },
            }, () => __awaiter(void 0, void 0, void 0, function* () { return undefined; }));
            const [result] = yield dexOrderSampler.executeAsync(dexOrderSampler.getSellQuotes([types_1.ERC20BridgeSource.LiquidityProvider], expectedMakerToken, expectedTakerToken, [contracts_test_utils_1.toBaseUnitAmount(1000)]));
            contracts_test_utils_1.expect(result).to.deep.equal([
                [
                    {
                        source: 'LiquidityProvider',
                        output: contracts_test_utils_1.toBaseUnitAmount(1001),
                        input: contracts_test_utils_1.toBaseUnitAmount(1000),
                        fillData: { poolAddress, gasCost },
                        gasUsed: new utils_1.BigNumber(gasCost),
                    },
                ],
            ]);
        }));
        it('getLiquidityProviderBuyQuotes()', () => __awaiter(void 0, void 0, void 0, function* () {
            const expectedMakerToken = contracts_test_utils_1.randomAddress();
            const expectedTakerToken = contracts_test_utils_1.randomAddress();
            const poolAddress = contracts_test_utils_1.randomAddress();
            const gasCost = 321;
            const sampler = new mock_sampler_contract_1.MockSamplerContract({
                sampleBuysFromLiquidityProvider: (providerAddress, takerToken, makerToken, _fillAmounts) => {
                    contracts_test_utils_1.expect(providerAddress).to.eq(poolAddress);
                    contracts_test_utils_1.expect(takerToken).to.eq(expectedTakerToken);
                    contracts_test_utils_1.expect(makerToken).to.eq(expectedMakerToken);
                    return [[new utils_1.BigNumber(gasCost)], [contracts_test_utils_1.toBaseUnitAmount(999)]];
                },
            });
            const dexOrderSampler = new sampler_1.DexOrderSampler(chainId, sampler, undefined, undefined, undefined, {
                [poolAddress]: { tokens: [expectedMakerToken, expectedTakerToken], gasCost },
            }, () => __awaiter(void 0, void 0, void 0, function* () { return undefined; }));
            const [result] = yield dexOrderSampler.executeAsync(dexOrderSampler.getBuyQuotes([types_1.ERC20BridgeSource.LiquidityProvider], expectedMakerToken, expectedTakerToken, [contracts_test_utils_1.toBaseUnitAmount(1000)]));
            contracts_test_utils_1.expect(result).to.deep.equal([
                [
                    {
                        source: 'LiquidityProvider',
                        output: contracts_test_utils_1.toBaseUnitAmount(999),
                        input: contracts_test_utils_1.toBaseUnitAmount(1000),
                        fillData: { poolAddress, gasCost },
                        gasUsed: new utils_1.BigNumber(gasCost),
                    },
                ],
            ]);
        }));
        it('getEth2DaiSellQuotes()', () => __awaiter(void 0, void 0, void 0, function* () {
            const expectedTakerToken = contracts_test_utils_1.randomAddress();
            const expectedMakerToken = contracts_test_utils_1.randomAddress();
            const expectedTakerFillAmounts = sampler_1.getSampleAmounts(new utils_1.BigNumber(100e18), 10);
            const expectedMakerFillAmounts = sampler_1.getSampleAmounts(new utils_1.BigNumber(100e18), 10);
            const sampler = new mock_sampler_contract_1.MockSamplerContract({
                sampleSellsFromEth2Dai: (_router, takerToken, makerToken, fillAmounts) => {
                    contracts_test_utils_1.expect(takerToken).to.eq(expectedTakerToken);
                    contracts_test_utils_1.expect(makerToken).to.eq(expectedMakerToken);
                    contracts_test_utils_1.expect(fillAmounts).to.deep.eq(expectedTakerFillAmounts);
                    return [[], expectedMakerFillAmounts];
                },
            });
            const dexOrderSampler = new sampler_1.DexOrderSampler(chainId, sampler, undefined, undefined, undefined, undefined, () => __awaiter(void 0, void 0, void 0, function* () { return undefined; }));
            const [result] = yield dexOrderSampler.executeAsync(dexOrderSampler.getEth2DaiSellQuotes(contracts_test_utils_1.randomAddress(), expectedMakerToken, expectedTakerToken, expectedTakerFillAmounts));
            contracts_test_utils_1.expect(result.samples).to.deep.eq(expectedMakerFillAmounts);
        }));
        it('getUniswapSellQuotes()', () => __awaiter(void 0, void 0, void 0, function* () {
            const expectedTakerToken = contracts_test_utils_1.randomAddress();
            const expectedMakerToken = contracts_test_utils_1.randomAddress();
            const expectedTakerFillAmounts = sampler_1.getSampleAmounts(new utils_1.BigNumber(100e18), 10);
            const expectedMakerFillAmounts = sampler_1.getSampleAmounts(new utils_1.BigNumber(100e18), 10);
            const sampler = new mock_sampler_contract_1.MockSamplerContract({
                sampleSellsFromUniswap: (_router, takerToken, makerToken, fillAmounts) => {
                    contracts_test_utils_1.expect(takerToken).to.eq(expectedTakerToken);
                    contracts_test_utils_1.expect(makerToken).to.eq(expectedMakerToken);
                    contracts_test_utils_1.expect(fillAmounts).to.deep.eq(expectedTakerFillAmounts);
                    return [[], expectedMakerFillAmounts];
                },
            });
            const dexOrderSampler = new sampler_1.DexOrderSampler(chainId, sampler, undefined, undefined, undefined, undefined, () => __awaiter(void 0, void 0, void 0, function* () { return undefined; }));
            const [results] = yield dexOrderSampler.executeAsync(dexOrderSampler.getUniswapSellQuotes(contracts_test_utils_1.randomAddress(), expectedMakerToken, expectedTakerToken, expectedTakerFillAmounts));
            contracts_test_utils_1.expect(results.samples).to.deep.eq(expectedMakerFillAmounts);
        }));
        it('getUniswapV2SellQuotes()', () => __awaiter(void 0, void 0, void 0, function* () {
            const expectedTakerToken = contracts_test_utils_1.randomAddress();
            const expectedMakerToken = contracts_test_utils_1.randomAddress();
            const expectedTakerFillAmounts = sampler_1.getSampleAmounts(new utils_1.BigNumber(100e18), 10);
            const expectedMakerFillAmounts = sampler_1.getSampleAmounts(new utils_1.BigNumber(100e18), 10);
            const sampler = new mock_sampler_contract_1.MockSamplerContract({
                sampleSellsFromUniswapV2: (_router, path, fillAmounts) => {
                    contracts_test_utils_1.expect(path).to.deep.eq([expectedMakerToken, expectedTakerToken]);
                    contracts_test_utils_1.expect(fillAmounts).to.deep.eq(expectedTakerFillAmounts);
                    return [[], expectedMakerFillAmounts];
                },
            });
            const dexOrderSampler = new sampler_1.DexOrderSampler(chainId, sampler, undefined, undefined, undefined, undefined, () => __awaiter(void 0, void 0, void 0, function* () { return undefined; }));
            const [results] = yield dexOrderSampler.executeAsync(dexOrderSampler.getUniswapV2SellQuotes(utils_1.NULL_ADDRESS, [expectedMakerToken, expectedTakerToken], expectedTakerFillAmounts));
            contracts_test_utils_1.expect(results.samples).to.deep.eq(expectedMakerFillAmounts);
        }));
        it('getEth2DaiBuyQuotes()', () => __awaiter(void 0, void 0, void 0, function* () {
            const expectedTakerToken = contracts_test_utils_1.randomAddress();
            const expectedMakerToken = contracts_test_utils_1.randomAddress();
            const expectedTakerFillAmounts = sampler_1.getSampleAmounts(new utils_1.BigNumber(100e18), 10);
            const expectedMakerFillAmounts = sampler_1.getSampleAmounts(new utils_1.BigNumber(100e18), 10);
            const sampler = new mock_sampler_contract_1.MockSamplerContract({
                sampleBuysFromEth2Dai: (_router, takerToken, makerToken, fillAmounts) => {
                    contracts_test_utils_1.expect(takerToken).to.eq(expectedTakerToken);
                    contracts_test_utils_1.expect(makerToken).to.eq(expectedMakerToken);
                    contracts_test_utils_1.expect(fillAmounts).to.deep.eq(expectedMakerFillAmounts);
                    return [[], expectedMakerFillAmounts];
                },
            });
            const dexOrderSampler = new sampler_1.DexOrderSampler(chainId, sampler, undefined, undefined, undefined, undefined, () => __awaiter(void 0, void 0, void 0, function* () { return undefined; }));
            const [results] = yield dexOrderSampler.executeAsync(dexOrderSampler.getEth2DaiBuyQuotes(contracts_test_utils_1.randomAddress(), expectedMakerToken, expectedTakerToken, expectedMakerFillAmounts));
            contracts_test_utils_1.expect(results.samples).to.deep.eq(expectedTakerFillAmounts);
        }));
        it('getUniswapBuyQuotes()', () => __awaiter(void 0, void 0, void 0, function* () {
            const expectedTakerToken = contracts_test_utils_1.randomAddress();
            const expectedMakerToken = contracts_test_utils_1.randomAddress();
            const expectedTakerFillAmounts = sampler_1.getSampleAmounts(new utils_1.BigNumber(100e18), 10);
            const expectedMakerFillAmounts = sampler_1.getSampleAmounts(new utils_1.BigNumber(100e18), 10);
            const sampler = new mock_sampler_contract_1.MockSamplerContract({
                sampleBuysFromUniswap: (_router, takerToken, makerToken, fillAmounts) => {
                    contracts_test_utils_1.expect(takerToken).to.eq(expectedTakerToken);
                    contracts_test_utils_1.expect(makerToken).to.eq(expectedMakerToken);
                    contracts_test_utils_1.expect(fillAmounts).to.deep.eq(expectedMakerFillAmounts);
                    return [[], expectedMakerFillAmounts];
                },
            });
            const dexOrderSampler = new sampler_1.DexOrderSampler(chainId, sampler, undefined, undefined, undefined, undefined, () => __awaiter(void 0, void 0, void 0, function* () { return undefined; }));
            const [results] = yield dexOrderSampler.executeAsync(dexOrderSampler.getUniswapBuyQuotes(contracts_test_utils_1.randomAddress(), expectedMakerToken, expectedTakerToken, expectedMakerFillAmounts));
            contracts_test_utils_1.expect(results.samples).to.deep.eq(expectedTakerFillAmounts);
        }));
        it('getSellQuotes()', () => __awaiter(void 0, void 0, void 0, function* () {
            const expectedTakerToken = contracts_test_utils_1.randomAddress();
            const expectedMakerToken = contracts_test_utils_1.randomAddress();
            const sources = [types_1.ERC20BridgeSource.Eth2Dai, types_1.ERC20BridgeSource.Uniswap, types_1.ERC20BridgeSource.UniswapV2];
            const ratesBySource = {
                [types_1.ERC20BridgeSource.Kyber]: contracts_test_utils_1.getRandomFloat(0, 100),
                [types_1.ERC20BridgeSource.Eth2Dai]: contracts_test_utils_1.getRandomFloat(0, 100),
                [types_1.ERC20BridgeSource.Uniswap]: contracts_test_utils_1.getRandomFloat(0, 100),
                [types_1.ERC20BridgeSource.UniswapV2]: contracts_test_utils_1.getRandomFloat(0, 100),
            };
            const expectedTakerFillAmounts = sampler_1.getSampleAmounts(new utils_1.BigNumber(100e18), 3);
            let uniswapRouter;
            let uniswapV2Router;
            let eth2DaiRouter;
            const gasUsed = new utils_1.BigNumber(123);
            const sampler = new mock_sampler_contract_1.MockSamplerContract({
                sampleSellsFromUniswap: (router, takerToken, makerToken, fillAmounts) => {
                    uniswapRouter = router;
                    contracts_test_utils_1.expect(takerToken).to.eq(expectedTakerToken);
                    contracts_test_utils_1.expect(makerToken).to.eq(expectedMakerToken);
                    contracts_test_utils_1.expect(fillAmounts).to.deep.eq(expectedTakerFillAmounts);
                    return [
                        fillAmounts.map(_a => gasUsed),
                        fillAmounts.map(a => a.times(ratesBySource[types_1.ERC20BridgeSource.Uniswap]).integerValue()),
                    ];
                },
                sampleSellsFromEth2Dai: (router, takerToken, makerToken, fillAmounts) => {
                    eth2DaiRouter = router;
                    contracts_test_utils_1.expect(takerToken).to.eq(expectedTakerToken);
                    contracts_test_utils_1.expect(makerToken).to.eq(expectedMakerToken);
                    contracts_test_utils_1.expect(fillAmounts).to.deep.eq(expectedTakerFillAmounts);
                    return [
                        fillAmounts.map(_a => gasUsed),
                        fillAmounts.map(a => a.times(ratesBySource[types_1.ERC20BridgeSource.Eth2Dai]).integerValue()),
                    ];
                },
                sampleSellsFromUniswapV2: (router, path, fillAmounts) => {
                    uniswapV2Router = router;
                    if (path.length === 2) {
                        contracts_test_utils_1.expect(path).to.deep.eq([expectedTakerToken, expectedMakerToken]);
                    }
                    else if (path.length === 3) {
                        contracts_test_utils_1.expect(path).to.deep.eq([expectedTakerToken, wethAddress, expectedMakerToken]);
                    }
                    else {
                        contracts_test_utils_1.expect(path).to.have.lengthOf.within(2, 3);
                    }
                    contracts_test_utils_1.expect(fillAmounts).to.deep.eq(expectedTakerFillAmounts);
                    return [
                        fillAmounts.map(_a => gasUsed),
                        fillAmounts.map(a => a.times(ratesBySource[types_1.ERC20BridgeSource.UniswapV2]).integerValue()),
                    ];
                },
            });
            const dexOrderSampler = new sampler_1.DexOrderSampler(chainId, sampler, undefined, undefined, tokenAdjacencyGraph, undefined, () => __awaiter(void 0, void 0, void 0, function* () { return undefined; }));
            const [quotes] = yield dexOrderSampler.executeAsync(dexOrderSampler.getSellQuotes(sources, expectedMakerToken, expectedTakerToken, expectedTakerFillAmounts));
            const expectedQuotes = sources.map(s => expectedTakerFillAmounts.map(a => ({
                source: s,
                input: a,
                output: a.times(ratesBySource[s]).integerValue(),
                gasUsed,
                fillData: (() => {
                    if (s === types_1.ERC20BridgeSource.UniswapV2) {
                        return {
                            router: uniswapV2Router,
                            tokenAddressPath: [expectedTakerToken, expectedMakerToken],
                        };
                    }
                    if (s === types_1.ERC20BridgeSource.Eth2Dai) {
                        return { router: eth2DaiRouter };
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
                    gasUsed,
                    fillData: {
                        router: uniswapV2Router,
                        tokenAddressPath: [expectedTakerToken, wethAddress, expectedMakerToken],
                    },
                })),
            ];
            //  extra quote for Uniswap V2, which provides a direct quote (tokenA -> tokenB) AND an ETH quote (tokenA -> ETH -> tokenB)
            const additionalSourceCount = 1;
            contracts_test_utils_1.expect(quotes).to.have.lengthOf(sources.length + additionalSourceCount);
            contracts_test_utils_1.expect(quotes).to.deep.eq(expectedQuotes.concat(uniswapV2ETHQuotes));
        }));
        it('getBuyQuotes()', () => __awaiter(void 0, void 0, void 0, function* () {
            const expectedTakerToken = contracts_test_utils_1.randomAddress();
            const expectedMakerToken = contracts_test_utils_1.randomAddress();
            const sources = [types_1.ERC20BridgeSource.Eth2Dai, types_1.ERC20BridgeSource.Uniswap, types_1.ERC20BridgeSource.UniswapV2];
            const ratesBySource = {
                [types_1.ERC20BridgeSource.Eth2Dai]: contracts_test_utils_1.getRandomFloat(0, 100),
                [types_1.ERC20BridgeSource.Uniswap]: contracts_test_utils_1.getRandomFloat(0, 100),
                [types_1.ERC20BridgeSource.UniswapV2]: contracts_test_utils_1.getRandomFloat(0, 100),
            };
            const expectedMakerFillAmounts = sampler_1.getSampleAmounts(new utils_1.BigNumber(100e18), 3);
            const gasUsed = new utils_1.BigNumber(123);
            let uniswapRouter;
            let uniswapV2Router;
            let eth2DaiRouter;
            const sampler = new mock_sampler_contract_1.MockSamplerContract({
                sampleBuysFromUniswap: (router, takerToken, makerToken, fillAmounts) => {
                    uniswapRouter = router;
                    contracts_test_utils_1.expect(takerToken).to.eq(expectedTakerToken);
                    contracts_test_utils_1.expect(makerToken).to.eq(expectedMakerToken);
                    contracts_test_utils_1.expect(fillAmounts).to.deep.eq(expectedMakerFillAmounts);
                    return [
                        fillAmounts.map(_a => gasUsed),
                        fillAmounts.map(a => a.times(ratesBySource[types_1.ERC20BridgeSource.Uniswap]).integerValue()),
                    ];
                },
                sampleBuysFromEth2Dai: (router, takerToken, makerToken, fillAmounts) => {
                    eth2DaiRouter = router;
                    contracts_test_utils_1.expect(takerToken).to.eq(expectedTakerToken);
                    contracts_test_utils_1.expect(makerToken).to.eq(expectedMakerToken);
                    contracts_test_utils_1.expect(fillAmounts).to.deep.eq(expectedMakerFillAmounts);
                    return [
                        fillAmounts.map(_a => gasUsed),
                        fillAmounts.map(a => a.times(ratesBySource[types_1.ERC20BridgeSource.Eth2Dai]).integerValue()),
                    ];
                },
                sampleBuysFromUniswapV2: (router, path, fillAmounts) => {
                    uniswapV2Router = router;
                    if (path.length === 2) {
                        contracts_test_utils_1.expect(path).to.deep.eq([expectedTakerToken, expectedMakerToken]);
                    }
                    else if (path.length === 3) {
                        contracts_test_utils_1.expect(path).to.deep.eq([expectedTakerToken, wethAddress, expectedMakerToken]);
                    }
                    else {
                        contracts_test_utils_1.expect(path).to.have.lengthOf.within(2, 3);
                    }
                    contracts_test_utils_1.expect(fillAmounts).to.deep.eq(expectedMakerFillAmounts);
                    return [
                        fillAmounts.map(_a => gasUsed),
                        fillAmounts.map(a => a.times(ratesBySource[types_1.ERC20BridgeSource.UniswapV2]).integerValue()),
                    ];
                },
            });
            const dexOrderSampler = new sampler_1.DexOrderSampler(chainId, sampler, undefined, undefined, tokenAdjacencyGraph, undefined, () => __awaiter(void 0, void 0, void 0, function* () { return undefined; }));
            const [quotes] = yield dexOrderSampler.executeAsync(dexOrderSampler.getBuyQuotes(sources, expectedMakerToken, expectedTakerToken, expectedMakerFillAmounts));
            const expectedQuotes = sources.map(s => expectedMakerFillAmounts.map(a => ({
                source: s,
                input: a,
                output: a.times(ratesBySource[s]).integerValue(),
                gasUsed,
                fillData: (() => {
                    if (s === types_1.ERC20BridgeSource.UniswapV2) {
                        return {
                            router: uniswapV2Router,
                            tokenAddressPath: [expectedTakerToken, expectedMakerToken],
                        };
                    }
                    if (s === types_1.ERC20BridgeSource.Eth2Dai) {
                        return { router: eth2DaiRouter };
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
                    gasUsed,
                    fillData: {
                        router: uniswapV2Router,
                        tokenAddressPath: [expectedTakerToken, wethAddress, expectedMakerToken],
                    },
                })),
            ];
            //  extra quote for Uniswap V2, which provides a direct quote (tokenA -> tokenB) AND an ETH quote (tokenA -> ETH -> tokenB)
            contracts_test_utils_1.expect(quotes).to.have.lengthOf(sources.length + 1);
            contracts_test_utils_1.expect(quotes).to.deep.eq(expectedQuotes.concat(uniswapV2ETHQuotes));
        }));
        describe('batched operations', () => {
            it('getLimitOrderFillableMakerAssetAmounts(), getLimitOrderFillableTakerAssetAmounts()', () => __awaiter(void 0, void 0, void 0, function* () {
                const expectedFillableTakerAmounts = ORDERS.map(() => contracts_test_utils_1.getRandomInteger(0, 100e18));
                const expectedFillableMakerAmounts = ORDERS.map(() => contracts_test_utils_1.getRandomInteger(0, 100e18));
                const sampler = new mock_sampler_contract_1.MockSamplerContract({
                    getLimitOrderFillableMakerAssetAmounts: (orders, signatures) => {
                        contracts_test_utils_1.expect(orders).to.deep.eq(SIMPLE_ORDERS);
                        contracts_test_utils_1.expect(signatures).to.deep.eq(ORDERS.map(o => o.signature));
                        return expectedFillableMakerAmounts;
                    },
                    getLimitOrderFillableTakerAssetAmounts: (orders, signatures) => {
                        contracts_test_utils_1.expect(orders).to.deep.eq(SIMPLE_ORDERS);
                        contracts_test_utils_1.expect(signatures).to.deep.eq(ORDERS.map(o => o.signature));
                        return expectedFillableTakerAmounts;
                    },
                });
                const dexOrderSampler = new sampler_1.DexOrderSampler(chainId, sampler, undefined, undefined, undefined, undefined, () => __awaiter(void 0, void 0, void 0, function* () { return undefined; }));
                const [fillableMakerAmounts, fillableTakerAmounts] = yield dexOrderSampler.executeAsync(dexOrderSampler.getLimitOrderFillableMakerAmounts(ORDERS, exchangeProxyAddress), dexOrderSampler.getLimitOrderFillableTakerAmounts(ORDERS, exchangeProxyAddress));
                contracts_test_utils_1.expect(fillableMakerAmounts).to.deep.eq(expectedFillableMakerAmounts);
                contracts_test_utils_1.expect(fillableTakerAmounts).to.deep.eq(expectedFillableTakerAmounts);
            }));
        });
    });
});
// tslint:disable-next-line: max-file-line-count
//# sourceMappingURL=dex_sampler_test.js.map