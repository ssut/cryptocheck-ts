import { ITicker, ITickerItem } from './models';
import { ITickAPIProvider, TickAPIProvider } from './base';
import * as Decimal from 'decimal.js';

export interface IBittrexTickerResponse {
    sucecss: boolean;
    message: string;
    result: Array<{
        MarketName: string,
        High: number,
        Low: number,
        Volume: number,
        Last: number,
        BaseVolume: number,
        Timestamp: string,
        Bid: number,
        Ask: number,
        OpenBuyOrders: number,
        OpenSellOrders: number,
        PrevDay: number,
        Created: string,
    }>
}

export default class BittrexTicker extends TickAPIProvider implements ITickAPIProvider {

    public static readonly baseCurrencies: string[] = ['USDT', 'BTC', 'ETH'];
    public readonly baseURL: string;

    constructor(baseURL: string = 'https://bittrex.com') {
        super();
        this.baseURL = baseURL;
    }

    public async getPrices(path = '/api/v1.1/public/getmarketsummaries'): Promise<IBittrexTickerResponse> {
        return await this.get(path) as IBittrexTickerResponse;
    }

    public async parse(data: IBittrexTickerResponse): Promise<ITicker> {
        const results = data.result;
        const result: ITicker = {
            supported: results.map((item) => item.MarketName.replace('-', '_')),
            details: {},
        };

        result.details = data.result.reduce((obj, item) => {
            const [ baseCurrency, nextCurrency ] = item.MarketName.split('-');
            obj[`${baseCurrency}_${nextCurrency}`] = {
                baseCurrency,
                nextCurrency,
                volume: new Decimal(item.Volume).toFixed(8),
                value: {
                    last: new Decimal(item.Last).toFixed(8),
                    high: new Decimal(item.High).toFixed(8),
                    low: new Decimal(item.Low).toFixed(8),
                    first: new Decimal(item.PrevDay).toFixed(8),
                },
            };

            return obj;
        }, {});

        return result;
    }

}
