import { ITicker } from './models';
import axios from 'axios';

export interface ITickAPIProvider {

    baseURL: string;

    getPrices(path?: string): Promise<object|string>;
    parse(data: object|string): Promise<ITicker>;

};

export class TickAPIProvider {

    public readonly baseURL: string;

    protected async get(path): Promise<object|string> {
        return await axios.get(`${this.baseURL}${path}`).then((resp) => resp.data);
    }

};
