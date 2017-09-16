import { Queue } from './../index';

export const test = new Queue('test', async (job) => {
    return { id: job.id };
});
