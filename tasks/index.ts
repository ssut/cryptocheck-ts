import axios from 'axios';
import * as Pino from 'pino';

const pino = Pino();
const pretty = Pino.pretty();
pretty.pipe(process.stdout);
const log = Pino({
  name: 'app',
  safe: true,
}, pretty);

const logWithDuration = (func, name: string, hr: [number, number], id: number): void => {
    const measured = process.hrtime(hr);
    const [ seconds, milliseconds ] = [measured[0], measured[1] / 1000000];
    log.info('[Runner] %s took %ds %dms.. #%d', name, seconds, milliseconds, id);
};

export class Queue {

    public readonly name: string;
    public readonly waitFinished: boolean;
    private readonly func: () => Promise<any>;
    private id: NodeJS.Timer;
    private counter: number;
    private running: boolean;

    constructor(name: string, func: () => Promise<any>, waitFinished: boolean = true) {
        this.name = name;
        this.func = func;
        this.waitFinished = waitFinished;
        this.counter = 0;
        this.running = false;
    }

    public start(interval: number = 5000): boolean {
        log.info('[Scheduler] Scheduling `%s`..', this.name);
        this.id = setInterval(() => {
            if (this.waitFinished && this.running) {
                log.warn('[Runner] Skipping %s because of waitFinished', this.name);
                return;
            }

            const id = ++this.counter;
            this.running = true;
            log.info('[Runner] Executing %s.. #%d', this.name, id);
            const start = process.hrtime();
            this.func().then(() => {
                this.running = false;
                logWithDuration(log.info, this.name, start, id);
            }).catch((err) => {
                this.running = false;
                log.child({ name: this.name, id }).error(err);
                logWithDuration(log.warn, this.name, start, id);
            });
        }, interval);

        return !!this.id;
    }

}

if (require.main === module) {
    log.info('[Initializer] Starting queues...');
    axios.defaults.timeout = 5000;
    const queues = require('./queues');
    for (const [name, queue] of Object.entries(queues)) {
        log.info(`[Initializer] Preparing Queue ${name}..`);
        queue.start();
    }
}
