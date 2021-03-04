import { SupportedProvider } from '@0x/dev-utils';
import { SDK } from '@bancor/sdk';
export declare class BancorService {
    sdk: SDK;
    static createAsync(provider: SupportedProvider): Promise<BancorService>;
    constructor(sdk: SDK);
    getPaths(_fromToken: string, _toToken: string): string[][];
}
//# sourceMappingURL=bancor_service.d.ts.map