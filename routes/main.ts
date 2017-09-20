import { Ticker } from '../models/Ticker';
import * as Router from 'koa-router';

const router = new Router();
router.prefix('/');

router.get('/', async (ctx) => {
    ctx.body = await Ticker.getLatestRecords({
        uniqueId: ['bittrex@USDT_ETH'],
        // baseCurrency: ['KRW'],
    });
});

export default router;
