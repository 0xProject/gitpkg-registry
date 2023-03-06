"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FORBIDDEN_PROPERTIES = exports.REQUIRED_PROPERTIES = void 0;
const utils_1 = require("@0x/utils");
const fs = require("fs");
exports.REQUIRED_PROPERTIES = [
    'schemaVersion',
    'contractName',
    'compilerOutput.evm.bytecode.object',
    'compilerOutput.evm.deployedBytecode.object',
    'compilerOutput.abi',
    'compilerOutput.devdoc',
    'compiler',
];
exports.FORBIDDEN_PROPERTIES = [
    'compilerOutput.evm.bytecode.sourceMap',
    'compilerOutput.evm.bytecode.opcodes',
    'compilerOutput.evm.bytecode.linkReferences',
    'compilerOutput.evm.deployedBytecode.sourceMap',
    'compilerOutput.evm.deployedBytecode.opcodes',
    'compilerOutput.evm.deployedBytecode.linkReferences',
    'compilerOutput.evm.assembly',
    'compilerOutput.evm.legacyAssembly',
    'compilerOutput.evm.gasEstimates',
    'compilerOutput.evm.methodIdentifiers',
    'compilerOutput.metadata',
    'compilerOutput.userdoc',
    'compiler.settings.remappings',
    'sourceCodes',
    'sources',
    'sourceTreeHashHex',
];
function removeForbiddenProperties(inputDir, outputDir) {
    const filePaths = fs
        .readdirSync(inputDir)
        .filter(filename => filename.indexOf('.json') !== -1)
        .map(filename => `./${inputDir}/${filename}`);
    for (const filePath of filePaths) {
        const artifact = JSON.parse(fs.readFileSync(filePath).toString());
        for (const property of exports.FORBIDDEN_PROPERTIES) {
            (0, utils_1.deleteNestedProperty)(artifact, property);
        }
        fs.writeFileSync(filePath.replace(inputDir, outputDir), JSON.stringify(artifact));
    }
}
if (require.main === module) {
    const inputDir = process.argv[2];
    const outputDir = process.argv[3] !== undefined ? process.argv[3] : inputDir;
    utils_1.logUtils.log(`Deleting forbidden properties from artifacts in ${inputDir}. Output to ${outputDir}`);
    if (!fs.existsSync(`./${outputDir}`)) {
        fs.mkdirSync(`./${outputDir}`);
    }
    removeForbiddenProperties(inputDir, outputDir);
}
//# sourceMappingURL=transform.js.map