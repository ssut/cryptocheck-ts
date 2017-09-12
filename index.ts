import 'source-map-support/register';

import { send } from 'micro';
import { router, get } from 'microrouter';

import * as tickers from './tickers';

import { queue } from './tasks';

const compose: any = (...fns) => fns.reduce((prevFn, nextFn) => (value) => nextFn(prevFn(value)), (value) => value);

export default compose()(router(
));
