import axios from "axios";
import * as Decimal from 'decimal.js';
import { ITickAPIProvider, TickAPIProvider } from './base';
import { ITicker, ITickerItem } from './models';

export default class PoloniexTicker extends TickAPIProvider implements ITickAPIProvider {

    public static readonly baseCurrencies: string[] = ['USDT', 'BTC', 'ETH'];
    public readonly baseURL: string;

    constructor(baseURL: string) {
        super();
        this.baseURL = baseURL;
    }

    public async getPrices(path = '/public?command=returnTicker'): Promise<object> {
        return await this.get(path) as object;
    }

    public async parse(data): Promise<ITicker> {
        const result: ITicker = {
            details: {},
            supported: Object.keys(data),
        };

        for (const [key, values] of Object.entries(data)) {
            const [baseCurrency, nextCurrency] = key.split('_');
            result.details[key] = {
                baseCurrency,
                nextCurrency,
                value: {
                    first: new Decimal(values.high24hr).add(values.low24hr).div(2).toFixed(8),
                    high: new Decimal(values.highestBid).toFixed(8),
                    last: new Decimal(values.last).toFixed(8),
                    low: new Decimal(values.lowestAsk).toFixed(8),
                },
                volume: new Decimal(values.quoteVolume).toFixed(8),
            };
        }

        return result;
    }

}
