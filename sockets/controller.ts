import { IWebSocketServer } from '.';
import * as WebSocket from 'ws';
import { IncomingMessage } from 'http';

export interface IWebSocketConnection extends WebSocket {
    context: {
        [key: string]: any,
    };
}

export type WebSocketControllerAction = (data: any) => IWebSocketControllerActionResponse;

export interface IWebSocketControllerActionResponse {
    exec?: string;
}

export interface IData {
    msg: string;
    data?: any;
}

export default class SocketDataController {

    public static actions: { [key: string ]: WebSocketControllerAction };
    public static registerActions(actions: { [key: string]: WebSocketControllerAction }): void {
        SocketDataController.actions = actions;
    }

    private readonly wss: IWebSocketServer;
    private readonly ws: IWebSocketConnection;
    private readonly request: IncomingMessage;

    constructor(wss: IWebSocketServer, ws: WebSocket, request: IncomingMessage) {
        this.wss = wss;
        this.ws = ws as IWebSocketConnection;
        this.request = request;

        this.ws.on('message', this.onMessage.bind(this));
    }

    get context(): any {
        return this.ws.context || {};
    }

    public getContext(key: string): any {
        return this.ws.context[key];
    }

    private setContext(ctx: object): void {
        this.ws.context = Object.assign(ctx, this.ws.context);
    }

    private send(data: any): void {
        this.ws.send(JSON.stringify(data));
    }

    private onMessage(data: WebSocket.Data): void {
        try {
            const msg: IData = JSON.parse(data.toString());
            if (msg.msg === undefined) {
                throw new SyntaxError();
            } else if (SocketDataController.actions.hasOwnProperty(msg.msg)) {
                const result = SocketDataController.actions[msg.msg](msg.data);
            } else {
                this.send({ ok: false, data: `no action found in ${msg.msg}` });
            }
        } catch (err) {
            if (err instanceof SyntaxError) {
                return;
            }
            console.error(err);
        }
    }

}
