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
const contract_addresses_1 = require("@0x/contract-addresses");
const contracts_test_utils_1 = require("@0x/contracts-test-utils");
const contracts_zero_ex_1 = require("@0x/contracts-zero-ex");
const src_1 = require("../../src");
const orders_1 = require("../../src/utils/market_operation_utils/orders");
(0, contracts_test_utils_1.blockchainTests)('Bridge adapter source compatibility tests', env => {
    (0, contracts_test_utils_1.describe)('Avalanche', () => {
        let adapter;
        before(() => __awaiter(void 0, void 0, void 0, function* () {
            adapter = yield contracts_zero_ex_1.AvalancheBridgeAdapterContract.deployFrom0xArtifactAsync(contracts_zero_ex_1.artifacts.AvalancheBridgeAdapter, env.provider, env.txDefaults, contracts_zero_ex_1.artifacts, contracts_test_utils_1.constants.NULL_ADDRESS);
        }));
        it('sell sources', () => __awaiter(void 0, void 0, void 0, function* () {
            const sellSources = src_1.SELL_SOURCE_FILTER_BY_CHAIN_ID[contract_addresses_1.ChainId.Avalanche].exclude([
                src_1.ERC20BridgeSource.Native,
                src_1.ERC20BridgeSource.MultiHop,
            ]).sources;
            return Promise.all(sellSources.map((source) => __awaiter(void 0, void 0, void 0, function* () {
                const isSupported = yield adapter
                    .isSupportedSource((0, orders_1.getErc20BridgeSourceToBridgeSource)(source))
                    .callAsync();
                (0, contracts_test_utils_1.expect)(isSupported, `${source} is not supported`).to.be.true();
            })));
        }));
        it('buy sources', () => __awaiter(void 0, void 0, void 0, function* () {
            const buySources = src_1.BUY_SOURCE_FILTER_BY_CHAIN_ID[contract_addresses_1.ChainId.Avalanche].exclude([
                src_1.ERC20BridgeSource.Native,
                src_1.ERC20BridgeSource.MultiHop,
            ]).sources;
            return Promise.all(buySources.map((source) => __awaiter(void 0, void 0, void 0, function* () {
                const isSupported = yield adapter
                    .isSupportedSource((0, orders_1.getErc20BridgeSourceToBridgeSource)(source))
                    .callAsync();
                (0, contracts_test_utils_1.expect)(isSupported, `${source} is not supported`).to.be.true();
            })));
        }));
    });
    (0, contracts_test_utils_1.describe)('BSC', () => {
        let adapter;
        before(() => __awaiter(void 0, void 0, void 0, function* () {
            adapter = yield contracts_zero_ex_1.BSCBridgeAdapterContract.deployFrom0xArtifactAsync(contracts_zero_ex_1.artifacts.BSCBridgeAdapter, env.provider, env.txDefaults, contracts_zero_ex_1.artifacts, contracts_test_utils_1.constants.NULL_ADDRESS);
        }));
        it('sell sources', () => __awaiter(void 0, void 0, void 0, function* () {
            const sellSources = src_1.SELL_SOURCE_FILTER_BY_CHAIN_ID[contract_addresses_1.ChainId.BSC].exclude([
                src_1.ERC20BridgeSource.Native,
                src_1.ERC20BridgeSource.MultiHop,
            ]).sources;
            return Promise.all(sellSources.map((source) => __awaiter(void 0, void 0, void 0, function* () {
                const isSupported = yield adapter
                    .isSupportedSource((0, orders_1.getErc20BridgeSourceToBridgeSource)(source))
                    .callAsync();
                (0, contracts_test_utils_1.expect)(isSupported, `${source} is not supported`).to.be.true();
            })));
        }));
        it('buy sources', () => __awaiter(void 0, void 0, void 0, function* () {
            const buySources = src_1.BUY_SOURCE_FILTER_BY_CHAIN_ID[contract_addresses_1.ChainId.BSC].exclude([
                src_1.ERC20BridgeSource.Native,
                src_1.ERC20BridgeSource.MultiHop,
            ]).sources;
            return Promise.all(buySources.map((source) => __awaiter(void 0, void 0, void 0, function* () {
                const isSupported = yield adapter
                    .isSupportedSource((0, orders_1.getErc20BridgeSourceToBridgeSource)(source))
                    .callAsync();
                (0, contracts_test_utils_1.expect)(isSupported, `${source} is not supported`).to.be.true();
            })));
        }));
    });
    (0, contracts_test_utils_1.describe)('Celo', () => {
        let adapter;
        before(() => __awaiter(void 0, void 0, void 0, function* () {
            adapter = yield contracts_zero_ex_1.CeloBridgeAdapterContract.deployFrom0xArtifactAsync(contracts_zero_ex_1.artifacts.CeloBridgeAdapter, env.provider, env.txDefaults, contracts_zero_ex_1.artifacts, contracts_test_utils_1.constants.NULL_ADDRESS);
        }));
        it('sell sources', () => __awaiter(void 0, void 0, void 0, function* () {
            const sellSources = src_1.SELL_SOURCE_FILTER_BY_CHAIN_ID[contract_addresses_1.ChainId.Celo].exclude([
                src_1.ERC20BridgeSource.Native,
                src_1.ERC20BridgeSource.MultiHop,
            ]).sources;
            return Promise.all(sellSources.map((source) => __awaiter(void 0, void 0, void 0, function* () {
                const isSupported = yield adapter
                    .isSupportedSource((0, orders_1.getErc20BridgeSourceToBridgeSource)(source))
                    .callAsync();
                (0, contracts_test_utils_1.expect)(isSupported, `${source} is not supported`).to.be.true();
            })));
        }));
        it('buy sources', () => __awaiter(void 0, void 0, void 0, function* () {
            const buySources = src_1.BUY_SOURCE_FILTER_BY_CHAIN_ID[contract_addresses_1.ChainId.Celo].exclude([
                src_1.ERC20BridgeSource.Native,
                src_1.ERC20BridgeSource.MultiHop,
            ]).sources;
            return Promise.all(buySources.map((source) => __awaiter(void 0, void 0, void 0, function* () {
                const isSupported = yield adapter
                    .isSupportedSource((0, orders_1.getErc20BridgeSourceToBridgeSource)(source))
                    .callAsync();
                (0, contracts_test_utils_1.expect)(isSupported, `${source} is not supported`).to.be.true();
            })));
        }));
    });
    (0, contracts_test_utils_1.describe)('Ethereum', () => {
        let adapter;
        before(() => __awaiter(void 0, void 0, void 0, function* () {
            adapter = yield contracts_zero_ex_1.EthereumBridgeAdapterContract.deployFrom0xArtifactAsync(contracts_zero_ex_1.artifacts.EthereumBridgeAdapter, env.provider, env.txDefaults, contracts_zero_ex_1.artifacts, contracts_test_utils_1.constants.NULL_ADDRESS);
        }));
        it('sell sources', () => __awaiter(void 0, void 0, void 0, function* () {
            const sellSources = src_1.SELL_SOURCE_FILTER_BY_CHAIN_ID[contract_addresses_1.ChainId.Mainnet].exclude([
                src_1.ERC20BridgeSource.Native,
                src_1.ERC20BridgeSource.MultiHop,
            ]).sources;
            return Promise.all(sellSources.map((source) => __awaiter(void 0, void 0, void 0, function* () {
                const isSupported = yield adapter
                    .isSupportedSource((0, orders_1.getErc20BridgeSourceToBridgeSource)(source))
                    .callAsync();
                (0, contracts_test_utils_1.expect)(isSupported, `${source} is not supported`).to.be.true();
            })));
        }));
        it('buy sources', () => __awaiter(void 0, void 0, void 0, function* () {
            const buySources = src_1.BUY_SOURCE_FILTER_BY_CHAIN_ID[contract_addresses_1.ChainId.Mainnet].exclude([
                src_1.ERC20BridgeSource.Native,
                src_1.ERC20BridgeSource.MultiHop,
            ]).sources;
            return Promise.all(buySources.map((source) => __awaiter(void 0, void 0, void 0, function* () {
                const isSupported = yield adapter
                    .isSupportedSource((0, orders_1.getErc20BridgeSourceToBridgeSource)(source))
                    .callAsync();
                (0, contracts_test_utils_1.expect)(isSupported, `${source} is not supported`).to.be.true();
            })));
        }));
    });
    (0, contracts_test_utils_1.describe)('Fantom', () => {
        let adapter;
        before(() => __awaiter(void 0, void 0, void 0, function* () {
            adapter = yield contracts_zero_ex_1.FantomBridgeAdapterContract.deployFrom0xArtifactAsync(contracts_zero_ex_1.artifacts.FantomBridgeAdapter, env.provider, env.txDefaults, contracts_zero_ex_1.artifacts, contracts_test_utils_1.constants.NULL_ADDRESS);
        }));
        it('sell sources', () => __awaiter(void 0, void 0, void 0, function* () {
            const sellSources = src_1.SELL_SOURCE_FILTER_BY_CHAIN_ID[contract_addresses_1.ChainId.Fantom].exclude([
                src_1.ERC20BridgeSource.Native,
                src_1.ERC20BridgeSource.MultiHop,
            ]).sources;
            return Promise.all(sellSources.map((source) => __awaiter(void 0, void 0, void 0, function* () {
                const isSupported = yield adapter
                    .isSupportedSource((0, orders_1.getErc20BridgeSourceToBridgeSource)(source))
                    .callAsync();
                (0, contracts_test_utils_1.expect)(isSupported, `${source} is not supported`).to.be.true();
            })));
        }));
        it('buy sources', () => __awaiter(void 0, void 0, void 0, function* () {
            const buySources = src_1.BUY_SOURCE_FILTER_BY_CHAIN_ID[contract_addresses_1.ChainId.Fantom].exclude([
                src_1.ERC20BridgeSource.Native,
                src_1.ERC20BridgeSource.MultiHop,
            ]).sources;
            return Promise.all(buySources.map((source) => __awaiter(void 0, void 0, void 0, function* () {
                const isSupported = yield adapter
                    .isSupportedSource((0, orders_1.getErc20BridgeSourceToBridgeSource)(source))
                    .callAsync();
                (0, contracts_test_utils_1.expect)(isSupported, `${source} is not supported`).to.be.true();
            })));
        }));
    });
    (0, contracts_test_utils_1.describe)('Optimism', () => {
        let adapter;
        before(() => __awaiter(void 0, void 0, void 0, function* () {
            adapter = yield contracts_zero_ex_1.OptimismBridgeAdapterContract.deployFrom0xArtifactAsync(contracts_zero_ex_1.artifacts.OptimismBridgeAdapter, env.provider, env.txDefaults, contracts_zero_ex_1.artifacts, contracts_test_utils_1.constants.NULL_ADDRESS);
        }));
        it('sell sources', () => __awaiter(void 0, void 0, void 0, function* () {
            const sellSources = src_1.SELL_SOURCE_FILTER_BY_CHAIN_ID[contract_addresses_1.ChainId.Optimism].exclude([
                src_1.ERC20BridgeSource.Native,
                src_1.ERC20BridgeSource.MultiHop,
            ]).sources;
            return Promise.all(sellSources.map((source) => __awaiter(void 0, void 0, void 0, function* () {
                const isSupported = yield adapter
                    .isSupportedSource((0, orders_1.getErc20BridgeSourceToBridgeSource)(source))
                    .callAsync();
                (0, contracts_test_utils_1.expect)(isSupported, `${source} is not supported`).to.be.true();
            })));
        }));
        it('buy sources', () => __awaiter(void 0, void 0, void 0, function* () {
            const buySources = src_1.BUY_SOURCE_FILTER_BY_CHAIN_ID[contract_addresses_1.ChainId.Optimism].exclude([
                src_1.ERC20BridgeSource.Native,
                src_1.ERC20BridgeSource.MultiHop,
            ]).sources;
            return Promise.all(buySources.map((source) => __awaiter(void 0, void 0, void 0, function* () {
                const isSupported = yield adapter
                    .isSupportedSource((0, orders_1.getErc20BridgeSourceToBridgeSource)(source))
                    .callAsync();
                (0, contracts_test_utils_1.expect)(isSupported, `${source} is not supported`).to.be.true();
            })));
        }));
    });
    (0, contracts_test_utils_1.describe)('Polygon', () => {
        let adapter;
        before(() => __awaiter(void 0, void 0, void 0, function* () {
            adapter = yield contracts_zero_ex_1.PolygonBridgeAdapterContract.deployFrom0xArtifactAsync(contracts_zero_ex_1.artifacts.PolygonBridgeAdapter, env.provider, env.txDefaults, contracts_zero_ex_1.artifacts, contracts_test_utils_1.constants.NULL_ADDRESS);
        }));
        it('sell sources', () => __awaiter(void 0, void 0, void 0, function* () {
            const sellSources = src_1.SELL_SOURCE_FILTER_BY_CHAIN_ID[contract_addresses_1.ChainId.Polygon].exclude([
                src_1.ERC20BridgeSource.Native,
                src_1.ERC20BridgeSource.MultiHop,
            ]).sources;
            return Promise.all(sellSources.map((source) => __awaiter(void 0, void 0, void 0, function* () {
                const isSupported = yield adapter
                    .isSupportedSource((0, orders_1.getErc20BridgeSourceToBridgeSource)(source))
                    .callAsync();
                (0, contracts_test_utils_1.expect)(isSupported, `${source} is not supported`).to.be.true();
            })));
        }));
        it('buy sources', () => __awaiter(void 0, void 0, void 0, function* () {
            const buySources = src_1.BUY_SOURCE_FILTER_BY_CHAIN_ID[contract_addresses_1.ChainId.Polygon].exclude([
                src_1.ERC20BridgeSource.Native,
                src_1.ERC20BridgeSource.MultiHop,
            ]).sources;
            return Promise.all(buySources.map((source) => __awaiter(void 0, void 0, void 0, function* () {
                const isSupported = yield adapter
                    .isSupportedSource((0, orders_1.getErc20BridgeSourceToBridgeSource)(source))
                    .callAsync();
                (0, contracts_test_utils_1.expect)(isSupported, `${source} is not supported`).to.be.true();
            })));
        }));
    });
});
//# sourceMappingURL=bridge_adapter_test.js.map