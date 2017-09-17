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
        return await Ticker.getLatestRecords({
            nextCurrency: ['ETH'],
        });
    }),
));
