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
const subproviders_1 = require("@0x/subproviders");
const utils_1 = require("@0x/utils");
const hw_app_eth_1 = require("@ledgerhq/hw-app-eth");
// tslint:disable:no-implicit-dependencies
const hw_transport_node_hid_1 = require("@ledgerhq/hw-transport-node-hid");
function ledgerEthereumNodeJsClientFactoryAsync() {
    return __awaiter(this, void 0, void 0, function* () {
        const ledgerConnection = yield hw_transport_node_hid_1.default.create();
        const ledgerEthClient = new hw_app_eth_1.default(ledgerConnection);
        return ledgerEthClient;
    });
}
exports.providerFactory = {
    getLedgerProviderAsync(networkId, rpcUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            const provider = new subproviders_1.Web3ProviderEngine();
            const ledgerWalletConfigs = {
                networkId,
                ledgerEthereumClientFactoryAsync: ledgerEthereumNodeJsClientFactoryAsync,
            };
            const ledgerSubprovider = new subproviders_1.LedgerSubprovider(ledgerWalletConfigs);
            provider.addProvider(ledgerSubprovider);
            provider.addProvider(new subproviders_1.RPCSubprovider(rpcUrl));
            utils_1.providerUtils.startProviderEngine(provider);
            return provider;
        });
    },
};
//# sourceMappingURL=provider_factory.js.map