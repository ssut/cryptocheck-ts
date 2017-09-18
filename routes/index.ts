import routesLoader from '../utils/routesLoader';
import * as Koa from 'koa';

export default function(app: Koa) {
    routesLoader(`${__dirname}`).then((files) => {
        files.forEach((route) => {
            console.log(route);
            app
                .use(route.routes())
                .use(route.allowedMethods({
                    throw: true,
                }));
        });
    });
}
