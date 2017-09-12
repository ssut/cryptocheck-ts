import * as Queue from 'bee-queue';
import * as sleep from 'sleep-promise';

const defaultQueueOptions = {
    redis: {
        host: 'localhost',
        port: 6379,
        db: 0,
        options: {},
    },
};
const queue: Queue = new Queue('coincoin');

queue.on('ready', () => {
    queue.process(async (job) => {
        console.log(job);
        await sleep(2000);
        return 4444;
    });

    console.log('processing job');
});

export {
    queue,
};
