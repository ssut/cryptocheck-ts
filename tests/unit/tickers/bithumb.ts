import test from 'ava';
import axios from 'axios';
import * as MockAdapter from 'axios-mock-adapter';
import { BithumbTicker } from '../../../tickers';

test('BithumbTicker -> ITicker', async (t) => {
    // Arrange
    const sample = require('./samples/bithumb').default;
    const expected = require('./samples/bithumb.expected').default;
    const mock = new MockAdapter(axios);
    mock.onGet('https://api.bithumb.com/public/ticker/ALL').reply(200, sample);
    const asdf = 1;

    // Act
    const ticker = new BithumbTicker('https://api.bithumb.com');
    const prices = await ticker.getPrices();
    const actual = await ticker.parse(prices);

    // Assert
    t.deepEqual(prices, sample);
    t.deepEqual(actual, expected);
});
