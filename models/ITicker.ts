export interface ITickerValue {
    volume: string;
    last: string;
    high: string;
    low: string;
    first: string;
}

export default interface ITicker {
    /** Unique identifier */
    uniqueId: string;
    /** Exchange code of cryptocurrency (ex BTC_ETH) */
    code: string;
    /** The name of market */
    market: string;
    /** Marks if the market is for international trading */
    isIntlMarket: boolean;
    /** Currency that is for base */
    baseCurrency: string;
    /** Currency that is to be exchanged */
    nextCurrency: string;
    /** For time-series */
    createdAtByDate: Date;
    /** Last updated date */
    lastUpdatedAt: Date;
    /** Time-series values */
    count: number;
    values: ITickerValue[];
    times: Date[];
    /** last values */
    last: ITickerValue;
}
