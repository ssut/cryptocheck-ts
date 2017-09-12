import test from 'ava';
import axios from 'axios';
import * as MockAdapter from 'axios-mock-adapter';
import { BittrexTicker } from '../../../tickers';

test('BittrexTicker -> ITicker', async (t) => {
    // Arrange
    const sample = {
        success: true,
        message: "",
        result: [
            {
                MarketName: "BTC-1ST",
                High: 0.00007891,
                Low: 0.00007101,
                Volume: 1374866.45151473,
                Last: 0.00007380,
                BaseVolume: 101.48715956,
                TimeStamp: "2017-09-12T03:29:51.79",
                Bid: 0.00007336,
                Ask: 0.00007465,
                OpenBuyOrders: 252,
                OpenSellOrders: 5435,
                PrevDay: 0.00007160,
                Created: "2017-06-06T01:22:35.727",
            },
        ],
    };
    const expected = {
        supported: ['BTC_1ST'],
        details: {
            BTC_1ST: {
                baseCurrency: 'BTC',
                nextCurrency: '1ST',
                value: {
                    last: '0.00007380',
                    high: '0.00007891',
                    low: '0.00007101',
                    first: '0.00007160',
                },
                volume: '1374866.45151473',
            },
        },
    };
    const mock = new MockAdapter(axios);
    mock.onGet('https://bittrex.com/api/v1.1/public/getmarketsummaries').reply(200, sample);

    // Act
    const ticker = new BittrexTicker('https://bittrex.com');
    const prices = await ticker.getPrices();
    const actual = await ticker.parse(prices);

    // Assert
    t.deepEqual(prices as any, sample);
    t.deepEqual(actual, expected);
});
