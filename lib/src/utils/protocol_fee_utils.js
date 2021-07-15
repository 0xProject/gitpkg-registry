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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProtocolFeeUtils = void 0;
const utils_1 = require("@0x/utils");
const fetch = require("axios");
const heartbeats = require("heartbeats");
const constants_1 = require("../constants");
const types_1 = require("../types");
const MAX_ERROR_COUNT = 5;
class ProtocolFeeUtils {
    constructor(gasPricePollingIntervalInMs, ethGasStationUrl = constants_1.constants.ETH_GAS_STATION_API_URL, initialGasPrice = constants_1.constants.ZERO_AMOUNT) {
        this._gasPriceEstimation = constants_1.constants.ZERO_AMOUNT;
        this._errorCount = 0;
        this._gasPriceHeart = heartbeats.createHeart(gasPricePollingIntervalInMs);
        this._gasPriceEstimation = initialGasPrice;
        this._ethGasStationUrl = ethGasStationUrl;
        this._initializeHeartBeat();
    }
    static getInstance(gasPricePollingIntervalInMs, ethGasStationUrl = constants_1.constants.ETH_GAS_STATION_API_URL, initialGasPrice = constants_1.constants.ZERO_AMOUNT) {
        if (!ProtocolFeeUtils._instance) {
            ProtocolFeeUtils._instance = new ProtocolFeeUtils(gasPricePollingIntervalInMs, ethGasStationUrl, initialGasPrice);
        }
        return ProtocolFeeUtils._instance;
    }
    getGasPriceEstimationOrThrowAsync(shouldHardRefresh) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._gasPriceEstimation.eq(constants_1.constants.ZERO_AMOUNT)) {
                return this._getGasPriceFromGasStationOrThrowAsync();
            }
            if (shouldHardRefresh) {
                return this._getGasPriceFromGasStationOrThrowAsync();
            }
            else {
                return this._gasPriceEstimation;
            }
        });
    }
    /**
     * Destroys any subscriptions or connections.
     */
    destroyAsync() {
        return __awaiter(this, void 0, void 0, function* () {
            this._gasPriceHeart.kill();
        });
    }
    // tslint:disable-next-line: prefer-function-over-method
    _getGasPriceFromGasStationOrThrowAsync() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield fetch(this._ethGasStationUrl);
                const gasInfo = res.data;
                // Eth Gas Station result is gwei * 10
                // tslint:disable-next-line:custom-no-magic-numbers
                const BASE_TEN = 10;
                const gasPriceGwei = new utils_1.BigNumber(gasInfo.fast / BASE_TEN);
                // tslint:disable-next-line:custom-no-magic-numbers
                const unit = new utils_1.BigNumber(BASE_TEN).pow(9);
                const gasPriceWei = unit.times(gasPriceGwei);
                // Reset the error count to 0 once we have a successful response
                this._errorCount = 0;
                return gasPriceWei;
            }
            catch (e) {
                this._errorCount++;
                // If we've reached our max error count then throw
                if (this._errorCount > MAX_ERROR_COUNT || this._gasPriceEstimation.isZero()) {
                    this._errorCount = 0;
                    throw new Error(types_1.SwapQuoterError.NoGasPriceProvidedOrEstimated);
                }
                return this._gasPriceEstimation;
            }
        });
    }
    _initializeHeartBeat() {
        this._gasPriceHeart.createEvent(1, () => __awaiter(this, void 0, void 0, function* () {
            this._gasPriceEstimation = yield this._getGasPriceFromGasStationOrThrowAsync();
        }));
    }
}
exports.ProtocolFeeUtils = ProtocolFeeUtils;
//# sourceMappingURL=protocol_fee_utils.js.map