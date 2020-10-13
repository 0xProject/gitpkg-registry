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
const dev_utils_1 = require("@0x/dev-utils");
const utils_1 = require("@0x/utils");
const fs = require("fs");
const path = require("path");
const migration_1 = require("./migration");
(() => __awaiter(this, void 0, void 0, function* () {
    let providerConfigs;
    let provider;
    let txDefaults;
    const packageJsonPath = path.join(__dirname, '../..', 'package.json');
    const packageJsonString = fs.readFileSync(packageJsonPath, 'utf8');
    const packageJson = JSON.parse(packageJsonString);
    if (packageJson.config === undefined || packageJson.config.snapshot_name === undefined) {
        throw new Error(`Did not find 'snapshot_name' key in package.json config`);
    }
    providerConfigs = { shouldUseInProcessGanache: true, ganacheDatabasePath: packageJson.config.snapshot_name };
    provider = dev_utils_1.web3Factory.getRpcProvider(providerConfigs);
    txDefaults = {
        from: dev_utils_1.devConstants.TESTRPC_FIRST_ADDRESS,
    };
    yield migration_1.runMigrationsAsync(provider, txDefaults);
    process.exit(0);
}))().catch(err => {
    utils_1.logUtils.log(err);
    process.exit(1);
});
//# sourceMappingURL=migrate_snapshot.js.map