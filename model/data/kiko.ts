export class KikoToken {
    name!: string;
    symbol!: string;
    regTimestamp!: number;
    auditTimestamp!: number;
    auditCount!: number;
    bonding!: number;
    mint!: string;
}

export class Kiko {
    currentTokens?: number;
    allTokens?: number;
    graduatedTokens?: number;
    blockedTokens?: number;
    audited?: Record<string, KikoToken>;
}