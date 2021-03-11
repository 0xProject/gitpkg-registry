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
const subproviders_1 = require("@0x/subproviders");
const utils_1 = require("@0x/utils");
const constants_1 = require("../../src/utils/market_operation_utils/constants");
const artifacts_1 = require("../artifacts");
const wrappers_1 = require("../wrappers");
exports.VB = '0x6cc5f688a315f3dc28a7781717a9a798a59fda7b';
// tslint:disable: custom-no-magic-numbers
contracts_test_utils_1.blockchainTests.skip('Mainnet Sampler Tests', env => {
    let testContract;
    const fakeSamplerAddress = '0x1111111111111111111111111111111111111111';
    const overrides = {
        [fakeSamplerAddress]: {
            code: artifacts_1.artifacts.ERC20BridgeSampler.compilerOutput.evm.deployedBytecode.object,
        },
    };
    before(() => __awaiter(this, void 0, void 0, function* () {
        const provider = new contracts_test_utils_1.Web3ProviderEngine();
        // tslint:disable-next-line:no-non-null-assertion
        provider.addProvider(new subproviders_1.RPCSubprovider(process.env.RPC_URL));
        utils_1.providerUtils.startProviderEngine(provider);
        testContract = new wrappers_1.ERC20BridgeSamplerContract(fakeSamplerAddress, provider, Object.assign({}, env.txDefaults, { from: exports.VB }));
    }));
    contracts_test_utils_1.describe('Curve', () => {
        const CURVE_ADDRESS = '0x45f783cce6b7ff23b2ab2d70e416cdb7d6055f51';
        const DAI_TOKEN_INDEX = new utils_1.BigNumber(0);
        const USDC_TOKEN_INDEX = new utils_1.BigNumber(1);
        const CURVE_INFO = {
            poolAddress: CURVE_ADDRESS,
            sellQuoteFunctionSelector: '0x07211ef7',
            buyQuoteFunctionSelector: '0x0e71d1b9',
        };
        contracts_test_utils_1.describe('sampleSellsFromCurve()', () => {
            it('samples sells from Curve DAI->USDC', () => __awaiter(this, void 0, void 0, function* () {
                const samples = yield testContract
                    .sampleSellsFromCurve(CURVE_INFO, DAI_TOKEN_INDEX, USDC_TOKEN_INDEX, [contracts_test_utils_1.toBaseUnitAmount(1)])
                    .callAsync({ overrides });
                contracts_test_utils_1.expect(samples.length).to.be.bignumber.greaterThan(0);
                contracts_test_utils_1.expect(samples[0]).to.be.bignumber.greaterThan(0);
            }));
            it('samples sells from Curve USDC->DAI', () => __awaiter(this, void 0, void 0, function* () {
                const samples = yield testContract
                    .sampleSellsFromCurve(CURVE_INFO, USDC_TOKEN_INDEX, DAI_TOKEN_INDEX, [contracts_test_utils_1.toBaseUnitAmount(1, 6)])
                    .callAsync({ overrides });
                contracts_test_utils_1.expect(samples.length).to.be.bignumber.greaterThan(0);
                contracts_test_utils_1.expect(samples[0]).to.be.bignumber.greaterThan(0);
            }));
        });
        contracts_test_utils_1.describe('sampleBuysFromCurve()', () => {
            it('samples buys from Curve DAI->USDC', () => __awaiter(this, void 0, void 0, function* () {
                // From DAI to USDC
                // I want to buy 1 USDC
                const samples = yield testContract
                    .sampleBuysFromCurve(CURVE_INFO, DAI_TOKEN_INDEX, USDC_TOKEN_INDEX, [contracts_test_utils_1.toBaseUnitAmount(1, 6)])
                    .callAsync({ overrides });
                contracts_test_utils_1.expect(samples.length).to.be.bignumber.greaterThan(0);
                contracts_test_utils_1.expect(samples[0]).to.be.bignumber.greaterThan(0);
            }));
            it('samples buys from Curve USDC->DAI', () => __awaiter(this, void 0, void 0, function* () {
                // From USDC to DAI
                // I want to buy 1 DAI
                const samples = yield testContract
                    .sampleBuysFromCurve(CURVE_INFO, USDC_TOKEN_INDEX, DAI_TOKEN_INDEX, [contracts_test_utils_1.toBaseUnitAmount(1)])
                    .callAsync({ overrides });
                contracts_test_utils_1.expect(samples.length).to.be.bignumber.greaterThan(0);
                contracts_test_utils_1.expect(samples[0]).to.be.bignumber.greaterThan(0);
            }));
        });
    });
    contracts_test_utils_1.describe('Kyber', () => {
        const WETH = constants_1.TOKENS.WETH;
        const DAI = constants_1.TOKENS.DAI;
        const USDC = constants_1.TOKENS.USDC;
        const RESERVE_OFFSET = new utils_1.BigNumber(0);
        const KYBER_OPTS = Object.assign({}, constants_1.KYBER_CONFIG_BY_CHAIN_ID[contract_addresses_1.ChainId.Mainnet], { reserveOffset: RESERVE_OFFSET, hint: utils_1.NULL_BYTES });
        contracts_test_utils_1.describe('sampleSellsFromKyberNetwork()', () => {
            it('samples sells from Kyber DAI->WETH', () => __awaiter(this, void 0, void 0, function* () {
                const [, samples] = yield testContract
                    .sampleSellsFromKyberNetwork(KYBER_OPTS, DAI, WETH, [contracts_test_utils_1.toBaseUnitAmount(1)])
                    .callAsync({ overrides });
                contracts_test_utils_1.expect(samples.length).to.be.bignumber.greaterThan(0);
                contracts_test_utils_1.expect(samples[0]).to.be.bignumber.greaterThan(0);
            }));
            it('samples sells from Kyber WETH->DAI', () => __awaiter(this, void 0, void 0, function* () {
                const [, samples] = yield testContract
                    .sampleSellsFromKyberNetwork(KYBER_OPTS, WETH, DAI, [contracts_test_utils_1.toBaseUnitAmount(1)])
                    .callAsync({ overrides });
                contracts_test_utils_1.expect(samples.length).to.be.bignumber.greaterThan(0);
                contracts_test_utils_1.expect(samples[0]).to.be.bignumber.greaterThan(0);
            }));
            it('samples sells from Kyber DAI->USDC', () => __awaiter(this, void 0, void 0, function* () {
                const [, samples] = yield testContract
                    .sampleSellsFromKyberNetwork(KYBER_OPTS, DAI, USDC, [contracts_test_utils_1.toBaseUnitAmount(1)])
                    .callAsync({ overrides });
                contracts_test_utils_1.expect(samples.length).to.be.bignumber.greaterThan(0);
                contracts_test_utils_1.expect(samples[0]).to.be.bignumber.greaterThan(0);
            }));
        });
        contracts_test_utils_1.describe('sampleBuysFromKyber()', () => {
            it('samples buys from Kyber WETH->DAI', () => __awaiter(this, void 0, void 0, function* () {
                // From ETH to DAI
                // I want to buy 1 DAI
                const [, samples] = yield testContract
                    .sampleBuysFromKyberNetwork(KYBER_OPTS, WETH, DAI, [contracts_test_utils_1.toBaseUnitAmount(1)])
                    .callAsync({ overrides });
                contracts_test_utils_1.expect(samples.length).to.be.bignumber.greaterThan(0);
                contracts_test_utils_1.expect(samples[0]).to.be.bignumber.greaterThan(0);
            }));
            it('samples buys from Kyber DAI->WETH', () => __awaiter(this, void 0, void 0, function* () {
                // From USDC to DAI
                // I want to buy 1 WETH
                const [, samples] = yield testContract
                    .sampleBuysFromKyberNetwork(KYBER_OPTS, DAI, WETH, [contracts_test_utils_1.toBaseUnitAmount(1)])
                    .callAsync({ overrides });
                contracts_test_utils_1.expect(samples.length).to.be.bignumber.greaterThan(0);
                contracts_test_utils_1.expect(samples[0]).to.be.bignumber.greaterThan(0);
            }));
        });
    });
});
//# sourceMappingURL=bridge_sampler_mainnet_test.js.map