import 'source-map-support/register';
import * as Koa from 'koa';
import * as KoaLogger from 'koa-logger';
import * as KoaCors from 'kcors';
import * as mongoose from 'mongoose';
import * as tickers from './tickers';
import { Ticker } from './models/Ticker';
import { test } from './tasks/queues';
import routing from './routes';
(mongoose as any).Promise = Promise;

const mongoOptions: mongoose.ConnectionOptions = {
    useMongoClient: true,
    promiseLibrary: Promise,
};
mongoose.connect(process.env.MOGNODB_URI || 'mongodb://localhost/coincoin', mongoOptions);

const app = new Koa();

app.use(KoaLogger())
    .use(KoaCors());

routing(app);

app.listen(process.env.PORT || 3000, () =>
    console.log(`✅  The server is running..`));

export default app;
