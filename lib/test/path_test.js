"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const contracts_test_utils_1 = require("@0x/contracts-test-utils");
const utils_1 = require("@0x/utils");
const types_1 = require("../src/types");
const path_1 = require("../src/utils/market_operation_utils/path");
const types_2 = require("../src/utils/market_operation_utils/types");
const createFill = (source, index = 0, input = new utils_1.BigNumber(100), output = new utils_1.BigNumber(100)) => 
// tslint:disable-next-line: no-object-literal-type-assertion
({
    source,
    input,
    output,
    adjustedOutput: output,
    flags: BigInt(0),
    sourcePathId: source,
    index,
});
describe('Path', () => {
    it('Adds a fallback', () => {
        const targetInput = new utils_1.BigNumber(100);
        const path = path_1.Path.create(types_1.MarketOperation.Sell, [createFill(types_2.ERC20BridgeSource.Native), createFill(types_2.ERC20BridgeSource.Native)], targetInput);
        const fallback = path_1.Path.create(types_1.MarketOperation.Sell, [createFill(types_2.ERC20BridgeSource.Uniswap)], targetInput);
        path.addFallback(fallback);
        const sources = path.fills.map(f => f.source);
        contracts_test_utils_1.expect(sources).to.deep.eq([types_2.ERC20BridgeSource.Native, types_2.ERC20BridgeSource.Native, types_2.ERC20BridgeSource.Uniswap]);
    });
    it('Adds a fallback with LiquidityProvider', () => {
        const targetInput = new utils_1.BigNumber(100);
        const path = path_1.Path.create(types_1.MarketOperation.Sell, [createFill(types_2.ERC20BridgeSource.Native), createFill(types_2.ERC20BridgeSource.LiquidityProvider)], targetInput);
        const fallback = path_1.Path.create(types_1.MarketOperation.Sell, [createFill(types_2.ERC20BridgeSource.Uniswap)], targetInput);
        path.addFallback(fallback);
        const sources = path.fills.map(f => f.source);
        contracts_test_utils_1.expect(sources).to.deep.eq([
            types_2.ERC20BridgeSource.Native,
            types_2.ERC20BridgeSource.LiquidityProvider,
            types_2.ERC20BridgeSource.Uniswap,
        ]);
    });
    it('Removes partial Native orders', () => {
        const targetInput = new utils_1.BigNumber(100);
        const path = path_1.Path.create(types_1.MarketOperation.Sell, [
            createFill(types_2.ERC20BridgeSource.Uniswap),
            createFill(types_2.ERC20BridgeSource.LiquidityProvider),
            createFill(types_2.ERC20BridgeSource.Native),
        ], targetInput);
        const fallback = path_1.Path.create(types_1.MarketOperation.Sell, [createFill(types_2.ERC20BridgeSource.Kyber)], targetInput);
        path.addFallback(fallback);
        const sources = path.fills.map(f => f.source);
        contracts_test_utils_1.expect(sources).to.deep.eq([
            types_2.ERC20BridgeSource.Uniswap,
            types_2.ERC20BridgeSource.LiquidityProvider,
            types_2.ERC20BridgeSource.Kyber,
        ]);
    });
    it('Handles duplicates', () => {
        const targetInput = new utils_1.BigNumber(100);
        const path = path_1.Path.create(types_1.MarketOperation.Sell, [createFill(types_2.ERC20BridgeSource.Uniswap), createFill(types_2.ERC20BridgeSource.LiquidityProvider)], targetInput);
        const fallback = path_1.Path.create(types_1.MarketOperation.Sell, [createFill(types_2.ERC20BridgeSource.Uniswap)], targetInput);
        path.addFallback(fallback);
        const sources = path.fills.map(f => f.source);
        contracts_test_utils_1.expect(sources).to.deep.eq([types_2.ERC20BridgeSource.Uniswap, types_2.ERC20BridgeSource.LiquidityProvider]);
    });
    it('Removes partial Native orders and replaces with unused fills', () => {
        const targetInput = new utils_1.BigNumber(100);
        const path = path_1.Path.create(types_1.MarketOperation.Sell, [
            createFill(types_2.ERC20BridgeSource.Uniswap, 0, new utils_1.BigNumber(50)),
            createFill(types_2.ERC20BridgeSource.Native, 0, new utils_1.BigNumber(50)),
        ], targetInput);
        const fallback = path_1.Path.create(types_1.MarketOperation.Sell, [
            createFill(types_2.ERC20BridgeSource.Uniswap, 0, new utils_1.BigNumber(50)),
            createFill(types_2.ERC20BridgeSource.Uniswap, 1, new utils_1.BigNumber(50)),
        ], targetInput);
        path.addFallback(fallback);
        const sources = path.fills.map(f => f.source);
        contracts_test_utils_1.expect(sources).to.deep.eq([types_2.ERC20BridgeSource.Uniswap, types_2.ERC20BridgeSource.Uniswap]);
    });
});
//# sourceMappingURL=path_test.js.map