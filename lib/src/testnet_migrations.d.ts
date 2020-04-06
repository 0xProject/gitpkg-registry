import { SupportedProvider, TxData } from 'ethereum-types';
/**
 * Deploys all 3.0 contracts and reconfigures existing 2.0 contracts.
 * @param supportedProvider  Web3 provider instance. Your provider instance should connect to the testnet you want to deploy to.
 * @param txDefaults Default transaction values to use when deploying contracts (e.g., specify the desired contract creator with the `from` parameter).
 */
export declare function runMigrationsAsync(supportedProvider: SupportedProvider, txDefaults: TxData): Promise<void>;
//# sourceMappingURL=testnet_migrations.d.ts.map