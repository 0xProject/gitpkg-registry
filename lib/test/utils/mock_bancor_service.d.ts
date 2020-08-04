import { BigNumber } from '@0x/utils';
import { BancorService } from '../../src/utils/market_operation_utils/bancor_service';
import { BancorQuoteData } from '../../src/utils/market_operation_utils/types';
export interface Handlers {
    getQuoteAsync: (fromToken: string, toToken: string, amount: BigNumber) => Promise<BancorQuoteData>;
}
export declare class MockBancorService extends BancorService {
    handlers: Partial<Handlers>;
    minReturnAmountBufferPercentage: number;
    constructor(handlers: Partial<Handlers>);
    getQuoteAsync(fromToken: string, toToken: string, amount: BigNumber): Promise<BancorQuoteData>;
}
//# sourceMappingURL=mock_bancor_service.d.ts.map