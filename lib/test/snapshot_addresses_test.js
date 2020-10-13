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
const dev_utils_1 = require("@0x/dev-utils");
const chai = require("chai");
const dirtyChai = require("dirty-chai");
require("mocha");
const migration_1 = require("../src/migration");
chai.use(dirtyChai);
const expect = chai.expect;
describe('addresses', () => {
    it('should contain the same addresses as contract-addresses', () => __awaiter(this, void 0, void 0, function* () {
        const providerConfigs = { shouldUseInProcessGanache: true };
        const provider = dev_utils_1.web3Factory.getRpcProvider(providerConfigs);
        const txDefaults = {
            from: dev_utils_1.devConstants.TESTRPC_FIRST_ADDRESS,
        };
        const migrationAddresses = yield migration_1.runMigrationsAsync(provider, txDefaults);
        const expectedAddresses = contract_addresses_1.getContractAddressesForChainOrThrow(contract_addresses_1.ChainId.Ganache);
        expect(migrationAddresses).to.deep.eq(expectedAddresses);
    }));
});
//# sourceMappingURL=snapshot_addresses_test.js.map