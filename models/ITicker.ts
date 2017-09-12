export default interface ITicker {
    code: string;
    market: string;
    marketName: string;
    isIntlMarket: boolean;
    baseCurrency: string;
    nextCurrency: string;
    createdAt: Date;
    volume: string;
    last: string;
    high: string;
    low: string;
    first: string;
};
