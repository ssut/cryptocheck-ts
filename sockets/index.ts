import * as WebSocket from 'ws';
import { IncomingMessage } from 'http';
import SocketDataController from './controller';
import * as actions from './actions';

export interface IWebSocketServer extends WebSocket.Server {
    broadcast(data: any);
    /**
     * broadcast if condition matches
     *
     * @example <caption>Send "hello!" to clients, which contains "bittrex" in their "subscriptions" context,
     * in every 5 seconds</caption>
     * setInterval(() => {
     *    wss.broadcastMatch((cont): boolean => {
     *        const subs: Set<string>|undefined = cont.getContext('subscriptions');
     *        return subs && subs.has('bittrex');
     *    }, 'hello!');
     * }, 5000);
     */
    broadcastMatch(cond: (cont: SocketDataController) => boolean, data: any);
}

export interface IWebSocketConnection extends WebSocket {
    controller?: SocketDataController;
}

const handling = (wss: IWebSocketServer) => {
    SocketDataController.registerActions(actions as any);

    const handleConnection = (ws: IWebSocketConnection, request: IncomingMessage) => {
        ws.controller = new SocketDataController(wss, ws, request);
    };

    wss.broadcast = (data: any) => {
        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(data);
            }
        });
    };
    wss.broadcastMatch = (cond: (cont: SocketDataController) => boolean, data: any) => {
        wss.clients.forEach((client: IWebSocketConnection) => {
            if (client.readyState === WebSocket.OPEN && client.controller && cond(client.controller)) {
                client.send(data);
            }
        });
    };
    wss.on('connection', handleConnection);

};

export default handling;
