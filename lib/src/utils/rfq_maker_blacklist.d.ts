/**
 * Tracks a maker's history of timely responses, and manages whether a given
 * maker should be avoided for being too latent.
 */
export declare class RfqMakerBlacklist {
    private readonly _blacklistDurationMinutes;
    private readonly _timeoutStreakThreshold;
    private readonly _makerTimeoutStreakLength;
    private readonly _makerBlacklistedUntilDate;
    constructor(_blacklistDurationMinutes: number, _timeoutStreakThreshold: number);
    logTimeoutOrLackThereof(makerUrl: string, didTimeout: boolean): void;
    isMakerBlacklisted(makerUrl: string): boolean;
}
//# sourceMappingURL=rfq_maker_blacklist.d.ts.map