import { Orderbook } from '../swap_quoter';
import { OrderProviderRequest, SwapQuote, SwapQuoteInfo } from '../types';
import { OptimizedMarketOrder } from './market_operation_utils/types';
export declare const assert: {
    isValidSwapQuote(variableName: string, swapQuote: SwapQuote): void;
    isValidSwapQuoteOrders(variableName: string, orders: OptimizedMarketOrder[], makerToken: string, takerToken: string): void;
    isValidTwoHopSwapQuoteOrders(variableName: string, orders: OptimizedMarketOrder[], makerToken: string, takerToken: string): void;
    isValidSwapQuoteInfo(variableName: string, swapQuoteInfo: SwapQuoteInfo): void;
    isValidOrderbook(variableName: string, orderFetcher: Orderbook): void;
    isValidOrderProviderRequest(variableName: string, orderFetcherRequest: OrderProviderRequest): void;
    isValidPercentage(variableName: string, percentage: number): void;
    isValidForwarderExtensionContractOpts(variableName: string, opts: any): void;
    isBigNumber(variableName: string, value: import("bignumber.js").BigNumber): void;
    isNumberLike(variableName: string, value: number | import("bignumber.js").BigNumber): void;
    isValidBaseUnitAmount(variableName: string, value: import("bignumber.js").BigNumber): void;
    isString(variableName: string, value: string): void;
    isFunction(variableName: string, value: any): void;
    isHexString(variableName: string, value: string): void;
    isETHAddressHex(variableName: string, value: string): void;
    doesBelongToStringEnum(variableName: string, value: string, stringEnum: any): void;
    hasAtMostOneUniqueValue(value: any[], errMsg: string): void;
    isNumber(variableName: string, value: number): void;
    isNumberOrBigNumber(variableName: string, value: any): void;
    isBoolean(variableName: string, value: boolean): void;
    isWeb3Provider(variableName: string, value: any): void;
    doesConformToSchema(variableName: string, value: any, schema: import("jsonschema").Schema, subSchemas?: import("jsonschema").Schema[] | undefined): void;
    doesMatchRegex(variableName: string, value: string, regex: RegExp): void;
    isWebUri(variableName: string, value: any): void;
    isUri(variableName: string, value: any): void;
    isBlockParam(variableName: string, value: any): void;
    isArray(variableName: string, value: any): void;
    assert(condition: boolean, message: string): void;
    typeAssertionMessage(variableName: string, type: string, value: any): string;
};
//# sourceMappingURL=assert.d.ts.map