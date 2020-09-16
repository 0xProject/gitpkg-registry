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
const assert_1 = require("@0x/assert");
// tslint:enable:no-unused-variable
const _ = require("lodash");
const utils_1 = require("./utils");
exports.assert = Object.assign({}, assert_1.assert, { isSenderAddressAsync(variableName, senderAddressHex, web3Wrapper) {
        return __awaiter(this, void 0, void 0, function* () {
            assert_1.assert.isETHAddressHex(variableName, senderAddressHex);
            const isSenderAddressAvailable = yield web3Wrapper.isSenderAddressAvailableAsync(senderAddressHex);
            assert_1.assert.assert(isSenderAddressAvailable, `Specified ${variableName} ${senderAddressHex} isn't available through the supplied web3 provider`);
        });
    },
    isOneOfExpectedSignatureTypes(signature, signatureTypes) {
        assert_1.assert.isHexString('signature', signature);
        const signatureTypeIndexIfExists = utils_1.utils.getSignatureTypeIndexIfExists(signature);
        const isExpectedSignatureType = _.includes(signatureTypes, signatureTypeIndexIfExists);
        if (!isExpectedSignatureType) {
            throw new Error(`Unexpected signatureType: ${signatureTypeIndexIfExists}. Valid signature types: ${signatureTypes}`);
        }
    } });
//# sourceMappingURL=assert.js.map