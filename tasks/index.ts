import * as BeeQueue from 'bee-queue';
import * as Logger from 'logplease';

const logger = Logger.create('TaskRunner');

export interface IQueueResult {
    id: number
    result: any
};

export interface IBeeQueueJob {
    id: number|undefined
    data: object
    status?: string
    options?: any
    queue?: BeeQueue
    progress?: number
}

export class Queue {

    public readonly name: string;
    private readonly queue: BeeQueue;
    private readonly func: (job: any) => any;

    constructor(name: string, func: (job: any) => any) {
        this.name = name;
        this.queue = new BeeQueue(name);
        this.func = func;
    }

    public start(): void {
        this.queue.on('ready', () => {
            this.queue.process((job: any) => {
                logger.info(`#${job.id} from the Queue ${this.name} has invoked..`);
                const post = this.func(job);
                return post;
            });
            logger.info(`Queue ${this.name} is ready to process..`);
        });
    }

    public async getJob(id: number): Promise<IBeeQueueJob|undefined> {
        return await this.queue.getJob(id).then((job: IBeeQueueJob): IBeeQueueJob => ({
            id: job.id,
            data: job.data,
            status: job.status,
            options: job.options,
        }));
    }

    public invoke(args?: any): Promise<number> {
        return new Promise((resolve, reject) => {
            const job = this.queue.createJob(args);

            job.save((err, { id }) => {
                if (err) {
                    return reject(err);
                }
                return resolve(id);
            });
        });
    }

    public async invokeAndWait(args?: any): Promise<any> {
        return new Promise((resolve, reject) => {
            const job = this.queue.createJob(args);
            job.on('succeeded', (result) => resolve({
                result,
                id: job.id,
            }));
            job.on('failed', (_, err) => reject(err));
            job.save((err) => {
                if (err) {
                    return reject(err);
                }
            });
        });
    }

};

if (require.main === module) {
    logger.info('Starting queues...');
    const queues = require('./queues');
    for (const [name, queue] of Object.entries(queues)) {
        logger.info(`Preparing Queue ${name}..`);
        queue.start();
    }
}
