import * as mongoose from 'mongoose';
import ITicker from './ITicker';
import * as Decimal from 'decimal.js';

export interface ITickerModel extends ITicker, mongoose.Document { }

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
    createdAt: { type: Date, default: Date.now, index: true },
    volume: decimalType,
    last: decimalType,
    high: decimalType,
    low: decimalType,
    first: decimalType,
});

tickerSchema.pre('save', function(next) {
    if (this.createdAt === undefined) {
        this.createdAt = new Date();
    }
    this.uniqueId = `${this.market}@${this.code}`;
    next();
});

export const Ticker: mongoose.Model<ITickerModel> =
    (mongoose as any).models.Ticker ||
    mongoose.model<ITickerModel>('Ticker', tickerSchema);
