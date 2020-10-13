#!/usr/bin/env node
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
const yargs = require("yargs");
const migration_1 = require("./migration");
const args = yargs
    .option('rpc-url', {
    describe: 'Endpoint where backing Ethereum JSON RPC interface is available',
    type: 'string',
    demandOption: false,
    default: 'http://localhost:8545',
})
    .option('from', {
    describe: 'Ethereum address from which to deploy the contracts',
    type: 'string',
    demandOption: true,
})
    .option('pk', {
    describe: 'Private key for the `from` address',
    type: 'string',
})
    .example('$0 --rpc-url http://localhost:8545 --from 0x5409ed021d9299bf6814279a6a1411a7e866a631 --pk 0xf2f48ee19680706196e2e339e5da3491186e0c4c5030670656b0e0164837257d', 'Full usage example').argv;
(() => __awaiter(this, void 0, void 0, function* () {
    const rpcSubprovider = new subproviders_1.RPCSubprovider(args['rpc-url']);
    const provider = new subproviders_1.Web3ProviderEngine();
    if (args.pk !== undefined && args.pk !== '') {
        const pkSubprovider = new subproviders_1.PrivateKeyWalletSubprovider(args.pk);
        provider.addProvider(pkSubprovider);
    }
    provider.addProvider(rpcSubprovider);
    utils_1.providerUtils.startProviderEngine(provider);
    const normalizedFromAddress = args.from.toLowerCase();
    const txDefaults = {
        from: normalizedFromAddress,
    };
    yield migration_1.runMigrationsAsync(provider, txDefaults);
    process.exit(0);
}))().catch(err => {
    utils_1.logUtils.log(err);
    process.exit(1);
});
//# sourceMappingURL=cli.js.map