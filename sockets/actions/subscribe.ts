import { WebSocketControllerAction } from '../controller';
import SocketDataController from '../controller';

const MARKETS: string[] = ['coinone', 'bittrex', 'poloniex', 'bithumb'];

export const getSubscriptions: WebSocketControllerAction =
    (self: SocketDataController, data: any) => {
        const subscriptions: Set<string> = self.getContext('subscriptions') || new Set();
        self.sendOk('', Array.from(subscriptions));
};

export const subscribe: WebSocketControllerAction =
    (self: SocketDataController, data: any) => {
        const subscriptions: Set<string> = self.getContext('subscriptions') || new Set();
        for (const market of (data as string[])) {
            if (!MARKETS.includes(market)) {
                return self.sendError(`market not found: ${market}`);
            }
            subscriptions.add(market);
        }

        self.setContext({ subscriptions });
        self.sendOk('markets are successfully subscribed', Array.from(subscriptions));
};
