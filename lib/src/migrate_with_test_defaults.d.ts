/// <reference types="web3-provider-engine" />
import { ContractAddresses } from '@0x/contract-addresses';
import { Web3ProviderEngine } from '@0x/subproviders';
/**
 * Configures and runs the migrations exactly once. Any subsequent times this is
 * called, it returns the cached addresses.
 * @returns The addresses of contracts that were deployed during the migrations.
 */
export declare function migrateOnceAsync(provider: Web3ProviderEngine): Promise<ContractAddresses>;
//# sourceMappingURL=migrate_with_test_defaults.d.ts.map