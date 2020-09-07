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
// These tests test the bancor SDK against mainnet
// TODO (xianny): After we move asset-swapper out of the monorepo, we should add an env variable to circle CI to run this test
describe.skip('Bancor Service', () => {
    const bancorService = new bancor_service_1.BancorService(provider);
    const eth = '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee';
    const bnt = '0x1f573d6fb3f13d689ff844b4ce37794d79a7ff1c';
    it('should retrieve the bancor network address', () => __awaiter(this, void 0, void 0, function* () {
        const networkAddress = yield bancorService.getBancorNetworkAddressAsync();
        expect(networkAddress).to.match(ADDRESS_REGEX);
    }));
    it('should retrieve a quote', () => __awaiter(this, void 0, void 0, function* () {
        const amt = new src_1.BigNumber(2);
        const quote = yield bancorService.getQuoteAsync(eth, bnt, amt);
        const fillData = quote.fillData;
        // get rate from the bancor sdk
        const sdk = yield bancorService.getSDKAsync();
        const expectedAmt = yield sdk.pricing.getRateByPath(fillData.path.map(s => bancor_service_1.token(s)), amt.toString());
        expect(fillData.networkAddress).to.match(ADDRESS_REGEX);
        expect(fillData.path).to.be.an.instanceOf(Array);
        expect(fillData.path).to.have.lengthOf(3);
        expect(quote.amount.dp(0)).to.bignumber.eq(new src_1.BigNumber(expectedAmt).multipliedBy(bancorService.minReturnAmountBufferPercentage).dp(0));
    }));
    // HACK (xianny): for exploring SDK results
    it('should retrieve multiple quotes', () => __awaiter(this, void 0, void 0, function* () {
        const amts = [1, 10, 100, 1000].map(a => new src_1.BigNumber(a).multipliedBy(10e18));
        const quotes = yield Promise.all(amts.map((amount) => __awaiter(this, void 0, void 0, function* () { return bancorService.getQuoteAsync(eth, bnt, amount); })));
        quotes.map((q, i) => {
            // tslint:disable:no-console
            const fillData = q.fillData;
            console.log(`Input ${amts[i].toExponential()}; Output: ${q.amount}; Path: ${fillData.path.length}\nPath: ${JSON.stringify(fillData.path)}`);
            // tslint:enable:no-console
        });
    }));
});
//# sourceMappingURL=bancor_service_test.js.map