## @0x/contract-wrappers

Wrappers for 0x smart contracts, generated using @0x/abi-gen.

## Installation

**Install**

```bash
npm install @0x/contract-wrappers --save
```

**Import**

```typescript
import { ContractWrappers } from '@0x/contract-wrappers';
```

If your project is in [TypeScript](https://www.typescriptlang.org/), add the following to your `tsconfig.json`:

```json
"compilerOptions": {
    "typeRoots": ["node_modules/@0x/typescript-typings/types", "node_modules/@types"],
}
```

## Contributing

We welcome improvements and fixes from the wider community! To report bugs within this package, please create an issue in this repository.

Please read our [contribution guidelines](../../CONTRIBUTING.md) before getting started.

### Install dependencies

If you don't have yarn workspaces enabled (Yarn < v1.0) - enable them:

```bash
yarn config set workspaces-experimental true
```

Then install dependencies

```bash
yarn install
```

### Build

To build this package and all other monorepo packages that it depends on, run the following from the monorepo root directory:

```bash
PKG=@0x/contract-wrappers yarn build
```

### Clean

```bash
yarn clean
```

### Lint

```bash
yarn lint
```

### Run Tests

```bash
yarn test
```

### Documentation

Documentation for this package is generated by TypeDoc, using the Solidity source code for 0x contracts. Each contract corresponds to one global-level module, which contains relevant enums and interfaces for its events and structs. Most significantly, each module exports a class, `<ContractName>Contract`, e.g. `ExchangeContract`, which implements helper methods for all the functions defined in the corresponding contract.

A convention to note is that these contract-specific helper methods are defined as _object literals_, which are separated from methods in the generated documentation. Each contract method has a number of sub-methods, e.g. `sendTransactionAsync`, or `estimateGasAsync`, which are documented separately. This is an example of an expected method call signature: `exchangeContractInstance.fillOrder.sendTransactionAsync(...arguments)`.

### Development

This package contains generated code. We use the `abi-gen` utility to generate wrappers from compiler artifacts in `@0x/contract-artifacts`. To re-generate wrappers, e.g. when `@0x/contract-artifacts` has been updated, run `yarn wrappers:generate && yarn wrappers:prettier`.
