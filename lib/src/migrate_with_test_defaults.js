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
const index_1 = require("./index");
/**
 * Configures and runs the migrations exactly once. Any subsequent times this is
 * called, it returns the cached addresses.
 * @returns The addresses of contracts that were deployed during the migrations.
 */
function migrateOnceAsync(provider) {
    return __awaiter(this, void 0, void 0, function* () {
        const txDefaults = {
            gas: dev_utils_1.devConstants.GAS_LIMIT,
            from: dev_utils_1.devConstants.TESTRPC_FIRST_ADDRESS,
        };
        return index_1.runMigrationsOnceAsync(provider, txDefaults);
    });
}
exports.migrateOnceAsync = migrateOnceAsync;
//# sourceMappingURL=migrate_with_test_defaults.js.map