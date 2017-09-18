import { Ticker } from '../models/Ticker';
import * as Router from 'koa-router';

const router = new Router();
router.prefix('/');

router.get('/', async (ctx) => {
    ctx.body = await Ticker.getLatestRecords({
        baseCurrency: ['KRW'],
    });
});

console.log(router);
export default router;
