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
const contracts_test_utils_1 = require("@0x/contracts-test-utils");
const orderbook_1 = require("@0x/orderbook");
const utils_1 = require("@0x/utils");
const TypeMoq = require("typemoq");
const swap_quoter_1 = require("../../src/swap_quoter");
// tslint:disable: max-classes-per-file
class OrderbookClass extends orderbook_1.Orderbook {
    // tslint:disable-next-line:prefer-function-over-method
    getOrdersAsync(_makerAssetData, _takerAssetData) {
        return __awaiter(this, void 0, void 0, function* () {
            return [];
        });
    }
    // tslint:disable-next-line:prefer-function-over-method
    getAvailableAssetDatasAsync() {
        return __awaiter(this, void 0, void 0, function* () {
            return [];
        });
    }
    // tslint:disable-next-line:prefer-function-over-method
    addOrdersAsync(_orders) {
        return __awaiter(this, void 0, void 0, function* () {
            return { accepted: [], rejected: [] };
        });
    }
}
exports.orderbookMock = () => {
    return TypeMoq.Mock.ofType(OrderbookClass, TypeMoq.MockBehavior.Strict);
};
exports.mockAvailableAssetDatas = (mockOrderbook, availableAssetDatas) => {
    mockOrderbook
        .setup((op) => __awaiter(this, void 0, void 0, function* () { return op.getAvailableAssetDatasAsync(); }))
        .returns(() => __awaiter(this, void 0, void 0, function* () { return availableAssetDatas; }))
        .verifiable(TypeMoq.Times.once());
    mockOrderbook
        .setup(o => o._orderProvider)
        .returns(() => undefined)
        .verifiable(TypeMoq.Times.atLeast(0));
    mockOrderbook
        .setup(o => o._orderStore)
        .returns(() => undefined)
        .verifiable(TypeMoq.Times.atLeast(0));
};
const partiallyMockedSwapQuoter = (provider, orderbook) => {
    const rawSwapQuoter = new swap_quoter_1.SwapQuoter(provider, orderbook);
    const mockedSwapQuoter = TypeMoq.Mock.ofInstance(rawSwapQuoter, TypeMoq.MockBehavior.Loose, false);
    mockedSwapQuoter.callBase = true;
    return mockedSwapQuoter;
};
class ProtocolFeeUtilsClass {
    static getInstance(..._args) {
        return {
            getGasPriceEstimationOrThrowAsync: () => __awaiter(this, void 0, void 0, function* () { return Promise.resolve(new utils_1.BigNumber(contracts_test_utils_1.constants.DEFAULT_GAS_PRICE)); }),
        };
    }
    // tslint:disable-next-line:prefer-function-over-method
    getGasPriceEstimationOrThrowAsync(_shouldHardRefresh) {
        return __awaiter(this, void 0, void 0, function* () {
            return new utils_1.BigNumber(contracts_test_utils_1.constants.DEFAULT_GAS_PRICE);
        });
    }
}
exports.protocolFeeUtilsMock = () => {
    const mockProtocolFeeUtils = TypeMoq.Mock.ofType(ProtocolFeeUtilsClass, TypeMoq.MockBehavior.Loose);
    mockProtocolFeeUtils.callBase = true;
    return mockProtocolFeeUtils;
};
const mockGetSignedOrdersWithFillableAmountsAsyncAsync = (mockedSwapQuoter, makerAssetData, takerAssetData, signedOrders) => {
    mockedSwapQuoter
        .setup((a) => __awaiter(this, void 0, void 0, function* () { return a.getSignedOrdersWithFillableAmountsAsync(makerAssetData, takerAssetData); }))
        .returns(() => __awaiter(this, void 0, void 0, function* () { return signedOrders; }))
        .verifiable(TypeMoq.Times.once());
};
exports.mockedSwapQuoterWithFillableAmounts = (provider, orderbook, makerAssetData, takerAssetData, signedOrders) => {
    const mockedAssetQuoter = partiallyMockedSwapQuoter(provider, orderbook);
    mockGetSignedOrdersWithFillableAmountsAsyncAsync(mockedAssetQuoter, makerAssetData, takerAssetData, signedOrders);
    return mockedAssetQuoter;
};
//# sourceMappingURL=mocks.js.map