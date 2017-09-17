import { Queue } from '..';
import * as mongoose from 'mongoose';
import { Ticker } from '../../models/Ticker';
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

export const coinoneTicker = new Queue('coinoneTicker', async (job) => {
    const data = await tickers.coinone.getPrices().then((x) => tickers.coinone.parse(x));
    const promises = [];
    for (const [key, info] of Object.entries(data.details)) {
        const t = new Ticker({
            code: key,
            market: 'coinone',
            baseCurrency: info.baseCurrency,
            nextCurrency: info.nextCurrency,
            volume: info.volume,
            ...info.value,
        });
        promises.push(t.save());
    }
    return Promise.all(promises);
});
