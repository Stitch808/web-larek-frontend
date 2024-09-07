export interface IProduct {
	id: string;
	description?: string;
	image: string;
	name: string;
	category: string;
	price: number | null;
	index?: number;
}

export interface IBasket {
	items: IProduct[];
}

export interface IOrder {
	address: string;
	phone: string;
	payment: string;
	email: string;
	
}

export interface IPaymentAndAddressForm {
	address: string,
	paymentType: string,
}

export type PaymentMethod = 'cash' | 'card';

export type OrderForm = Omit<IOrder, 'total'|'items'>;

export type FormErrors = Partial<Record<keyof IOrder, string>>;

export interface IOrderResult {
	id: string;
	total: number;
}

export const CategoryType = <Record<string, string>>{
	'софт-скил': 'soft',
	'другое': 'other',
	'дополнительное': 'additional',
	'кнопка': 'button',
	'хард-скил': 'hard',
};
