import { TickAPIProvider, ITickAPIProvider } from './base';
import axios from "axios";
import { ITicker } from "./models";
import * as Decimal from 'decimal.js';

export default class BithumbTicker extends TickAPIProvider implements ITickAPIProvider {

    public static readonly baseCurrencies: string[] = ['KRW'];
    public readonly baseURL: string;

    constructor(baseURL: string = 'https://api.bithumb.com') {
        super();
        this.baseURL = baseURL;
    }

    public async getPrices(path: string = '/public/ticker/ALL'): Promise<object> {
        return await this.get(path) as object;
    }

    public async parse(data): Promise<ITicker> {
        const result = {
            details: {},
            supported: Object.keys(data.data).filter((i) => i === i.toUpperCase()),
        };

        result.supported.forEach((coin) => {
            const details = data.data[coin];
            result.details[coin] = {
                first: new Decimal(details.opening_price).toFixed(),
                high: new Decimal(details.max_price).toFixed(),
                last: new Decimal(details.closing_price).toFixed(),
                low: new Decimal(details.min_price).toFixed(),
                volume: new Decimal(details.volume_1day).toFixed(8),
                baseCurrency: 'KRW',
                nextCurrency: coin,
            };
        });

        return result;
    }

}
