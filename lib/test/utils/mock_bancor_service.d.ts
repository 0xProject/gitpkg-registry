import { BigNumber } from '@0x/utils';
import { SupportedProvider } from '../../src';
import { BancorService } from '../../src/utils/market_operation_utils/bancor_service';
import { BancorFillData, Quote } from '../../src/utils/market_operation_utils/types';
export interface Handlers {
    getQuoteAsync: (fromToken: string, toToken: string, amount: BigNumber) => Promise<Quote<BancorFillData>>;
}
export declare class MockBancorService extends BancorService {
    handlers: Partial<Handlers>;
    minReturnAmountBufferPercentage: number;
    constructor(provider: SupportedProvider, handlers: Partial<Handlers>);
    getQuoteAsync(fromToken: string, toToken: string, amount: BigNumber): Promise<Quote<BancorFillData>>;
}
//# sourceMappingURL=mock_bancor_service.d.ts.map