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
const contract_addresses_1 = require("@0x/contract-addresses");
const contracts_test_utils_1 = require("@0x/contracts-test-utils");
const order_utils_1 = require("@0x/order-utils");
const utils_1 = require("@0x/utils");
const _ = require("lodash");
const balancer_utils_1 = require("../src/utils/market_operation_utils/balancer_utils");
const sampler_1 = require("../src/utils/market_operation_utils/sampler");
const types_1 = require("../src/utils/market_operation_utils/types");
const mock_balancer_pools_cache_1 = require("./utils/mock_balancer_pools_cache");
const mock_bancor_service_1 = require("./utils/mock_bancor_service");
const mock_sampler_contract_1 = require("./utils/mock_sampler_contract");
const web3_wrapper_1 = require("./utils/web3_wrapper");
const CHAIN_ID = 1;
// tslint:disable: custom-no-magic-numbers
describe('DexSampler tests', () => {
    const MAKER_TOKEN = contracts_test_utils_1.randomAddress();
    const TAKER_TOKEN = contracts_test_utils_1.randomAddress();
    const MAKER_ASSET_DATA = order_utils_1.assetDataUtils.encodeERC20AssetData(MAKER_TOKEN);
    const TAKER_ASSET_DATA = order_utils_1.assetDataUtils.encodeERC20AssetData(TAKER_TOKEN);
    const wethAddress = contract_addresses_1.getContractAddressesForChainOrThrow(CHAIN_ID).etherToken;
    const exchangeAddress = contract_addresses_1.getContractAddressesForChainOrThrow(CHAIN_ID).exchange;
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
        return Object.assign({ chainId: CHAIN_ID, exchangeAddress: contracts_test_utils_1.randomAddress(), makerAddress: contracts_test_utils_1.constants.NULL_ADDRESS, takerAddress: contracts_test_utils_1.constants.NULL_ADDRESS, senderAddress: contracts_test_utils_1.constants.NULL_ADDRESS, feeRecipientAddress: contracts_test_utils_1.randomAddress(), salt: order_utils_1.generatePseudoRandomSalt(), expirationTimeSeconds: contracts_test_utils_1.getRandomInteger(0, Math.pow(2, 64)), makerAssetData: MAKER_ASSET_DATA, takerAssetData: TAKER_ASSET_DATA, makerFeeAssetData: contracts_test_utils_1.constants.NULL_BYTES, takerFeeAssetData: contracts_test_utils_1.constants.NULL_BYTES, makerAssetAmount: contracts_test_utils_1.getRandomInteger(1, 1e18), takerAssetAmount: contracts_test_utils_1.getRandomInteger(1, 1e18), makerFee: contracts_test_utils_1.constants.ZERO_AMOUNT, takerFee: contracts_test_utils_1.constants.ZERO_AMOUNT, signature: utils_1.hexUtils.random() }, overrides);
    }
    const ORDERS = _.times(4, () => createOrder());
    const SIMPLE_ORDERS = ORDERS.map(o => _.omit(o, ['signature', 'chainId', 'exchangeAddress']));
    describe('operations', () => {
        it('getOrderFillableMakerAmounts()', () => __awaiter(this, void 0, void 0, function* () {
            const expectedFillableAmounts = ORDERS.map(() => contracts_test_utils_1.getRandomInteger(0, 100e18));
            const sampler = new mock_sampler_contract_1.MockSamplerContract({
                getOrderFillableMakerAssetAmounts: (orders, signatures) => {
                    contracts_test_utils_1.expect(orders).to.deep.eq(SIMPLE_ORDERS);
                    contracts_test_utils_1.expect(signatures).to.deep.eq(ORDERS.map(o => o.signature));
                    return expectedFillableAmounts;
                },
            });
            const dexOrderSampler = new sampler_1.DexOrderSampler(sampler);
            const [fillableAmounts] = yield dexOrderSampler.executeAsync(dexOrderSampler.getOrderFillableMakerAmounts(ORDERS, exchangeAddress));
            contracts_test_utils_1.expect(fillableAmounts).to.deep.eq(expectedFillableAmounts);
        }));
        it('getOrderFillableTakerAmounts()', () => __awaiter(this, void 0, void 0, function* () {
            const expectedFillableAmounts = ORDERS.map(() => contracts_test_utils_1.getRandomInteger(0, 100e18));
            const sampler = new mock_sampler_contract_1.MockSamplerContract({
                getOrderFillableTakerAssetAmounts: (orders, signatures) => {
                    contracts_test_utils_1.expect(orders).to.deep.eq(SIMPLE_ORDERS);
                    contracts_test_utils_1.expect(signatures).to.deep.eq(ORDERS.map(o => o.signature));
                    return expectedFillableAmounts;
                },
            });
            const dexOrderSampler = new sampler_1.DexOrderSampler(sampler);
            const [fillableAmounts] = yield dexOrderSampler.executeAsync(dexOrderSampler.getOrderFillableTakerAmounts(ORDERS, exchangeAddress));
            contracts_test_utils_1.expect(fillableAmounts).to.deep.eq(expectedFillableAmounts);
        }));
        it('getKyberSellQuotes()', () => __awaiter(this, void 0, void 0, function* () {
            const expectedTakerToken = contracts_test_utils_1.randomAddress();
            const expectedMakerToken = contracts_test_utils_1.randomAddress();
            const expectedTakerFillAmounts = sampler_1.getSampleAmounts(new utils_1.BigNumber(100e18), 10);
            const expectedMakerFillAmounts = sampler_1.getSampleAmounts(new utils_1.BigNumber(100e18), 10);
            const sampler = new mock_sampler_contract_1.MockSamplerContract({
                sampleSellsFromKyberNetwork: (_reserveId, takerToken, makerToken, fillAmounts) => {
                    contracts_test_utils_1.expect(takerToken).to.eq(expectedTakerToken);
                    contracts_test_utils_1.expect(makerToken).to.eq(expectedMakerToken);
                    contracts_test_utils_1.expect(fillAmounts).to.deep.eq(expectedTakerFillAmounts);
                    return ['0x', expectedMakerFillAmounts];
                },
            });
            const dexOrderSampler = new sampler_1.DexOrderSampler(sampler);
            const [fillableAmounts] = yield dexOrderSampler.executeAsync(dexOrderSampler.getKyberSellQuotes('0x', expectedMakerToken, expectedTakerToken, expectedTakerFillAmounts));
            contracts_test_utils_1.expect(fillableAmounts).to.deep.eq(expectedMakerFillAmounts);
        }));
        it('getLiquidityProviderSellQuotes()', () => __awaiter(this, void 0, void 0, function* () {
            const expectedMakerToken = contracts_test_utils_1.randomAddress();
            const expectedTakerToken = contracts_test_utils_1.randomAddress();
            const registry = contracts_test_utils_1.randomAddress();
            const poolAddress = contracts_test_utils_1.randomAddress();
            const sampler = new mock_sampler_contract_1.MockSamplerContract({
                sampleSellsFromLiquidityProviderRegistry: (registryAddress, takerToken, makerToken, _fillAmounts) => {
                    contracts_test_utils_1.expect(registryAddress).to.eq(registry);
                    contracts_test_utils_1.expect(takerToken).to.eq(expectedTakerToken);
                    contracts_test_utils_1.expect(makerToken).to.eq(expectedMakerToken);
                    return [[contracts_test_utils_1.toBaseUnitAmount(1001)], poolAddress];
                },
            });
            const dexOrderSampler = new sampler_1.DexOrderSampler(sampler);
            const [result] = yield dexOrderSampler.executeAsync(dexOrderSampler.getSellQuotes([types_1.ERC20BridgeSource.LiquidityProvider], expectedMakerToken, expectedTakerToken, [contracts_test_utils_1.toBaseUnitAmount(1000)], wethAddress, registry));
            contracts_test_utils_1.expect(result).to.deep.equal([
                [
                    {
                        source: 'LiquidityProvider',
                        output: contracts_test_utils_1.toBaseUnitAmount(1001),
                        input: contracts_test_utils_1.toBaseUnitAmount(1000),
                        fillData: { poolAddress },
                    },
                ],
            ]);
        }));
        it('getLiquidityProviderBuyQuotes()', () => __awaiter(this, void 0, void 0, function* () {
            const expectedMakerToken = contracts_test_utils_1.randomAddress();
            const expectedTakerToken = contracts_test_utils_1.randomAddress();
            const registry = contracts_test_utils_1.randomAddress();
            const poolAddress = contracts_test_utils_1.randomAddress();
            const sampler = new mock_sampler_contract_1.MockSamplerContract({
                sampleBuysFromLiquidityProviderRegistry: (registryAddress, takerToken, makerToken, _fillAmounts) => {
                    contracts_test_utils_1.expect(registryAddress).to.eq(registry);
                    contracts_test_utils_1.expect(takerToken).to.eq(expectedTakerToken);
                    contracts_test_utils_1.expect(makerToken).to.eq(expectedMakerToken);
                    return [[contracts_test_utils_1.toBaseUnitAmount(999)], poolAddress];
                },
            });
            const dexOrderSampler = new sampler_1.DexOrderSampler(sampler);
            const [result] = yield dexOrderSampler.executeAsync(dexOrderSampler.getBuyQuotes([types_1.ERC20BridgeSource.LiquidityProvider], expectedMakerToken, expectedTakerToken, [contracts_test_utils_1.toBaseUnitAmount(1000)], wethAddress, registry));
            contracts_test_utils_1.expect(result).to.deep.equal([
                [
                    {
                        source: 'LiquidityProvider',
                        output: contracts_test_utils_1.toBaseUnitAmount(999),
                        input: contracts_test_utils_1.toBaseUnitAmount(1000),
                        fillData: { poolAddress },
                    },
                ],
            ]);
        }));
        it('getMultiBridgeSellQuotes()', () => __awaiter(this, void 0, void 0, function* () {
            const expectedTakerToken = contracts_test_utils_1.randomAddress();
            const expectedMakerToken = contracts_test_utils_1.randomAddress();
            const multiBridge = contracts_test_utils_1.randomAddress();
            const sampler = new mock_sampler_contract_1.MockSamplerContract({
                sampleSellsFromMultiBridge: (multiBridgeAddress, takerToken, _intermediateToken, makerToken, _fillAmounts) => {
                    contracts_test_utils_1.expect(multiBridgeAddress).to.eq(multiBridge);
                    contracts_test_utils_1.expect(takerToken).to.eq(expectedTakerToken);
                    contracts_test_utils_1.expect(makerToken).to.eq(expectedMakerToken);
                    return [contracts_test_utils_1.toBaseUnitAmount(1001)];
                },
            });
            const dexOrderSampler = new sampler_1.DexOrderSampler(sampler);
            const [result] = yield dexOrderSampler.executeAsync(dexOrderSampler.getSellQuotes([types_1.ERC20BridgeSource.MultiBridge], expectedMakerToken, expectedTakerToken, [contracts_test_utils_1.toBaseUnitAmount(1000)], contracts_test_utils_1.randomAddress(), contracts_test_utils_1.randomAddress(), multiBridge));
            contracts_test_utils_1.expect(result).to.deep.equal([
                [
                    {
                        source: 'MultiBridge',
                        output: contracts_test_utils_1.toBaseUnitAmount(1001),
                        input: contracts_test_utils_1.toBaseUnitAmount(1000),
                        fillData: { poolAddress: multiBridge },
                    },
                ],
            ]);
        }));
        it('getEth2DaiSellQuotes()', () => __awaiter(this, void 0, void 0, function* () {
            const expectedTakerToken = contracts_test_utils_1.randomAddress();
            const expectedMakerToken = contracts_test_utils_1.randomAddress();
            const expectedTakerFillAmounts = sampler_1.getSampleAmounts(new utils_1.BigNumber(100e18), 10);
            const expectedMakerFillAmounts = sampler_1.getSampleAmounts(new utils_1.BigNumber(100e18), 10);
            const sampler = new mock_sampler_contract_1.MockSamplerContract({
                sampleSellsFromEth2Dai: (takerToken, makerToken, fillAmounts) => {
                    contracts_test_utils_1.expect(takerToken).to.eq(expectedTakerToken);
                    contracts_test_utils_1.expect(makerToken).to.eq(expectedMakerToken);
                    contracts_test_utils_1.expect(fillAmounts).to.deep.eq(expectedTakerFillAmounts);
                    return expectedMakerFillAmounts;
                },
            });
            const dexOrderSampler = new sampler_1.DexOrderSampler(sampler);
            const [fillableAmounts] = yield dexOrderSampler.executeAsync(dexOrderSampler.getEth2DaiSellQuotes(expectedMakerToken, expectedTakerToken, expectedTakerFillAmounts));
            contracts_test_utils_1.expect(fillableAmounts).to.deep.eq(expectedMakerFillAmounts);
        }));
        it('getUniswapSellQuotes()', () => __awaiter(this, void 0, void 0, function* () {
            const expectedTakerToken = contracts_test_utils_1.randomAddress();
            const expectedMakerToken = contracts_test_utils_1.randomAddress();
            const expectedTakerFillAmounts = sampler_1.getSampleAmounts(new utils_1.BigNumber(100e18), 10);
            const expectedMakerFillAmounts = sampler_1.getSampleAmounts(new utils_1.BigNumber(100e18), 10);
            const sampler = new mock_sampler_contract_1.MockSamplerContract({
                sampleSellsFromUniswap: (takerToken, makerToken, fillAmounts) => {
                    contracts_test_utils_1.expect(takerToken).to.eq(expectedTakerToken);
                    contracts_test_utils_1.expect(makerToken).to.eq(expectedMakerToken);
                    contracts_test_utils_1.expect(fillAmounts).to.deep.eq(expectedTakerFillAmounts);
                    return expectedMakerFillAmounts;
                },
            });
            const dexOrderSampler = new sampler_1.DexOrderSampler(sampler);
            const [fillableAmounts] = yield dexOrderSampler.executeAsync(dexOrderSampler.getUniswapSellQuotes(expectedMakerToken, expectedTakerToken, expectedTakerFillAmounts));
            contracts_test_utils_1.expect(fillableAmounts).to.deep.eq(expectedMakerFillAmounts);
        }));
        it('getUniswapV2SellQuotes()', () => __awaiter(this, void 0, void 0, function* () {
            const expectedTakerToken = contracts_test_utils_1.randomAddress();
            const expectedMakerToken = contracts_test_utils_1.randomAddress();
            const expectedTakerFillAmounts = sampler_1.getSampleAmounts(new utils_1.BigNumber(100e18), 10);
            const expectedMakerFillAmounts = sampler_1.getSampleAmounts(new utils_1.BigNumber(100e18), 10);
            const sampler = new mock_sampler_contract_1.MockSamplerContract({
                sampleSellsFromUniswapV2: (path, fillAmounts) => {
                    contracts_test_utils_1.expect(path).to.deep.eq([expectedMakerToken, expectedTakerToken]);
                    contracts_test_utils_1.expect(fillAmounts).to.deep.eq(expectedTakerFillAmounts);
                    return expectedMakerFillAmounts;
                },
            });
            const dexOrderSampler = new sampler_1.DexOrderSampler(sampler);
            const [fillableAmounts] = yield dexOrderSampler.executeAsync(dexOrderSampler.getUniswapV2SellQuotes([expectedMakerToken, expectedTakerToken], expectedTakerFillAmounts));
            contracts_test_utils_1.expect(fillableAmounts).to.deep.eq(expectedMakerFillAmounts);
        }));
        it('getEth2DaiBuyQuotes()', () => __awaiter(this, void 0, void 0, function* () {
            const expectedTakerToken = contracts_test_utils_1.randomAddress();
            const expectedMakerToken = contracts_test_utils_1.randomAddress();
            const expectedTakerFillAmounts = sampler_1.getSampleAmounts(new utils_1.BigNumber(100e18), 10);
            const expectedMakerFillAmounts = sampler_1.getSampleAmounts(new utils_1.BigNumber(100e18), 10);
            const sampler = new mock_sampler_contract_1.MockSamplerContract({
                sampleBuysFromEth2Dai: (takerToken, makerToken, fillAmounts) => {
                    contracts_test_utils_1.expect(takerToken).to.eq(expectedTakerToken);
                    contracts_test_utils_1.expect(makerToken).to.eq(expectedMakerToken);
                    contracts_test_utils_1.expect(fillAmounts).to.deep.eq(expectedMakerFillAmounts);
                    return expectedTakerFillAmounts;
                },
            });
            const dexOrderSampler = new sampler_1.DexOrderSampler(sampler);
            const [fillableAmounts] = yield dexOrderSampler.executeAsync(dexOrderSampler.getEth2DaiBuyQuotes(expectedMakerToken, expectedTakerToken, expectedMakerFillAmounts));
            contracts_test_utils_1.expect(fillableAmounts).to.deep.eq(expectedTakerFillAmounts);
        }));
        it('getUniswapBuyQuotes()', () => __awaiter(this, void 0, void 0, function* () {
            const expectedTakerToken = contracts_test_utils_1.randomAddress();
            const expectedMakerToken = contracts_test_utils_1.randomAddress();
            const expectedTakerFillAmounts = sampler_1.getSampleAmounts(new utils_1.BigNumber(100e18), 10);
            const expectedMakerFillAmounts = sampler_1.getSampleAmounts(new utils_1.BigNumber(100e18), 10);
            const sampler = new mock_sampler_contract_1.MockSamplerContract({
                sampleBuysFromUniswap: (takerToken, makerToken, fillAmounts) => {
                    contracts_test_utils_1.expect(takerToken).to.eq(expectedTakerToken);
                    contracts_test_utils_1.expect(makerToken).to.eq(expectedMakerToken);
                    contracts_test_utils_1.expect(fillAmounts).to.deep.eq(expectedMakerFillAmounts);
                    return expectedTakerFillAmounts;
                },
            });
            const dexOrderSampler = new sampler_1.DexOrderSampler(sampler);
            const [fillableAmounts] = yield dexOrderSampler.executeAsync(dexOrderSampler.getUniswapBuyQuotes(expectedMakerToken, expectedTakerToken, expectedMakerFillAmounts));
            contracts_test_utils_1.expect(fillableAmounts).to.deep.eq(expectedTakerFillAmounts);
        }));
        it('getSellQuotes()', () => __awaiter(this, void 0, void 0, function* () {
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
            const sampler = new mock_sampler_contract_1.MockSamplerContract({
                sampleSellsFromUniswap: (takerToken, makerToken, fillAmounts) => {
                    contracts_test_utils_1.expect(takerToken).to.eq(expectedTakerToken);
                    contracts_test_utils_1.expect(makerToken).to.eq(expectedMakerToken);
                    contracts_test_utils_1.expect(fillAmounts).to.deep.eq(expectedTakerFillAmounts);
                    return fillAmounts.map(a => a.times(ratesBySource[types_1.ERC20BridgeSource.Uniswap]).integerValue());
                },
                sampleSellsFromEth2Dai: (takerToken, makerToken, fillAmounts) => {
                    contracts_test_utils_1.expect(takerToken).to.eq(expectedTakerToken);
                    contracts_test_utils_1.expect(makerToken).to.eq(expectedMakerToken);
                    contracts_test_utils_1.expect(fillAmounts).to.deep.eq(expectedTakerFillAmounts);
                    return fillAmounts.map(a => a.times(ratesBySource[types_1.ERC20BridgeSource.Eth2Dai]).integerValue());
                },
                sampleSellsFromUniswapV2: (path, fillAmounts) => {
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
                    return fillAmounts.map(a => a.times(ratesBySource[types_1.ERC20BridgeSource.UniswapV2]).integerValue());
                },
            });
            const dexOrderSampler = new sampler_1.DexOrderSampler(sampler);
            const [quotes] = yield dexOrderSampler.executeAsync(dexOrderSampler.getSellQuotes(sources, expectedMakerToken, expectedTakerToken, expectedTakerFillAmounts, wethAddress));
            const expectedQuotes = sources.map(s => expectedTakerFillAmounts.map(a => ({
                source: s,
                input: a,
                output: a.times(ratesBySource[s]).integerValue(),
                fillData: s === types_1.ERC20BridgeSource.UniswapV2
                    ? { tokenAddressPath: [expectedTakerToken, expectedMakerToken] }
                    : {},
            })));
            const uniswapV2ETHQuotes = [
                expectedTakerFillAmounts.map(a => ({
                    source: types_1.ERC20BridgeSource.UniswapV2,
                    input: a,
                    output: a.times(ratesBySource[types_1.ERC20BridgeSource.UniswapV2]).integerValue(),
                    fillData: {
                        tokenAddressPath: [expectedTakerToken, wethAddress, expectedMakerToken],
                    },
                })),
            ];
            //  extra quote for Uniswap V2, which provides a direct quote (tokenA -> tokenB) AND an ETH quote (tokenA -> ETH -> tokenB)
            const additionalSourceCount = 1;
            contracts_test_utils_1.expect(quotes).to.have.lengthOf(sources.length + additionalSourceCount);
            contracts_test_utils_1.expect(quotes).to.deep.eq(expectedQuotes.concat(uniswapV2ETHQuotes));
        }));
        it('getSellQuotes() uses samples from Balancer', () => __awaiter(this, void 0, void 0, function* () {
            const expectedTakerToken = contracts_test_utils_1.randomAddress();
            const expectedMakerToken = contracts_test_utils_1.randomAddress();
            const expectedTakerFillAmounts = sampler_1.getSampleAmounts(new utils_1.BigNumber(100e18), 3);
            const pools = [generateBalancerPool(), generateBalancerPool()];
            const balancerPoolsCache = new mock_balancer_pools_cache_1.MockBalancerPoolsCache({
                getPoolsForPairAsync: (takerToken, makerToken) => __awaiter(this, void 0, void 0, function* () {
                    contracts_test_utils_1.expect(takerToken).equal(expectedTakerToken);
                    contracts_test_utils_1.expect(makerToken).equal(expectedMakerToken);
                    return Promise.resolve(pools);
                }),
            });
            const dexOrderSampler = new sampler_1.DexOrderSampler(new mock_sampler_contract_1.MockSamplerContract({}), undefined, undefined, balancerPoolsCache);
            const quotes = yield dexOrderSampler.getBalancerSellQuotesOffChainAsync(expectedMakerToken, expectedTakerToken, expectedTakerFillAmounts);
            const expectedQuotes = pools.map(p => expectedTakerFillAmounts.map(a => ({
                source: types_1.ERC20BridgeSource.Balancer,
                input: a,
                output: balancer_utils_1.computeBalancerSellQuote(p, a),
                fillData: { poolAddress: p.id },
            })));
            contracts_test_utils_1.expect(quotes).to.have.lengthOf(2); // one array per pool
            contracts_test_utils_1.expect(quotes).to.deep.eq(expectedQuotes);
        }));
        it('getSellQuotes() uses samples from Bancor', () => __awaiter(this, void 0, void 0, function* () {
            const expectedTakerToken = contracts_test_utils_1.randomAddress();
            const expectedMakerToken = contracts_test_utils_1.randomAddress();
            const networkAddress = contracts_test_utils_1.randomAddress();
            const expectedTakerFillAmounts = sampler_1.getSampleAmounts(new utils_1.BigNumber(100e18), 3);
            const rate = contracts_test_utils_1.getRandomFloat(0, 100);
            const bancorService = yield mock_bancor_service_1.MockBancorService.createMockAsync({
                getQuotesAsync: (fromToken, toToken, amounts) => __awaiter(this, void 0, void 0, function* () {
                    contracts_test_utils_1.expect(fromToken).equal(expectedTakerToken);
                    contracts_test_utils_1.expect(toToken).equal(expectedMakerToken);
                    return Promise.resolve(amounts.map(a => ({
                        fillData: { path: [fromToken, toToken], networkAddress },
                        amount: a.multipliedBy(rate),
                    })));
                }),
            });
            const dexOrderSampler = new sampler_1.DexOrderSampler(new mock_sampler_contract_1.MockSamplerContract({}), undefined, // sampler overrides
            web3_wrapper_1.provider, undefined, // balancer cache
            undefined, // cream cache
            () => bancorService);
            const quotes = yield dexOrderSampler.getBancorSellQuotesOffChainAsync(expectedMakerToken, expectedTakerToken, expectedTakerFillAmounts);
            const expectedQuotes = expectedTakerFillAmounts.map(a => ({
                source: types_1.ERC20BridgeSource.Bancor,
                input: a,
                output: a.multipliedBy(rate),
                fillData: { path: [expectedTakerToken, expectedMakerToken], networkAddress },
            }));
            contracts_test_utils_1.expect(quotes).to.deep.eq(expectedQuotes);
        }));
        it('getBuyQuotes()', () => __awaiter(this, void 0, void 0, function* () {
            const expectedTakerToken = contracts_test_utils_1.randomAddress();
            const expectedMakerToken = contracts_test_utils_1.randomAddress();
            const sources = [types_1.ERC20BridgeSource.Eth2Dai, types_1.ERC20BridgeSource.Uniswap, types_1.ERC20BridgeSource.UniswapV2];
            const ratesBySource = {
                [types_1.ERC20BridgeSource.Eth2Dai]: contracts_test_utils_1.getRandomFloat(0, 100),
                [types_1.ERC20BridgeSource.Uniswap]: contracts_test_utils_1.getRandomFloat(0, 100),
                [types_1.ERC20BridgeSource.UniswapV2]: contracts_test_utils_1.getRandomFloat(0, 100),
            };
            const expectedMakerFillAmounts = sampler_1.getSampleAmounts(new utils_1.BigNumber(100e18), 3);
            const sampler = new mock_sampler_contract_1.MockSamplerContract({
                sampleBuysFromUniswap: (takerToken, makerToken, fillAmounts) => {
                    contracts_test_utils_1.expect(takerToken).to.eq(expectedTakerToken);
                    contracts_test_utils_1.expect(makerToken).to.eq(expectedMakerToken);
                    contracts_test_utils_1.expect(fillAmounts).to.deep.eq(expectedMakerFillAmounts);
                    return fillAmounts.map(a => a.times(ratesBySource[types_1.ERC20BridgeSource.Uniswap]).integerValue());
                },
                sampleBuysFromEth2Dai: (takerToken, makerToken, fillAmounts) => {
                    contracts_test_utils_1.expect(takerToken).to.eq(expectedTakerToken);
                    contracts_test_utils_1.expect(makerToken).to.eq(expectedMakerToken);
                    contracts_test_utils_1.expect(fillAmounts).to.deep.eq(expectedMakerFillAmounts);
                    return fillAmounts.map(a => a.times(ratesBySource[types_1.ERC20BridgeSource.Eth2Dai]).integerValue());
                },
                sampleBuysFromUniswapV2: (path, fillAmounts) => {
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
                    return fillAmounts.map(a => a.times(ratesBySource[types_1.ERC20BridgeSource.UniswapV2]).integerValue());
                },
            });
            const dexOrderSampler = new sampler_1.DexOrderSampler(sampler);
            const [quotes] = yield dexOrderSampler.executeAsync(dexOrderSampler.getBuyQuotes(sources, expectedMakerToken, expectedTakerToken, expectedMakerFillAmounts, wethAddress));
            const expectedQuotes = sources.map(s => expectedMakerFillAmounts.map(a => ({
                source: s,
                input: a,
                output: a.times(ratesBySource[s]).integerValue(),
                fillData: s === types_1.ERC20BridgeSource.UniswapV2
                    ? { tokenAddressPath: [expectedTakerToken, expectedMakerToken] }
                    : {},
            })));
            const uniswapV2ETHQuotes = [
                expectedMakerFillAmounts.map(a => ({
                    source: types_1.ERC20BridgeSource.UniswapV2,
                    input: a,
                    output: a.times(ratesBySource[types_1.ERC20BridgeSource.UniswapV2]).integerValue(),
                    fillData: {
                        tokenAddressPath: [expectedTakerToken, wethAddress, expectedMakerToken],
                    },
                })),
            ];
            //  extra quote for Uniswap V2, which provides a direct quote (tokenA -> tokenB) AND an ETH quote (tokenA -> ETH -> tokenB)
            contracts_test_utils_1.expect(quotes).to.have.lengthOf(sources.length + 1);
            contracts_test_utils_1.expect(quotes).to.deep.eq(expectedQuotes.concat(uniswapV2ETHQuotes));
        }));
        it('getBuyQuotes() uses samples from Balancer', () => __awaiter(this, void 0, void 0, function* () {
            const expectedTakerToken = contracts_test_utils_1.randomAddress();
            const expectedMakerToken = contracts_test_utils_1.randomAddress();
            const expectedMakerFillAmounts = sampler_1.getSampleAmounts(new utils_1.BigNumber(100e18), 3);
            const pools = [generateBalancerPool(), generateBalancerPool()];
            const balancerPoolsCache = new mock_balancer_pools_cache_1.MockBalancerPoolsCache({
                getPoolsForPairAsync: (takerToken, makerToken) => __awaiter(this, void 0, void 0, function* () {
                    contracts_test_utils_1.expect(takerToken).equal(expectedTakerToken);
                    contracts_test_utils_1.expect(makerToken).equal(expectedMakerToken);
                    return Promise.resolve(pools);
                }),
            });
            const dexOrderSampler = new sampler_1.DexOrderSampler(new mock_sampler_contract_1.MockSamplerContract({}), undefined, undefined, balancerPoolsCache);
            const quotes = yield dexOrderSampler.getBalancerBuyQuotesOffChainAsync(expectedMakerToken, expectedTakerToken, expectedMakerFillAmounts);
            const expectedQuotes = pools.map(p => expectedMakerFillAmounts.map(a => ({
                source: types_1.ERC20BridgeSource.Balancer,
                input: a,
                output: balancer_utils_1.computeBalancerBuyQuote(p, a),
                fillData: { poolAddress: p.id },
            })));
            contracts_test_utils_1.expect(quotes).to.have.lengthOf(2); //  one set per pool
            contracts_test_utils_1.expect(quotes).to.deep.eq(expectedQuotes);
        }));
    });
    describe('batched operations', () => {
        it('getOrderFillableMakerAmounts(), getOrderFillableTakerAmounts()', () => __awaiter(this, void 0, void 0, function* () {
            const expectedFillableTakerAmounts = ORDERS.map(() => contracts_test_utils_1.getRandomInteger(0, 100e18));
            const expectedFillableMakerAmounts = ORDERS.map(() => contracts_test_utils_1.getRandomInteger(0, 100e18));
            const sampler = new mock_sampler_contract_1.MockSamplerContract({
                getOrderFillableMakerAssetAmounts: (orders, signatures) => {
                    contracts_test_utils_1.expect(orders).to.deep.eq(SIMPLE_ORDERS);
                    contracts_test_utils_1.expect(signatures).to.deep.eq(ORDERS.map(o => o.signature));
                    return expectedFillableMakerAmounts;
                },
                getOrderFillableTakerAssetAmounts: (orders, signatures) => {
                    contracts_test_utils_1.expect(orders).to.deep.eq(SIMPLE_ORDERS);
                    contracts_test_utils_1.expect(signatures).to.deep.eq(ORDERS.map(o => o.signature));
                    return expectedFillableTakerAmounts;
                },
            });
            const dexOrderSampler = new sampler_1.DexOrderSampler(sampler);
            const [fillableMakerAmounts, fillableTakerAmounts] = yield dexOrderSampler.executeAsync(dexOrderSampler.getOrderFillableMakerAmounts(ORDERS, exchangeAddress), dexOrderSampler.getOrderFillableTakerAmounts(ORDERS, exchangeAddress));
            contracts_test_utils_1.expect(fillableMakerAmounts).to.deep.eq(expectedFillableMakerAmounts);
            contracts_test_utils_1.expect(fillableTakerAmounts).to.deep.eq(expectedFillableTakerAmounts);
        }));
    });
});
function generateBalancerPool() {
    return {
        id: contracts_test_utils_1.randomAddress(),
        balanceIn: contracts_test_utils_1.getRandomInteger(1, 1e18),
        balanceOut: contracts_test_utils_1.getRandomInteger(1, 1e18),
        weightIn: contracts_test_utils_1.getRandomInteger(0, 1e5),
        weightOut: contracts_test_utils_1.getRandomInteger(0, 1e5),
        swapFee: contracts_test_utils_1.getRandomInteger(0, 1e5),
    };
}
// tslint:disable-next-line: max-file-line-count
//# sourceMappingURL=dex_sampler_test.js.map