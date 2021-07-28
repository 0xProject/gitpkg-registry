import { Chain } from './chain';
import { Address } from './types';
export declare class NetworkUtils {
    readonly chain: Chain;
    private readonly _networkUtilsContractHelper;
    private readonly _networkUtilsContract;
    private readonly _tokenDecimalsCache;
    constructor(chain: Chain);
    getTokenDecimalsAsync(tokens: Address[]): Promise<number[]>;
    isAddressContractAsync(address: Address): Promise<boolean>;
}
//# sourceMappingURL=network_utils.d.ts.map