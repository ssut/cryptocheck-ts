import * as WebSocket from 'ws';
import { IncomingMessage } from 'http';

export interface IWebSocketServer extends WebSocket.Server {
    broadcast(data: any);
}

const handling = (wss: IWebSocketServer) => {
    const handleConnection = (ws: WebSocket, request: IncomingMessage) => {
        wss.broadcast('test');
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
