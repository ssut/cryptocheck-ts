import { ITickerItemPrices } from './index';

export interface ITickerItemPrices {
    last: string;
    high: string;
    low: string;
    first: string;
}

export interface ITickerItem {
    volume: string;
    value: ITickerItemPrices;

    baseCurrency: string;
    nextCurrency: string;
}

export interface ITicker {
    supported: string[];
    details: {[key: string]: ITickerItem};
}
