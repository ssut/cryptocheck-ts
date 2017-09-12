import axios from 'axios';
import * as Decimal from 'decimal.js';

export interface ICoinmarketcapMarketPriceResponse {
    result: {
        price: number,
    },
    allowance: {
        cost: number,
        remaining: number,
    },
}

export default class TetherProvider {

    private static readonly DEFAULT_URL = 'https://api.cryptowat.ch/markets/kraken/usdtusd/price';

    /** data fetched by .getPriceRaw() */
    private data: ICoinmarketcapMarketPriceResponse;

    public async getPriceRaw(url: string = TetherProvider.DEFAULT_URL): Promise<object> {
        this.data = await axios.get(url).then((resp) => resp.data);
        return this.data;
    }

    get raw(): ICoinmarketcapMarketPriceResponse {
        return this.data;
    }

    public async getPrice(): Promise<number> {
        if (this.data === undefined) {
            await this.getPriceRaw();
        }
        const price = this.data.result.price;
        const cut = parseFloat(new Decimal(price).toFixed(3));
        return cut as number;
    }

}
