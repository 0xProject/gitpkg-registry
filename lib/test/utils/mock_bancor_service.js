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
const bancor_service_1 = require("../../src/utils/market_operation_utils/bancor_service");
class MockBancorService extends bancor_service_1.BancorService {
    constructor(provider, handlers) {
        super(provider);
        this.handlers = handlers;
        // Bancor recommends setting this value to 2% under the expected return amount
        this.minReturnAmountBufferPercentage = 0.98;
    }
    getQuoteAsync(fromToken, toToken, amount) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            return this.handlers.getQuoteAsync
                ? this.handlers.getQuoteAsync(fromToken, toToken, amount)
                : _super("getQuoteAsync").call(this, fromToken, toToken, amount);
        });
    }
}
exports.MockBancorService = MockBancorService;
//# sourceMappingURL=mock_bancor_service.js.map