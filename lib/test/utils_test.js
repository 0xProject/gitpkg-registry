"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dev_utils_1 = require("@0x/dev-utils");
const order_utils_1 = require("@0x/order-utils");
const utils_1 = require("@0x/utils");
const chai = require("chai");
require("mocha");
const utils_2 = require("../src/utils/utils");
const chai_setup_1 = require("./utils/chai_setup");
chai_setup_1.chaiSetup.configure();
const expect = chai.expect;
describe('utils', () => {
    describe('isAssetDataEquivalent', () => {
        describe('ERC20', () => {
            const [tokenA, tokenB] = dev_utils_1.tokenUtils.getDummyERC20TokenAddresses();
            it('should succeed ERC20 to be ERC20Bridge', () => {
                const isEquivalent = utils_2.isAssetDataEquivalent(order_utils_1.assetDataUtils.encodeERC20AssetData(tokenA), order_utils_1.assetDataUtils.encodeERC20BridgeAssetData(tokenA, utils_1.NULL_ADDRESS, utils_1.NULL_BYTES));
                expect(isEquivalent).to.be.true();
            });
            it('should succeed ERC20Bridge to be ERC20', () => {
                const isEquivalent = utils_2.isAssetDataEquivalent(order_utils_1.assetDataUtils.encodeERC20BridgeAssetData(tokenA, utils_1.NULL_ADDRESS, utils_1.NULL_BYTES), order_utils_1.assetDataUtils.encodeERC20AssetData(tokenA));
                expect(isEquivalent).to.be.true();
            });
            it('should succeed ERC20 to be ERC20', () => {
                const isEquivalent = utils_2.isAssetDataEquivalent(order_utils_1.assetDataUtils.encodeERC20AssetData(tokenA), order_utils_1.assetDataUtils.encodeERC20AssetData(tokenA));
                expect(isEquivalent).to.be.true();
            });
            it('should fail if ERC20Bridge is not the same ERC20 token', () => {
                const isEquivalent = utils_2.isAssetDataEquivalent(order_utils_1.assetDataUtils.encodeERC20AssetData(tokenA), order_utils_1.assetDataUtils.encodeERC20BridgeAssetData(tokenB, utils_1.NULL_ADDRESS, utils_1.NULL_BYTES));
                expect(isEquivalent).to.be.false();
            });
            it('should fail if ERC20 is not the same ERC20 token', () => {
                const isEquivalent = utils_2.isAssetDataEquivalent(order_utils_1.assetDataUtils.encodeERC20AssetData(tokenA), order_utils_1.assetDataUtils.encodeERC20AssetData(tokenB));
                expect(isEquivalent).to.be.false();
            });
        });
        describe('ERC721', () => {
            const [tokenA, tokenB] = dev_utils_1.tokenUtils.getDummyERC20TokenAddresses();
            const tokenIdA = new utils_1.BigNumber(1);
            const tokenIdB = new utils_1.BigNumber(2);
            it('should succeed if ERC721 the same ERC721 token and id', () => {
                const isEquivalent = utils_2.isAssetDataEquivalent(order_utils_1.assetDataUtils.encodeERC721AssetData(tokenA, tokenIdA), order_utils_1.assetDataUtils.encodeERC721AssetData(tokenA, tokenIdA));
                expect(isEquivalent).to.be.true();
            });
            it('should fail if ERC721 is not the same ERC721 token', () => {
                const isEquivalent = utils_2.isAssetDataEquivalent(order_utils_1.assetDataUtils.encodeERC721AssetData(tokenA, tokenIdA), order_utils_1.assetDataUtils.encodeERC721AssetData(tokenB, tokenIdA));
                expect(isEquivalent).to.be.false();
            });
            it('should fail if ERC721 is not the same ERC721 id', () => {
                const isEquivalent = utils_2.isAssetDataEquivalent(order_utils_1.assetDataUtils.encodeERC721AssetData(tokenA, tokenIdA), order_utils_1.assetDataUtils.encodeERC721AssetData(tokenA, tokenIdB));
                expect(isEquivalent).to.be.false();
            });
            it('should fail if ERC721 is compared with ERC20', () => {
                const isEquivalent = utils_2.isAssetDataEquivalent(order_utils_1.assetDataUtils.encodeERC721AssetData(tokenA, tokenIdA), order_utils_1.assetDataUtils.encodeERC20AssetData(tokenA));
                expect(isEquivalent).to.be.false();
            });
        });
        describe('ERC1155', () => {
            const [tokenA, tokenB] = dev_utils_1.tokenUtils.getDummyERC20TokenAddresses();
            const tokenIdA = new utils_1.BigNumber(1);
            const tokenIdB = new utils_1.BigNumber(2);
            const valueA = new utils_1.BigNumber(1);
            const valueB = new utils_1.BigNumber(2);
            it('should succeed if ERC1155 is the same ERC1155 token and id', () => {
                const isEquivalent = utils_2.isAssetDataEquivalent(order_utils_1.assetDataUtils.encodeERC1155AssetData(tokenA, [tokenIdA], [valueA], utils_1.NULL_BYTES), order_utils_1.assetDataUtils.encodeERC1155AssetData(tokenA, [tokenIdA], [valueA], utils_1.NULL_BYTES));
                expect(isEquivalent).to.be.true();
            });
            it('should succeed if ERC1155 is the same ERC1155 token and ids', () => {
                const isEquivalent = utils_2.isAssetDataEquivalent(order_utils_1.assetDataUtils.encodeERC1155AssetData(tokenA, [tokenIdA, tokenIdB], [valueA, valueB], utils_1.NULL_BYTES), order_utils_1.assetDataUtils.encodeERC1155AssetData(tokenA, [tokenIdA, tokenIdB], [valueA, valueB], utils_1.NULL_BYTES));
                expect(isEquivalent).to.be.true();
            });
            it('should succeed if ERC1155 is the same ERC1155 token and ids in different orders', () => {
                const isEquivalent = utils_2.isAssetDataEquivalent(order_utils_1.assetDataUtils.encodeERC1155AssetData(tokenA, [tokenIdB, tokenIdA], [valueB, valueA], utils_1.NULL_BYTES), order_utils_1.assetDataUtils.encodeERC1155AssetData(tokenA, [tokenIdA, tokenIdB], [valueA, valueB], utils_1.NULL_BYTES));
                expect(isEquivalent).to.be.true();
            });
            it('should succeed if ERC1155 is the same ERC1155 token and ids with different callback data', () => {
                const isEquivalent = utils_2.isAssetDataEquivalent(order_utils_1.assetDataUtils.encodeERC1155AssetData(tokenA, [tokenIdB, tokenIdA], [valueB, valueA], utils_1.NULL_BYTES), order_utils_1.assetDataUtils.encodeERC1155AssetData(tokenA, [tokenIdA, tokenIdB], [valueA, valueB], tokenA));
                expect(isEquivalent).to.be.true();
            });
            it('should fail if ERC1155 contains different ids', () => {
                const isEquivalent = utils_2.isAssetDataEquivalent(order_utils_1.assetDataUtils.encodeERC1155AssetData(tokenA, [tokenIdB, tokenIdA], [valueB, valueA], utils_1.NULL_BYTES), order_utils_1.assetDataUtils.encodeERC1155AssetData(tokenB, [tokenIdA], [valueB], utils_1.NULL_BYTES));
                expect(isEquivalent).to.be.false();
            });
            it('should fail if ERC1155 is a different ERC1155 token', () => {
                const isEquivalent = utils_2.isAssetDataEquivalent(order_utils_1.assetDataUtils.encodeERC1155AssetData(tokenA, [tokenIdB, tokenIdA], [valueB, valueA], utils_1.NULL_BYTES), order_utils_1.assetDataUtils.encodeERC1155AssetData(tokenB, [tokenIdA, tokenIdB], [valueA, valueB], utils_1.NULL_BYTES));
                expect(isEquivalent).to.be.false();
            });
            it('should fail if expected ERC1155 has different callback data', () => {
                const isEquivalent = utils_2.isAssetDataEquivalent(order_utils_1.assetDataUtils.encodeERC1155AssetData(tokenA, [tokenIdB, tokenIdA], [valueB, valueA], tokenA), order_utils_1.assetDataUtils.encodeERC1155AssetData(tokenA, [tokenIdA, tokenIdB], [valueA, valueB], utils_1.NULL_BYTES));
                expect(isEquivalent).to.be.false();
            });
        });
    });
});
//# sourceMappingURL=utils_test.js.map