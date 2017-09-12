import * as mongoose from 'mongoose';
import ITicker from './ITicker';
import * as Decimal from 'decimal.js';

export interface ITickerModel extends ITicker, mongoose.Document { }

const decimalGetter = (val) => Decimal(val);
const decimalSetter = (val) => Decimal(val).toFixed();
const decimalType = { type: String, get : decimalGetter, set: decimalSetter };

const tickerSchema = new mongoose.Schema({
    code: String,
    market: String,
    marketName: String,
    isIntlMarket: Boolean,
    baseCurrency: String,
    nextCurrency: String,
    createdAt: Date,
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
    next();
});

export const Ticker: mongoose.Model<ITickerModel> = mongoose.model<ITickerModel>('Ticker', tickerSchema);
