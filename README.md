# Neon bindings for 0x API Router

For more information about 0x API see [https://0x.org/api](https://0x.org/api).

## Developers

### Test

```sh
cargo test
npm run build
npm run test
```

### Plotting liquidity curves for local development

When building the module with the `plots` feature enabled, the router will create a `./plots` folder relative to the folder it is executed from and output plots of the curves for every sampled source.

#### Building with all optional features enabled

All optional features can be enabled by building with

```
npm run build:all_features
```

### Publishing the package

#### Production npm publish

1. Bump the version appropriately in the `package.json`, commit with the message `[publish binary]` and push to the remote. An action will automatically build the binaries and upload them to S3
1. Publish the new version to npm with `npm run publish:npm`

#### Private gitpkg publish

1. Bump the version by running `npm run publish:private:bump_version`, commit with the message `[publish binary]` and push to the remote. An action will automatically build the binaries and upload them to S3
1. Publish the package to gitpkg by running `npm run publish:private`
1. See Quip doc about how to use gitpkg published packages

### Developing with 0x API locally

You can develop neon-router directly towards you local 0x API instance, but it requires a bit of setup

1. In `neon-router` run `yarn link`
1. In `neon-router` run `npm run build` or `npm run build:all_features`
1. In `asset-swapper` run `yarn link "@0x/neon-router" && yarn build`
1. In `0x-api` run `yarn link "@0x/asset-swapper"`
1. You can now make changes to the router, rebuild it, then restart 0x API to use the updated version
