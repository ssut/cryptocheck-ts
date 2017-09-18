import * as WebSocket from 'ws';
import { IncomingMessage } from 'http';

const handleConnection = (ws: WebSocket, request: IncomingMessage) => {
    ws.send('hello');
};

const handling = (wss: WebSocket.Server) => wss.on('connection', handleConnection);

export default handling;
