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
// tslint:disable
const subproviders_1 = require("@0x/subproviders");
const utils_1 = require("@0x/utils");
const web3_wrapper_1 = require("@0x/web3-wrapper");
const swap_quoter_1 = require("./swap_quoter");
const index_1 = require("./index");
// import { NativeOrderSource } from './utils/quote_reporter';
// import { QuoteReporter, QuoteReport } from './utils/quote_reporter';
const apiKey = 'c695b154-2296-441f-9785-115c6b2df24e';
const takerAddress = '0x8B58750df7D41F91a281A496e160A827fdc4De0A';
const buyTokenAddress = '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48'; // USDC
const sellTokenAddress = '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2'; // WETH
const sellAmount = 1;
const sellTokenDecimals = 18;
const buyAmount = 50;
const buyTokenDecimals = 6;
exports.PROTOCOL_FEE_MULTIPLIER = new index_1.BigNumber(70000);
// Params to emulate 0x API params
exports.GAS_SCHEDULE_V0 = {
    [index_1.ERC20BridgeSource.Native]: () => 1.5e5,
    [index_1.ERC20BridgeSource.Uniswap]: () => 3e5,
    [index_1.ERC20BridgeSource.LiquidityProvider]: () => 3e5,
    [index_1.ERC20BridgeSource.Eth2Dai]: () => 5.5e5,
    [index_1.ERC20BridgeSource.Kyber]: () => 8e5,
    [index_1.ERC20BridgeSource.Curve]: fillData => {
        switch (fillData.curve.poolAddress.toLowerCase()) {
            case '0xa2b47e3d5c44877cca798226b7b8118f9bfb7a56':
            case '0x52ea46506b9cc5ef470c5bf89f17dc28bb35d85c':
                return 9e5;
            case '0x45f783cce6b7ff23b2ab2d70e416cdb7d6055f51':
            case '0x79a8c46dea5ada233abaffd40f3a0a2b1e5a4f27':
                return 10e5;
            case '0xa5407eae9ba41422680e2e00537571bcc53efbfd':
            case '0x93054188d876f558f4a66b2ef1d97d16edf0895b':
            case '0x7fc77b5c7614e1533320ea6ddc2eb61fa00a9714':
                return 6e5;
            default:
                throw new Error('Unrecognized Curve address');
        }
    },
    [index_1.ERC20BridgeSource.MultiBridge]: () => 6.5e5,
    [index_1.ERC20BridgeSource.UniswapV2]: fillData => {
        let gas = 3e5;
        if (fillData.tokenAddressPath.length > 2) {
            gas += 5e4;
        }
        return gas;
    },
    [index_1.ERC20BridgeSource.Balancer]: () => 4.5e5,
};
const FEE_SCHEDULE_V0 = Object.assign({}, ...Object.keys(exports.GAS_SCHEDULE_V0).map(k => ({
    [k]: (fillData) => exports.PROTOCOL_FEE_MULTIPLIER.plus(exports.GAS_SCHEDULE_V0[k](fillData)),
})));
exports.GAS_SCHEDULE_V1 = Object.assign({}, exports.GAS_SCHEDULE_V0);
const FEE_SCHEDULE_V1 = Object.assign({}, ...Object.keys(exports.GAS_SCHEDULE_V0).map(k => ({
    [k]: k === index_1.ERC20BridgeSource.Native
        ? (fillData) => exports.PROTOCOL_FEE_MULTIPLIER.plus(exports.GAS_SCHEDULE_V1[k](fillData))
        : (fillData) => exports.GAS_SCHEDULE_V1[k](fillData),
})));
const DEFAULT_QUOTE_SLIPPAGE_PERCENTAGE = 0.03; // 3% Slippage
const DEFAULT_FALLBACK_SLIPPAGE_PERCENTAGE = 0.015; // 1.5% Slippage in a fallback route
exports.ASSET_SWAPPER_MARKET_ORDERS_OPTS = {
    excludedSources: [],
    bridgeSlippage: DEFAULT_QUOTE_SLIPPAGE_PERCENTAGE,
    maxFallbackSlippage: DEFAULT_FALLBACK_SLIPPAGE_PERCENTAGE,
    numSamples: 13,
    sampleDistributionBase: 1.05,
    feeSchedule: FEE_SCHEDULE_V0,
    gasSchedule: exports.GAS_SCHEDULE_V0,
};
exports.ASSET_SWAPPER_MARKET_ORDERS_V1_OPTS = {
    excludedSources: [],
    bridgeSlippage: DEFAULT_QUOTE_SLIPPAGE_PERCENTAGE,
    maxFallbackSlippage: DEFAULT_FALLBACK_SLIPPAGE_PERCENTAGE,
    numSamples: 13,
    sampleDistributionBase: 1.05,
    feeSchedule: FEE_SCHEDULE_V1,
    gasSchedule: exports.GAS_SCHEDULE_V1,
    shouldBatchBridgeOrders: false,
    runLimit: Math.pow(2, 8),
};
const getQuoter = () => {
    const providerEngine = new subproviders_1.Web3ProviderEngine();
    providerEngine.addProvider(new subproviders_1.RPCSubprovider('https://eth-mainnet.alchemyapi.io/v2/xV8dg5YmFyi1EvKnDzQdwB4W3_FM3P-H'));
    utils_1.providerUtils.startProviderEngine(providerEngine);
    const web3Wrapper = new web3_wrapper_1.Web3Wrapper(providerEngine);
    const quoter = swap_quoter_1.SwapQuoter.getSwapQuoterForStandardRelayerAPIUrl(web3Wrapper.getProvider(), 'https://api.0x.org/sra/', {
        chainId: 1,
        rfqt: {
            makerAssetOfferings: {
                'https://eth-usdc.rfqt.net': [
                    ['0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48', '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2'],
                ],
                'https://eth-usdc.pscope.xyz': [
                    ['0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48', '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2'],
                ],
            },
            takerApiKeyWhitelist: [apiKey],
        },
    });
    return quoter;
};
const go = () => __awaiter(this, void 0, void 0, function* () {
    const quoter = getQuoter();
    const theQuote = yield quoter.getMarketSellSwapQuoteAsync(buyTokenAddress, sellTokenAddress, web3_wrapper_1.Web3Wrapper.toBaseUnitAmount(sellAmount, sellTokenDecimals), Object.assign({}, exports.ASSET_SWAPPER_MARKET_ORDERS_V1_OPTS, { rfqt: { apiKey: apiKey, intentOnFilling: true, isIndicative: false, takerAddress: takerAddress }, shouldGenerateQuoteReport: true }));
    console.log('sellQuote received');
    // const theQuote = await quoter.getMarketBuySwapQuoteAsync(
    //     buyTokenAddress,
    //     sellTokenAddress,
    //     Web3Wrapper.toBaseUnitAmount(buyAmount, buyTokenDecimals),
    //     {
    //         ...ASSET_SWAPPER_MARKET_ORDERS_OPTS,
    //         rfqt: { apiKey: apiKey, intentOnFilling: true, isIndicative: false, takerAddress: takerAddress },
    //     },
    // );
    // console.log('buyQuote received');
    const quoteReport = theQuote.quoteReport;
    if (!quoteReport) {
        console.error('no quote report');
        return;
    }
    const sources = quoteReport.sourcesConsidered.map(sc => {
        const nativeOrderInfo = sc.liquiditySource === index_1.ERC20BridgeSource.Native
            ? { isRfqt: sc.isRfqt, makerAddress: sc.nativeOrder.makerAddress }
            : undefined;
        return {
            makerAmount: sc.makerAmount,
            takerAmount: sc.takerAmount,
            liquiditySource: sc.liquiditySource,
            nativeOrderInfo,
            rawSc: sc,
        };
    });
    console.log('sources', sources);
    console.log('any rfqt sources?', sources.filter(s => (s.nativeOrderInfo ? s.nativeOrderInfo.isRfqt : false)));
    console.log('delivered', quoteReport.sourcesDelivered);
    console.log('total quote report:::');
    console.log('--------------------------');
    console.log(JSON.stringify(quoteReport, undefined, 2));
    // console.log(
    //     'pathGenerated:',
    //     quoteReport &&
    //     quoteReport.sourcesDelivered.map(po => {
    //         console.log(po);
    //         return {
    //             ...po,
    //             priceOne: new BigNumber(po.makerAmount).div(po.takerAmount).dp(2),
    //             priceTwo: new BigNumber(po.takerAmount).div(po.makerAmount).dp(2),
    //         };
    //     }),
    // );
    // const firstFillInfo = quoteReport && (quoteReport.paths[0].subFills[0] as any);
    // console.log('subfills', quoteReport && quoteReport.paths[0].subFills.length);
    // console.log('first fill', firstFillInfo.fillData);
    // console.log(JSON.stringify(sellQuote, undefined, 2));
});
go()
    .then(() => {
    console.log('done');
    process.exit();
})
    .catch(e => {
    console.log('error');
    console.error(e);
    process.exit();
});
//# sourceMappingURL=demo.js.map