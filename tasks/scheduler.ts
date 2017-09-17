import { Queue } from '.';
import * as Logger from 'logplease';
const logger = Logger.create('TaskScheduler');
const queues = require('./queues');

const MS = 1;
const S = 1000;
const M = 60 * 1000;

const addSchedule = (queue: Queue, interval: number) => {
    setInterval(() => {
        logger.log(`Sending scheduled job request of ${queue.name}..`);
        const hrstart = process.hrtime();
        queue.invokeAndWait().then((job) => {
            const hrend = process.hrtime(hrstart);
            const took = `${hrend[0]}s ${hrend[1]/1000000}ms`;
            logger.log(`Successfully executed job request id of #${job.id} from ${queue.name} took ${took}`);
        }).catch((err) => {
            logger.error(err);
        });
    }, interval);
};

logger.info('Scheduling jobs of queues..');
addSchedule(queues.test, 5 * S);
addSchedule(queues.coinoneTicker, 5 * S);
addSchedule(queues.bithumbTicker, 5 * S);
addSchedule(queues.poloniexTicker, 5 * S);
