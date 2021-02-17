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
const contracts_test_utils_1 = require("@0x/contracts-test-utils");
const protocol_utils_1 = require("@0x/protocol-utils");
const utils_1 = require("@0x/utils");
const _ = require("lodash");
const src_1 = require("../../src");
const artifacts_1 = require("../artifacts");
const wrappers_1 = require("../wrappers");
// tslint:disable: custom-no-magic-numbers
const { NULL_ADDRESS } = contracts_test_utils_1.constants;
contracts_test_utils_1.blockchainTests('erc20-bridge-sampler', env => {
    let testContract;
    const RATE_DENOMINATOR = contracts_test_utils_1.constants.ONE_ETHER;
    const MIN_RATE = new utils_1.BigNumber('0.01');
    const MAX_RATE = new utils_1.BigNumber('100');
    const MIN_DECIMALS = 4;
    const MAX_DECIMALS = 20;
    const WETH_ADDRESS = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2';
    const KYBER_SALT = '0x0ff3ca9d46195c39f9a12afb74207b4970349fb3cfb1e459bbf170298d326bc7';
    const ETH2DAI_SALT = '0xb713b61bb9bb2958a0f5d1534b21e94fc68c4c0c034b0902ed844f2f6cd1b4f7';
    const UNISWAP_BASE_SALT = '0x1d6a6a0506b0b4a554b907a4c29d9f4674e461989d9c1921feb17b26716385ab';
    const UNISWAP_V2_SALT = '0xadc7fcb33c735913b8635927e66896b356a53a912ab2ceff929e60a04b53b3c1';
    let UNISWAP_V2_ROUTER = '';
    const INVALID_TOKEN_PAIR_ERROR = 'ERC20BridgeSampler/INVALID_TOKEN_PAIR';
    const MAKER_TOKEN = contracts_test_utils_1.randomAddress();
    const TAKER_TOKEN = contracts_test_utils_1.randomAddress();
    const INTERMEDIATE_TOKEN = contracts_test_utils_1.randomAddress();
    const KYBER_RESERVE_OFFSET = new utils_1.BigNumber(0);
    before(() => __awaiter(this, void 0, void 0, function* () {
        testContract = yield wrappers_1.TestERC20BridgeSamplerContract.deployFrom0xArtifactAsync(artifacts_1.artifacts.TestERC20BridgeSampler, env.provider, env.txDefaults, {});
        UNISWAP_V2_ROUTER = yield testContract.uniswapV2Router().callAsync();
    }));
    function getPackedHash(...args) {
        return utils_1.hexUtils.hash(utils_1.hexUtils.concat(...args.map(a => utils_1.hexUtils.toHex(a))));
    }
    function getUniswapExchangeSalt(tokenAddress) {
        return getPackedHash(UNISWAP_BASE_SALT, tokenAddress);
    }
    function getDeterministicRate(salt, sellToken, buyToken) {
        const hash = getPackedHash(salt, sellToken, buyToken);
        const _minRate = RATE_DENOMINATOR.times(MIN_RATE);
        const _maxRate = RATE_DENOMINATOR.times(MAX_RATE);
        return new utils_1.BigNumber(hash)
            .mod(_maxRate.minus(_minRate))
            .plus(_minRate)
            .div(RATE_DENOMINATOR);
    }
    function getDeterministicTokenDecimals(token) {
        if (token === WETH_ADDRESS) {
            return 18;
        }
        // HACK(dorothy-zbornak): Linter will complain about the addition not being
        // between two numbers, even though they are.
        // tslint:disable-next-line restrict-plus-operands
        return new utils_1.BigNumber(getPackedHash(token)).mod(MAX_DECIMALS - MIN_DECIMALS).toNumber() + MIN_DECIMALS;
    }
    function getDeterministicSellQuote(salt, sellToken, buyToken, sellAmount) {
        const sellBase = new utils_1.BigNumber(10).pow(getDeterministicTokenDecimals(sellToken));
        const buyBase = new utils_1.BigNumber(10).pow(getDeterministicTokenDecimals(buyToken));
        const rate = getDeterministicRate(salt, sellToken, buyToken);
        return sellAmount
            .times(rate)
            .times(buyBase)
            .dividedToIntegerBy(sellBase);
    }
    function getDeterministicBuyQuote(salt, sellToken, buyToken, buyAmount) {
        const sellBase = new utils_1.BigNumber(10).pow(getDeterministicTokenDecimals(sellToken));
        const buyBase = new utils_1.BigNumber(10).pow(getDeterministicTokenDecimals(buyToken));
        const rate = getDeterministicRate(salt, sellToken, buyToken);
        return buyAmount
            .times(sellBase)
            .dividedToIntegerBy(rate)
            .dividedToIntegerBy(buyBase);
    }
    function areAddressesEqual(a, b) {
        return a.toLowerCase() === b.toLowerCase();
    }
    function getDeterministicUniswapSellQuote(sellToken, buyToken, sellAmount) {
        if (areAddressesEqual(buyToken, WETH_ADDRESS)) {
            return getDeterministicSellQuote(getUniswapExchangeSalt(sellToken), sellToken, WETH_ADDRESS, sellAmount);
        }
        if (areAddressesEqual(sellToken, WETH_ADDRESS)) {
            return getDeterministicSellQuote(getUniswapExchangeSalt(buyToken), buyToken, WETH_ADDRESS, sellAmount);
        }
        const ethBought = getDeterministicSellQuote(getUniswapExchangeSalt(sellToken), sellToken, WETH_ADDRESS, sellAmount);
        return getDeterministicSellQuote(getUniswapExchangeSalt(buyToken), buyToken, WETH_ADDRESS, ethBought);
    }
    function getDeterministicUniswapBuyQuote(sellToken, buyToken, buyAmount) {
        if (areAddressesEqual(buyToken, WETH_ADDRESS)) {
            return getDeterministicBuyQuote(getUniswapExchangeSalt(sellToken), WETH_ADDRESS, sellToken, buyAmount);
        }
        if (areAddressesEqual(sellToken, WETH_ADDRESS)) {
            return getDeterministicBuyQuote(getUniswapExchangeSalt(buyToken), WETH_ADDRESS, buyToken, buyAmount);
        }
        const ethSold = getDeterministicBuyQuote(getUniswapExchangeSalt(buyToken), WETH_ADDRESS, buyToken, buyAmount);
        return getDeterministicBuyQuote(getUniswapExchangeSalt(sellToken), WETH_ADDRESS, sellToken, ethSold);
    }
    function getDeterministicSellQuotes(sellToken, buyToken, sources, sampleAmounts) {
        const quotes = [];
        for (const source of sources) {
            const sampleOutputs = [];
            for (const amount of sampleAmounts) {
                if (source === 'Kyber' || source === 'Eth2Dai') {
                    sampleOutputs.push(getDeterministicSellQuote(source === 'Kyber' ? KYBER_SALT : ETH2DAI_SALT, sellToken, buyToken, amount));
                }
                else if (source === 'Uniswap') {
                    sampleOutputs.push(getDeterministicUniswapSellQuote(sellToken, buyToken, amount));
                }
            }
            quotes.push(sampleOutputs);
        }
        return quotes;
    }
    function getDeterministicBuyQuotes(sellToken, buyToken, sources, sampleAmounts) {
        const quotes = [];
        for (const source of sources) {
            const sampleOutputs = [];
            for (const amount of sampleAmounts) {
                if (source === 'Kyber' || source === 'Eth2Dai') {
                    sampleOutputs.push(getDeterministicBuyQuote(source === 'Kyber' ? KYBER_SALT : ETH2DAI_SALT, sellToken, buyToken, amount));
                }
                else if (source === 'Uniswap') {
                    sampleOutputs.push(getDeterministicUniswapBuyQuote(sellToken, buyToken, amount));
                }
            }
            quotes.push(sampleOutputs);
        }
        return quotes;
    }
    function getDeterministicUniswapV2SellQuote(path, sellAmount) {
        let bought = sellAmount;
        for (let i = 0; i < path.length - 1; ++i) {
            bought = getDeterministicSellQuote(UNISWAP_V2_SALT, path[i], path[i + 1], bought);
        }
        return bought;
    }
    function getDeterministicUniswapV2BuyQuote(path, buyAmount) {
        let sold = buyAmount;
        for (let i = path.length - 1; i > 0; --i) {
            sold = getDeterministicBuyQuote(UNISWAP_V2_SALT, path[i - 1], path[i], sold);
        }
        return sold;
    }
    function getDeterministicFillableTakerAssetAmount(order) {
        const hash = getPackedHash(utils_1.hexUtils.leftPad(order.order.salt));
        return new utils_1.BigNumber(hash).mod(order.order.takerAmount);
    }
    function getDeterministicFillableMakerAssetAmount(order) {
        const takerAmount = getDeterministicFillableTakerAssetAmount(order);
        return order.order.makerAmount
            .times(takerAmount)
            .div(order.order.takerAmount)
            .integerValue(utils_1.BigNumber.ROUND_UP);
    }
    function getSampleAmounts(tokenAddress, count) {
        const tokenDecimals = getDeterministicTokenDecimals(tokenAddress);
        const _upperLimit = contracts_test_utils_1.getRandomPortion(contracts_test_utils_1.getRandomInteger(1000, 50000).times(Math.pow(10, tokenDecimals)));
        const _count = count || _.random(1, 16);
        const d = _upperLimit.div(_count);
        return _.times(_count, i => d.times((i + 1) / _count).integerValue());
    }
    function createOrder(makerToken, takerToken) {
        return {
            order: {
                chainId: 1337,
                verifyingContract: contracts_test_utils_1.randomAddress(),
                maker: contracts_test_utils_1.randomAddress(),
                taker: contracts_test_utils_1.randomAddress(),
                pool: utils_1.NULL_BYTES,
                sender: NULL_ADDRESS,
                feeRecipient: contracts_test_utils_1.randomAddress(),
                makerAmount: contracts_test_utils_1.getRandomInteger(1, 1e18),
                takerAmount: contracts_test_utils_1.getRandomInteger(1, 1e18),
                takerTokenFeeAmount: contracts_test_utils_1.getRandomInteger(1, 1e18),
                makerToken,
                takerToken,
                salt: new utils_1.BigNumber(utils_1.hexUtils.random()),
                expiry: contracts_test_utils_1.getRandomInteger(0, Math.pow(2, 32)),
            },
            signature: { v: 1, r: utils_1.NULL_BYTES, s: utils_1.NULL_BYTES, signatureType: protocol_utils_1.SignatureType.EthSign },
            type: src_1.FillQuoteTransformerOrderType.Limit,
        };
    }
    function createOrders(makerToken, takerToken, count) {
        return _.times(count || _.random(1, 16), () => createOrder(makerToken, takerToken));
    }
    function enableFailTriggerAsync() {
        return __awaiter(this, void 0, void 0, function* () {
            yield testContract.enableFailTrigger().awaitTransactionSuccessAsync({ value: 1 });
        });
    }
    function expectQuotesWithinRange(quotes, expectedQuotes, maxSlippage) {
        quotes.forEach((_q, i) => {
            // If we're within 1 base unit of a low decimal token
            // then that's as good as we're going to get (and slippage is "high")
            if (expectedQuotes[i].isZero() ||
                utils_1.BigNumber.max(expectedQuotes[i], quotes[i])
                    .minus(utils_1.BigNumber.min(expectedQuotes[i], quotes[i]))
                    .eq(1)) {
                return;
            }
            const slippage = quotes[i]
                .dividedBy(expectedQuotes[i])
                .minus(1)
                .decimalPlaces(4);
            contracts_test_utils_1.expect(slippage, `quote[${i}]: ${slippage} ${quotes[i]} ${expectedQuotes[i]}`).to.be.bignumber.gte(0);
            contracts_test_utils_1.expect(slippage, `quote[${i}] ${slippage} ${quotes[i]} ${expectedQuotes[i]}`).to.be.bignumber.lte(new utils_1.BigNumber(maxSlippage));
        });
    }
    describe('getOrderFillableTakerAssetAmounts()', () => {
        it('returns the expected amount for each order', () => __awaiter(this, void 0, void 0, function* () {
            const orders = createOrders(MAKER_TOKEN, TAKER_TOKEN);
            const expected = orders.map(getDeterministicFillableTakerAssetAmount);
            const actual = yield testContract
                .getLimitOrderFillableTakerAssetAmounts(
            // tslint:disable-next-line:no-unnecessary-type-assertion
            orders.map(o => o.order), orders.map(o => o.signature), NULL_ADDRESS)
                .callAsync();
            contracts_test_utils_1.expect(actual).to.deep.eq(expected);
        }));
        it('returns empty for no orders', () => __awaiter(this, void 0, void 0, function* () {
            const actual = yield testContract.getLimitOrderFillableTakerAssetAmounts([], [], NULL_ADDRESS).callAsync();
            contracts_test_utils_1.expect(actual).to.deep.eq([]);
        }));
    });
    describe('getOrderFillableMakerAssetAmounts()', () => {
        it('returns the expected amount for each order', () => __awaiter(this, void 0, void 0, function* () {
            const orders = createOrders(MAKER_TOKEN, TAKER_TOKEN);
            const expected = orders.map(getDeterministicFillableMakerAssetAmount);
            const actual = yield testContract
                .getLimitOrderFillableMakerAssetAmounts(
            // tslint:disable-next-line:no-unnecessary-type-assertion
            orders.map(o => o.order), orders.map(o => o.signature), NULL_ADDRESS)
                .callAsync();
            contracts_test_utils_1.expect(actual).to.deep.eq(expected);
        }));
        it('returns empty for no orders', () => __awaiter(this, void 0, void 0, function* () {
            const actual = yield testContract.getLimitOrderFillableMakerAssetAmounts([], [], NULL_ADDRESS).callAsync();
            contracts_test_utils_1.expect(actual).to.deep.eq([]);
        }));
    });
    contracts_test_utils_1.blockchainTests.resets('sampleSellsFromKyberNetwork()', () => {
        before(() => __awaiter(this, void 0, void 0, function* () {
            yield testContract.createTokenExchanges([MAKER_TOKEN, TAKER_TOKEN]).awaitTransactionSuccessAsync();
        }));
        it('throws if tokens are the same', () => __awaiter(this, void 0, void 0, function* () {
            const tx = testContract
                .sampleSellsFromKyberNetwork(KYBER_RESERVE_OFFSET, MAKER_TOKEN, MAKER_TOKEN, [])
                .callAsync();
            return contracts_test_utils_1.expect(tx).to.revertWith(INVALID_TOKEN_PAIR_ERROR);
        }));
        it('can return no quotes', () => __awaiter(this, void 0, void 0, function* () {
            const [, , quotes] = yield testContract
                .sampleSellsFromKyberNetwork(KYBER_RESERVE_OFFSET, TAKER_TOKEN, MAKER_TOKEN, [])
                .callAsync();
            contracts_test_utils_1.expect(quotes).to.deep.eq([]);
        }));
        it('returns zero if token -> token fails', () => __awaiter(this, void 0, void 0, function* () {
            const sampleAmounts = getSampleAmounts(TAKER_TOKEN);
            const expectedQuotes = _.times(sampleAmounts.length, () => contracts_test_utils_1.constants.ZERO_AMOUNT);
            yield enableFailTriggerAsync();
            const [, , quotes] = yield testContract
                .sampleSellsFromKyberNetwork(KYBER_RESERVE_OFFSET, TAKER_TOKEN, MAKER_TOKEN, sampleAmounts)
                .callAsync();
            contracts_test_utils_1.expect(quotes).to.deep.eq(expectedQuotes);
        }));
        it('can quote token -> ETH', () => __awaiter(this, void 0, void 0, function* () {
            const sampleAmounts = getSampleAmounts(TAKER_TOKEN);
            const [expectedQuotes] = getDeterministicSellQuotes(TAKER_TOKEN, WETH_ADDRESS, ['Kyber'], sampleAmounts);
            const [, , quotes] = yield testContract
                .sampleSellsFromKyberNetwork(KYBER_RESERVE_OFFSET, TAKER_TOKEN, WETH_ADDRESS, sampleAmounts)
                .callAsync();
            contracts_test_utils_1.expect(quotes).to.deep.eq(expectedQuotes);
        }));
        it('can quote token -> token', () => __awaiter(this, void 0, void 0, function* () {
            const sampleAmounts = getSampleAmounts(TAKER_TOKEN);
            const [expectedQuotes] = getDeterministicSellQuotes(TAKER_TOKEN, MAKER_TOKEN, ['Kyber'], sampleAmounts);
            const [, , quotes] = yield testContract
                .sampleSellsFromKyberNetwork(KYBER_RESERVE_OFFSET, TAKER_TOKEN, MAKER_TOKEN, sampleAmounts)
                .callAsync();
            contracts_test_utils_1.expect(quotes).to.deep.eq(expectedQuotes);
        }));
        it('returns zero if token -> ETH fails', () => __awaiter(this, void 0, void 0, function* () {
            const sampleAmounts = getSampleAmounts(TAKER_TOKEN);
            const expectedQuotes = _.times(sampleAmounts.length, () => contracts_test_utils_1.constants.ZERO_AMOUNT);
            yield enableFailTriggerAsync();
            const [, , quotes] = yield testContract
                .sampleSellsFromKyberNetwork(KYBER_RESERVE_OFFSET, TAKER_TOKEN, WETH_ADDRESS, sampleAmounts)
                .callAsync();
            contracts_test_utils_1.expect(quotes).to.deep.eq(expectedQuotes);
        }));
        it('can quote ETH -> token', () => __awaiter(this, void 0, void 0, function* () {
            const sampleAmounts = getSampleAmounts(TAKER_TOKEN);
            const [expectedQuotes] = getDeterministicSellQuotes(WETH_ADDRESS, TAKER_TOKEN, ['Kyber'], sampleAmounts);
            const [, , quotes] = yield testContract
                .sampleSellsFromKyberNetwork(KYBER_RESERVE_OFFSET, WETH_ADDRESS, TAKER_TOKEN, sampleAmounts)
                .callAsync();
            contracts_test_utils_1.expect(quotes).to.deep.eq(expectedQuotes);
        }));
        it('returns zero if ETH -> token fails', () => __awaiter(this, void 0, void 0, function* () {
            const sampleAmounts = getSampleAmounts(TAKER_TOKEN);
            const expectedQuotes = _.times(sampleAmounts.length, () => contracts_test_utils_1.constants.ZERO_AMOUNT);
            yield enableFailTriggerAsync();
            const [, , quotes] = yield testContract
                .sampleSellsFromKyberNetwork(KYBER_RESERVE_OFFSET, WETH_ADDRESS, TAKER_TOKEN, sampleAmounts)
                .callAsync();
            contracts_test_utils_1.expect(quotes).to.deep.eq(expectedQuotes);
        }));
    });
    contracts_test_utils_1.blockchainTests.resets('sampleBuysFromKyberNetwork()', () => {
        const ACCEPTABLE_SLIPPAGE = 0.0005;
        before(() => __awaiter(this, void 0, void 0, function* () {
            yield testContract.createTokenExchanges([MAKER_TOKEN, TAKER_TOKEN]).awaitTransactionSuccessAsync();
        }));
        it('throws if tokens are the same', () => __awaiter(this, void 0, void 0, function* () {
            const tx = testContract
                .sampleBuysFromKyberNetwork(KYBER_RESERVE_OFFSET, MAKER_TOKEN, MAKER_TOKEN, [])
                .callAsync();
            return contracts_test_utils_1.expect(tx).to.revertWith(INVALID_TOKEN_PAIR_ERROR);
        }));
        it('can return no quotes', () => __awaiter(this, void 0, void 0, function* () {
            const [, , quotes] = yield testContract
                .sampleBuysFromKyberNetwork(KYBER_RESERVE_OFFSET, TAKER_TOKEN, MAKER_TOKEN, [])
                .callAsync();
            contracts_test_utils_1.expect(quotes).to.deep.eq([]);
        }));
        it('can quote token -> token', () => __awaiter(this, void 0, void 0, function* () {
            const sampleAmounts = getSampleAmounts(TAKER_TOKEN);
            const [expectedQuotes] = getDeterministicBuyQuotes(TAKER_TOKEN, MAKER_TOKEN, ['Kyber'], sampleAmounts);
            const [, , quotes] = yield testContract
                .sampleBuysFromKyberNetwork(KYBER_RESERVE_OFFSET, TAKER_TOKEN, MAKER_TOKEN, sampleAmounts)
                .callAsync();
            expectQuotesWithinRange(quotes, expectedQuotes, ACCEPTABLE_SLIPPAGE);
        }));
        it('returns zero if token -> token fails', () => __awaiter(this, void 0, void 0, function* () {
            const sampleAmounts = getSampleAmounts(TAKER_TOKEN);
            const expectedQuotes = _.times(sampleAmounts.length, () => contracts_test_utils_1.constants.ZERO_AMOUNT);
            yield enableFailTriggerAsync();
            const [, , quotes] = yield testContract
                .sampleBuysFromKyberNetwork(KYBER_RESERVE_OFFSET, TAKER_TOKEN, MAKER_TOKEN, sampleAmounts)
                .callAsync();
            contracts_test_utils_1.expect(quotes).to.deep.eq(expectedQuotes);
        }));
        it('can quote token -> ETH', () => __awaiter(this, void 0, void 0, function* () {
            const sampleAmounts = getSampleAmounts(TAKER_TOKEN);
            const [expectedQuotes] = getDeterministicBuyQuotes(TAKER_TOKEN, WETH_ADDRESS, ['Kyber'], sampleAmounts);
            const [, , quotes] = yield testContract
                .sampleBuysFromKyberNetwork(KYBER_RESERVE_OFFSET, TAKER_TOKEN, WETH_ADDRESS, sampleAmounts)
                .callAsync();
            expectQuotesWithinRange(quotes, expectedQuotes, ACCEPTABLE_SLIPPAGE);
        }));
        it('returns zero if token -> ETH fails', () => __awaiter(this, void 0, void 0, function* () {
            const sampleAmounts = getSampleAmounts(TAKER_TOKEN);
            const expectedQuotes = _.times(sampleAmounts.length, () => contracts_test_utils_1.constants.ZERO_AMOUNT);
            yield enableFailTriggerAsync();
            const [, , quotes] = yield testContract
                .sampleBuysFromKyberNetwork(KYBER_RESERVE_OFFSET, TAKER_TOKEN, WETH_ADDRESS, sampleAmounts)
                .callAsync();
            contracts_test_utils_1.expect(quotes).to.deep.eq(expectedQuotes);
        }));
        it('can quote ETH -> token', () => __awaiter(this, void 0, void 0, function* () {
            const sampleAmounts = getSampleAmounts(TAKER_TOKEN);
            const [expectedQuotes] = getDeterministicBuyQuotes(WETH_ADDRESS, TAKER_TOKEN, ['Kyber'], sampleAmounts);
            const [, , quotes] = yield testContract
                .sampleBuysFromKyberNetwork(KYBER_RESERVE_OFFSET, WETH_ADDRESS, TAKER_TOKEN, sampleAmounts)
                .callAsync();
            expectQuotesWithinRange(quotes, expectedQuotes, ACCEPTABLE_SLIPPAGE);
        }));
        it('returns zero if ETH -> token fails', () => __awaiter(this, void 0, void 0, function* () {
            const sampleAmounts = getSampleAmounts(TAKER_TOKEN);
            const expectedQuotes = _.times(sampleAmounts.length, () => contracts_test_utils_1.constants.ZERO_AMOUNT);
            yield enableFailTriggerAsync();
            const [, , quotes] = yield testContract
                .sampleBuysFromKyberNetwork(KYBER_RESERVE_OFFSET, WETH_ADDRESS, TAKER_TOKEN, sampleAmounts)
                .callAsync();
            contracts_test_utils_1.expect(quotes).to.deep.eq(expectedQuotes);
        }));
    });
    contracts_test_utils_1.blockchainTests.resets('sampleSellsFromEth2Dai()', () => {
        before(() => __awaiter(this, void 0, void 0, function* () {
            yield testContract.createTokenExchanges([MAKER_TOKEN, TAKER_TOKEN]).awaitTransactionSuccessAsync();
        }));
        it('throws if tokens are the same', () => __awaiter(this, void 0, void 0, function* () {
            const tx = testContract.sampleSellsFromEth2Dai(MAKER_TOKEN, MAKER_TOKEN, []).callAsync();
            return contracts_test_utils_1.expect(tx).to.revertWith(INVALID_TOKEN_PAIR_ERROR);
        }));
        it('can return no quotes', () => __awaiter(this, void 0, void 0, function* () {
            const quotes = yield testContract.sampleSellsFromEth2Dai(TAKER_TOKEN, MAKER_TOKEN, []).callAsync();
            contracts_test_utils_1.expect(quotes).to.deep.eq([]);
        }));
        it('can quote token -> token', () => __awaiter(this, void 0, void 0, function* () {
            const sampleAmounts = getSampleAmounts(TAKER_TOKEN);
            const [expectedQuotes] = getDeterministicSellQuotes(TAKER_TOKEN, MAKER_TOKEN, ['Eth2Dai'], sampleAmounts);
            const quotes = yield testContract
                .sampleSellsFromEth2Dai(TAKER_TOKEN, MAKER_TOKEN, sampleAmounts)
                .callAsync();
            contracts_test_utils_1.expect(quotes).to.deep.eq(expectedQuotes);
        }));
        it('returns zero if token -> token fails', () => __awaiter(this, void 0, void 0, function* () {
            const sampleAmounts = getSampleAmounts(TAKER_TOKEN);
            const expectedQuotes = _.times(sampleAmounts.length, () => contracts_test_utils_1.constants.ZERO_AMOUNT);
            yield enableFailTriggerAsync();
            const quotes = yield testContract
                .sampleSellsFromEth2Dai(TAKER_TOKEN, MAKER_TOKEN, sampleAmounts)
                .callAsync();
            contracts_test_utils_1.expect(quotes).to.deep.eq(expectedQuotes);
        }));
        it('can quote token -> ETH', () => __awaiter(this, void 0, void 0, function* () {
            const sampleAmounts = getSampleAmounts(TAKER_TOKEN);
            const [expectedQuotes] = getDeterministicSellQuotes(TAKER_TOKEN, WETH_ADDRESS, ['Eth2Dai'], sampleAmounts);
            const quotes = yield testContract
                .sampleSellsFromEth2Dai(TAKER_TOKEN, WETH_ADDRESS, sampleAmounts)
                .callAsync();
            contracts_test_utils_1.expect(quotes).to.deep.eq(expectedQuotes);
        }));
        it('returns zero if token -> ETH fails', () => __awaiter(this, void 0, void 0, function* () {
            const sampleAmounts = getSampleAmounts(TAKER_TOKEN);
            const expectedQuotes = _.times(sampleAmounts.length, () => contracts_test_utils_1.constants.ZERO_AMOUNT);
            yield enableFailTriggerAsync();
            const quotes = yield testContract
                .sampleSellsFromEth2Dai(TAKER_TOKEN, WETH_ADDRESS, sampleAmounts)
                .callAsync();
            contracts_test_utils_1.expect(quotes).to.deep.eq(expectedQuotes);
        }));
        it('can quote ETH -> token', () => __awaiter(this, void 0, void 0, function* () {
            const sampleAmounts = getSampleAmounts(TAKER_TOKEN);
            const [expectedQuotes] = getDeterministicSellQuotes(WETH_ADDRESS, TAKER_TOKEN, ['Eth2Dai'], sampleAmounts);
            const quotes = yield testContract
                .sampleSellsFromEth2Dai(WETH_ADDRESS, TAKER_TOKEN, sampleAmounts)
                .callAsync();
            contracts_test_utils_1.expect(quotes).to.deep.eq(expectedQuotes);
        }));
        it('returns zero if ETH -> token fails', () => __awaiter(this, void 0, void 0, function* () {
            const sampleAmounts = getSampleAmounts(TAKER_TOKEN);
            const expectedQuotes = _.times(sampleAmounts.length, () => contracts_test_utils_1.constants.ZERO_AMOUNT);
            yield enableFailTriggerAsync();
            const quotes = yield testContract
                .sampleSellsFromEth2Dai(WETH_ADDRESS, TAKER_TOKEN, sampleAmounts)
                .callAsync();
            contracts_test_utils_1.expect(quotes).to.deep.eq(expectedQuotes);
        }));
    });
    contracts_test_utils_1.blockchainTests.resets('sampleBuysFromEth2Dai()', () => {
        before(() => __awaiter(this, void 0, void 0, function* () {
            yield testContract.createTokenExchanges([MAKER_TOKEN, TAKER_TOKEN]).awaitTransactionSuccessAsync();
        }));
        it('throws if tokens are the same', () => __awaiter(this, void 0, void 0, function* () {
            const tx = testContract.sampleBuysFromEth2Dai(MAKER_TOKEN, MAKER_TOKEN, []).callAsync();
            return contracts_test_utils_1.expect(tx).to.revertWith(INVALID_TOKEN_PAIR_ERROR);
        }));
        it('can return no quotes', () => __awaiter(this, void 0, void 0, function* () {
            const quotes = yield testContract.sampleBuysFromEth2Dai(TAKER_TOKEN, MAKER_TOKEN, []).callAsync();
            contracts_test_utils_1.expect(quotes).to.deep.eq([]);
        }));
        it('can quote token -> token', () => __awaiter(this, void 0, void 0, function* () {
            const sampleAmounts = getSampleAmounts(MAKER_TOKEN);
            const [expectedQuotes] = getDeterministicBuyQuotes(TAKER_TOKEN, MAKER_TOKEN, ['Eth2Dai'], sampleAmounts);
            const quotes = yield testContract
                .sampleBuysFromEth2Dai(TAKER_TOKEN, MAKER_TOKEN, sampleAmounts)
                .callAsync();
            contracts_test_utils_1.expect(quotes).to.deep.eq(expectedQuotes);
        }));
        it('returns zero if token -> token fails', () => __awaiter(this, void 0, void 0, function* () {
            const sampleAmounts = getSampleAmounts(MAKER_TOKEN);
            const expectedQuotes = _.times(sampleAmounts.length, () => contracts_test_utils_1.constants.ZERO_AMOUNT);
            yield enableFailTriggerAsync();
            const quotes = yield testContract
                .sampleBuysFromEth2Dai(TAKER_TOKEN, MAKER_TOKEN, sampleAmounts)
                .callAsync();
            contracts_test_utils_1.expect(quotes).to.deep.eq(expectedQuotes);
        }));
        it('can quote token -> ETH', () => __awaiter(this, void 0, void 0, function* () {
            const sampleAmounts = getSampleAmounts(MAKER_TOKEN);
            const [expectedQuotes] = getDeterministicBuyQuotes(TAKER_TOKEN, WETH_ADDRESS, ['Eth2Dai'], sampleAmounts);
            const quotes = yield testContract
                .sampleBuysFromEth2Dai(TAKER_TOKEN, WETH_ADDRESS, sampleAmounts)
                .callAsync();
            contracts_test_utils_1.expect(quotes).to.deep.eq(expectedQuotes);
        }));
        it('returns zero if token -> ETH fails', () => __awaiter(this, void 0, void 0, function* () {
            const sampleAmounts = getSampleAmounts(MAKER_TOKEN);
            const expectedQuotes = _.times(sampleAmounts.length, () => contracts_test_utils_1.constants.ZERO_AMOUNT);
            yield enableFailTriggerAsync();
            const quotes = yield testContract
                .sampleBuysFromEth2Dai(TAKER_TOKEN, WETH_ADDRESS, sampleAmounts)
                .callAsync();
            contracts_test_utils_1.expect(quotes).to.deep.eq(expectedQuotes);
        }));
        it('can quote ETH -> token', () => __awaiter(this, void 0, void 0, function* () {
            const sampleAmounts = getSampleAmounts(MAKER_TOKEN);
            const [expectedQuotes] = getDeterministicBuyQuotes(WETH_ADDRESS, TAKER_TOKEN, ['Eth2Dai'], sampleAmounts);
            const quotes = yield testContract
                .sampleBuysFromEth2Dai(WETH_ADDRESS, TAKER_TOKEN, sampleAmounts)
                .callAsync();
            contracts_test_utils_1.expect(quotes).to.deep.eq(expectedQuotes);
        }));
        it('returns zero if ETH -> token fails', () => __awaiter(this, void 0, void 0, function* () {
            const sampleAmounts = getSampleAmounts(MAKER_TOKEN);
            const expectedQuotes = _.times(sampleAmounts.length, () => contracts_test_utils_1.constants.ZERO_AMOUNT);
            yield enableFailTriggerAsync();
            const quotes = yield testContract
                .sampleBuysFromEth2Dai(WETH_ADDRESS, TAKER_TOKEN, sampleAmounts)
                .callAsync();
            contracts_test_utils_1.expect(quotes).to.deep.eq(expectedQuotes);
        }));
    });
    contracts_test_utils_1.blockchainTests.resets('sampleSellsFromUniswap()', () => {
        before(() => __awaiter(this, void 0, void 0, function* () {
            yield testContract.createTokenExchanges([MAKER_TOKEN, TAKER_TOKEN]).awaitTransactionSuccessAsync();
        }));
        it('throws if tokens are the same', () => __awaiter(this, void 0, void 0, function* () {
            const tx = testContract.sampleSellsFromUniswap(MAKER_TOKEN, MAKER_TOKEN, []).callAsync();
            return contracts_test_utils_1.expect(tx).to.revertWith(INVALID_TOKEN_PAIR_ERROR);
        }));
        it('can return no quotes', () => __awaiter(this, void 0, void 0, function* () {
            const quotes = yield testContract.sampleSellsFromUniswap(TAKER_TOKEN, MAKER_TOKEN, []).callAsync();
            contracts_test_utils_1.expect(quotes).to.deep.eq([]);
        }));
        it('can quote token -> token', () => __awaiter(this, void 0, void 0, function* () {
            const sampleAmounts = getSampleAmounts(TAKER_TOKEN);
            const [expectedQuotes] = getDeterministicSellQuotes(TAKER_TOKEN, MAKER_TOKEN, ['Uniswap'], sampleAmounts);
            const quotes = yield testContract
                .sampleSellsFromUniswap(TAKER_TOKEN, MAKER_TOKEN, sampleAmounts)
                .callAsync();
            contracts_test_utils_1.expect(quotes).to.deep.eq(expectedQuotes);
        }));
        it('returns zero if token -> token fails', () => __awaiter(this, void 0, void 0, function* () {
            const sampleAmounts = getSampleAmounts(TAKER_TOKEN);
            const expectedQuotes = _.times(sampleAmounts.length, () => contracts_test_utils_1.constants.ZERO_AMOUNT);
            yield enableFailTriggerAsync();
            const quotes = yield testContract
                .sampleSellsFromUniswap(TAKER_TOKEN, MAKER_TOKEN, sampleAmounts)
                .callAsync();
            contracts_test_utils_1.expect(quotes).to.deep.eq(expectedQuotes);
        }));
        it('can quote token -> ETH', () => __awaiter(this, void 0, void 0, function* () {
            const sampleAmounts = getSampleAmounts(TAKER_TOKEN);
            const [expectedQuotes] = getDeterministicSellQuotes(TAKER_TOKEN, WETH_ADDRESS, ['Uniswap'], sampleAmounts);
            const quotes = yield testContract
                .sampleSellsFromUniswap(TAKER_TOKEN, WETH_ADDRESS, sampleAmounts)
                .callAsync();
            contracts_test_utils_1.expect(quotes).to.deep.eq(expectedQuotes);
        }));
        it('returns zero if token -> ETH fails', () => __awaiter(this, void 0, void 0, function* () {
            const sampleAmounts = getSampleAmounts(TAKER_TOKEN);
            const expectedQuotes = _.times(sampleAmounts.length, () => contracts_test_utils_1.constants.ZERO_AMOUNT);
            yield enableFailTriggerAsync();
            const quotes = yield testContract
                .sampleSellsFromUniswap(TAKER_TOKEN, WETH_ADDRESS, sampleAmounts)
                .callAsync();
            contracts_test_utils_1.expect(quotes).to.deep.eq(expectedQuotes);
        }));
        it('can quote ETH -> token', () => __awaiter(this, void 0, void 0, function* () {
            const sampleAmounts = getSampleAmounts(TAKER_TOKEN);
            const [expectedQuotes] = getDeterministicSellQuotes(WETH_ADDRESS, TAKER_TOKEN, ['Uniswap'], sampleAmounts);
            const quotes = yield testContract
                .sampleSellsFromUniswap(WETH_ADDRESS, TAKER_TOKEN, sampleAmounts)
                .callAsync();
            contracts_test_utils_1.expect(quotes).to.deep.eq(expectedQuotes);
        }));
        it('returns zero if ETH -> token fails', () => __awaiter(this, void 0, void 0, function* () {
            const sampleAmounts = getSampleAmounts(TAKER_TOKEN);
            const expectedQuotes = _.times(sampleAmounts.length, () => contracts_test_utils_1.constants.ZERO_AMOUNT);
            yield enableFailTriggerAsync();
            const quotes = yield testContract
                .sampleSellsFromUniswap(WETH_ADDRESS, TAKER_TOKEN, sampleAmounts)
                .callAsync();
            contracts_test_utils_1.expect(quotes).to.deep.eq(expectedQuotes);
        }));
        it('returns zero if no exchange exists for the maker token', () => __awaiter(this, void 0, void 0, function* () {
            const nonExistantToken = contracts_test_utils_1.randomAddress();
            const sampleAmounts = getSampleAmounts(TAKER_TOKEN);
            const expectedQuotes = _.times(sampleAmounts.length, () => contracts_test_utils_1.constants.ZERO_AMOUNT);
            const quotes = yield testContract
                .sampleSellsFromUniswap(TAKER_TOKEN, nonExistantToken, sampleAmounts)
                .callAsync();
            contracts_test_utils_1.expect(quotes).to.deep.eq(expectedQuotes);
        }));
        it('returns zero if no exchange exists for the taker token', () => __awaiter(this, void 0, void 0, function* () {
            const nonExistantToken = contracts_test_utils_1.randomAddress();
            const sampleAmounts = getSampleAmounts(nonExistantToken);
            const expectedQuotes = _.times(sampleAmounts.length, () => contracts_test_utils_1.constants.ZERO_AMOUNT);
            const quotes = yield testContract
                .sampleSellsFromUniswap(nonExistantToken, MAKER_TOKEN, sampleAmounts)
                .callAsync();
            contracts_test_utils_1.expect(quotes).to.deep.eq(expectedQuotes);
        }));
    });
    contracts_test_utils_1.blockchainTests.resets('sampleBuysFromUniswap()', () => {
        before(() => __awaiter(this, void 0, void 0, function* () {
            yield testContract.createTokenExchanges([MAKER_TOKEN, TAKER_TOKEN]).awaitTransactionSuccessAsync();
        }));
        it('throws if tokens are the same', () => __awaiter(this, void 0, void 0, function* () {
            const tx = testContract.sampleBuysFromUniswap(MAKER_TOKEN, MAKER_TOKEN, []).callAsync();
            return contracts_test_utils_1.expect(tx).to.revertWith(INVALID_TOKEN_PAIR_ERROR);
        }));
        it('can return no quotes', () => __awaiter(this, void 0, void 0, function* () {
            const quotes = yield testContract.sampleBuysFromUniswap(TAKER_TOKEN, MAKER_TOKEN, []).callAsync();
            contracts_test_utils_1.expect(quotes).to.deep.eq([]);
        }));
        it('can quote token -> token', () => __awaiter(this, void 0, void 0, function* () {
            const sampleAmounts = getSampleAmounts(MAKER_TOKEN);
            const [expectedQuotes] = getDeterministicBuyQuotes(TAKER_TOKEN, MAKER_TOKEN, ['Uniswap'], sampleAmounts);
            const quotes = yield testContract
                .sampleBuysFromUniswap(TAKER_TOKEN, MAKER_TOKEN, sampleAmounts)
                .callAsync();
            contracts_test_utils_1.expect(quotes).to.deep.eq(expectedQuotes);
        }));
        it('returns zero if token -> token fails', () => __awaiter(this, void 0, void 0, function* () {
            const sampleAmounts = getSampleAmounts(MAKER_TOKEN);
            const expectedQuotes = _.times(sampleAmounts.length, () => contracts_test_utils_1.constants.ZERO_AMOUNT);
            yield enableFailTriggerAsync();
            const quotes = yield testContract
                .sampleBuysFromUniswap(TAKER_TOKEN, MAKER_TOKEN, sampleAmounts)
                .callAsync();
            contracts_test_utils_1.expect(quotes).to.deep.eq(expectedQuotes);
        }));
        it('can quote token -> ETH', () => __awaiter(this, void 0, void 0, function* () {
            const sampleAmounts = getSampleAmounts(MAKER_TOKEN);
            const [expectedQuotes] = getDeterministicBuyQuotes(TAKER_TOKEN, WETH_ADDRESS, ['Uniswap'], sampleAmounts);
            const quotes = yield testContract
                .sampleBuysFromUniswap(TAKER_TOKEN, WETH_ADDRESS, sampleAmounts)
                .callAsync();
            contracts_test_utils_1.expect(quotes).to.deep.eq(expectedQuotes);
        }));
        it('returns zero if token -> ETH fails', () => __awaiter(this, void 0, void 0, function* () {
            const sampleAmounts = getSampleAmounts(MAKER_TOKEN);
            const expectedQuotes = _.times(sampleAmounts.length, () => contracts_test_utils_1.constants.ZERO_AMOUNT);
            yield enableFailTriggerAsync();
            const quotes = yield testContract
                .sampleBuysFromUniswap(TAKER_TOKEN, WETH_ADDRESS, sampleAmounts)
                .callAsync();
            contracts_test_utils_1.expect(quotes).to.deep.eq(expectedQuotes);
        }));
        it('can quote ETH -> token', () => __awaiter(this, void 0, void 0, function* () {
            const sampleAmounts = getSampleAmounts(MAKER_TOKEN);
            const [expectedQuotes] = getDeterministicBuyQuotes(WETH_ADDRESS, TAKER_TOKEN, ['Uniswap'], sampleAmounts);
            const quotes = yield testContract
                .sampleBuysFromUniswap(WETH_ADDRESS, TAKER_TOKEN, sampleAmounts)
                .callAsync();
            contracts_test_utils_1.expect(quotes).to.deep.eq(expectedQuotes);
        }));
        it('returns zero if ETH -> token fails', () => __awaiter(this, void 0, void 0, function* () {
            const sampleAmounts = getSampleAmounts(MAKER_TOKEN);
            const expectedQuotes = _.times(sampleAmounts.length, () => contracts_test_utils_1.constants.ZERO_AMOUNT);
            yield enableFailTriggerAsync();
            const quotes = yield testContract
                .sampleBuysFromUniswap(WETH_ADDRESS, TAKER_TOKEN, sampleAmounts)
                .callAsync();
            contracts_test_utils_1.expect(quotes).to.deep.eq(expectedQuotes);
        }));
        it('returns zero if no exchange exists for the maker token', () => __awaiter(this, void 0, void 0, function* () {
            const nonExistantToken = contracts_test_utils_1.randomAddress();
            const sampleAmounts = getSampleAmounts(nonExistantToken);
            const expectedQuotes = _.times(sampleAmounts.length, () => contracts_test_utils_1.constants.ZERO_AMOUNT);
            const quotes = yield testContract
                .sampleBuysFromUniswap(TAKER_TOKEN, nonExistantToken, sampleAmounts)
                .callAsync();
            contracts_test_utils_1.expect(quotes).to.deep.eq(expectedQuotes);
        }));
        it('returns zero if no exchange exists for the taker token', () => __awaiter(this, void 0, void 0, function* () {
            const nonExistantToken = contracts_test_utils_1.randomAddress();
            const sampleAmounts = getSampleAmounts(MAKER_TOKEN);
            const expectedQuotes = _.times(sampleAmounts.length, () => contracts_test_utils_1.constants.ZERO_AMOUNT);
            const quotes = yield testContract
                .sampleBuysFromUniswap(nonExistantToken, MAKER_TOKEN, sampleAmounts)
                .callAsync();
            contracts_test_utils_1.expect(quotes).to.deep.eq(expectedQuotes);
        }));
    });
    describe('liquidity provider', () => {
        const xAsset = contracts_test_utils_1.randomAddress();
        const yAsset = contracts_test_utils_1.randomAddress();
        const sampleAmounts = getSampleAmounts(yAsset);
        let liquidityProvider;
        before(() => __awaiter(this, void 0, void 0, function* () {
            liquidityProvider = yield wrappers_1.DummyLiquidityProviderContract.deployFrom0xArtifactAsync(artifacts_1.artifacts.DummyLiquidityProvider, env.provider, env.txDefaults, {});
        }));
        it('should be able to query sells from the liquidity provider', () => __awaiter(this, void 0, void 0, function* () {
            const quotes = yield testContract
                .sampleSellsFromLiquidityProvider(liquidityProvider.address, yAsset, xAsset, sampleAmounts)
                .callAsync();
            quotes.forEach((value, idx) => {
                contracts_test_utils_1.expect(value).is.bignumber.eql(sampleAmounts[idx].minus(1));
            });
        }));
        it('should be able to query buys from the liquidity provider', () => __awaiter(this, void 0, void 0, function* () {
            const quotes = yield testContract
                .sampleBuysFromLiquidityProvider(liquidityProvider.address, yAsset, xAsset, sampleAmounts)
                .callAsync();
            quotes.forEach((value, idx) => {
                contracts_test_utils_1.expect(value).is.bignumber.eql(sampleAmounts[idx].plus(1));
            });
        }));
        it('should just return zeros if the liquidity provider does not exist', () => __awaiter(this, void 0, void 0, function* () {
            const quotes = yield testContract
                .sampleBuysFromLiquidityProvider(contracts_test_utils_1.randomAddress(), yAsset, xAsset, sampleAmounts)
                .callAsync();
            quotes.forEach(value => {
                contracts_test_utils_1.expect(value).is.bignumber.eql(contracts_test_utils_1.constants.ZERO_AMOUNT);
            });
        }));
    });
    contracts_test_utils_1.blockchainTests.resets('sampleSellsFromUniswapV2()', () => {
        function predictSellQuotes(path, sellAmounts) {
            return sellAmounts.map(a => getDeterministicUniswapV2SellQuote(path, a));
        }
        it('can return no quotes', () => __awaiter(this, void 0, void 0, function* () {
            const quotes = yield testContract
                .sampleSellsFromUniswapV2(UNISWAP_V2_ROUTER, [TAKER_TOKEN, MAKER_TOKEN], [])
                .callAsync();
            contracts_test_utils_1.expect(quotes).to.deep.eq([]);
        }));
        it('can quote token -> token', () => __awaiter(this, void 0, void 0, function* () {
            const sampleAmounts = getSampleAmounts(TAKER_TOKEN);
            const expectedQuotes = predictSellQuotes([TAKER_TOKEN, MAKER_TOKEN], sampleAmounts);
            const quotes = yield testContract
                .sampleSellsFromUniswapV2(UNISWAP_V2_ROUTER, [TAKER_TOKEN, MAKER_TOKEN], sampleAmounts)
                .callAsync();
            contracts_test_utils_1.expect(quotes).to.deep.eq(expectedQuotes);
        }));
        it('returns zero if token -> token fails', () => __awaiter(this, void 0, void 0, function* () {
            const sampleAmounts = getSampleAmounts(TAKER_TOKEN);
            const expectedQuotes = _.times(sampleAmounts.length, () => contracts_test_utils_1.constants.ZERO_AMOUNT);
            yield enableFailTriggerAsync();
            const quotes = yield testContract
                .sampleSellsFromUniswapV2(UNISWAP_V2_ROUTER, [TAKER_TOKEN, MAKER_TOKEN], sampleAmounts)
                .callAsync();
            contracts_test_utils_1.expect(quotes).to.deep.eq(expectedQuotes);
        }));
        it('can quote token -> token -> token', () => __awaiter(this, void 0, void 0, function* () {
            const intermediateToken = contracts_test_utils_1.randomAddress();
            const sampleAmounts = getSampleAmounts(TAKER_TOKEN);
            const expectedQuotes = predictSellQuotes([TAKER_TOKEN, intermediateToken, MAKER_TOKEN], sampleAmounts);
            const quotes = yield testContract
                .sampleSellsFromUniswapV2(UNISWAP_V2_ROUTER, [TAKER_TOKEN, intermediateToken, MAKER_TOKEN], sampleAmounts)
                .callAsync();
            contracts_test_utils_1.expect(quotes).to.deep.eq(expectedQuotes);
        }));
    });
    contracts_test_utils_1.blockchainTests.resets('sampleBuysFromUniswapV2()', () => {
        function predictBuyQuotes(path, buyAmounts) {
            return buyAmounts.map(a => getDeterministicUniswapV2BuyQuote(path, a));
        }
        it('can return no quotes', () => __awaiter(this, void 0, void 0, function* () {
            const quotes = yield testContract
                .sampleBuysFromUniswapV2(UNISWAP_V2_ROUTER, [TAKER_TOKEN, MAKER_TOKEN], [])
                .callAsync();
            contracts_test_utils_1.expect(quotes).to.deep.eq([]);
        }));
        it('can quote token -> token', () => __awaiter(this, void 0, void 0, function* () {
            const sampleAmounts = getSampleAmounts(MAKER_TOKEN);
            const expectedQuotes = predictBuyQuotes([TAKER_TOKEN, MAKER_TOKEN], sampleAmounts);
            const quotes = yield testContract
                .sampleBuysFromUniswapV2(UNISWAP_V2_ROUTER, [TAKER_TOKEN, MAKER_TOKEN], sampleAmounts)
                .callAsync();
            contracts_test_utils_1.expect(quotes).to.deep.eq(expectedQuotes);
        }));
        it('returns zero if token -> token fails', () => __awaiter(this, void 0, void 0, function* () {
            const sampleAmounts = getSampleAmounts(MAKER_TOKEN);
            const expectedQuotes = _.times(sampleAmounts.length, () => contracts_test_utils_1.constants.ZERO_AMOUNT);
            yield enableFailTriggerAsync();
            const quotes = yield testContract
                .sampleBuysFromUniswapV2(UNISWAP_V2_ROUTER, [TAKER_TOKEN, MAKER_TOKEN], sampleAmounts)
                .callAsync();
            contracts_test_utils_1.expect(quotes).to.deep.eq(expectedQuotes);
        }));
        it('can quote token -> token -> token', () => __awaiter(this, void 0, void 0, function* () {
            const intermediateToken = contracts_test_utils_1.randomAddress();
            const sampleAmounts = getSampleAmounts(MAKER_TOKEN);
            const expectedQuotes = predictBuyQuotes([TAKER_TOKEN, intermediateToken, MAKER_TOKEN], sampleAmounts);
            const quotes = yield testContract
                .sampleBuysFromUniswapV2(UNISWAP_V2_ROUTER, [TAKER_TOKEN, intermediateToken, MAKER_TOKEN], sampleAmounts)
                .callAsync();
            contracts_test_utils_1.expect(quotes).to.deep.eq(expectedQuotes);
        }));
    });
    describe('batchCall()', () => {
        it('can call one function', () => __awaiter(this, void 0, void 0, function* () {
            const orders = createOrders(MAKER_TOKEN, TAKER_TOKEN);
            const expected = orders.map(getDeterministicFillableTakerAssetAmount);
            const calls = [
                testContract
                    .getLimitOrderFillableTakerAssetAmounts(
                // tslint:disable-next-line:no-unnecessary-type-assertion
                orders.map(o => o.order), orders.map(o => o.signature), NULL_ADDRESS)
                    .getABIEncodedTransactionData(),
            ];
            const r = yield testContract.batchCall(calls).callAsync();
            contracts_test_utils_1.expect(r).to.be.length(1);
            const actual = testContract.getABIDecodedReturnData('getLimitOrderFillableTakerAssetAmounts', r[0].data);
            contracts_test_utils_1.expect(actual).to.deep.eq(expected);
        }));
        it('can call two functions', () => __awaiter(this, void 0, void 0, function* () {
            const numOrders = _.random(1, 10);
            const orders = _.times(2, () => createOrders(MAKER_TOKEN, TAKER_TOKEN, numOrders));
            const expecteds = [
                orders[0].map(getDeterministicFillableTakerAssetAmount),
                orders[1].map(getDeterministicFillableMakerAssetAmount),
            ];
            const calls = [
                testContract
                    .getLimitOrderFillableTakerAssetAmounts(
                // tslint:disable-next-line:no-unnecessary-type-assertion
                orders[0].map(o => o.order), orders[0].map(o => o.signature), NULL_ADDRESS)
                    .getABIEncodedTransactionData(),
                testContract
                    .getLimitOrderFillableMakerAssetAmounts(
                // tslint:disable-next-line:no-unnecessary-type-assertion
                orders[1].map(o => o.order), orders[1].map(o => o.signature), NULL_ADDRESS)
                    .getABIEncodedTransactionData(),
            ];
            const r = yield testContract.batchCall(calls).callAsync();
            contracts_test_utils_1.expect(r).to.be.length(2);
            contracts_test_utils_1.expect(testContract.getABIDecodedReturnData('getLimitOrderFillableTakerAssetAmounts', r[0].data)).to.deep.eq(expecteds[0]);
            contracts_test_utils_1.expect(testContract.getABIDecodedReturnData('getLimitOrderFillableMakerAssetAmounts', r[1].data)).to.deep.eq(expecteds[1]);
        }));
        it('can make recursive calls', () => __awaiter(this, void 0, void 0, function* () {
            const numOrders = _.random(1, 10);
            const orders = createOrders(MAKER_TOKEN, TAKER_TOKEN, numOrders);
            const expected = orders.map(getDeterministicFillableTakerAssetAmount);
            let r = yield testContract
                .batchCall([
                testContract
                    .batchCall([
                    testContract
                        .getLimitOrderFillableTakerAssetAmounts(
                    // tslint:disable-next-line:no-unnecessary-type-assertion
                    orders.map(o => o.order), orders.map(o => o.signature), NULL_ADDRESS)
                        .getABIEncodedTransactionData(),
                ])
                    .getABIEncodedTransactionData(),
            ])
                .callAsync();
            contracts_test_utils_1.expect(r).to.be.length(1);
            r = testContract.getABIDecodedReturnData('batchCall', r[0].data);
            contracts_test_utils_1.expect(r).to.be.length(1);
            contracts_test_utils_1.expect(testContract.getABIDecodedReturnData('getLimitOrderFillableTakerAssetAmounts', r[0].data)).to.deep.eq(expected);
        }));
    });
    contracts_test_utils_1.blockchainTests.resets('TwoHopSampler', () => {
        before(() => __awaiter(this, void 0, void 0, function* () {
            yield testContract
                .createTokenExchanges([MAKER_TOKEN, TAKER_TOKEN, INTERMEDIATE_TOKEN])
                .awaitTransactionSuccessAsync();
        }));
        it('sampleTwoHopSell', () => __awaiter(this, void 0, void 0, function* () {
            // tslint:disable-next-line no-unnecessary-type-assertion
            const sellAmount = _.last(getSampleAmounts(TAKER_TOKEN));
            const uniswapV2FirstHopPath = [TAKER_TOKEN, INTERMEDIATE_TOKEN];
            const uniswapV2FirstHop = testContract
                .sampleSellsFromUniswapV2(UNISWAP_V2_ROUTER, uniswapV2FirstHopPath, [contracts_test_utils_1.constants.ZERO_AMOUNT])
                .getABIEncodedTransactionData();
            const uniswapV2SecondHopPath = [INTERMEDIATE_TOKEN, contracts_test_utils_1.randomAddress(), MAKER_TOKEN];
            const uniswapV2SecondHop = testContract
                .sampleSellsFromUniswapV2(UNISWAP_V2_ROUTER, uniswapV2SecondHopPath, [contracts_test_utils_1.constants.ZERO_AMOUNT])
                .getABIEncodedTransactionData();
            const eth2DaiFirstHop = testContract
                .sampleSellsFromEth2Dai(TAKER_TOKEN, INTERMEDIATE_TOKEN, [contracts_test_utils_1.constants.ZERO_AMOUNT])
                .getABIEncodedTransactionData();
            const eth2DaiSecondHop = testContract
                .sampleSellsFromEth2Dai(INTERMEDIATE_TOKEN, MAKER_TOKEN, [contracts_test_utils_1.constants.ZERO_AMOUNT])
                .getABIEncodedTransactionData();
            const firstHopQuotes = [
                getDeterministicSellQuote(ETH2DAI_SALT, TAKER_TOKEN, INTERMEDIATE_TOKEN, sellAmount),
                getDeterministicUniswapV2SellQuote(uniswapV2FirstHopPath, sellAmount),
            ];
            const expectedIntermediateAssetAmount = utils_1.BigNumber.max(...firstHopQuotes);
            const secondHopQuotes = [
                getDeterministicSellQuote(ETH2DAI_SALT, INTERMEDIATE_TOKEN, MAKER_TOKEN, expectedIntermediateAssetAmount),
                getDeterministicUniswapV2SellQuote(uniswapV2SecondHopPath, expectedIntermediateAssetAmount),
            ];
            const expectedBuyAmount = utils_1.BigNumber.max(...secondHopQuotes);
            const [firstHop, secondHop, buyAmount] = yield testContract
                .sampleTwoHopSell([eth2DaiFirstHop, uniswapV2FirstHop], [eth2DaiSecondHop, uniswapV2SecondHop], sellAmount)
                .callAsync();
            contracts_test_utils_1.expect(firstHop.sourceIndex, 'First hop source index').to.bignumber.equal(firstHopQuotes.findIndex(quote => quote.isEqualTo(expectedIntermediateAssetAmount)));
            contracts_test_utils_1.expect(secondHop.sourceIndex, 'Second hop source index').to.bignumber.equal(secondHopQuotes.findIndex(quote => quote.isEqualTo(expectedBuyAmount)));
            contracts_test_utils_1.expect(buyAmount, 'Two hop buy amount').to.bignumber.equal(expectedBuyAmount);
        }));
        it('sampleTwoHopBuy', () => __awaiter(this, void 0, void 0, function* () {
            // tslint:disable-next-line no-unnecessary-type-assertion
            const buyAmount = _.last(getSampleAmounts(MAKER_TOKEN));
            const uniswapV2FirstHopPath = [TAKER_TOKEN, INTERMEDIATE_TOKEN];
            const uniswapV2FirstHop = testContract
                .sampleBuysFromUniswapV2(UNISWAP_V2_ROUTER, uniswapV2FirstHopPath, [contracts_test_utils_1.constants.ZERO_AMOUNT])
                .getABIEncodedTransactionData();
            const uniswapV2SecondHopPath = [INTERMEDIATE_TOKEN, contracts_test_utils_1.randomAddress(), MAKER_TOKEN];
            const uniswapV2SecondHop = testContract
                .sampleBuysFromUniswapV2(UNISWAP_V2_ROUTER, uniswapV2SecondHopPath, [contracts_test_utils_1.constants.ZERO_AMOUNT])
                .getABIEncodedTransactionData();
            const eth2DaiFirstHop = testContract
                .sampleBuysFromEth2Dai(TAKER_TOKEN, INTERMEDIATE_TOKEN, [contracts_test_utils_1.constants.ZERO_AMOUNT])
                .getABIEncodedTransactionData();
            const eth2DaiSecondHop = testContract
                .sampleBuysFromEth2Dai(INTERMEDIATE_TOKEN, MAKER_TOKEN, [contracts_test_utils_1.constants.ZERO_AMOUNT])
                .getABIEncodedTransactionData();
            const secondHopQuotes = [
                getDeterministicBuyQuote(ETH2DAI_SALT, INTERMEDIATE_TOKEN, MAKER_TOKEN, buyAmount),
                getDeterministicUniswapV2BuyQuote(uniswapV2SecondHopPath, buyAmount),
            ];
            const expectedIntermediateAssetAmount = utils_1.BigNumber.min(...secondHopQuotes);
            const firstHopQuotes = [
                getDeterministicBuyQuote(ETH2DAI_SALT, TAKER_TOKEN, INTERMEDIATE_TOKEN, expectedIntermediateAssetAmount),
                getDeterministicUniswapV2BuyQuote(uniswapV2FirstHopPath, expectedIntermediateAssetAmount),
            ];
            const expectedSellAmount = utils_1.BigNumber.min(...firstHopQuotes);
            const [firstHop, secondHop, sellAmount] = yield testContract
                .sampleTwoHopBuy([eth2DaiFirstHop, uniswapV2FirstHop], [eth2DaiSecondHop, uniswapV2SecondHop], buyAmount)
                .callAsync();
            contracts_test_utils_1.expect(firstHop.sourceIndex, 'First hop source index').to.bignumber.equal(firstHopQuotes.findIndex(quote => quote.isEqualTo(expectedSellAmount)));
            contracts_test_utils_1.expect(secondHop.sourceIndex, 'Second hop source index').to.bignumber.equal(secondHopQuotes.findIndex(quote => quote.isEqualTo(expectedIntermediateAssetAmount)));
            contracts_test_utils_1.expect(sellAmount, 'Two hop sell amount').to.bignumber.equal(expectedSellAmount);
        }));
    });
});
//# sourceMappingURL=erc20_bridge_sampler_test.js.map