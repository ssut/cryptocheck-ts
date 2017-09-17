import { Queue } from '..';
import * as mongoose from 'mongoose';
import { Ticker } from '../../models/Ticker';
import { ITickAPIProvider } from './../../tickers/base';
import {
    CoinoneTicker,
    BithumbTicker,
    PoloniexTicker,
    BittrexTicker,
} from '../../tickers';
(mongoose as any).Promise = Promise;

const mongoOptions: mongoose.ConnectionOptions = {
    useMongoClient: true,
    promiseLibrary: Promise,
};
mongoose.connect(process.env.MOGNODB_URI || 'mongodb://localhost/coincoin', mongoOptions);

const tickers = {
    coinone: new CoinoneTicker(),
    bithumb: new BithumbTicker(),
    poloniex: new PoloniexTicker(),
    bittrex: new BittrexTicker(),
};

const fetchAndPush = async (market: string, ticker: ITickAPIProvider, intlMarket?: boolean) => {
    const data = await ticker.getPrices().then((x) => ticker.parse(x));
    const promises = [];
    for (const [key, info] of Object.entries(data.details)) {
        const t = new Ticker({
            market,
            code: key,
            isIntlMarket: !!intlMarket,
            baseCurrency: info.baseCurrency,
            nextCurrency: info.nextCurrency,
            volume: info.volume,
            ...info.value,
        });
        promises.push(t.save());
    }
    await Promise.all(promises);
};

export const coinoneTicker = new Queue('coinoneTicker', async (job) =>
    fetchAndPush('coinone', tickers.coinone));

export const bithumbTicker = new Queue('bithumbTicker', async (job) =>
    fetchAndPush('bithumb', tickers.bithumb));

export const poloniexTicker = new Queue('poloniexTicker', async (job) =>
    fetchAndPush('poloniex', tickers.poloniex));
