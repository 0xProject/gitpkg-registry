import { BigNumber } from '@0x/utils';
export interface TimelockRegistration {
    functionSelector: string;
    destination: string;
    secondsTimeLocked: BigNumber;
}
/**
 * Gets the custom timelock configs that correspond the the network of the given provider.
 * @param provider Web3 provider instance.
 */
export declare function getTimelockRegistrationsByChainId(chainId: number): TimelockRegistration[];
//# sourceMappingURL=timelocks.d.ts.map