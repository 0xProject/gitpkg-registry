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
const sdk_1 = require("@bancor/sdk");
const bancor_service_1 = require("../../src/utils/market_operation_utils/bancor_service");
class MockBancorService extends bancor_service_1.BancorService {
    constructor(sdk, handlers) {
        super(sdk);
        this.handlers = handlers;
        // Bancor recommends setting this value to 2% under the expected return amount
        this.minReturnAmountBufferPercentage = 0.98;
    }
    static createMockAsync(handlers) {
        return __awaiter(this, void 0, void 0, function* () {
            const sdk = new sdk_1.SDK();
            return new MockBancorService(sdk, handlers);
        });
    }
    getQuotesAsync(fromToken, toToken, amounts) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            return this.handlers.getQuotesAsync
                ? this.handlers.getQuotesAsync(fromToken, toToken, amounts)
                : _super("getQuotesAsync").call(this, fromToken, toToken, amounts);
        });
    }
}
exports.MockBancorService = MockBancorService;
//# sourceMappingURL=mock_bancor_service.js.map