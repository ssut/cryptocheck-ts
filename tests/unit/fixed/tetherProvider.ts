import axios from 'axios';
import test from 'ava';
import * as MockAdapter from 'axios-mock-adapter';
import { TetherProvider } from '../../../tickers';

test('TetherProvider -> number (ratio)', async (t) => {
    const sample = {
        result: {
            price: 1.0052,
        },
        allowance: {
            cost: 2272602,
            remaining: 3997727398,
        },
    };
    const expected = 1.005;
    const url = 'https://api.cryptowat.ch/markets/kraken/usdtusd/price';

    const mock = new MockAdapter(axios);
    mock.onGet(url).reply(200, sample);

    const provider = new TetherProvider();
    const data = await provider.getPriceRaw();
    const actual = await provider.getPrice();

    t.deepEqual(data, sample);
    t.deepEqual(actual, expected);
});
