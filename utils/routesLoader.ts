import * as glob from 'glob';

export default function(dirname): Promise<any> {
    return new Promise((resolve, reject) => {
        const routes = [];
        glob(`${dirname}/*.js`, {
            ignore: '**/index.js',
        }, (err, files) => {
            if (err) {
                return reject(err);
            }
            files.forEach((file) => {
                const route = require(file); // eslint-disable-line global-require, import/no-dynamic-require
                routes.push(route.default);
            });
            return resolve(routes);
        });
    });
}
