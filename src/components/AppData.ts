import { IEvents } from './base/events';
import {
	IBasket,
	IOrder,
	IProduct,
	OrderForm,
	FormErrors,
} from '../types/index';
import { Model } from './base/Model';

	export class AppData extends Model<IOrder> {
		
	items: IProduct[] = [];
	preview: IProduct = null;
	basket: IBasket = {
		items: [],
	};

	order: IOrder = {
		payment: '',
		address: '',
		email: '',
		phone: '',
	};

	formErrors: FormErrors = {};

	constructor(protected events: IEvents) {
		super({}, events);
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
		return this.basket.items.includes(item);
	}

	addToBasket(item: IProduct) {
		this.basket.items.push(item);
		this.events.emit('basket:changed', this.basket);
	}

	removeFromBasket(item: IProduct) {
		this.basket.items = this.basket.items.filter((id) => id !== item);
		this.events.emit('basket:changed', this.basket);
	}

	clearBasket() {
		this.basket.items = [];
		this.events.emit('basket:changed', this.basket);
	}

	clearOrder() {
		this.order.payment = '';
		this.order.address = '';
		this.order.email = '';
		this.order.phone = ''
	}

	getTotalPrice() {
		return this.basket.items.reduce((a, b) => a + b.price, 0);
	}

	setOrderField(field: keyof OrderForm, value: string) {
		this.order[field] = value;

		if (this.validateOrderForm()) {
			const orderItems = this.basket.items.map(item => item.id);
			const orderTotal = this.getTotalPrice();
			this.events.emit('order:ready', { ...this.order, items: orderItems, total: orderTotal });
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
