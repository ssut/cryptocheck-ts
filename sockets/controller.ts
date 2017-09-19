import { IWebSocketServer } from '.';
import * as WebSocket from 'ws';
import { IncomingMessage } from 'http';

export interface IWebSocketConnection extends WebSocket {
    context: {
        [key: string]: any,
    };
}

export type WebSocketControllerAction = (self: SocketDataController, data: any) => void;
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

        this.ws.context = {};
        this.ws.on('message', this.onMessage.bind(this));
    }

    public send(data: any): void {
        this.ws.send(JSON.stringify(data), (err: Error) => {
            console.error(err);
        });
    }

    public sendOk(msg: string, data?: any): void {
        this.send({ ok: true, data: msg, returns: data });
    }

    public sendError(msg: string): void {
        this.send({ ok: false, data: msg });
    }

    get context(): any {
        return this.ws.context;
    }

    public getContext(key: string): any|undefined {
        return this.ws.context[key];
    }

    public setContext(ctx: object): void {
        this.ws.context = Object.assign(ctx, this.ws.context);
    }

    private onMessage(data: WebSocket.Data): void {
        try {
            const msg: IData = JSON.parse(data.toString());
            if (msg.msg === undefined) {
                throw new SyntaxError();
            } else if (SocketDataController.actions.hasOwnProperty(msg.msg)) {
                SocketDataController.actions[msg.msg](this, msg.data);
            } else {
                this.sendError(`no action found in ${msg.msg}`);
            }
        } catch (err) {
            if (err instanceof SyntaxError) {
                return;
            } else {
                this.sendError('unable to handle the requested context');
            }
            console.error(err);
        }
    }

}
