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
const contract_wrappers_1 = require("@0x/contract-wrappers");
const json_schemas_1 = require("@0x/json-schemas");
const order_utils_1 = require("@0x/order-utils");
const orderbook_1 = require("@0x/orderbook");
const utils_1 = require("@0x/utils");
const ethereum_types_1 = require("ethereum-types");
const _ = require("lodash");
const artifacts_1 = require("./artifacts");
const constants_1 = require("./constants");
const types_1 = require("./types");
const assert_1 = require("./utils/assert");
const calculate_liquidity_1 = require("./utils/calculate_liquidity");
const market_operation_utils_1 = require("./utils/market_operation_utils");
const orders_1 = require("./utils/market_operation_utils/orders");
const sampler_1 = require("./utils/market_operation_utils/sampler");
const source_filters_1 = require("./utils/market_operation_utils/source_filters");
const types_2 = require("./utils/market_operation_utils/types");
const order_prune_utils_1 = require("./utils/order_prune_utils");
const order_state_utils_1 = require("./utils/order_state_utils");
const protocol_fee_utils_1 = require("./utils/protocol_fee_utils");
const quote_requestor_1 = require("./utils/quote_requestor");
const sorting_utils_1 = require("./utils/sorting_utils");
const swap_quote_calculator_1 = require("./utils/swap_quote_calculator");
const wrappers_1 = require("./wrappers");
class SwapQuoter {
    /**
     * Instantiates a new SwapQuoter instance given existing liquidity in the form of orders and feeOrders.
     * @param   supportedProvider   The Provider instance you would like to use for interacting with the Ethereum network.
     * @param   orders              A non-empty array of objects that conform to SignedOrder. All orders must have the same makerAssetData and takerAssetData.
     * @param   options             Initialization options for the SwapQuoter. See type definition for details.
     *
     * @return  An instance of SwapQuoter
     */
    static getSwapQuoterForProvidedOrders(supportedProvider, orders, options = {}) {
        assert_1.assert.doesConformToSchema('orders', orders, json_schemas_1.schemas.signedOrdersSchema);
        assert_1.assert.assert(orders.length !== 0, `Expected orders to contain at least one order`);
        const orderbook = orderbook_1.Orderbook.getOrderbookForProvidedOrders(orders);
        const swapQuoter = new SwapQuoter(supportedProvider, orderbook, options);
        return swapQuoter;
    }
    /**
     * Instantiates a new SwapQuoter instance given a [Standard Relayer API](https://github.com/0xProject/standard-relayer-api) endpoint
     * @param   supportedProvider  The Provider instance you would like to use for interacting with the Ethereum network.
     * @param   sraApiUrl          The standard relayer API base HTTP url you would like to source orders from.
     * @param   options            Initialization options for the SwapQuoter. See type definition for details.
     *
     * @return  An instance of SwapQuoter
     */
    static getSwapQuoterForStandardRelayerAPIUrl(supportedProvider, sraApiUrl, options = {}) {
        const provider = utils_1.providerUtils.standardizeOrThrow(supportedProvider);
        assert_1.assert.isWebUri('sraApiUrl', sraApiUrl);
        const orderbook = orderbook_1.Orderbook.getOrderbookForPollingProvider({
            httpEndpoint: sraApiUrl,
            pollingIntervalMs: options.orderRefreshIntervalMs || constants_1.constants.DEFAULT_SWAP_QUOTER_OPTS.orderRefreshIntervalMs,
            perPage: options.perPage || constants_1.constants.DEFAULT_PER_PAGE,
        });
        const swapQuoter = new SwapQuoter(provider, orderbook, options);
        return swapQuoter;
    }
    /**
     * Instantiates a new SwapQuoter instance given a [Standard Relayer API](https://github.com/0xProject/standard-relayer-api) endpoint
     * and a websocket endpoint. This is more effecient than `getSwapQuoterForStandardRelayerAPIUrl` when requesting multiple quotes.
     * @param   supportedProvider    The Provider instance you would like to use for interacting with the Ethereum network.
     * @param   sraApiUrl            The standard relayer API base HTTP url you would like to source orders from.
     * @param   sraWebsocketApiUrl   The standard relayer API Websocket url you would like to subscribe to.
     * @param   options              Initialization options for the SwapQuoter. See type definition for details.
     *
     * @return  An instance of SwapQuoter
     */
    static getSwapQuoterForStandardRelayerAPIWebsocket(supportedProvider, sraApiUrl, sraWebsocketAPIUrl, options = {}) {
        const provider = utils_1.providerUtils.standardizeOrThrow(supportedProvider);
        assert_1.assert.isWebUri('sraApiUrl', sraApiUrl);
        assert_1.assert.isUri('sraWebsocketAPIUrl', sraWebsocketAPIUrl);
        const orderbook = orderbook_1.Orderbook.getOrderbookForWebsocketProvider({
            httpEndpoint: sraApiUrl,
            websocketEndpoint: sraWebsocketAPIUrl,
        });
        const swapQuoter = new SwapQuoter(provider, orderbook, options);
        return swapQuoter;
    }
    /**
     * Instantiates a new SwapQuoter instance given a 0x Mesh endpoint. This pulls all available liquidity stored in Mesh
     * @param   supportedProvider The Provider instance you would like to use for interacting with the Ethereum network.
     * @param   meshEndpoint      The standard relayer API base HTTP url you would like to source orders from.
     * @param   options           Initialization options for the SwapQuoter. See type definition for details.
     *
     * @return  An instance of SwapQuoter
     */
    static getSwapQuoterForMeshEndpoint(supportedProvider, meshEndpoint, options = {}) {
        const provider = utils_1.providerUtils.standardizeOrThrow(supportedProvider);
        assert_1.assert.isUri('meshEndpoint', meshEndpoint);
        const orderbook = orderbook_1.Orderbook.getOrderbookForMeshProvider({
            websocketEndpoint: meshEndpoint,
            wsOpts: options.wsOpts,
        });
        const swapQuoter = new SwapQuoter(provider, orderbook, options);
        return swapQuoter;
    }
    /**
     * Instantiates a new SwapQuoter instance
     * @param   supportedProvider   The Provider instance you would like to use for interacting with the Ethereum network.
     * @param   orderbook           An object that conforms to Orderbook, see type for definition.
     * @param   options             Initialization options for the SwapQuoter. See type definition for details.
     *
     * @return  An instance of SwapQuoter
     */
    constructor(supportedProvider, orderbook, options = {}) {
        const { chainId, expiryBufferMs, permittedOrderFeeTypes, samplerGasLimit, liquidityProviderRegistryAddress, rfqt, tokenAdjacencyGraph, } = _.merge({}, constants_1.constants.DEFAULT_SWAP_QUOTER_OPTS, options);
        const provider = utils_1.providerUtils.standardizeOrThrow(supportedProvider);
        assert_1.assert.isValidOrderbook('orderbook', orderbook);
        assert_1.assert.isNumber('chainId', chainId);
        assert_1.assert.isNumber('expiryBufferMs', expiryBufferMs);
        this.chainId = chainId;
        this.provider = provider;
        this.orderbook = orderbook;
        this.expiryBufferMs = expiryBufferMs;
        this.permittedOrderFeeTypes = permittedOrderFeeTypes;
        this._rfqtOptions = rfqt;
        this._contractAddresses = options.contractAddresses || contract_addresses_1.getContractAddressesForChainOrThrow(chainId);
        this._devUtilsContract = new contract_wrappers_1.DevUtilsContract(this._contractAddresses.devUtils, provider);
        this._protocolFeeUtils = protocol_fee_utils_1.ProtocolFeeUtils.getInstance(constants_1.constants.PROTOCOL_FEE_UTILS_POLLING_INTERVAL_IN_MS, options.ethGasStationUrl);
        this._orderStateUtils = new order_state_utils_1.OrderStateUtils(this._devUtilsContract);
        // Allow the sampler bytecode to be overwritten using geths override functionality
        const samplerBytecode = _.get(artifacts_1.artifacts.ERC20BridgeSampler, 'compilerOutput.evm.deployedBytecode.object');
        const defaultCodeOverrides = samplerBytecode
            ? {
                [this._contractAddresses.erc20BridgeSampler]: { code: samplerBytecode },
            }
            : {};
        const samplerOverrides = _.assign({ block: ethereum_types_1.BlockParamLiteral.Latest, overrides: defaultCodeOverrides }, options.samplerOverrides);
        const samplerContract = new wrappers_1.ERC20BridgeSamplerContract(this._contractAddresses.erc20BridgeSampler, this.provider, {
            gas: samplerGasLimit,
        });
        this._marketOperationUtils = new market_operation_utils_1.MarketOperationUtils(new sampler_1.DexOrderSampler(samplerContract, samplerOverrides, provider), this._contractAddresses, {
            chainId,
            exchangeAddress: this._contractAddresses.exchange,
        }, liquidityProviderRegistryAddress, tokenAdjacencyGraph);
        this._swapQuoteCalculator = new swap_quote_calculator_1.SwapQuoteCalculator(this._marketOperationUtils);
    }
    /**
     * Get a `SwapQuote` containing all information relevant to fulfilling a swap between a desired ERC20 token address and ERC20 owned by a provided address.
     * You can then pass the `SwapQuote` to a `SwapQuoteConsumer` to execute a buy, or process SwapQuote for on-chain consumption.
     * @param   makerAssetData           The makerAssetData of the desired asset to swap for (for more info: https://github.com/0xProject/0x-protocol-specification/blob/master/v2/v2-specification.md).
     * @param   takerAssetData           The takerAssetData of the asset to swap makerAssetData for (for more info: https://github.com/0xProject/0x-protocol-specification/blob/master/v2/v2-specification.md).
     * @param   takerAssetSellAmount     The amount of taker asset to swap for.
     * @param   options                  Options for the request. See type definition for more information.
     *
     * @return  An object that conforms to SwapQuote that satisfies the request. See type definition for more information.
     */
    getMarketSellSwapQuoteForAssetDataAsync(makerAssetData, takerAssetData, takerAssetSellAmount, options = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            assert_1.assert.isBigNumber('takerAssetSellAmount', takerAssetSellAmount);
            return (yield this._getSwapQuoteAsync(makerAssetData, takerAssetData, takerAssetSellAmount, types_1.MarketOperation.Sell, options));
        });
    }
    /**
     * Get a `SwapQuote` containing all information relevant to fulfilling a swap between a desired ERC20 token address and ERC20 owned by a provided address.
     * You can then pass the `SwapQuote` to a `SwapQuoteConsumer` to execute a buy, or process SwapQuote for on-chain consumption.
     * @param   makerAssetData           The makerAssetData of the desired asset to swap for (for more info: https://github.com/0xProject/0x-protocol-specification/blob/master/v2/v2-specification.md).
     * @param   takerAssetData           The takerAssetData of the asset to swap makerAssetData for (for more info: https://github.com/0xProject/0x-protocol-specification/blob/master/v2/v2-specification.md).
     * @param   makerAssetBuyAmount     The amount of maker asset to swap for.
     * @param   options                  Options for the request. See type definition for more information.
     *
     * @return  An object that conforms to SwapQuote that satisfies the request. See type definition for more information.
     */
    getMarketBuySwapQuoteForAssetDataAsync(makerAssetData, takerAssetData, makerAssetBuyAmount, options = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            assert_1.assert.isBigNumber('makerAssetBuyAmount', makerAssetBuyAmount);
            return (yield this._getSwapQuoteAsync(makerAssetData, takerAssetData, makerAssetBuyAmount, types_1.MarketOperation.Buy, options));
        });
    }
    getBatchMarketBuySwapQuoteForAssetDataAsync(makerAssetDatas, takerAssetData, makerAssetBuyAmount, options = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            makerAssetBuyAmount.map((a, i) => assert_1.assert.isBigNumber(`makerAssetBuyAmount[${i}]`, a));
            let gasPrice;
            const calculateSwapQuoteOpts = _.merge({}, constants_1.constants.DEFAULT_SWAP_QUOTE_REQUEST_OPTS, options);
            if (!!options.gasPrice) {
                gasPrice = options.gasPrice;
                assert_1.assert.isBigNumber('gasPrice', gasPrice);
            }
            else {
                gasPrice = yield this.getGasPriceEstimationOrThrowAsync();
            }
            const apiOrders = yield this.orderbook.getBatchOrdersAsync(makerAssetDatas, [takerAssetData]);
            const allOrders = apiOrders.map(orders => orders.map(o => o.order));
            const allPrunedOrders = allOrders.map((orders, i) => {
                const prunedOrders = order_prune_utils_1.orderPrunerUtils.pruneForUsableSignedOrders(orders, this.permittedOrderFeeTypes, this.expiryBufferMs);
                if (prunedOrders.length === 0) {
                    return [
                        orders_1.createDummyOrderForSampler(makerAssetDatas[i], takerAssetData, this._contractAddresses.uniswapBridge),
                    ];
                }
                else {
                    return sorting_utils_1.sortingUtils.sortOrders(prunedOrders);
                }
            });
            const swapQuotes = yield this._swapQuoteCalculator.calculateBatchMarketBuySwapQuoteAsync(allPrunedOrders, makerAssetBuyAmount, gasPrice, calculateSwapQuoteOpts);
            return swapQuotes;
        });
    }
    /**
     * Get a `SwapQuote` containing all information relevant to fulfilling a swap between a desired ERC20 token address and ERC20 owned by a provided address.
     * You can then pass the `SwapQuote` to a `SwapQuoteConsumer` to execute a buy, or process SwapQuote for on-chain consumption.
     * @param   makerTokenAddress       The address of the maker asset
     * @param   takerTokenAddress       The address of the taker asset
     * @param   makerAssetBuyAmount     The amount of maker asset to swap for.
     * @param   options                 Options for the request. See type definition for more information.
     *
     * @return  An object that conforms to SwapQuote that satisfies the request. See type definition for more information.
     */
    getMarketBuySwapQuoteAsync(makerTokenAddress, takerTokenAddress, makerAssetBuyAmount, options = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            assert_1.assert.isETHAddressHex('makerTokenAddress', makerTokenAddress);
            assert_1.assert.isETHAddressHex('takerTokenAddress', takerTokenAddress);
            assert_1.assert.isBigNumber('makerAssetBuyAmount', makerAssetBuyAmount);
            const makerAssetData = order_utils_1.assetDataUtils.encodeERC20AssetData(makerTokenAddress);
            const takerAssetData = order_utils_1.assetDataUtils.encodeERC20AssetData(takerTokenAddress);
            return this.getMarketBuySwapQuoteForAssetDataAsync(makerAssetData, takerAssetData, makerAssetBuyAmount, options);
        });
    }
    /**
     * Get a `SwapQuote` containing all information relevant to fulfilling a swap between a desired ERC20 token address and ERC20 owned by a provided address.
     * You can then pass the `SwapQuote` to a `SwapQuoteConsumer` to execute a buy, or process SwapQuote for on-chain consumption.
     * @param   makerTokenAddress       The address of the maker asset
     * @param   takerTokenAddress       The address of the taker asset
     * @param   takerAssetSellAmount     The amount of taker asset to sell.
     * @param   options                  Options for the request. See type definition for more information.
     *
     * @return  An object that conforms to SwapQuote that satisfies the request. See type definition for more information.
     */
    getMarketSellSwapQuoteAsync(makerTokenAddress, takerTokenAddress, takerAssetSellAmount, options = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            assert_1.assert.isETHAddressHex('makerTokenAddress', makerTokenAddress);
            assert_1.assert.isETHAddressHex('takerTokenAddress', takerTokenAddress);
            assert_1.assert.isBigNumber('takerAssetSellAmount', takerAssetSellAmount);
            const makerAssetData = order_utils_1.assetDataUtils.encodeERC20AssetData(makerTokenAddress);
            const takerAssetData = order_utils_1.assetDataUtils.encodeERC20AssetData(takerTokenAddress);
            return this.getMarketSellSwapQuoteForAssetDataAsync(makerAssetData, takerAssetData, takerAssetSellAmount, options);
        });
    }
    /**
     * Returns information about available liquidity for an asset
     * Does not factor in slippage or fees
     * @param   makerAssetData      The makerAssetData of the desired asset to swap for (for more info: https://github.com/0xProject/0x-protocol-specification/blob/master/v2/v2-specification.md).
     * @param   takerAssetData      The takerAssetData of the asset to swap makerAssetData for (for more info: https://github.com/0xProject/0x-protocol-specification/blob/master/v2/v2-specification.md).
     *
     * @return  An object that conforms to LiquidityForTakerMakerAssetDataPair that satisfies the request. See type definition for more information.
     */
    getLiquidityForMakerTakerAssetDataPairAsync(makerAssetData, takerAssetData) {
        return __awaiter(this, void 0, void 0, function* () {
            assert_1.assert.isString('makerAssetData', makerAssetData);
            assert_1.assert.isString('takerAssetData', takerAssetData);
            order_utils_1.assetDataUtils.decodeAssetDataOrThrow(takerAssetData);
            order_utils_1.assetDataUtils.decodeAssetDataOrThrow(makerAssetData);
            const assetPairs = yield this.getAvailableMakerAssetDatasAsync(takerAssetData);
            if (!assetPairs.includes(makerAssetData)) {
                return {
                    makerAssetAvailableInBaseUnits: new utils_1.BigNumber(0),
                    takerAssetAvailableInBaseUnits: new utils_1.BigNumber(0),
                };
            }
            const ordersWithFillableAmounts = yield this.getSignedOrdersWithFillableAmountsAsync(makerAssetData, takerAssetData);
            return calculate_liquidity_1.calculateLiquidity(ordersWithFillableAmounts);
        });
    }
    /**
     * Returns the bids and asks liquidity for the entire market.
     * For certain sources (like AMM's) it is recommended to provide a practical maximum takerAssetAmount.
     * @param   makerTokenAddress The address of the maker asset
     * @param   takerTokenAddress The address of the taker asset
     * @param   takerAssetAmount  The amount to sell and buy for the bids and asks.
     *
     * @return  An object that conforms to MarketDepth that contains all of the samples and liquidity
     *          information for the source.
     */
    getBidAskLiquidityForMakerTakerAssetPairAsync(makerTokenAddress, takerTokenAddress, takerAssetAmount, options = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            assert_1.assert.isString('makerTokenAddress', makerTokenAddress);
            assert_1.assert.isString('takerTokenAddress', takerTokenAddress);
            const makerAssetData = order_utils_1.assetDataUtils.encodeERC20AssetData(makerTokenAddress);
            const takerAssetData = order_utils_1.assetDataUtils.encodeERC20AssetData(takerTokenAddress);
            const sourceFilters = new source_filters_1.SourceFilters([], options.excludedSources, options.includedSources);
            let [sellOrders, buyOrders] = !sourceFilters.isAllowed(types_2.ERC20BridgeSource.Native)
                ? [[], []]
                : yield Promise.all([
                    this.orderbook.getOrdersAsync(makerAssetData, takerAssetData),
                    this.orderbook.getOrdersAsync(takerAssetData, makerAssetData),
                ]);
            if (!sellOrders || sellOrders.length === 0) {
                sellOrders = [
                    {
                        metaData: {},
                        order: orders_1.createDummyOrderForSampler(makerAssetData, takerAssetData, this._contractAddresses.uniswapBridge),
                    },
                ];
            }
            if (!buyOrders || buyOrders.length === 0) {
                buyOrders = [
                    {
                        metaData: {},
                        order: orders_1.createDummyOrderForSampler(takerAssetData, makerAssetData, this._contractAddresses.uniswapBridge),
                    },
                ];
            }
            const getMarketDepthSide = (marketSideLiquidity) => {
                const { dexQuotes, nativeOrders, orderFillableAmounts, side } = marketSideLiquidity;
                return [
                    ...dexQuotes,
                    nativeOrders.map((o, i) => {
                        // When sell order fillable amount is taker
                        // When buy order fillable amount is maker
                        const scaleFactor = orderFillableAmounts[i].div(side === types_1.MarketOperation.Sell ? o.takerAssetAmount : o.makerAssetAmount);
                        return {
                            input: (side === types_1.MarketOperation.Sell ? o.takerAssetAmount : o.makerAssetAmount)
                                .times(scaleFactor)
                                .integerValue(),
                            output: (side === types_1.MarketOperation.Sell ? o.makerAssetAmount : o.takerAssetAmount)
                                .times(scaleFactor)
                                .integerValue(),
                            fillData: o,
                            source: types_2.ERC20BridgeSource.Native,
                        };
                    }),
                ];
            };
            const [bids, asks] = yield Promise.all([
                this._marketOperationUtils.getMarketBuyLiquidityAsync((buyOrders || []).map(o => o.order), takerAssetAmount, options),
                this._marketOperationUtils.getMarketSellLiquidityAsync((sellOrders || []).map(o => o.order), takerAssetAmount, options),
            ]);
            return {
                bids: getMarketDepthSide(bids),
                asks: getMarketDepthSide(asks),
            };
        });
    }
    /**
     * Get the asset data of all assets that can be used to purchase makerAssetData in the order provider passed in at init.
     *
     * @return  An array of asset data strings that can purchase makerAssetData.
     */
    getAvailableTakerAssetDatasAsync(makerAssetData) {
        return __awaiter(this, void 0, void 0, function* () {
            assert_1.assert.isString('makerAssetData', makerAssetData);
            order_utils_1.assetDataUtils.decodeAssetDataOrThrow(makerAssetData);
            const allAssetPairs = yield this.orderbook.getAvailableAssetDatasAsync();
            const assetPairs = allAssetPairs
                .filter(pair => pair.assetDataA.assetData === makerAssetData)
                .map(pair => pair.assetDataB.assetData);
            return assetPairs;
        });
    }
    /**
     * Get the asset data of all assets that are purchaseable with takerAssetData in the order provider passed in at init.
     *
     * @return  An array of asset data strings that are purchaseable with takerAssetData.
     */
    getAvailableMakerAssetDatasAsync(takerAssetData) {
        return __awaiter(this, void 0, void 0, function* () {
            assert_1.assert.isString('takerAssetData', takerAssetData);
            order_utils_1.assetDataUtils.decodeAssetDataOrThrow(takerAssetData);
            const allAssetPairs = yield this.orderbook.getAvailableAssetDatasAsync();
            const assetPairs = allAssetPairs
                .filter(pair => pair.assetDataB.assetData === takerAssetData)
                .map(pair => pair.assetDataA.assetData);
            return assetPairs;
        });
    }
    /**
     * Validates the taker + maker asset pair is available from the order provider provided to `SwapQuote`.
     * @param   makerAssetData      The makerAssetData of the desired asset to swap for (for more info: https://github.com/0xProject/0x-protocol-specification/blob/master/v2/v2-specification.md).
     * @param   takerAssetData      The takerAssetData of the asset to swap makerAssetData for (for more info: https://github.com/0xProject/0x-protocol-specification/blob/master/v2/v2-specification.md).
     *
     * @return  A boolean on if the taker, maker pair exists
     */
    isTakerMakerAssetDataPairAvailableAsync(makerAssetData, takerAssetData) {
        return __awaiter(this, void 0, void 0, function* () {
            assert_1.assert.isString('makerAssetData', makerAssetData);
            assert_1.assert.isString('takerAssetData', takerAssetData);
            order_utils_1.assetDataUtils.decodeAssetDataOrThrow(takerAssetData);
            order_utils_1.assetDataUtils.decodeAssetDataOrThrow(makerAssetData);
            const availableMakerAssetDatas = yield this.getAvailableMakerAssetDatasAsync(takerAssetData);
            return _.includes(availableMakerAssetDatas, makerAssetData);
        });
    }
    /**
     * Grab orders from the order provider, prunes for valid orders with provided OrderPruner options
     * @param   makerAssetData      The makerAssetData of the desired asset to swap for (for more info: https://github.com/0xProject/0x-protocol-specification/blob/master/v2/v2-specification.md).
     * @param   takerAssetData      The takerAssetData of the asset to swap makerAssetData for (for more info: https://github.com/0xProject/0x-protocol-specification/blob/master/v2/v2-specification.md).
     */
    getSignedOrdersWithFillableAmountsAsync(makerAssetData, takerAssetData) {
        return __awaiter(this, void 0, void 0, function* () {
            assert_1.assert.isString('makerAssetData', makerAssetData);
            assert_1.assert.isString('takerAssetData', takerAssetData);
            order_utils_1.assetDataUtils.decodeAssetDataOrThrow(takerAssetData);
            order_utils_1.assetDataUtils.decodeAssetDataOrThrow(makerAssetData);
            // get orders
            const apiOrders = yield this.orderbook.getOrdersAsync(makerAssetData, takerAssetData);
            const orders = _.map(apiOrders, o => o.order);
            const prunedOrders = order_prune_utils_1.orderPrunerUtils.pruneForUsableSignedOrders(orders, this.permittedOrderFeeTypes, this.expiryBufferMs);
            const sortedPrunedOrders = sorting_utils_1.sortingUtils.sortOrders(prunedOrders);
            const ordersWithFillableAmounts = yield this._orderStateUtils.getSignedOrdersWithFillableAmountsAsync(sortedPrunedOrders);
            return ordersWithFillableAmounts;
        });
    }
    /**
     * Util function to check if takerAddress's allowance is enough for 0x exchange contracts to conduct the swap specified by the swapQuote.
     * @param swapQuote The swapQuote in question to check enough allowance enabled for 0x exchange contracts to conduct the swap.
     * @param takerAddress The address of the taker of the provided swapQuote
     */
    isSwapQuoteFillableByTakerAddressAsync(swapQuote, takerAddress) {
        return __awaiter(this, void 0, void 0, function* () {
            const balanceAndAllowance = yield this._devUtilsContract
                .getBalanceAndAssetProxyAllowance(takerAddress, swapQuote.takerAssetData)
                .callAsync();
            return [
                balanceAndAllowance[1].isGreaterThanOrEqualTo(swapQuote.bestCaseQuoteInfo.totalTakerAssetAmount),
                balanceAndAllowance[1].isGreaterThanOrEqualTo(swapQuote.worstCaseQuoteInfo.totalTakerAssetAmount),
            ];
        });
    }
    /**
     * Returns the recommended gas price for a fast transaction
     */
    getGasPriceEstimationOrThrowAsync() {
        return __awaiter(this, void 0, void 0, function* () {
            return this._protocolFeeUtils.getGasPriceEstimationOrThrowAsync();
        });
    }
    /**
     * Destroys any subscriptions or connections.
     */
    destroyAsync() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this._protocolFeeUtils.destroyAsync();
            yield this.orderbook.destroyAsync();
        });
    }
    /**
     * Utility function to get assetData for Ether token.
     */
    getEtherTokenAssetDataOrThrowAsync() {
        return __awaiter(this, void 0, void 0, function* () {
            return order_utils_1.assetDataUtils.encodeERC20AssetData(this._contractAddresses.etherToken);
        });
    }
    /**
     * Grab orders from the order provider, prunes for valid orders with provided OrderPruner options
     * @param   makerAssetData      The makerAssetData of the desired asset to swap for (for more info: https://github.com/0xProject/0x-protocol-specification/blob/master/v2/v2-specification.md).
     * @param   takerAssetData      The takerAssetData of the asset to swap makerAssetData for (for more info: https://github.com/0xProject/0x-protocol-specification/blob/master/v2/v2-specification.md).
     */
    _getSignedOrdersAsync(makerAssetData, takerAssetData) {
        return __awaiter(this, void 0, void 0, function* () {
            assert_1.assert.isString('makerAssetData', makerAssetData);
            assert_1.assert.isString('takerAssetData', takerAssetData);
            order_utils_1.assetDataUtils.decodeAssetDataOrThrow(takerAssetData);
            order_utils_1.assetDataUtils.decodeAssetDataOrThrow(makerAssetData);
            // get orders
            const apiOrders = yield this.orderbook.getOrdersAsync(makerAssetData, takerAssetData);
            const orders = _.map(apiOrders, o => o.order);
            const prunedOrders = order_prune_utils_1.orderPrunerUtils.pruneForUsableSignedOrders(orders, this.permittedOrderFeeTypes, this.expiryBufferMs);
            return prunedOrders;
        });
    }
    /**
     * General function for getting swap quote, conditionally uses different logic per specified marketOperation
     */
    _getSwapQuoteAsync(makerAssetData, takerAssetData, assetFillAmount, marketOperation, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const opts = _.merge({}, constants_1.constants.DEFAULT_SWAP_QUOTE_REQUEST_OPTS, options);
            assert_1.assert.isString('makerAssetData', makerAssetData);
            assert_1.assert.isString('takerAssetData', takerAssetData);
            let gasPrice;
            if (!!opts.gasPrice) {
                gasPrice = opts.gasPrice;
                assert_1.assert.isBigNumber('gasPrice', gasPrice);
            }
            else {
                gasPrice = yield this.getGasPriceEstimationOrThrowAsync();
            }
            const sourceFilters = new source_filters_1.SourceFilters([], opts.excludedSources, opts.includedSources);
            // If RFQT is enabled and `nativeExclusivelyRFQT` is set, then `ERC20BridgeSource.Native` should
            // never be excluded.
            if (opts.rfqt &&
                opts.rfqt.nativeExclusivelyRFQT === true &&
                !sourceFilters.isAllowed(types_2.ERC20BridgeSource.Native)) {
                throw new Error('Native liquidity cannot be excluded if "rfqt.nativeExclusivelyRFQT" is set');
            }
            // get batches of orders from different sources, awaiting sources in parallel
            const orderBatchPromises = [];
            const skipOpenOrderbook = !sourceFilters.isAllowed(types_2.ERC20BridgeSource.Native) ||
                (opts.rfqt && opts.rfqt.nativeExclusivelyRFQT === true);
            if (!skipOpenOrderbook) {
                orderBatchPromises.push(this._getSignedOrdersAsync(makerAssetData, takerAssetData)); // order book
            }
            const rfqtOptions = this._rfqtOptions;
            const quoteRequestor = new quote_requestor_1.QuoteRequestor(rfqtOptions ? rfqtOptions.makerAssetOfferings || {} : {}, rfqtOptions ? rfqtOptions.warningLogger : undefined, rfqtOptions ? rfqtOptions.infoLogger : undefined, this.expiryBufferMs);
            if (opts.rfqt && // This is an RFQT-enabled API request
                opts.rfqt.intentOnFilling && // The requestor is asking for a firm quote
                opts.rfqt.apiKey &&
                this._isApiKeyWhitelisted(opts.rfqt.apiKey) && // A valid API key was provided
                sourceFilters.isAllowed(types_2.ERC20BridgeSource.Native) // Native liquidity is not excluded
            ) {
                if (!opts.rfqt.takerAddress || opts.rfqt.takerAddress === constants_1.constants.NULL_ADDRESS) {
                    throw new Error('RFQ-T requests must specify a taker address');
                }
                orderBatchPromises.push(quoteRequestor
                    .requestRfqtFirmQuotesAsync(makerAssetData, takerAssetData, assetFillAmount, marketOperation, opts.rfqt)
                    .then(firmQuotes => firmQuotes.map(quote => quote.signedOrder)));
            }
            const orderBatches = yield Promise.all(orderBatchPromises);
            const unsortedOrders = orderBatches.reduce((_orders, batch) => _orders.concat(...batch), []);
            const orders = sorting_utils_1.sortingUtils.sortOrders(unsortedOrders);
            // if no native orders, pass in a dummy order for the sampler to have required metadata for sampling
            if (orders.length === 0) {
                orders.push(orders_1.createDummyOrderForSampler(makerAssetData, takerAssetData, this._contractAddresses.uniswapBridge));
            }
            let swapQuote;
            const calcOpts = opts;
            if (calcOpts.rfqt !== undefined) {
                calcOpts.rfqt.quoteRequestor = quoteRequestor;
            }
            if (marketOperation === types_1.MarketOperation.Buy) {
                swapQuote = yield this._swapQuoteCalculator.calculateMarketBuySwapQuoteAsync(orders, assetFillAmount, gasPrice, calcOpts);
            }
            else {
                swapQuote = yield this._swapQuoteCalculator.calculateMarketSellSwapQuoteAsync(orders, assetFillAmount, gasPrice, calcOpts);
            }
            return swapQuote;
        });
    }
    _isApiKeyWhitelisted(apiKey) {
        const whitelistedApiKeys = this._rfqtOptions ? this._rfqtOptions.takerApiKeyWhitelist : [];
        return whitelistedApiKeys.includes(apiKey);
    }
}
exports.SwapQuoter = SwapQuoter;
// tslint:disable-next-line: max-file-line-count
//# sourceMappingURL=swap_quoter_BASE_86434.js.map