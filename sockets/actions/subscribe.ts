import { IWebSocketControllerActionResponse, WebSocketControllerAction } from '../controller';

export const subscribe: WebSocketControllerAction =
    (data: any): IWebSocketControllerActionResponse => {
        console.log(data);
        return {};
};
