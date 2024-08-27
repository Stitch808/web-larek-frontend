import { IEvents } from './base/events';
import {IBasket, IOrder, IProduct, OrderForm, PaymentMethod, FormErrors} from '../types/index';

export type CatalogChangeEvent = {
	catalog: IProduct[];
};

export class AppData {
	items: IProduct[] = [];
	preview: IProduct = null;
	catalog: IProduct[];
	basket: IBasket = {
		items: [],
		total: 0
	};
	order: IOrder = {
		total: 0,
		items: [],
		payment: '',
		address: '',
		email: '',
		phone: '',
	};
	formErrors: FormErrors = {};

	constructor(protected events: IEvents) {

	}

	setItems(items: IProduct[]) {
		this.items = items;
		this.events.emit('items:changed', this.items);
	}

	setPreview(item: IProduct) {
		this.preview = item;
		this.events.emit('preview:changed', this.preview);
	}

	inBasket(item: IProduct) {
		return this.basket.items.includes(item)
	}

	addToBasket(item: IProduct) {
		this.basket.items.push(item);
		this.basket.total += item.price;
		this.addOrderID(item);
		this.events.emit('basket:changed', this.basket);
	}

	addOrderID(item: IProduct) {
		this.order.items.push(item.id);
	}

	removeFromBasket(item: IProduct) {
		this.basket.items = this.basket.items.filter(id => id !== item)
		this.basket.total -= item.price;
		this.events.emit('basket:changed', this.basket);
	}

	clearBasket() {
		this.basket.items = [];
		this.basket.total = 0;
		this.order.items = [];
		this.events.emit('basket:changed', this.basket);
	}

	getTotalPrice() { 
		return this.basket.items.reduce((a, b) => a + b.price, 0);
	}

	setOrderField(field: keyof OrderForm, value: string) {
		this.order[field] = value;
		this.basket.items.map((item) => ({ id: item, quantity: 1 }));
		this.order.total = this.getTotalPrice(); 
		
		if (this.validateOrderForm()) {
			this.events.emit('order:ready', this.order);
		}
	}

	setContactsField(field: keyof OrderForm, value: string) {
		this.order[field] = value;

		if (this.validateContactsForm()) {
			this.events.emit('order:ready', this.order);
		}
	}

	validateOrderForm() {
		const errors: typeof this.formErrors = {};
		if (!this.order.address) {
			errors.address = 'Необходимо указать адрес';
		}

		if (!this.order.payment) {
			errors.address = 'Необходимо выбрать способ оплаты';
		}

		this.formErrors = errors;
		this.events.emit('formErrors:change', this.formErrors);
		return Object.keys(errors).length === 0;
	}

	validateContactsForm() {
		const errors: typeof this.formErrors = {};

		if (!this.order.email) {
			errors.email = 'Необходимо указать email';
		}

		if (!this.order.phone) {
			errors.phone = 'Необходимо указать телефон';
		}

		this.formErrors = errors;
		this.events.emit('formErrors:change', this.formErrors);
		return Object.keys(errors).length === 0;
	}

}