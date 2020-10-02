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
const dev_utils_1 = require("@0x/dev-utils");
const order_utils_1 = require("@0x/order-utils");
const types_1 = require("@0x/types");
const utils_1 = require("@0x/utils");
const _ = require("lodash");
const TypeMoq = require("typemoq");
const src_1 = require("../src");
const market_operation_utils_1 = require("../src/utils/market_operation_utils/");
const balancer_utils_1 = require("../src/utils/market_operation_utils/balancer_utils");
const constants_1 = require("../src/utils/market_operation_utils/constants");
const fills_1 = require("../src/utils/market_operation_utils/fills");
const sampler_operations_1 = require("../src/utils/market_operation_utils/sampler_operations");
const types_2 = require("../src/utils/market_operation_utils/types");
const MAKER_TOKEN = contracts_test_utils_1.randomAddress();
const TAKER_TOKEN = contracts_test_utils_1.randomAddress();
const MAKER_ASSET_DATA = order_utils_1.assetDataUtils.encodeERC20AssetData(MAKER_TOKEN);
const TAKER_ASSET_DATA = order_utils_1.assetDataUtils.encodeERC20AssetData(TAKER_TOKEN);
const DEFAULT_EXCLUDED = [
    types_2.ERC20BridgeSource.UniswapV2,
    types_2.ERC20BridgeSource.Curve,
    types_2.ERC20BridgeSource.Balancer,
    types_2.ERC20BridgeSource.MStable,
    types_2.ERC20BridgeSource.Mooniswap,
    types_2.ERC20BridgeSource.Bancor,
    types_2.ERC20BridgeSource.Swerve,
    types_2.ERC20BridgeSource.SushiSwap,
    types_2.ERC20BridgeSource.MultiHop,
];
const BUY_SOURCES = constants_1.BUY_SOURCE_FILTER.sources;
const SELL_SOURCES = constants_1.SELL_SOURCE_FILTER.sources;
// tslint:disable: custom-no-magic-numbers promise-function-async
describe('MarketOperationUtils tests', () => {
    const CHAIN_ID = 1;
    const contractAddresses = Object.assign({}, contract_addresses_1.getContractAddressesForChainOrThrow(CHAIN_ID), { multiBridge: utils_1.NULL_ADDRESS });
    function createOrder(overrides) {
        return Object.assign({ chainId: CHAIN_ID, exchangeAddress: contractAddresses.exchange, makerAddress: contracts_test_utils_1.constants.NULL_ADDRESS, takerAddress: contracts_test_utils_1.constants.NULL_ADDRESS, senderAddress: contracts_test_utils_1.constants.NULL_ADDRESS, feeRecipientAddress: contracts_test_utils_1.randomAddress(), salt: order_utils_1.generatePseudoRandomSalt(), expirationTimeSeconds: contracts_test_utils_1.getRandomInteger(0, Math.pow(2, 64)), makerAssetData: MAKER_ASSET_DATA, takerAssetData: TAKER_ASSET_DATA, makerFeeAssetData: contracts_test_utils_1.constants.NULL_BYTES, takerFeeAssetData: contracts_test_utils_1.constants.NULL_BYTES, makerAssetAmount: contracts_test_utils_1.getRandomInteger(1, 1e18), takerAssetAmount: contracts_test_utils_1.getRandomInteger(1, 1e18), makerFee: contracts_test_utils_1.constants.ZERO_AMOUNT, takerFee: contracts_test_utils_1.constants.ZERO_AMOUNT, signature: utils_1.hexUtils.random() }, overrides);
    }
    function getSourceFromAssetData(assetData) {
        if (assetData.length === 74) {
            return types_2.ERC20BridgeSource.Native;
        }
        const bridgeData = order_utils_1.assetDataUtils.decodeAssetDataOrThrow(assetData);
        if (!order_utils_1.assetDataUtils.isERC20BridgeAssetData(bridgeData)) {
            throw new Error('AssetData is not ERC20BridgeAssetData');
        }
        const { bridgeAddress } = bridgeData;
        switch (bridgeAddress) {
            case contractAddresses.kyberBridge.toLowerCase():
                return types_2.ERC20BridgeSource.Kyber;
            case contractAddresses.eth2DaiBridge.toLowerCase():
                return types_2.ERC20BridgeSource.Eth2Dai;
            case contractAddresses.uniswapBridge.toLowerCase():
                return types_2.ERC20BridgeSource.Uniswap;
            case contractAddresses.uniswapV2Bridge.toLowerCase():
                return types_2.ERC20BridgeSource.UniswapV2;
            case contractAddresses.curveBridge.toLowerCase():
                return types_2.ERC20BridgeSource.Curve;
            case contractAddresses.mStableBridge.toLowerCase():
                return types_2.ERC20BridgeSource.MStable;
            case contractAddresses.mooniswapBridge.toLowerCase():
                return types_2.ERC20BridgeSource.Mooniswap;
            case contractAddresses.sushiswapBridge.toLowerCase():
                return types_2.ERC20BridgeSource.SushiSwap;
            default:
                break;
        }
        throw new Error(`Unknown bridge address: ${bridgeAddress}`);
    }
    function assertSamePrefix(actual, expected) {
        contracts_test_utils_1.expect(actual.substr(0, expected.length)).to.eq(expected);
    }
    function createOrdersFromSellRates(takerAssetAmount, rates) {
        const singleTakerAssetAmount = takerAssetAmount.div(rates.length).integerValue(utils_1.BigNumber.ROUND_UP);
        return rates.map(r => createOrder({
            makerAssetAmount: singleTakerAssetAmount.times(r).integerValue(),
            takerAssetAmount: singleTakerAssetAmount,
        }));
    }
    function createOrdersFromBuyRates(makerAssetAmount, rates) {
        const singleMakerAssetAmount = makerAssetAmount.div(rates.length).integerValue(utils_1.BigNumber.ROUND_UP);
        return rates.map(r => createOrder({
            makerAssetAmount: singleMakerAssetAmount,
            takerAssetAmount: singleMakerAssetAmount.div(r).integerValue(),
        }));
    }
    const ORDER_DOMAIN = {
        exchangeAddress: contractAddresses.exchange,
        chainId: CHAIN_ID,
    };
    function createSamplesFromRates(source, inputs, rates, fillData) {
        const samples = [];
        inputs.forEach((input, i) => {
            const rate = rates[i];
            samples.push({
                source,
                fillData: fillData || DEFAULT_FILL_DATA[source],
                input: new utils_1.BigNumber(input),
                output: new utils_1.BigNumber(input)
                    .minus(i === 0 ? 0 : samples[i - 1].input)
                    .times(rate)
                    .plus(i === 0 ? 0 : samples[i - 1].output)
                    .integerValue(),
            });
        });
        return samples;
    }
    function createGetMultipleSellQuotesOperationFromRates(rates) {
        return (sources, _makerToken, _takerToken, fillAmounts, _wethAddress) => {
            return sampler_operations_1.BATCH_SOURCE_FILTERS.getAllowed(sources).map(s => createSamplesFromRates(s, fillAmounts, rates[s]));
        };
    }
    function callTradeOperationAndRetainLiquidityProviderParams(tradeOperation, rates) {
        const liquidityPoolParams = {
            sources: [],
            liquidityProviderAddress: undefined,
        };
        const fn = (sources, makerToken, takerToken, fillAmounts, wethAddress, liquidityProviderAddress) => {
            liquidityPoolParams.liquidityProviderAddress = liquidityProviderAddress;
            liquidityPoolParams.sources = liquidityPoolParams.sources.concat(sources);
            return tradeOperation(rates)(sources, makerToken, takerToken, fillAmounts, wethAddress, liquidityProviderAddress);
        };
        return [liquidityPoolParams, fn];
    }
    function createGetMultipleBuyQuotesOperationFromRates(rates) {
        return (sources, _makerToken, _takerToken, fillAmounts, _wethAddress) => {
            return sampler_operations_1.BATCH_SOURCE_FILTERS.getAllowed(sources).map(s => createSamplesFromRates(s, fillAmounts, rates[s].map(r => new utils_1.BigNumber(1).div(r))));
        };
    }
    function createGetMedianSellRate(rate) {
        return (_sources, _makerToken, _takerToken, _fillAmounts, _wethAddress) => {
            return new utils_1.BigNumber(rate);
        };
    }
    function createDecreasingRates(count) {
        const rates = [];
        const initialRate = contracts_test_utils_1.getRandomFloat(1e-3, 1e2);
        _.times(count, () => contracts_test_utils_1.getRandomFloat(0.95, 1)).forEach((r, i) => {
            const prevRate = i === 0 ? initialRate : rates[i - 1];
            rates.push(prevRate.times(r));
        });
        return rates;
    }
    function getSortedOrderSources(side, orders) {
        return (orders
            // Sort orders by descending rate.
            .sort((a, b) => b.makerAssetAmount.div(b.takerAssetAmount).comparedTo(a.makerAssetAmount.div(a.takerAssetAmount)))
            // Then sort fills by descending rate.
            .map(o => {
            return o.fills
                .slice()
                .sort((a, b) => side === src_1.MarketOperation.Sell
                ? b.output.div(b.input).comparedTo(a.output.div(a.input))
                : b.input.div(b.output).comparedTo(a.input.div(a.output)))
                .map(f => f.source);
        }));
    }
    const NUM_SAMPLES = 3;
    const ZERO_RATES = {
        [types_2.ERC20BridgeSource.Native]: _.times(NUM_SAMPLES, () => 0),
        [types_2.ERC20BridgeSource.Eth2Dai]: _.times(NUM_SAMPLES, () => 0),
        [types_2.ERC20BridgeSource.Uniswap]: _.times(NUM_SAMPLES, () => 0),
        [types_2.ERC20BridgeSource.Kyber]: _.times(NUM_SAMPLES, () => 0),
        [types_2.ERC20BridgeSource.UniswapV2]: _.times(NUM_SAMPLES, () => 0),
        [types_2.ERC20BridgeSource.Balancer]: _.times(NUM_SAMPLES, () => 0),
        [types_2.ERC20BridgeSource.Bancor]: _.times(NUM_SAMPLES, () => 0),
        [types_2.ERC20BridgeSource.Curve]: _.times(NUM_SAMPLES, () => 0),
        [types_2.ERC20BridgeSource.LiquidityProvider]: _.times(NUM_SAMPLES, () => 0),
        [types_2.ERC20BridgeSource.MultiBridge]: _.times(NUM_SAMPLES, () => 0),
        [types_2.ERC20BridgeSource.MStable]: _.times(NUM_SAMPLES, () => 0),
        [types_2.ERC20BridgeSource.Mooniswap]: _.times(NUM_SAMPLES, () => 0),
        [types_2.ERC20BridgeSource.Swerve]: _.times(NUM_SAMPLES, () => 0),
        [types_2.ERC20BridgeSource.SushiSwap]: _.times(NUM_SAMPLES, () => 0),
        [types_2.ERC20BridgeSource.MultiHop]: _.times(NUM_SAMPLES, () => 0),
    };
    const DEFAULT_RATES = Object.assign({}, ZERO_RATES, { [types_2.ERC20BridgeSource.Native]: createDecreasingRates(NUM_SAMPLES), [types_2.ERC20BridgeSource.Eth2Dai]: createDecreasingRates(NUM_SAMPLES), [types_2.ERC20BridgeSource.Uniswap]: createDecreasingRates(NUM_SAMPLES) });
    const DEFAULT_FILL_DATA = {
        [types_2.ERC20BridgeSource.UniswapV2]: { tokenAddressPath: [] },
        [types_2.ERC20BridgeSource.Balancer]: { poolAddress: contracts_test_utils_1.randomAddress() },
        [types_2.ERC20BridgeSource.Bancor]: { path: [], networkAddress: contracts_test_utils_1.randomAddress() },
        [types_2.ERC20BridgeSource.Kyber]: { hint: '0x', reserveId: '0x' },
        [types_2.ERC20BridgeSource.Curve]: {
            curve: {
                poolAddress: contracts_test_utils_1.randomAddress(),
                tokens: [TAKER_TOKEN, MAKER_TOKEN],
                exchangeFunctionSelector: utils_1.hexUtils.random(4),
                sellQuoteFunctionSelector: utils_1.hexUtils.random(4),
                buyQuoteFunctionSelector: utils_1.hexUtils.random(4),
            },
            fromTokenIdx: 0,
            toTokenIdx: 1,
        },
        [types_2.ERC20BridgeSource.Swerve]: {
            pool: {
                poolAddress: contracts_test_utils_1.randomAddress(),
                tokens: [TAKER_TOKEN, MAKER_TOKEN],
                exchangeFunctionSelector: utils_1.hexUtils.random(4),
                sellQuoteFunctionSelector: utils_1.hexUtils.random(4),
                buyQuoteFunctionSelector: utils_1.hexUtils.random(4),
            },
            fromTokenIdx: 0,
            toTokenIdx: 1,
        },
        [types_2.ERC20BridgeSource.LiquidityProvider]: { poolAddress: contracts_test_utils_1.randomAddress() },
        [types_2.ERC20BridgeSource.SushiSwap]: { tokenAddressPath: [] },
        [types_2.ERC20BridgeSource.Mooniswap]: { poolAddress: contracts_test_utils_1.randomAddress() },
        [types_2.ERC20BridgeSource.Native]: { order: createOrder() },
        [types_2.ERC20BridgeSource.MultiHop]: {},
    };
    const DEFAULT_OPS = {
        getOrderFillableTakerAmounts(orders) {
            return orders.map(o => o.takerAssetAmount);
        },
        getOrderFillableMakerAmounts(orders) {
            return orders.map(o => o.makerAssetAmount);
        },
        getSellQuotes: createGetMultipleSellQuotesOperationFromRates(DEFAULT_RATES),
        getBuyQuotes: createGetMultipleBuyQuotesOperationFromRates(DEFAULT_RATES),
        getMedianSellRate: createGetMedianSellRate(1),
        getBalancerSellQuotesOffChainAsync: (_makerToken, _takerToken, takerFillAmounts) => [
            createSamplesFromRates(types_2.ERC20BridgeSource.Balancer, takerFillAmounts, createDecreasingRates(takerFillAmounts.length), DEFAULT_FILL_DATA[types_2.ERC20BridgeSource.Balancer]),
        ],
        getBalancerBuyQuotesOffChainAsync: (_makerToken, _takerToken, makerFillAmounts) => [
            createSamplesFromRates(types_2.ERC20BridgeSource.Balancer, makerFillAmounts, createDecreasingRates(makerFillAmounts.length).map(r => new utils_1.BigNumber(1).div(r)), DEFAULT_FILL_DATA[types_2.ERC20BridgeSource.Balancer]),
        ],
        getBancorSellQuotesOffChainAsync: (_makerToken, _takerToken, takerFillAmounts) => createSamplesFromRates(types_2.ERC20BridgeSource.Bancor, takerFillAmounts, createDecreasingRates(takerFillAmounts.length), DEFAULT_FILL_DATA[types_2.ERC20BridgeSource.Bancor]),
        getTwoHopSellQuotes: (..._params) => [],
        getTwoHopBuyQuotes: (..._params) => [],
    };
    const MOCK_SAMPLER = {
        executeAsync(...ops) {
            return __awaiter(this, void 0, void 0, function* () {
                return MOCK_SAMPLER.executeBatchAsync(ops);
            });
        },
        executeBatchAsync(ops) {
            return __awaiter(this, void 0, void 0, function* () {
                return ops;
            });
        },
        balancerPoolsCache: new balancer_utils_1.BalancerPoolsCache(),
    };
    function replaceSamplerOps(ops = {}) {
        Object.assign(MOCK_SAMPLER, DEFAULT_OPS);
        Object.assign(MOCK_SAMPLER, ops);
    }
    describe('getRfqtIndicativeQuotesAsync', () => {
        const partialRfqt = {
            apiKey: 'foo',
            takerAddress: utils_1.NULL_ADDRESS,
            isIndicative: true,
            intentOnFilling: false,
        };
        it('calls RFQT', () => __awaiter(this, void 0, void 0, function* () {
            const requestor = TypeMoq.Mock.ofType(src_1.QuoteRequestor, TypeMoq.MockBehavior.Loose);
            requestor
                .setup(r => r.requestRfqtIndicativeQuotesAsync(TypeMoq.It.isAny(), TypeMoq.It.isAny(), TypeMoq.It.isAny(), TypeMoq.It.isAny(), TypeMoq.It.isAny()))
                .returns(() => Promise.resolve([]))
                .verifiable(TypeMoq.Times.once());
            yield market_operation_utils_1.getRfqtIndicativeQuotesAsync(MAKER_ASSET_DATA, TAKER_ASSET_DATA, src_1.MarketOperation.Sell, new utils_1.BigNumber('100e18'), {
                rfqt: Object.assign({ quoteRequestor: requestor.object }, partialRfqt),
            });
            requestor.verifyAll();
        }));
    });
    describe('MarketOperationUtils', () => {
        let marketOperationUtils;
        before(() => __awaiter(this, void 0, void 0, function* () {
            marketOperationUtils = new market_operation_utils_1.MarketOperationUtils(MOCK_SAMPLER, contractAddresses, ORDER_DOMAIN);
        }));
        describe('getMarketSellOrdersAsync()', () => {
            const FILL_AMOUNT = new utils_1.BigNumber('100e18');
            const ORDERS = createOrdersFromSellRates(FILL_AMOUNT, _.times(NUM_SAMPLES, i => DEFAULT_RATES[types_2.ERC20BridgeSource.Native][i]));
            const DEFAULT_OPTS = {
                numSamples: NUM_SAMPLES,
                sampleDistributionBase: 1,
                bridgeSlippage: 0,
                maxFallbackSlippage: 100,
                excludedSources: DEFAULT_EXCLUDED,
                allowFallback: false,
                shouldBatchBridgeOrders: false,
            };
            beforeEach(() => {
                replaceSamplerOps();
            });
            it('queries `numSamples` samples', () => __awaiter(this, void 0, void 0, function* () {
                const numSamples = _.random(1, NUM_SAMPLES);
                let actualNumSamples = 0;
                replaceSamplerOps({
                    getSellQuotes: (sources, makerToken, takerToken, amounts, wethAddress) => {
                        actualNumSamples = amounts.length;
                        return DEFAULT_OPS.getSellQuotes(sources, makerToken, takerToken, amounts, wethAddress);
                    },
                });
                yield marketOperationUtils.getMarketSellOrdersAsync(ORDERS, FILL_AMOUNT, Object.assign({}, DEFAULT_OPTS, { numSamples }));
                contracts_test_utils_1.expect(actualNumSamples).eq(numSamples);
            }));
            it('polls all DEXes if `excludedSources` is empty', () => __awaiter(this, void 0, void 0, function* () {
                let sourcesPolled = [];
                replaceSamplerOps({
                    getSellQuotes: (sources, makerToken, takerToken, amounts, wethAddress) => {
                        sourcesPolled = sourcesPolled.concat(sources.slice());
                        return DEFAULT_OPS.getSellQuotes(sources, makerToken, takerToken, amounts, wethAddress);
                    },
                    getTwoHopSellQuotes: (...args) => {
                        sourcesPolled.push(types_2.ERC20BridgeSource.MultiHop);
                        return DEFAULT_OPS.getTwoHopSellQuotes(...args);
                    },
                    getBalancerSellQuotesOffChainAsync: (makerToken, takerToken, takerFillAmounts) => {
                        sourcesPolled = sourcesPolled.concat(types_2.ERC20BridgeSource.Balancer);
                        return DEFAULT_OPS.getBalancerSellQuotesOffChainAsync(makerToken, takerToken, takerFillAmounts);
                    },
                });
                yield marketOperationUtils.getMarketSellOrdersAsync(ORDERS, FILL_AMOUNT, Object.assign({}, DEFAULT_OPTS, { excludedSources: [] }));
                contracts_test_utils_1.expect(_.uniq(sourcesPolled).sort()).to.deep.equals(SELL_SOURCES.slice().sort());
            }));
            it('polls the liquidity provider when the registry is provided in the arguments', () => __awaiter(this, void 0, void 0, function* () {
                const [args, fn] = callTradeOperationAndRetainLiquidityProviderParams(createGetMultipleSellQuotesOperationFromRates, DEFAULT_RATES);
                replaceSamplerOps({
                    getSellQuotes: fn,
                    getTwoHopSellQuotes: (sources, ..._args) => {
                        if (sources.length !== 0) {
                            args.sources.push(types_2.ERC20BridgeSource.MultiHop);
                            args.sources.push(...sources);
                        }
                        return DEFAULT_OPS.getTwoHopSellQuotes(..._args);
                    },
                    getBalancerSellQuotesOffChainAsync: (makerToken, takerToken, takerFillAmounts) => {
                        args.sources = args.sources.concat(types_2.ERC20BridgeSource.Balancer);
                        return DEFAULT_OPS.getBalancerSellQuotesOffChainAsync(makerToken, takerToken, takerFillAmounts);
                    },
                });
                const registryAddress = contracts_test_utils_1.randomAddress();
                const newMarketOperationUtils = new market_operation_utils_1.MarketOperationUtils(MOCK_SAMPLER, contractAddresses, ORDER_DOMAIN, registryAddress);
                yield newMarketOperationUtils.getMarketSellOrdersAsync(ORDERS, FILL_AMOUNT, Object.assign({}, DEFAULT_OPTS, { excludedSources: [] }));
                contracts_test_utils_1.expect(_.uniq(args.sources).sort()).to.deep.equals(SELL_SOURCES.concat([types_2.ERC20BridgeSource.LiquidityProvider]).sort());
                contracts_test_utils_1.expect(args.liquidityProviderAddress).to.eql(registryAddress);
            }));
            it('does not poll DEXes in `excludedSources`', () => __awaiter(this, void 0, void 0, function* () {
                const excludedSources = [types_2.ERC20BridgeSource.Uniswap, types_2.ERC20BridgeSource.Eth2Dai];
                let sourcesPolled = [];
                replaceSamplerOps({
                    getSellQuotes: (sources, makerToken, takerToken, amounts, wethAddress) => {
                        sourcesPolled = sourcesPolled.concat(sources.slice());
                        return DEFAULT_OPS.getSellQuotes(sources, makerToken, takerToken, amounts, wethAddress);
                    },
                    getTwoHopSellQuotes: (sources, ...args) => {
                        if (sources.length !== 0) {
                            sourcesPolled.push(types_2.ERC20BridgeSource.MultiHop);
                            sourcesPolled.push(...sources);
                        }
                        return DEFAULT_OPS.getTwoHopSellQuotes(...args);
                    },
                    getBalancerSellQuotesOffChainAsync: (makerToken, takerToken, takerFillAmounts) => {
                        sourcesPolled = sourcesPolled.concat(types_2.ERC20BridgeSource.Balancer);
                        return DEFAULT_OPS.getBalancerSellQuotesOffChainAsync(makerToken, takerToken, takerFillAmounts);
                    },
                });
                yield marketOperationUtils.getMarketSellOrdersAsync(ORDERS, FILL_AMOUNT, Object.assign({}, DEFAULT_OPTS, { excludedSources }));
                contracts_test_utils_1.expect(_.uniq(sourcesPolled).sort()).to.deep.equals(_.without(SELL_SOURCES, ...excludedSources).sort());
            }));
            it('only polls DEXes in `includedSources`', () => __awaiter(this, void 0, void 0, function* () {
                const includedSources = [types_2.ERC20BridgeSource.Uniswap, types_2.ERC20BridgeSource.Eth2Dai];
                let sourcesPolled = [];
                replaceSamplerOps({
                    getSellQuotes: (sources, makerToken, takerToken, amounts, wethAddress) => {
                        sourcesPolled = sourcesPolled.concat(sources.slice());
                        return DEFAULT_OPS.getSellQuotes(sources, makerToken, takerToken, amounts, wethAddress);
                    },
                    getTwoHopSellQuotes: (sources, ...args) => {
                        if (sources.length !== 0) {
                            sourcesPolled.push(types_2.ERC20BridgeSource.MultiHop);
                            sourcesPolled.push(...sources);
                        }
                        return DEFAULT_OPS.getTwoHopSellQuotes(sources, ...args);
                    },
                    getBalancerSellQuotesOffChainAsync: (makerToken, takerToken, takerFillAmounts) => {
                        sourcesPolled = sourcesPolled.concat(types_2.ERC20BridgeSource.Balancer);
                        return DEFAULT_OPS.getBalancerSellQuotesOffChainAsync(makerToken, takerToken, takerFillAmounts);
                    },
                });
                yield marketOperationUtils.getMarketSellOrdersAsync(ORDERS, FILL_AMOUNT, Object.assign({}, DEFAULT_OPTS, { excludedSources: [], includedSources }));
                contracts_test_utils_1.expect(_.uniq(sourcesPolled).sort()).to.deep.equals(includedSources.sort());
            }));
            it('generates bridge orders with correct asset data', () => __awaiter(this, void 0, void 0, function* () {
                const improvedOrdersResponse = yield marketOperationUtils.getMarketSellOrdersAsync(
                // Pass in empty orders to prevent native orders from being used.
                ORDERS.map(o => (Object.assign({}, o, { makerAssetAmount: contracts_test_utils_1.constants.ZERO_AMOUNT }))), FILL_AMOUNT, DEFAULT_OPTS);
                const improvedOrders = improvedOrdersResponse.optimizedOrders;
                contracts_test_utils_1.expect(improvedOrders).to.not.be.length(0);
                for (const order of improvedOrders) {
                    contracts_test_utils_1.expect(getSourceFromAssetData(order.makerAssetData)).to.exist('');
                    const makerAssetDataPrefix = utils_1.hexUtils.slice(order_utils_1.assetDataUtils.encodeERC20BridgeAssetData(MAKER_TOKEN, contracts_test_utils_1.constants.NULL_ADDRESS, contracts_test_utils_1.constants.NULL_BYTES), 0, 36);
                    assertSamePrefix(order.makerAssetData, makerAssetDataPrefix);
                    contracts_test_utils_1.expect(order.takerAssetData).to.eq(TAKER_ASSET_DATA);
                }
            }));
            it('generates bridge orders with correct taker amount', () => __awaiter(this, void 0, void 0, function* () {
                const improvedOrdersResponse = yield marketOperationUtils.getMarketSellOrdersAsync(
                // Pass in empty orders to prevent native orders from being used.
                ORDERS.map(o => (Object.assign({}, o, { makerAssetAmount: contracts_test_utils_1.constants.ZERO_AMOUNT }))), FILL_AMOUNT, DEFAULT_OPTS);
                const improvedOrders = improvedOrdersResponse.optimizedOrders;
                const totalTakerAssetAmount = utils_1.BigNumber.sum(...improvedOrders.map(o => o.takerAssetAmount));
                contracts_test_utils_1.expect(totalTakerAssetAmount).to.bignumber.gte(FILL_AMOUNT);
            }));
            it('generates bridge orders with max slippage of `bridgeSlippage`', () => __awaiter(this, void 0, void 0, function* () {
                const bridgeSlippage = _.random(0.1, true);
                const improvedOrdersResponse = yield marketOperationUtils.getMarketSellOrdersAsync(
                // Pass in empty orders to prevent native orders from being used.
                ORDERS.map(o => (Object.assign({}, o, { makerAssetAmount: contracts_test_utils_1.constants.ZERO_AMOUNT }))), FILL_AMOUNT, Object.assign({}, DEFAULT_OPTS, { bridgeSlippage }));
                const improvedOrders = improvedOrdersResponse.optimizedOrders;
                contracts_test_utils_1.expect(improvedOrders).to.not.be.length(0);
                for (const order of improvedOrders) {
                    const expectedMakerAmount = order.fills[0].output;
                    const slippage = new utils_1.BigNumber(1).minus(order.makerAssetAmount.div(expectedMakerAmount.plus(1)));
                    contracts_test_utils_1.assertRoughlyEquals(slippage, bridgeSlippage, 1);
                }
            }));
            it('can mix convex sources', () => __awaiter(this, void 0, void 0, function* () {
                const rates = Object.assign({}, DEFAULT_RATES);
                rates[types_2.ERC20BridgeSource.Native] = [0.4, 0.3, 0.2, 0.1];
                rates[types_2.ERC20BridgeSource.Uniswap] = [0.5, 0.05, 0.05, 0.05];
                rates[types_2.ERC20BridgeSource.Eth2Dai] = [0.6, 0.05, 0.05, 0.05];
                rates[types_2.ERC20BridgeSource.Kyber] = [0, 0, 0, 0]; // unused
                replaceSamplerOps({
                    getSellQuotes: createGetMultipleSellQuotesOperationFromRates(rates),
                });
                const improvedOrdersResponse = yield marketOperationUtils.getMarketSellOrdersAsync(createOrdersFromSellRates(FILL_AMOUNT, rates[types_2.ERC20BridgeSource.Native]), FILL_AMOUNT, Object.assign({}, DEFAULT_OPTS, { numSamples: 4 }));
                const improvedOrders = improvedOrdersResponse.optimizedOrders;
                const orderSources = improvedOrders.map(o => o.fills[0].source);
                const expectedSources = [
                    types_2.ERC20BridgeSource.Eth2Dai,
                    types_2.ERC20BridgeSource.Uniswap,
                    types_2.ERC20BridgeSource.Native,
                    types_2.ERC20BridgeSource.Native,
                ];
                contracts_test_utils_1.expect(orderSources.sort()).to.deep.eq(expectedSources.sort());
            }));
            const ETH_TO_MAKER_RATE = 1.5;
            it('factors in fees for native orders', () => __awaiter(this, void 0, void 0, function* () {
                // Native orders will have the best rates but have fees,
                // dropping their effective rates.
                const nativeFeeRate = 0.06;
                const rates = {
                    [types_2.ERC20BridgeSource.Native]: [1, 0.99, 0.98, 0.97],
                    [types_2.ERC20BridgeSource.Uniswap]: [0.96, 0.1, 0.1, 0.1],
                    [types_2.ERC20BridgeSource.Eth2Dai]: [0.95, 0.1, 0.1, 0.1],
                    [types_2.ERC20BridgeSource.Kyber]: [0.1, 0.1, 0.1, 0.1],
                };
                const feeSchedule = {
                    [types_2.ERC20BridgeSource.Native]: _.constant(FILL_AMOUNT.div(4)
                        .times(nativeFeeRate)
                        .dividedToIntegerBy(ETH_TO_MAKER_RATE)),
                };
                replaceSamplerOps({
                    getSellQuotes: createGetMultipleSellQuotesOperationFromRates(rates),
                    getMedianSellRate: createGetMedianSellRate(ETH_TO_MAKER_RATE),
                });
                const improvedOrdersResponse = yield marketOperationUtils.getMarketSellOrdersAsync(createOrdersFromSellRates(FILL_AMOUNT, rates[types_2.ERC20BridgeSource.Native]), FILL_AMOUNT, Object.assign({}, DEFAULT_OPTS, { numSamples: 4, feeSchedule }));
                const improvedOrders = improvedOrdersResponse.optimizedOrders;
                const orderSources = improvedOrders.map(o => o.fills[0].source);
                const expectedSources = [
                    types_2.ERC20BridgeSource.Native,
                    types_2.ERC20BridgeSource.Uniswap,
                    types_2.ERC20BridgeSource.Eth2Dai,
                    types_2.ERC20BridgeSource.Native,
                ];
                contracts_test_utils_1.expect(orderSources.sort()).to.deep.eq(expectedSources.sort());
            }));
            it('factors in fees for dexes', () => __awaiter(this, void 0, void 0, function* () {
                // Kyber will have the best rates but will have fees,
                // dropping its effective rates.
                const uniswapFeeRate = 0.2;
                const rates = {
                    [types_2.ERC20BridgeSource.Native]: [0.95, 0.1, 0.1, 0.1],
                    [types_2.ERC20BridgeSource.Kyber]: [0.1, 0.1, 0.1, 0.1],
                    [types_2.ERC20BridgeSource.Eth2Dai]: [0.92, 0.1, 0.1, 0.1],
                    // Effectively [0.8, ~0.5, ~0, ~0]
                    [types_2.ERC20BridgeSource.Uniswap]: [1, 0.7, 0.2, 0.2],
                };
                const feeSchedule = {
                    [types_2.ERC20BridgeSource.Uniswap]: _.constant(FILL_AMOUNT.div(4)
                        .times(uniswapFeeRate)
                        .dividedToIntegerBy(ETH_TO_MAKER_RATE)),
                };
                replaceSamplerOps({
                    getSellQuotes: createGetMultipleSellQuotesOperationFromRates(rates),
                    getMedianSellRate: createGetMedianSellRate(ETH_TO_MAKER_RATE),
                });
                const improvedOrdersResponse = yield marketOperationUtils.getMarketSellOrdersAsync(createOrdersFromSellRates(FILL_AMOUNT, rates[types_2.ERC20BridgeSource.Native]), FILL_AMOUNT, Object.assign({}, DEFAULT_OPTS, { numSamples: 4, feeSchedule }));
                const improvedOrders = improvedOrdersResponse.optimizedOrders;
                const orderSources = improvedOrders.map(o => o.fills[0].source);
                const expectedSources = [
                    types_2.ERC20BridgeSource.Native,
                    types_2.ERC20BridgeSource.Eth2Dai,
                    types_2.ERC20BridgeSource.Uniswap,
                ];
                contracts_test_utils_1.expect(orderSources.sort()).to.deep.eq(expectedSources.sort());
            }));
            it('can mix one concave source', () => __awaiter(this, void 0, void 0, function* () {
                const rates = {
                    [types_2.ERC20BridgeSource.Kyber]: [0, 0, 0, 0],
                    [types_2.ERC20BridgeSource.Eth2Dai]: [0.5, 0.85, 0.75, 0.75],
                    [types_2.ERC20BridgeSource.Uniswap]: [0.96, 0.2, 0.1, 0.1],
                    [types_2.ERC20BridgeSource.Native]: [0.95, 0.2, 0.2, 0.1],
                };
                replaceSamplerOps({
                    getSellQuotes: createGetMultipleSellQuotesOperationFromRates(rates),
                    getMedianSellRate: createGetMedianSellRate(ETH_TO_MAKER_RATE),
                });
                const improvedOrdersResponse = yield marketOperationUtils.getMarketSellOrdersAsync(createOrdersFromSellRates(FILL_AMOUNT, rates[types_2.ERC20BridgeSource.Native]), FILL_AMOUNT, Object.assign({}, DEFAULT_OPTS, { numSamples: 4 }));
                const improvedOrders = improvedOrdersResponse.optimizedOrders;
                const orderSources = improvedOrders.map(o => o.fills[0].source);
                const expectedSources = [
                    types_2.ERC20BridgeSource.Eth2Dai,
                    types_2.ERC20BridgeSource.Uniswap,
                    types_2.ERC20BridgeSource.Native,
                ];
                contracts_test_utils_1.expect(orderSources.sort()).to.deep.eq(expectedSources.sort());
            }));
            it('fallback orders use different sources', () => __awaiter(this, void 0, void 0, function* () {
                const rates = {};
                rates[types_2.ERC20BridgeSource.Native] = [0.9, 0.8, 0.5, 0.5];
                rates[types_2.ERC20BridgeSource.Uniswap] = [0.6, 0.05, 0.01, 0.01];
                rates[types_2.ERC20BridgeSource.Eth2Dai] = [0.4, 0.3, 0.01, 0.01];
                rates[types_2.ERC20BridgeSource.Kyber] = [0.35, 0.2, 0.01, 0.01];
                replaceSamplerOps({
                    getSellQuotes: createGetMultipleSellQuotesOperationFromRates(rates),
                });
                const improvedOrdersResponse = yield marketOperationUtils.getMarketSellOrdersAsync(createOrdersFromSellRates(FILL_AMOUNT, rates[types_2.ERC20BridgeSource.Native]), FILL_AMOUNT, Object.assign({}, DEFAULT_OPTS, { numSamples: 4, allowFallback: true }));
                const improvedOrders = improvedOrdersResponse.optimizedOrders;
                const orderSources = improvedOrders.map(o => o.fills[0].source);
                const firstSources = orderSources.slice(0, 4);
                const secondSources = orderSources.slice(4);
                contracts_test_utils_1.expect(_.intersection(firstSources, secondSources)).to.be.length(0);
            }));
            it('does not create a fallback if below maxFallbackSlippage', () => __awaiter(this, void 0, void 0, function* () {
                const rates = {};
                rates[types_2.ERC20BridgeSource.Native] = [1, 1, 0.01, 0.01];
                rates[types_2.ERC20BridgeSource.Uniswap] = [1, 1, 0.01, 0.01];
                rates[types_2.ERC20BridgeSource.Eth2Dai] = [0.49, 0.49, 0.49, 0.49];
                rates[types_2.ERC20BridgeSource.Kyber] = [0.35, 0.2, 0.01, 0.01];
                replaceSamplerOps({
                    getSellQuotes: createGetMultipleSellQuotesOperationFromRates(rates),
                });
                const improvedOrdersResponse = yield marketOperationUtils.getMarketSellOrdersAsync(createOrdersFromSellRates(FILL_AMOUNT, rates[types_2.ERC20BridgeSource.Native]), FILL_AMOUNT, Object.assign({}, DEFAULT_OPTS, { numSamples: 4, allowFallback: true, maxFallbackSlippage: 0.25 }));
                const improvedOrders = improvedOrdersResponse.optimizedOrders;
                const orderSources = improvedOrders.map(o => o.fills[0].source);
                const firstSources = [types_2.ERC20BridgeSource.Native, types_2.ERC20BridgeSource.Native, types_2.ERC20BridgeSource.Uniswap];
                const secondSources = [];
                contracts_test_utils_1.expect(orderSources.slice(0, firstSources.length).sort()).to.deep.eq(firstSources.sort());
                contracts_test_utils_1.expect(orderSources.slice(firstSources.length).sort()).to.deep.eq(secondSources.sort());
            }));
            it('is able to create a order from LiquidityProvider', () => __awaiter(this, void 0, void 0, function* () {
                const registryAddress = contracts_test_utils_1.randomAddress();
                const liquidityProviderAddress = DEFAULT_FILL_DATA[types_2.ERC20BridgeSource.LiquidityProvider]
                    .poolAddress;
                const xAsset = contracts_test_utils_1.randomAddress();
                const yAsset = contracts_test_utils_1.randomAddress();
                const toSell = utils_1.fromTokenUnitAmount(10);
                const [getSellQuotesParams, getSellQuotesFn] = callTradeOperationAndRetainLiquidityProviderParams(createGetMultipleSellQuotesOperationFromRates, {
                    [types_2.ERC20BridgeSource.LiquidityProvider]: createDecreasingRates(5),
                });
                replaceSamplerOps({
                    getOrderFillableTakerAmounts: () => [contracts_test_utils_1.constants.ZERO_AMOUNT],
                    getSellQuotes: getSellQuotesFn,
                });
                const sampler = new market_operation_utils_1.MarketOperationUtils(MOCK_SAMPLER, contractAddresses, ORDER_DOMAIN, registryAddress);
                const ordersAndReport = yield sampler.getMarketSellOrdersAsync([
                    createOrder({
                        makerAssetData: order_utils_1.assetDataUtils.encodeERC20AssetData(xAsset),
                        takerAssetData: order_utils_1.assetDataUtils.encodeERC20AssetData(yAsset),
                    }),
                ], dev_utils_1.Web3Wrapper.toBaseUnitAmount(10, 18), {
                    excludedSources: SELL_SOURCES.concat(types_2.ERC20BridgeSource.Bancor),
                    numSamples: 4,
                    bridgeSlippage: 0,
                    shouldBatchBridgeOrders: false,
                });
                const result = ordersAndReport.optimizedOrders;
                contracts_test_utils_1.expect(result.length).to.eql(1);
                contracts_test_utils_1.expect(result[0].makerAddress).to.eql(liquidityProviderAddress);
                // tslint:disable-next-line:no-unnecessary-type-assertion
                const decodedAssetData = order_utils_1.assetDataUtils.decodeAssetDataOrThrow(result[0].makerAssetData);
                contracts_test_utils_1.expect(decodedAssetData.assetProxyId).to.eql(types_1.AssetProxyId.ERC20Bridge);
                contracts_test_utils_1.expect(decodedAssetData.bridgeAddress).to.eql(liquidityProviderAddress);
                contracts_test_utils_1.expect(result[0].takerAssetAmount).to.bignumber.eql(toSell);
                contracts_test_utils_1.expect(getSellQuotesParams.sources).contains(types_2.ERC20BridgeSource.LiquidityProvider);
                contracts_test_utils_1.expect(getSellQuotesParams.liquidityProviderAddress).is.eql(registryAddress);
            }));
            it('batches contiguous bridge sources', () => __awaiter(this, void 0, void 0, function* () {
                const rates = {};
                rates[types_2.ERC20BridgeSource.Uniswap] = [1, 0.01, 0.01, 0.01];
                rates[types_2.ERC20BridgeSource.Native] = [0.5, 0.01, 0.01, 0.01];
                rates[types_2.ERC20BridgeSource.Eth2Dai] = [0.49, 0.01, 0.01, 0.01];
                rates[types_2.ERC20BridgeSource.Curve] = [0.48, 0.01, 0.01, 0.01];
                replaceSamplerOps({
                    getSellQuotes: createGetMultipleSellQuotesOperationFromRates(rates),
                });
                const improvedOrdersResponse = yield marketOperationUtils.getMarketSellOrdersAsync(createOrdersFromSellRates(FILL_AMOUNT, rates[types_2.ERC20BridgeSource.Native]), FILL_AMOUNT, Object.assign({}, DEFAULT_OPTS, { numSamples: 4, excludedSources: [
                        types_2.ERC20BridgeSource.Kyber,
                        ..._.without(DEFAULT_OPTS.excludedSources, types_2.ERC20BridgeSource.Curve),
                    ], shouldBatchBridgeOrders: true }));
                const improvedOrders = improvedOrdersResponse.optimizedOrders;
                contracts_test_utils_1.expect(improvedOrders).to.be.length(3);
                const orderFillSources = getSortedOrderSources(src_1.MarketOperation.Sell, improvedOrders);
                contracts_test_utils_1.expect(orderFillSources).to.deep.eq([
                    [types_2.ERC20BridgeSource.Uniswap],
                    [types_2.ERC20BridgeSource.Native],
                    [types_2.ERC20BridgeSource.Eth2Dai, types_2.ERC20BridgeSource.Curve],
                ]);
            }));
        });
        describe('getMarketBuyOrdersAsync()', () => {
            const FILL_AMOUNT = new utils_1.BigNumber('100e18');
            const ORDERS = createOrdersFromBuyRates(FILL_AMOUNT, _.times(NUM_SAMPLES, () => DEFAULT_RATES[types_2.ERC20BridgeSource.Native][0]));
            const DEFAULT_OPTS = {
                numSamples: NUM_SAMPLES,
                sampleDistributionBase: 1,
                bridgeSlippage: 0,
                maxFallbackSlippage: 100,
                excludedSources: DEFAULT_EXCLUDED,
                allowFallback: false,
                shouldBatchBridgeOrders: false,
            };
            beforeEach(() => {
                replaceSamplerOps();
            });
            it('queries `numSamples` samples', () => __awaiter(this, void 0, void 0, function* () {
                const numSamples = _.random(1, 16);
                let actualNumSamples = 0;
                replaceSamplerOps({
                    getBuyQuotes: (sources, makerToken, takerToken, amounts, wethAddress) => {
                        actualNumSamples = amounts.length;
                        return DEFAULT_OPS.getBuyQuotes(sources, makerToken, takerToken, amounts, wethAddress);
                    },
                });
                yield marketOperationUtils.getMarketBuyOrdersAsync(ORDERS, FILL_AMOUNT, Object.assign({}, DEFAULT_OPTS, { numSamples }));
                contracts_test_utils_1.expect(actualNumSamples).eq(numSamples);
            }));
            it('polls all DEXes if `excludedSources` is empty', () => __awaiter(this, void 0, void 0, function* () {
                let sourcesPolled = [];
                replaceSamplerOps({
                    getBuyQuotes: (sources, makerToken, takerToken, amounts, wethAddress) => {
                        sourcesPolled = sourcesPolled.concat(sources.slice());
                        return DEFAULT_OPS.getBuyQuotes(sources, makerToken, takerToken, amounts, wethAddress);
                    },
                    getTwoHopBuyQuotes: (sources, ..._args) => {
                        if (sources.length !== 0) {
                            sourcesPolled.push(types_2.ERC20BridgeSource.MultiHop);
                            sourcesPolled.push(...sources);
                        }
                        return DEFAULT_OPS.getTwoHopBuyQuotes(..._args);
                    },
                    getBalancerBuyQuotesOffChainAsync: (makerToken, takerToken, makerFillAmounts) => {
                        sourcesPolled = sourcesPolled.concat(types_2.ERC20BridgeSource.Balancer);
                        return DEFAULT_OPS.getBalancerBuyQuotesOffChainAsync(makerToken, takerToken, makerFillAmounts);
                    },
                });
                yield marketOperationUtils.getMarketBuyOrdersAsync(ORDERS, FILL_AMOUNT, Object.assign({}, DEFAULT_OPTS, { excludedSources: [] }));
                contracts_test_utils_1.expect(_.uniq(sourcesPolled).sort()).to.deep.equals(BUY_SOURCES.sort());
            }));
            it('polls the liquidity provider when the registry is provided in the arguments', () => __awaiter(this, void 0, void 0, function* () {
                const [args, fn] = callTradeOperationAndRetainLiquidityProviderParams(createGetMultipleBuyQuotesOperationFromRates, DEFAULT_RATES);
                replaceSamplerOps({
                    getBuyQuotes: fn,
                    getTwoHopBuyQuotes: (sources, ..._args) => {
                        if (sources.length !== 0) {
                            args.sources.push(types_2.ERC20BridgeSource.MultiHop);
                            args.sources.push(...sources);
                        }
                        return DEFAULT_OPS.getTwoHopBuyQuotes(..._args);
                    },
                    getBalancerBuyQuotesOffChainAsync: (makerToken, takerToken, makerFillAmounts) => {
                        args.sources = args.sources.concat(types_2.ERC20BridgeSource.Balancer);
                        return DEFAULT_OPS.getBalancerBuyQuotesOffChainAsync(makerToken, takerToken, makerFillAmounts);
                    },
                });
                const registryAddress = contracts_test_utils_1.randomAddress();
                const newMarketOperationUtils = new market_operation_utils_1.MarketOperationUtils(MOCK_SAMPLER, contractAddresses, ORDER_DOMAIN, registryAddress);
                yield newMarketOperationUtils.getMarketBuyOrdersAsync(ORDERS, FILL_AMOUNT, Object.assign({}, DEFAULT_OPTS, { excludedSources: [] }));
                contracts_test_utils_1.expect(_.uniq(args.sources).sort()).to.deep.eq(BUY_SOURCES.concat([types_2.ERC20BridgeSource.LiquidityProvider]).sort());
                contracts_test_utils_1.expect(args.liquidityProviderAddress).to.eql(registryAddress);
            }));
            it('does not poll DEXes in `excludedSources`', () => __awaiter(this, void 0, void 0, function* () {
                const excludedSources = [types_2.ERC20BridgeSource.Uniswap, types_2.ERC20BridgeSource.Eth2Dai];
                let sourcesPolled = [];
                replaceSamplerOps({
                    getBuyQuotes: (sources, makerToken, takerToken, amounts, wethAddress) => {
                        sourcesPolled = sourcesPolled.concat(sources.slice());
                        return DEFAULT_OPS.getBuyQuotes(sources, makerToken, takerToken, amounts, wethAddress);
                    },
                    getTwoHopBuyQuotes: (sources, ..._args) => {
                        if (sources.length !== 0) {
                            sourcesPolled.push(types_2.ERC20BridgeSource.MultiHop);
                            sourcesPolled.push(...sources);
                        }
                        return DEFAULT_OPS.getTwoHopBuyQuotes(..._args);
                    },
                    getBalancerBuyQuotesOffChainAsync: (makerToken, takerToken, makerFillAmounts) => {
                        sourcesPolled = sourcesPolled.concat(types_2.ERC20BridgeSource.Balancer);
                        return DEFAULT_OPS.getBalancerBuyQuotesOffChainAsync(makerToken, takerToken, makerFillAmounts);
                    },
                });
                yield marketOperationUtils.getMarketBuyOrdersAsync(ORDERS, FILL_AMOUNT, Object.assign({}, DEFAULT_OPTS, { excludedSources }));
                contracts_test_utils_1.expect(_.uniq(sourcesPolled).sort()).to.deep.eq(_.without(BUY_SOURCES, ...excludedSources).sort());
            }));
            it('only polls DEXes in `includedSources`', () => __awaiter(this, void 0, void 0, function* () {
                const includedSources = [types_2.ERC20BridgeSource.Uniswap, types_2.ERC20BridgeSource.Eth2Dai];
                let sourcesPolled = [];
                replaceSamplerOps({
                    getBuyQuotes: (sources, makerToken, takerToken, amounts, wethAddress) => {
                        sourcesPolled = sourcesPolled.concat(sources.slice());
                        return DEFAULT_OPS.getBuyQuotes(sources, makerToken, takerToken, amounts, wethAddress);
                    },
                    getTwoHopBuyQuotes: (sources, ..._args) => {
                        if (sources.length !== 0) {
                            sourcesPolled.push(types_2.ERC20BridgeSource.MultiHop);
                            sourcesPolled.push(...sources);
                        }
                        return DEFAULT_OPS.getTwoHopBuyQuotes(..._args);
                    },
                    getBalancerBuyQuotesOffChainAsync: (makerToken, takerToken, makerFillAmounts) => {
                        sourcesPolled = sourcesPolled.concat(types_2.ERC20BridgeSource.Balancer);
                        return DEFAULT_OPS.getBalancerBuyQuotesOffChainAsync(makerToken, takerToken, makerFillAmounts);
                    },
                });
                yield marketOperationUtils.getMarketBuyOrdersAsync(ORDERS, FILL_AMOUNT, Object.assign({}, DEFAULT_OPTS, { excludedSources: [], includedSources }));
                contracts_test_utils_1.expect(_.uniq(sourcesPolled).sort()).to.deep.eq(includedSources.sort());
            }));
            it('generates bridge orders with correct asset data', () => __awaiter(this, void 0, void 0, function* () {
                const improvedOrdersResponse = yield marketOperationUtils.getMarketBuyOrdersAsync(
                // Pass in empty orders to prevent native orders from being used.
                ORDERS.map(o => (Object.assign({}, o, { makerAssetAmount: contracts_test_utils_1.constants.ZERO_AMOUNT }))), FILL_AMOUNT, DEFAULT_OPTS);
                const improvedOrders = improvedOrdersResponse.optimizedOrders;
                contracts_test_utils_1.expect(improvedOrders).to.not.be.length(0);
                for (const order of improvedOrders) {
                    contracts_test_utils_1.expect(getSourceFromAssetData(order.makerAssetData)).to.exist('');
                    const makerAssetDataPrefix = utils_1.hexUtils.slice(order_utils_1.assetDataUtils.encodeERC20BridgeAssetData(MAKER_TOKEN, contracts_test_utils_1.constants.NULL_ADDRESS, contracts_test_utils_1.constants.NULL_BYTES), 0, 36);
                    assertSamePrefix(order.makerAssetData, makerAssetDataPrefix);
                    contracts_test_utils_1.expect(order.takerAssetData).to.eq(TAKER_ASSET_DATA);
                }
            }));
            it('generates bridge orders with correct maker amount', () => __awaiter(this, void 0, void 0, function* () {
                const improvedOrdersResponse = yield marketOperationUtils.getMarketBuyOrdersAsync(
                // Pass in empty orders to prevent native orders from being used.
                ORDERS.map(o => (Object.assign({}, o, { makerAssetAmount: contracts_test_utils_1.constants.ZERO_AMOUNT }))), FILL_AMOUNT, DEFAULT_OPTS);
                const improvedOrders = improvedOrdersResponse.optimizedOrders;
                const totalMakerAssetAmount = utils_1.BigNumber.sum(...improvedOrders.map(o => o.makerAssetAmount));
                contracts_test_utils_1.expect(totalMakerAssetAmount).to.bignumber.gte(FILL_AMOUNT);
            }));
            it('generates bridge orders with max slippage of `bridgeSlippage`', () => __awaiter(this, void 0, void 0, function* () {
                const bridgeSlippage = _.random(0.1, true);
                const improvedOrdersResponse = yield marketOperationUtils.getMarketBuyOrdersAsync(
                // Pass in empty orders to prevent native orders from being used.
                ORDERS.map(o => (Object.assign({}, o, { makerAssetAmount: contracts_test_utils_1.constants.ZERO_AMOUNT }))), FILL_AMOUNT, Object.assign({}, DEFAULT_OPTS, { bridgeSlippage }));
                const improvedOrders = improvedOrdersResponse.optimizedOrders;
                contracts_test_utils_1.expect(improvedOrders).to.not.be.length(0);
                for (const order of improvedOrders) {
                    const expectedTakerAmount = order.fills[0].output;
                    const slippage = order.takerAssetAmount.div(expectedTakerAmount.plus(1)).minus(1);
                    contracts_test_utils_1.assertRoughlyEquals(slippage, bridgeSlippage, 1);
                }
            }));
            it('can mix convex sources', () => __awaiter(this, void 0, void 0, function* () {
                const rates = Object.assign({}, ZERO_RATES);
                rates[types_2.ERC20BridgeSource.Native] = [0.4, 0.3, 0.2, 0.1];
                rates[types_2.ERC20BridgeSource.Uniswap] = [0.5, 0.05, 0.05, 0.05];
                rates[types_2.ERC20BridgeSource.Eth2Dai] = [0.6, 0.05, 0.05, 0.05];
                replaceSamplerOps({
                    getBuyQuotes: createGetMultipleBuyQuotesOperationFromRates(rates),
                });
                const improvedOrdersResponse = yield marketOperationUtils.getMarketBuyOrdersAsync(createOrdersFromBuyRates(FILL_AMOUNT, rates[types_2.ERC20BridgeSource.Native]), FILL_AMOUNT, Object.assign({}, DEFAULT_OPTS, { numSamples: 4 }));
                const improvedOrders = improvedOrdersResponse.optimizedOrders;
                const orderSources = improvedOrders.map(o => o.fills[0].source);
                const expectedSources = [
                    types_2.ERC20BridgeSource.Eth2Dai,
                    types_2.ERC20BridgeSource.Uniswap,
                    types_2.ERC20BridgeSource.Native,
                    types_2.ERC20BridgeSource.Native,
                ];
                contracts_test_utils_1.expect(orderSources.sort()).to.deep.eq(expectedSources.sort());
            }));
            const ETH_TO_TAKER_RATE = 1.5;
            it('factors in fees for native orders', () => __awaiter(this, void 0, void 0, function* () {
                // Native orders will have the best rates but have fees,
                // dropping their effective rates.
                const nativeFeeRate = 0.06;
                const rates = Object.assign({}, ZERO_RATES, { [types_2.ERC20BridgeSource.Native]: [1, 0.99, 0.98, 0.97], [types_2.ERC20BridgeSource.Uniswap]: [0.96, 0.1, 0.1, 0.1], [types_2.ERC20BridgeSource.Eth2Dai]: [0.95, 0.1, 0.1, 0.1], [types_2.ERC20BridgeSource.Kyber]: [0.1, 0.1, 0.1, 0.1] });
                const feeSchedule = {
                    [types_2.ERC20BridgeSource.Native]: _.constant(FILL_AMOUNT.div(4)
                        .times(nativeFeeRate)
                        .dividedToIntegerBy(ETH_TO_TAKER_RATE)),
                };
                replaceSamplerOps({
                    getBuyQuotes: createGetMultipleBuyQuotesOperationFromRates(rates),
                    getMedianSellRate: createGetMedianSellRate(ETH_TO_TAKER_RATE),
                });
                const improvedOrdersResponse = yield marketOperationUtils.getMarketBuyOrdersAsync(createOrdersFromBuyRates(FILL_AMOUNT, rates[types_2.ERC20BridgeSource.Native]), FILL_AMOUNT, Object.assign({}, DEFAULT_OPTS, { numSamples: 4, feeSchedule }));
                const improvedOrders = improvedOrdersResponse.optimizedOrders;
                const orderSources = improvedOrders.map(o => o.fills[0].source);
                const expectedSources = [
                    types_2.ERC20BridgeSource.Uniswap,
                    types_2.ERC20BridgeSource.Eth2Dai,
                    types_2.ERC20BridgeSource.Native,
                    types_2.ERC20BridgeSource.Native,
                ];
                contracts_test_utils_1.expect(orderSources.sort()).to.deep.eq(expectedSources.sort());
            }));
            it('factors in fees for dexes', () => __awaiter(this, void 0, void 0, function* () {
                // Uniswap will have the best rates but will have fees,
                // dropping its effective rates.
                const uniswapFeeRate = 0.2;
                const rates = Object.assign({}, ZERO_RATES, { [types_2.ERC20BridgeSource.Native]: [0.95, 0.1, 0.1, 0.1], 
                    // Effectively [0.8, ~0.5, ~0, ~0]
                    [types_2.ERC20BridgeSource.Uniswap]: [1, 0.7, 0.2, 0.2], [types_2.ERC20BridgeSource.Eth2Dai]: [0.92, 0.1, 0.1, 0.1] });
                const feeSchedule = {
                    [types_2.ERC20BridgeSource.Uniswap]: _.constant(FILL_AMOUNT.div(4)
                        .times(uniswapFeeRate)
                        .dividedToIntegerBy(ETH_TO_TAKER_RATE)),
                };
                replaceSamplerOps({
                    getBuyQuotes: createGetMultipleBuyQuotesOperationFromRates(rates),
                    getMedianSellRate: createGetMedianSellRate(ETH_TO_TAKER_RATE),
                });
                const improvedOrdersResponse = yield marketOperationUtils.getMarketBuyOrdersAsync(createOrdersFromBuyRates(FILL_AMOUNT, rates[types_2.ERC20BridgeSource.Native]), FILL_AMOUNT, Object.assign({}, DEFAULT_OPTS, { numSamples: 4, feeSchedule }));
                const improvedOrders = improvedOrdersResponse.optimizedOrders;
                const orderSources = improvedOrders.map(o => o.fills[0].source);
                const expectedSources = [
                    types_2.ERC20BridgeSource.Native,
                    types_2.ERC20BridgeSource.Eth2Dai,
                    types_2.ERC20BridgeSource.Uniswap,
                ];
                contracts_test_utils_1.expect(orderSources.sort()).to.deep.eq(expectedSources.sort());
            }));
            it('fallback orders use different sources', () => __awaiter(this, void 0, void 0, function* () {
                const rates = Object.assign({}, ZERO_RATES);
                rates[types_2.ERC20BridgeSource.Native] = [0.9, 0.8, 0.5, 0.5];
                rates[types_2.ERC20BridgeSource.Uniswap] = [0.6, 0.05, 0.01, 0.01];
                rates[types_2.ERC20BridgeSource.Eth2Dai] = [0.4, 0.3, 0.01, 0.01];
                replaceSamplerOps({
                    getBuyQuotes: createGetMultipleBuyQuotesOperationFromRates(rates),
                });
                const improvedOrdersResponse = yield marketOperationUtils.getMarketBuyOrdersAsync(createOrdersFromBuyRates(FILL_AMOUNT, rates[types_2.ERC20BridgeSource.Native]), FILL_AMOUNT, Object.assign({}, DEFAULT_OPTS, { numSamples: 4, allowFallback: true }));
                const improvedOrders = improvedOrdersResponse.optimizedOrders;
                const orderSources = improvedOrders.map(o => o.fills[0].source);
                const firstSources = orderSources.slice(0, 4);
                const secondSources = orderSources.slice(4);
                contracts_test_utils_1.expect(_.intersection(firstSources, secondSources)).to.be.length(0);
            }));
            it('does not create a fallback if below maxFallbackSlippage', () => __awaiter(this, void 0, void 0, function* () {
                const rates = Object.assign({}, ZERO_RATES);
                rates[types_2.ERC20BridgeSource.Native] = [1, 1, 0.01, 0.01];
                rates[types_2.ERC20BridgeSource.Uniswap] = [1, 1, 0.01, 0.01];
                rates[types_2.ERC20BridgeSource.Eth2Dai] = [0.49, 0.49, 0.49, 0.49];
                replaceSamplerOps({
                    getBuyQuotes: createGetMultipleBuyQuotesOperationFromRates(rates),
                });
                const improvedOrdersResponse = yield marketOperationUtils.getMarketBuyOrdersAsync(createOrdersFromBuyRates(FILL_AMOUNT, rates[types_2.ERC20BridgeSource.Native]), FILL_AMOUNT, Object.assign({}, DEFAULT_OPTS, { numSamples: 4, allowFallback: true, maxFallbackSlippage: 0.25 }));
                const improvedOrders = improvedOrdersResponse.optimizedOrders;
                const orderSources = improvedOrders.map(o => o.fills[0].source);
                const firstSources = [types_2.ERC20BridgeSource.Native, types_2.ERC20BridgeSource.Native, types_2.ERC20BridgeSource.Uniswap];
                const secondSources = [];
                contracts_test_utils_1.expect(orderSources.slice(0, firstSources.length).sort()).to.deep.eq(firstSources.sort());
                contracts_test_utils_1.expect(orderSources.slice(firstSources.length).sort()).to.deep.eq(secondSources.sort());
            }));
            it('batches contiguous bridge sources', () => __awaiter(this, void 0, void 0, function* () {
                const rates = Object.assign({}, ZERO_RATES);
                rates[types_2.ERC20BridgeSource.Native] = [0.5, 0.01, 0.01, 0.01];
                rates[types_2.ERC20BridgeSource.Eth2Dai] = [0.49, 0.02, 0.01, 0.01];
                rates[types_2.ERC20BridgeSource.Uniswap] = [0.48, 0.01, 0.01, 0.01];
                replaceSamplerOps({
                    getBuyQuotes: createGetMultipleBuyQuotesOperationFromRates(rates),
                });
                const improvedOrdersResponse = yield marketOperationUtils.getMarketBuyOrdersAsync(createOrdersFromBuyRates(FILL_AMOUNT, rates[types_2.ERC20BridgeSource.Native]), FILL_AMOUNT, Object.assign({}, DEFAULT_OPTS, { numSamples: 4, shouldBatchBridgeOrders: true }));
                const improvedOrders = improvedOrdersResponse.optimizedOrders;
                contracts_test_utils_1.expect(improvedOrders).to.be.length(2);
                const orderFillSources = getSortedOrderSources(src_1.MarketOperation.Sell, improvedOrders);
                contracts_test_utils_1.expect(orderFillSources).to.deep.eq([
                    [types_2.ERC20BridgeSource.Native],
                    [types_2.ERC20BridgeSource.Eth2Dai, types_2.ERC20BridgeSource.Uniswap],
                ]);
            }));
        });
    });
    describe('createFillPaths', () => {
        const takerAssetAmount = new utils_1.BigNumber(5000000);
        const ethToOutputRate = new utils_1.BigNumber(0.5);
        // tslint:disable-next-line:no-object-literal-type-assertion
        const smallOrder = {
            chainId: 1,
            makerAddress: 'SMALL_ORDER',
            takerAddress: utils_1.NULL_ADDRESS,
            takerAssetAmount,
            makerAssetAmount: takerAssetAmount.times(2),
            makerFee: constants_1.ZERO_AMOUNT,
            takerFee: constants_1.ZERO_AMOUNT,
            makerAssetData: '0xf47261b0000000000000000000000000c02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
            takerAssetData: '0xf47261b0000000000000000000000000a0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
            makerFeeAssetData: '0x',
            takerFeeAssetData: '0x',
            fillableTakerAssetAmount: takerAssetAmount,
            fillableMakerAssetAmount: takerAssetAmount.times(2),
            fillableTakerFeeAmount: constants_1.ZERO_AMOUNT,
        };
        const largeOrder = Object.assign({}, smallOrder, { makerAddress: 'LARGE_ORDER', fillableMakerAssetAmount: smallOrder.fillableMakerAssetAmount.times(2), fillableTakerAssetAmount: smallOrder.fillableTakerAssetAmount.times(2), makerAssetAmount: smallOrder.makerAssetAmount.times(2), takerAssetAmount: smallOrder.takerAssetAmount.times(2) });
        const orders = [smallOrder, largeOrder];
        const feeSchedule = {
            [types_2.ERC20BridgeSource.Native]: _.constant(2e5),
        };
        it('penalizes native fill based on target amount when target is smaller', () => {
            const path = fills_1.createFillPaths({
                side: src_1.MarketOperation.Sell,
                orders,
                dexQuotes: [],
                targetInput: takerAssetAmount.minus(1),
                ethToOutputRate,
                feeSchedule,
            });
            contracts_test_utils_1.expect(path[0][0].fillData.order.makerAddress).to.eq(smallOrder.makerAddress);
            contracts_test_utils_1.expect(path[0][0].input).to.be.bignumber.eq(takerAssetAmount.minus(1));
        });
        it('penalizes native fill based on available amount when target is larger', () => {
            const path = fills_1.createFillPaths({
                side: src_1.MarketOperation.Sell,
                orders,
                dexQuotes: [],
                targetInput: constants_1.POSITIVE_INF,
                ethToOutputRate,
                feeSchedule,
            });
            contracts_test_utils_1.expect(path[0][0].fillData.order.makerAddress).to.eq(largeOrder.makerAddress);
            contracts_test_utils_1.expect(path[0][1].fillData.order.makerAddress).to.eq(smallOrder.makerAddress);
        });
    });
});
// tslint:disable-next-line: max-file-line-count
//# sourceMappingURL=market_operation_utils_test.js.map