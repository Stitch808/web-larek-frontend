import { Api} from './base/api';
import {IProductList} from '../types/productList'
import { IOrder, IOrderResult, IProduct } from '../types';

export interface ILarekApi {
    getProducts(): Promise<IProductList<IProduct>>;
    createOrder(order: IOrder): Promise<IOrderResult>;
}

export class LarekApi extends Api implements ILarekApi {
    readonly cdn: string;

    constructor(cdn: string, baseUrl: string, options?: RequestInit) {
        super(baseUrl, options);
        this.cdn = cdn;
    }

    getProducts(): Promise<IProductList<IProduct>> {
        return this.get('/product') as Promise<IProductList<IProduct>>
    }

    createOrder(order: IOrder): Promise<IOrderResult> {
        return this.post('/order', order) as Promise<IOrderResult>
    }

}