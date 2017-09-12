import { ITickAPIProvider, TickAPIProvider } from './base';
import axios from "axios";
import { ITicker } from "./models";
import * as Decimal from 'decimal.js';

export default class CoinoneTicker extends TickAPIProvider implements ITickAPIProvider {

    public static readonly baseCurrencies: string[] = ['KRW'];
    public readonly baseURL: string;

    constructor(baseURL: string = 'https://api.coinone.co.kr') {
        super();
        this.baseURL = baseURL;
    }

    public async getPrices(path = '/ticker/?format=json&currency='): Promise<object> {
        return await this.get(path) as object;
    }

    public async parse(data): Promise<ITicker> {
        const result: ITicker = {
            details: {},
            supported: Object.values(data).filter((item) => item.currency).map((item) => item.currency),
        };

        result.details = Object.values(data)
            .filter((item) => result.supported.includes(item.currency))
            .reduce((obj, item) => {
                // side-effect on here because of references
                item = Object.assign({}, item);
                const currency = item.currency.toUpperCase();
                delete item.currency;
                obj[currency] = Object.assign(item, {
                    volume: new Decimal(item.volume).toFixed(),
                    first: new Decimal(item.first).toFixed(),
                    high: new Decimal(item.high).toFixed(),
                    last: new Decimal(item.last).toFixed(),
                    low: new Decimal(item.low).toFixed(),
                    baseCurrency: 'KRW',
                    nextCurrency: currency,
                });
                return obj;
        }, {});
        result.supported = result.supported.map((i) => i.toUpperCase());

        return result;
    }

}
