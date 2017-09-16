import 'source-map-support/register';
import * as mongoose from 'mongoose';
import { send } from 'micro';
import { router, get } from 'microrouter';
import * as tickers from './tickers';
import { Ticker } from './models/Ticker';
import { test } from './tasks/queues';
import * as sleep from 'sleep-promise';
(mongoose as any).Promise = Promise;

const compose: any = (...fns) => fns.reduce((prevFn, nextFn) => (value) => nextFn(prevFn(value)), (value) => value);

const mongoOptions: mongoose.ConnectionOptions = {
    useMongoClient: true,
    promiseLibrary: Promise,
};
mongoose.connect(process.env.MOGNODB_URI || 'mongodb://localhost/coincoin', mongoOptions);

export default compose()(router(
    get('/', async () => {
        const result = await test.invokeAndWait();
        return result;
        // const coinoneTicker = new tickers.BithumbTicker();
        // const data = await coinoneTicker.getPrices().then((x) => coinoneTicker.parse(x));

        // for (const [key, info] of Object.entries(data.details)) {
        //     const t = new Ticker({
        //         code: key,
        //         market: 'bithumb',
        //         marketName: '빗썸',
        //         isIntlMarket: false,
        //         baseCurrency: info.baseCurrency,
        //         nextCurrency: info.nextCurrency,
        //         volume: info.volume,
        //         ...info.value,
        //     });
        //     await t.save();
        // }


        // return await Ticker.aggregate([
        //     { $match: { market: { $in: ['bithumb'] } } },
        //     { $group: {
        //         _id: "$code",
        //         createdAt: { $last: '$createdAt' },
        //         market: { $first: '$market' },
        //         marketName: { $first: '$marketName' },
        //         isIntlMarket: { $first: '$isIntlMarket' },
        //         baseCurrency: { $first: '$baseCurrency' },
        //         nextCurrency: { $first: '$nextCurrency' },
        //         volume: { $first: '$volume' },
        //         first: { $first: '$first' },
        //         high: { $first: '$high' },
        //         last: { $first: '$last' },
        //         low: { $first: '$low' },
        //     } },
        //     { $project: {
        //         code: "$_id",
        //         document: "$$ROOT",
        //     } },
        // ]);
    }),
));
