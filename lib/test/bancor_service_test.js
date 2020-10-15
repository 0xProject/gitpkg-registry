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
const dev_utils_1 = require("@0x/dev-utils");
const ethereum_1 = require("@bancor/sdk/dist/blockchains/ethereum");
const helpers_1 = require("@bancor/sdk/dist/helpers");
const types_1 = require("@bancor/sdk/dist/types");
const chai = require("chai");
require("mocha");
const src_1 = require("../src");
const bancor_service_1 = require("../src/utils/market_operation_utils/bancor_service");
const chai_setup_1 = require("./utils/chai_setup");
chai_setup_1.chaiSetup.configure();
const expect = chai.expect;
const ADDRESS_REGEX = /^(0x)?[0-9a-f]{40}$/i;
const RPC_URL = `https://mainnet.infura.io/v3/${process.env.INFURA_PROJECT_ID}`;
const provider = dev_utils_1.web3Factory.getRpcProvider({ rpcUrl: RPC_URL });
// tslint:disable:custom-no-magic-numbers
let bancorService;
// These tests test the bancor SDK against mainnet
// TODO (xianny): After we move asset-swapper out of the monorepo, we should add an env variable to circle CI to run this test
describe.skip('Bancor Service', () => {
    const eth = '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee';
    const bnt = '0x1f573d6fb3f13d689ff844b4ce37794d79a7ff1c';
    it('should retrieve the bancor network address', () => __awaiter(this, void 0, void 0, function* () {
        bancorService = yield bancor_service_1.BancorService.createAsync(provider);
        const networkAddress = bancorService.getBancorNetworkAddress();
        expect(networkAddress).to.match(ADDRESS_REGEX);
    }));
    it('should retrieve a quote', () => __awaiter(this, void 0, void 0, function* () {
        const amt = new src_1.BigNumber(10e18);
        const quotes = yield bancorService.getQuotesAsync(eth, bnt, [amt]);
        const fillData = quotes[0].fillData;
        // get rate from the bancor sdk
        const blockchain = bancorService.sdk._core.blockchains[types_1.BlockchainType.Ethereum];
        const sourceDecimals = yield ethereum_1.getDecimals(blockchain, bancor_service_1.token(eth));
        const rate = yield bancorService.sdk.pricing.getRateByPath(fillData.path.map(p => bancor_service_1.token(p)), helpers_1.fromWei(amt.toString(), sourceDecimals));
        const expectedRate = helpers_1.toWei(rate, yield ethereum_1.getDecimals(blockchain, bancor_service_1.token(bnt)));
        expect(fillData.networkAddress).to.match(ADDRESS_REGEX);
        expect(fillData.path[0].toLowerCase()).to.eq(eth);
        expect(fillData.path[2].toLowerCase()).to.eq(bnt);
        expect(fillData.path.length).to.eq(3); // eth -> bnt should be single hop!
        expect(quotes[0].amount.dp(0)).to.bignumber.eq(new src_1.BigNumber(expectedRate).multipliedBy(bancorService.minReturnAmountBufferPercentage).dp(0));
    }));
    // HACK (xianny): for exploring SDK results
    it('should retrieve multiple quotes', () => __awaiter(this, void 0, void 0, function* () {
        const amts = [1, 10, 100, 1000].map(a => new src_1.BigNumber(a).multipliedBy(10e18));
        const quotes = yield bancorService.getQuotesAsync(eth, bnt, amts);
        quotes.map((q, i) => {
            // tslint:disable:no-console
            const fillData = q.fillData;
            console.log(`Input ${amts[i].toExponential()}; Output: ${q.amount}; Ratio: ${q.amount.dividedBy(amts[i])}, Path: ${fillData.path.length}\nPath: ${JSON.stringify(fillData.path)}`);
            // tslint:enable:no-console
        });
    }));
});
//# sourceMappingURL=bancor_service_test.js.map