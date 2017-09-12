import test from 'ava';
import axios from 'axios';
import * as MockAdapter from 'axios-mock-adapter';
import { WooriBankProvider } from '../../../tickers';

test.only('WooriBankProvider -> Currency in number', async (t) => {
    // Arrange
    const testURL = 'https://sbiz.wooribank.com/biz/jcc?withyou=BZFXD0025&__ID=c005989&color=A&caption=A';
    const sample = `
<table cellspacing="0" summary="환전시,매매기준율,해외송금시 사실때 파실때 환율">
	<caption>환전 매매기준율 해외송금 분류기준</caption>
	<colgroup>
		<col width="100"/>
		<col width="150"/>
		<col width="190"/>
		<col width="150"/>
	</colgroup>
	<thead>
		<tr>
			<th scope="col">&nbsp;</th>
			<th scope="col">환전시</th>
			<th scope="col">매매기준율</th>
			<th scope="col">해외송금시</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<th scope="row">사실때</th>
			<td>1100</td>
			<td rowspan="2"><strong class="font-13">1000.54</strong></td>
			<td>1120</td>
		</tr>
		<tr>
			<th scope="row">파실때</th>
			<td>1120.2</td>
			<td>1130.1</td>
		</tr>
	</tbody>
</table>`;
    const mock = new MockAdapter(axios);
    mock.onGet(testURL).reply(200, sample);
    const wooriProvider: WooriBankProvider = new WooriBankProvider();

    // Act
    const data = await wooriProvider.getBankCurrencyRaw(testURL);
    const actual = wooriProvider.getCurrency();

    // Assert
    t.deepEqual(data, sample);
    t.is(actual, 1000.54);
});
