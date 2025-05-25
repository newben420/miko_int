export class SideToken {
    name!: string;
    symbol!: string;
    mint!: string;
    amount!: number;
    pnl!: number;
}

export type Tokens = Record<string, SideToken>;

export class LimitOrder {
    type?: 'buy' | 'sell';
    marketcap?: number;
    amount?: number;
    min_time?: number;
    max_time?: number;
    perc?: number;
    trailing?: boolean;
    min_sell_pnl?: number;
    max_sell_pnl?: number;
}

export class UILimitOrder {
    isBuy!: boolean;
    marketcap!: number;
    amount!: number;
    min_time?: number;
    isGreaterThan!: boolean;
    max_time?: number;
    perc?: number;
    trailing!: boolean;
    min_sell_pnl?: number;
    max_sell_pnl?: number;
    currency!: string;
    buys!: number[];
    sells!: number[];

    constructor() {
        this.isBuy = true;
        this.isGreaterThan = true;
        this.trailing = false;
        this.buys = [];
        this.sells = [];
    }
}

export class OHLCV {
    open!: number;
    high!: number;
    low!: number;
    close!: number;
    volume!: number;
    time!: number;
}

export class Token {
    name?: string;
    mint?: string;
    symbol?: string;
    current_price?: number;
    current_marketcap?: number;
    price_history?: OHLCV[]
    last_updated?: number;
    amount_held?: number;
    pending_orders?: LimitOrder[];
    reg_timestamp?: number;
    max_marketcap?: number;
    min_marketcap?: number;
    peak_price?: number;
    least_price?: number;
    description?: string;
    whaleLog?: string[];
    pnl_base?: number;
    pnl?: number;
    max_pnl?: number;
    min_pnl?: number;
    source?: 'Telegram' | 'Kiko' | 'Unspecified' | 'Recovery';
    exit_reasons?: string[];
    entry_reasons?: string[];
}

export class PriceHistory {
    title!: string;
    delta!: number;
}