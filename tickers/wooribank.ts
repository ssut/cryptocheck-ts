import axios from 'axios';
import * as cheerio from 'cheerio';

export interface IBankCurrencyProvider {
    getBankCurrencyRaw(url: string): Promise<string>;
    getCurrency(): number;
}

export default class WooriBankProvider implements IBankCurrencyProvider {

    private static readonly DEFAULT_URL =
        'https://sbiz.wooribank.com/biz/jcc?withyou=BZFXD0025&__ID=c005989&color=A&caption=A';

    /** data fetched by .getBankCurrencyRaw() */
    private data: string;

    public async getBankCurrencyRaw(url: string = WooriBankProvider.DEFAULT_URL): Promise<string> {
        this.data = await axios.get(url).then((resp) => resp.data);
        return this.data;
    }

    get raw(): string {
        return this.data;
    };

    public getCurrency(): number {
        const $ = cheerio.load(this.data);
        const value = $('table > tbody > tr:first-child > td[rowspan="2"]').text();
        return parseFloat(value);
    }
}
