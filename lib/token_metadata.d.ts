import { ChainId } from '@0x/contract-addresses';
export interface TokenMetadataAndChainAddresses {
    symbol: string;
    decimals: number;
    name: string;
    tokenAddresses: {
        [ChainId.Mainnet]: string;
        [ChainId.Kovan]: string;
        [ChainId.Ganache]: string;
        [ChainId.Rinkeby]: string;
        [ChainId.Ropsten]: string;
        [ChainId.BSC]: string;
        [ChainId.Polygon]: string;
        [ChainId.PolygonMumbai]: string;
        [ChainId.Avalanche]: string;
        [ChainId.Fantom]: string;
        [ChainId.Celo]: string;
        [ChainId.Arbitrum]: string;
        [ChainId.Optimism]: string;
    };
}
export declare const TokenMetadatasForChains: TokenMetadataAndChainAddresses[];
//# sourceMappingURL=token_metadata.d.ts.map