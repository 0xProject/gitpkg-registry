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
const chai = require("chai");
require("mocha");
const assert_1 = require("../src/assert");
const chai_setup_1 = require("./utils/chai_setup");
const web3_wrapper_1 = require("./utils/web3_wrapper");
chai_setup_1.chaiSetup.configure();
const expect = chai.expect;
describe('Assertion library', () => {
    describe('#isSenderAddressHexAsync', () => {
        it('throws when address is invalid', () => __awaiter(this, void 0, void 0, function* () {
            const address = '0xdeadbeef';
            const varName = 'address';
            return expect(assert_1.assert.isSenderAddressAsync(varName, address, web3_wrapper_1.web3Wrapper)).to.be.rejectedWith(`Expected ${varName} to be of type ETHAddressHex, encountered: ${address}`);
        }));
        it('throws when address is unavailable', () => __awaiter(this, void 0, void 0, function* () {
            const validUnrelatedAddress = '0x8b0292b11a196601eddce54b665cafeca0347d42';
            const varName = 'address';
            return expect(assert_1.assert.isSenderAddressAsync(varName, validUnrelatedAddress, web3_wrapper_1.web3Wrapper)).to.be.rejectedWith(`Specified ${varName} ${validUnrelatedAddress} isn't available through the supplied web3 provider`);
        }));
        it("doesn't throw if address is available", () => __awaiter(this, void 0, void 0, function* () {
            const availableAddress = (yield web3_wrapper_1.web3Wrapper.getAvailableAddressesAsync())[0];
            const varName = 'address';
            return expect(assert_1.assert.isSenderAddressAsync(varName, availableAddress, web3_wrapper_1.web3Wrapper)).to.become(undefined);
        }));
    });
});
//# sourceMappingURL=assert_test.js.map