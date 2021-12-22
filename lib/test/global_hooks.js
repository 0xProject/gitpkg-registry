"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
before('set up mocha', function () {
    return __awaiter(this, void 0, void 0, function* () {
        // HACK: Since the migrations take longer then our global mocha timeout limit
        // we manually increase it for this before hook.
        const mochaTestTimeoutMs = 25000;
        this.timeout(mochaTestTimeoutMs); // tslint:disable-line:no-invalid-this
    });
});
//# sourceMappingURL=global_hooks.js.map