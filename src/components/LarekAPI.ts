import { Api, ApiListResponse } from './base/api';
import { IProduct, IOrderResult, IOrder } from '../types/index';


export interface LarekAPI {
	getProductList: () => Promise<IProduct[]>; // Получение списка всех продуктов, доступных в магазине
	orderProduct: (value: IOrder) => Promise<IOrderResult>; // Отправка заказа на сервер
}

export class LarekApi extends Api implements LarekAPI {
	readonly cdn: string;

	constructor(cdn: string, baseUrl: string, options?: RequestInit) {
		super(baseUrl, options);
		this.cdn = cdn;
	}

	getProductList(): Promise<IProduct[]> {
		return this.get('/product').then((data: ApiListResponse<IProduct>) =>
			data.items.map((item) => ({
				...item,
				image: this.cdn + item.image,
			}))
		);
	}

	orderProduct(value: IOrder): Promise<IOrderResult> {
		if (value.items.length === 0) {
			throw new Error('No products specified in the order');
		  }
		console.log('Sending order to server:', value);
		return this.post('/order', value).then(
			(data: IOrderResult) => data,
		);
		
	}
}
