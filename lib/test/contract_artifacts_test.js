"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai = require("chai");
const lodash_1 = require("lodash");
require("mocha");
const artifacts = require("../src/index");
const transform_1 = require("../src/transform");
const expect = chai.expect;
// For pure functions, we use local EVM execution in `@0x/base-contract` instead
// of making an eth_call. This requires the `deployedBytecode` from compiler output.
const CONTRACTS_WITH_PURE_FNS = [
    // 'Coordinator', // missing deployedBytecode
    'DevUtils',
    'ERC1155Proxy',
    'ERC20Proxy',
    'ERC721Proxy',
    'IAssetProxy',
    'MultiAssetProxy',
    'StaticCallProxy',
];
describe('Contract Artifacts', () => {
    it('should not include forbidden attributes', () => {
        const forbiddenPropertiesByArtifact = {};
        for (const [artifactName, artifact] of Object.entries(artifacts)) {
            for (const forbiddenProperty of transform_1.FORBIDDEN_PROPERTIES) {
                const rejectedValue = (0, lodash_1.get)(artifact, forbiddenProperty);
                if (rejectedValue) {
                    const previousForbidden = forbiddenPropertiesByArtifact[artifactName];
                    forbiddenPropertiesByArtifact[artifactName] = previousForbidden
                        ? [...previousForbidden, forbiddenProperty]
                        : [forbiddenProperty];
                }
            }
        }
        expect(forbiddenPropertiesByArtifact).to.eql({});
    });
    it('should include all required attributes', () => {
        const missingRequiredPropertiesByArtifact = {};
        for (const [artifactName, artifact] of Object.entries(artifacts)) {
            for (const requiredProperty of transform_1.REQUIRED_PROPERTIES) {
                // HACK (xianny): Remove after `compiler` field is added in v3.
                if (requiredProperty === 'compiler' && artifact.schemaVersion === '2.0.0') {
                    continue;
                }
                if (requiredProperty === 'compilerOutput.evm.deployedBytecode.object') {
                    if (!CONTRACTS_WITH_PURE_FNS.includes(artifactName)) {
                        continue;
                    }
                }
                const requiredValue = (0, lodash_1.get)(artifact, requiredProperty);
                if (requiredValue === undefined || requiredValue === '') {
                    const previousMissing = missingRequiredPropertiesByArtifact[artifactName];
                    missingRequiredPropertiesByArtifact[artifactName] = previousMissing
                        ? [...previousMissing, requiredProperty]
                        : [requiredProperty];
                }
            }
        }
        expect(missingRequiredPropertiesByArtifact).to.eql({});
    });
});
//# sourceMappingURL=contract_artifacts_test.js.map