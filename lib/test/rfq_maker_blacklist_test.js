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
const constants_1 = require("../src/constants");
const rfq_maker_blacklist_1 = require("../src/utils/rfq_maker_blacklist");
const chai_setup_1 = require("./utils/chai_setup");
chai_setup_1.chaiSetup.configure();
const expect = chai.expect;
describe('RfqMakerBlacklist', () => {
    it('does blacklist', () => __awaiter(this, void 0, void 0, function* () {
        const blacklistDurationMinutes = 1;
        const timeoutStreakThreshold = 3;
        const blacklist = new rfq_maker_blacklist_1.RfqMakerBlacklist(blacklistDurationMinutes, timeoutStreakThreshold);
        blacklist.logTimeoutOrLackThereof('makerA', true);
        blacklist.logTimeoutOrLackThereof('makerA', true);
        expect(blacklist.isMakerBlacklisted('makerA')).to.be.false();
        blacklist.logTimeoutOrLackThereof('makerA', true);
        expect(blacklist.isMakerBlacklisted('makerA')).to.be.true();
    }));
    it('does unblacklist', () => __awaiter(this, void 0, void 0, function* () {
        const blacklistDurationMinutes = 0.1;
        const timeoutStreakThreshold = 3;
        const blacklist = new rfq_maker_blacklist_1.RfqMakerBlacklist(blacklistDurationMinutes, timeoutStreakThreshold);
        blacklist.logTimeoutOrLackThereof('makerA', true);
        blacklist.logTimeoutOrLackThereof('makerA', true);
        blacklist.logTimeoutOrLackThereof('makerA', true);
        expect(blacklist.isMakerBlacklisted('makerA')).to.be.true();
        yield new Promise(r => {
            setTimeout(r, blacklistDurationMinutes * constants_1.constants.ONE_MINUTE_MS);
        });
        expect(blacklist.isMakerBlacklisted('makerA')).to.be.false();
    }));
});
//# sourceMappingURL=rfq_maker_blacklist_test.js.map