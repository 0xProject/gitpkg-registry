/// <reference types="web3-provider-engine" />
import { ContractAddresses } from '@0x/contract-addresses';
import { Web3ProviderEngine } from '@0x/subproviders';
import { SupportedProvider, TxData } from 'ethereum-types';
/**
 * Creates and deploys all the contracts that are required for the latest
 * version of the 0x protocol.
 * @param supportedProvider  Web3 provider instance. Your provider instance should connect to the testnet you want to deploy to.
 * @param txDefaults Default transaction values to use when deploying contracts (e.g., specify the desired contract creator with the `from` parameter).
 * @returns The addresses of the contracts that were deployed.
 */
export declare function runMigrationsAsync(supportedProvider: SupportedProvider, txDefaults: TxData): Promise<ContractAddresses>;
/**
 * Exactly like runMigrationsAsync but will only run the migrations the first
 * time it is called. Any subsequent calls will return the cached contract
 * addresses.
 * @param provider  Web3 provider instance. Your provider instance should connect to the testnet you want to deploy to.
 * @param txDefaults Default transaction values to use when deploying contracts (e.g., specify the desired contract creator with the `from` parameter).
 * @returns The addresses of the contracts that were deployed.
 */
export declare function runMigrationsOnceAsync(provider: Web3ProviderEngine, txDefaults: TxData): Promise<ContractAddresses>;
//# sourceMappingURL=migration.d.ts.map