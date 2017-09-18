import * as mongoose from 'mongoose';
import * as moment from 'moment';
import ITicker from './ITicker';
import { ITickerValue } from './ITicker';
import * as Decimal from 'decimal.js';
import { ITickerItem } from '../tickers/models';

export interface IPushArgs {
    market: string;
    code: string;
    isIntlMarket: boolean;
    values: ITickerItem;
}
export interface IGetLatestRecordsArgs {
    market?: string[];
    baseCurrency?: string[];
    nextCurrency?: string[];
}
export interface ITickerDocument extends ITicker, mongoose.Document { }
export interface ITickerModel extends mongoose.Model<ITickerDocument> {
    push(args: IPushArgs): Promise<any>;
    getLatestRecords(args: IGetLatestRecordsArgs);
}

const decimalGetter = (val) => Decimal(val);
const decimalSetter = (val) => Decimal(val).toFixed();
const decimalType = { type: String, get: decimalGetter, set: decimalSetter };

const tickerSchema = new mongoose.Schema({
    uniqueId: { type: String, index: true },
    code: { type: String },
    market: { type: String, index: true },
    isIntlMarket: { type: Boolean, default: false },
    baseCurrency: { type: String, index: true },
    nextCurrency: { type: String, index: true },
    createdAtByDate: { type: Date, index: true },
    lastUpdatedAt: { type: Date, index: true },
    values: Object,
    last: Object,
//     volume: decimalType,
//     last: decimalType,
//     high: decimalType,
//     low: decimalType,
//     first: decimalType,
});

tickerSchema.pre('save', function(next) {
    if (!this.uniqueId) {
        this.uniqueId = `${this.market}@${this.code}`;
    }
    if (!this.createdAtByDate) {
        this.createdAt = moment.utc().startOf('date').toDate();
    }
    next();
});

tickerSchema.statics.getLatestRecords = function(args: IGetLatestRecordsArgs): Promise<any[]> {
    const conditions: any = {};
    for (const [key, vals] of Object.entries(args)) {
        if (args[key] && args[key].length > 0) {
            conditions[key] = { $in: vals };
        }
    }

    const query = this.aggregate([
        { $match: conditions },
        { $group: {
            _id: '$uniqueId',
            createdAtByDate: { $last: '$createdAtByDate' },
            lastUpdatedAt: { $last: '$lastUpdatedAt' },
            code: { $first: '$code' },
            market: { $first: '$market' },
            isIntlMarket: { $first: '$isIntlMarket' },
            baseCurrency: { $first: '$baseCurrency' },
            nextCurrency: { $first: '$nextCurrency' },
            last: { $last: '$last' },
        } },
        { $project: {
            uniqueId: '$_id',
            code: '$code',
            date: '$createdAtByDate',
            updatedAt: '$lastUpdatedAt',
            market: '$market',
            isIntlMarket: '$isIntlMarket',
            baseCurrency: '$baseCurrency',
            nextCurrency: '$nextCurrency',
            value: '$last',
            volume: '$last.volume',
        } },
    ]);

    return query;
};

tickerSchema.statics.push = function(args: IPushArgs): Promise<any[]> {
    const now: moment.Moment = moment();
    const createdAtByDate: Date = now.clone().startOf('date').toDate();
    const currentHour: number = now.get('hour');
    const currentMinute: number = now.get('minute');
    const currentSecond: number = now.get('second');

    const {
        market,
        code,
        isIntlMarket,
        values,
    } = args;
    const uniqueId = `${market}@${code}`;

    const value = Object.assign({
        volume: values.volume,
    }, values.value);

    const query = (this as mongoose.Query<ITickerModel>).findOneAndUpdate({
        market,
        uniqueId,
        createdAtByDate,
    }, {
        $set: {
            code,
            isIntlMarket,
            baseCurrency: values.baseCurrency,
            nextCurrency: values.nextCurrency,
            lastUpdatedAt: now.toDate(),
            last: value,
            [`values.${currentHour}.${currentMinute}.${currentSecond}`]: value,
        },
    }, { setDefaultsOnInsert: true, upsert: true });

    return Promise.all([
        query,
    ]);
};

export const Ticker: ITickerModel =
    (mongoose as any).models.Ticker ||
    mongoose.model<ITickerDocument>('Ticker', tickerSchema);
