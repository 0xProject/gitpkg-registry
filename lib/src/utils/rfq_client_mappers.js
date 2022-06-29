"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toSignedNativeOrder = void 0;
const protocol_utils_1 = require("@0x/protocol-utils");
/**
 * Converts a RfqClientRfqOrderFirmQuote to a SignedNativeOrder
 */
const toSignedNativeOrder = (quote) => {
    return {
        type: protocol_utils_1.FillQuoteTransformerOrderType.Rfq,
        order: quote.order,
        signature: quote.signature,
    };
};
exports.toSignedNativeOrder = toSignedNativeOrder;
//# sourceMappingURL=rfq_client_mappers.js.map