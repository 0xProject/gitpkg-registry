"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.valueByChainId = void 0;
const contract_addresses_1 = require("@0x/contract-addresses");
// TODO(kimpers): Consolidate this implementation with the one in @0x/token-metadata
function valueByChainId(rest, defaultValue) {
    // TODO I don't like this but iterating through enums is weird
    return Object.assign({ [contract_addresses_1.ChainId.Mainnet]: defaultValue, [contract_addresses_1.ChainId.Ropsten]: defaultValue, [contract_addresses_1.ChainId.Rinkeby]: defaultValue, [contract_addresses_1.ChainId.Kovan]: defaultValue, [contract_addresses_1.ChainId.Ganache]: defaultValue, [contract_addresses_1.ChainId.BSC]: defaultValue, [contract_addresses_1.ChainId.Polygon]: defaultValue, [contract_addresses_1.ChainId.PolygonMumbai]: defaultValue, [contract_addresses_1.ChainId.Avalanche]: defaultValue, [contract_addresses_1.ChainId.Fantom]: defaultValue, [contract_addresses_1.ChainId.Celo]: defaultValue, [contract_addresses_1.ChainId.Optimism]: defaultValue }, (rest || {}));
}
exports.valueByChainId = valueByChainId;
//# sourceMappingURL=utils.js.map