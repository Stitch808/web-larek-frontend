import {IEvents} from "./base/events"
import {IProduct, IAppData, IOrder, FormErrors, Events} from "../types"
import {Model} from "./base/Model";

export type ProductsChangeEvent = {
	products: IProduct[]
}

export class AppData extends Model<IAppData> {
	private products: IProduct[] //массив объектов продуктов (товаров)
	private basket: IProduct[] //массив товаров в корзине
	private order: IOrder //заказ
	private selectedProduct: string | null //id товара для отображения в модальном окне
	private formErrors: FormErrors = {}

	constructor(data: Partial<IAppData>, protected events: IEvents, products: IProduct[], basket: IProduct[], order: IOrder) {
		super(data, events);
		this.products = products;
		this.basket = basket;
		this.order = order
	}

	//получаем товары для главной страницы
	setProducts(products: IProduct[]) {
		this.products = products;
		this.emitChanges(Events.PRODUCTS_CHANGED, { products: this.products });
	} 

	getProducts() {
		return this.products;
	}

	selectProduct(selectedProduct: string | null) {
		this.selectedProduct = selectedProduct
		this.emitChanges(Events.PRODUCT_OPEN_IN_MODAL, { selectedProduct: this.selectedProduct });
	}

	getBasket() {
		return this.basket;
	}

	addProductToBasket(product: IProduct) {
		if (!this.basket.some(item => item === product)) {
			this.basket.push(product)
		}
	}

	removeProductFromBasket(product: IProduct) {
		this.basket = this.basket.filter(item => item !== product);
        this.emitChanges(Events.BASKET_OPEN);
	}

	getTotalPrice() {
		return this.basket.map(product => product.price)
		.reduce((a, b) => a + b, 0)
	}

	clearBasket() {
		this.basket = []
		this.emitChanges(Events.PRODUCTS_CHANGED, {products: this.products });
	}

	getOrder() {
		return this.order;
}

//проверка на заполненность первой формы
	isFirstFormFill() {
		if (this.order === null) {
			return false
		}
		else {
			return this.order.address && this.order.payment;
		}
	}

	setOrderField(field: keyof Omit<IOrder, 'items' | 'total'>, value: string) {
		this.order[field] = value;
		if (this.validateOrder(field)) {
			this.emitChanges(Events.FORM_USERDATA_SUBMIT, {order: this.order})
		}
	}

	clearOrder() {
		this.order = {
				payment: null,
				address: '',
				email: '',
				phone: '',
				total: 0,
				items: [],
		};
	}

    validateOrder(field: keyof IOrder) {
        const errors: Partial<Record<keyof IOrder, string>> = {};

        // Проверка для полей email и phone
        if (field === 'email' || field === 'phone') {
            const emailError = !this.order.email.match(/^\S+@\S+\.\S+$/)
                ? 'email'
                : '';
            const phoneError = !this.order.phone.match(/^\+\d{1,3} \(\d{3}\) \d{3}-\d{2}-\d{2}$/) 
                ? 'телефон'
                : '';

            if (emailError && phoneError) {
                errors.email = `Необходимо указать ${emailError} и ${phoneError}`;
            } else if (emailError) {
                errors.email = `Необходимо указать ${emailError}`;
            } else if (phoneError) {
                errors.phone = `Необходимо указать ${phoneError}`;
            }
        } else if (!this.order.address) errors.address = 'Необходимо указать адрес';
        else if (!this.order.payment)
            errors.address = 'Необходимо выбрать тип оплаты';

        this.formErrors = errors;
        this.events.emit(Events.FORM_ERRORS_CHANGED, this.formErrors);
        return Object.keys(errors).length === 0;
    }

}