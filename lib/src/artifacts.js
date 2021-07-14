"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.artifacts = void 0;
const BalanceChecker = require("../generated-artifacts/BalanceChecker.json");
const CallDispatcher = require("../generated-artifacts/CallDispatcher.json");
const ERC20BridgeSampler = require("../generated-artifacts/ERC20BridgeSampler.json");
const FakeTaker = require("../generated-artifacts/FakeTaker.json");
const NativeOrderUtils = require("../generated-artifacts/NativeOrderUtils.json");
const NetworkUtils = require("../generated-artifacts/NetworkUtils.json");
const UniswapV3BuySampler = require("../generated-artifacts/UniswapV3BuySampler.json");
const UniswapV3SellSampler = require("../generated-artifacts/UniswapV3SellSampler.json");
exports.artifacts = {
    ERC20BridgeSampler: ERC20BridgeSampler,
    BalanceChecker: BalanceChecker,
    FakeTaker: FakeTaker,
    CallDispatcher: CallDispatcher,
    UniswapV3SellSampler: UniswapV3SellSampler,
    UniswapV3BuySampler: UniswapV3BuySampler,
    NetworkUtils: NetworkUtils,
    NativeOrderUtils: NativeOrderUtils,
};
//# sourceMappingURL=artifacts.js.map