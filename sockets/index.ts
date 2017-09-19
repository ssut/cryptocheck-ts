import * as WebSocket from 'ws';
import { IncomingMessage } from 'http';
import SocketDataController from './controller';
import * as actions from './actions';

export interface IWebSocketServer extends WebSocket.Server {
    broadcast(data: any);
}

export interface IWebSocketConnection extends WebSocket {
    controller?: SocketDataController;
}

const handling = (wss: IWebSocketServer) => {
    SocketDataController.registerActions(actions as any);

    const handleConnection = (ws: IWebSocketConnection, request: IncomingMessage) => {
        ws.controller = new SocketDataController(wss, ws, request);
    };

    wss.broadcast = function broadcast(data) {
        wss.clients.forEach(function each(client) {
            if (client.readyState === WebSocket.OPEN) {
                client.send(data);
            }
        });
    };
    wss.on('connection', handleConnection);
};

export default handling;
