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
const errors_1 = require("../../src/errors");
exports.testHelpers = {
    expectInsufficientLiquidityErrorAsync: (expect, functionWhichTriggersErrorAsync, expectedAmountAvailableToFill) => __awaiter(this, void 0, void 0, function* () {
        let wasErrorThrown = false;
        try {
            yield functionWhichTriggersErrorAsync();
        }
        catch (e) {
            wasErrorThrown = true;
            expect(e).to.be.instanceOf(errors_1.InsufficientAssetLiquidityError);
            if (expectedAmountAvailableToFill) {
                expect(e.amountAvailableToFill).to.be.bignumber.equal(expectedAmountAvailableToFill);
            }
            else {
                expect(e.amountAvailableToFill).to.be.undefined();
            }
        }
        expect(wasErrorThrown).to.be.true();
    }),
};
//# sourceMappingURL=test_helpers.js.map