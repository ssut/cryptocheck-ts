import test from 'ava';
import axios from 'axios';
import * as MockAdapter from 'axios-mock-adapter';
import { CoinoneTicker } from '../../../tickers';

test('CoinoneTicker -> ITicker', async (t) => {
    // Arrange
    const sample = require('./samples/coinone').default;
    const expected = require('./samples/coinone.expected').default;
    const mock = new MockAdapter(axios);
    mock.onGet('https://api.coinone.co.kr/ticker/?format=json&currency=').reply(200, sample);

    // Act
    const ticker = new CoinoneTicker('https://api.coinone.co.kr');
    const prices = await ticker.getPrices();
    const actual = await ticker.parse(prices);

    // Assert
    t.deepEqual(prices, sample);
    t.deepEqual(actual, expected);
});

test('CoinoneTicker -> RateLimitExceeded -> Error', async (t) => {
    // Arrange
    const mock = new MockAdapter(axios);
    mock.onGet('https://api.coinone.co.kr/ticker/?format=json&currency=').reply(429, {
        result: 'error',
        errorCode: '4',
        errorMsg: 'Blocked user access.',
    });

    // Act
    const ticker = new CoinoneTicker('https://api.coinone.co.kr');
    const getPrices = ticker.getPrices();

    // Assert
    await t.throws(getPrices);
});

test('CoinoneTicker -> ServersDead -> Error', async (t) => {
    // Arrnage
    const mock = new MockAdapter(axios);
    mock.onGet('https://api.coinone.co.kr/ticker/?format=json&currency=').timeout();

    // Act
    const ticker = new CoinoneTicker('https://api.coinone.co.kr');
    const getPrices = ticker.getPrices();

    // Assert
    await t.throws(getPrices);
});
