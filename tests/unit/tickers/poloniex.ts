import test from 'ava';
import axios from 'axios';
import * as MockAdapter from 'axios-mock-adapter';
import { PoloniexTicker } from '../../../tickers';

test('PoloniexTicker -> ITicker', async (t) => {
    // Arrange
    const sample = require('./samples/poloniex').default;
    const expected = require('./samples/poloniex.expected').default;
    const mock = new MockAdapter(axios);
    mock.onGet('https://poloniex.com/public?command=returnTicker').reply(200, sample);

    // Act
    const ticker = new PoloniexTicker('https://poloniex.com');
    const prices = await ticker.getPrices();
    const actual = await ticker.parse(prices);

    // Assert
    t.deepEqual(prices, sample);
    t.deepEqual(actual, expected);
});

test('PoloniexTicker -> Given 404 -> Error', async (t) => {
    // Arrange
    const mock = new MockAdapter(axios);
    mock.onGet('https://poloniex.com/public?command=returnTicker').reply(404, {});

    // Act
    const ticker = new PoloniexTicker('https://poloniex.com');
    const getPrices = ticker.getPrices();

    // Assert
    await t.throws(getPrices);
});

test('PoloniexTicker -> ServersDead -> Error', async (t) => {
    // Arrange
    const mock = new MockAdapter(axios);
    mock.onGet('https://poloniex.com/public?command=returnTicker').timeout();

    // Act
    const ticker = new PoloniexTicker('https://poloniex.com');
    const getPrices = ticker.getPrices();

    // Assert
    await t.throws(getPrices);
});
