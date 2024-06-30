//Продукт
export interface IProduct {
	id: string;
	description: string;
	image: string;
	title: string;
	category: ProductCategory;
	price: number | null;
}

//Категории продуктов
export enum ProductCategory {
    'софт-скил' = 'soft',
    'другое' = 'other',
    'хард-скил' = 'hard',
    'дополнительное' = 'additional',
    'кнопка' = 'кнопка'
}

//Заказ
export interface IOrder {
	address: string;
	phone: string;
	payment: string;
	email: string;
	total: number | null;
	items: string[]
}

//Ошибки в форме
export type FormErrors = {
	email?: string;
	phone?: string;
	address?: string;
	payment?: string;
}

//Результат заказа
export interface IOrderResult {
	id: string;
	total: number | null;
	error: string
}

export type ListItem = {
    index: number
}

//тип для отображения товара в корзине
export type TBasket = Pick<IProduct, 'id' | 'title' | 'price'>

//модель
export interface IAppData {
	products: IProduct[]
	basket: IProduct[]
	order: IOrder
}

export enum Events {
	PRODUCTS_CHANGED = 'products:changed', //изменение массива карточек
	PRODUCT_OPEN_IN_MODAL = 'product:preview', //открытие модалки с товаром
	USER_CHANGED  = 'userData:changed', //изменение данных пользователя при заполнении формы
	ADD_BASKET = 'basket:add-product', //добавление товара в корзину
	BASKET_REMOVE = 'basket:remove-product', //удаление товара из корзины
	MODAL_CLOSE = 'modal:close', //клик на иконку закрытия модального окна/клик на кнопку в модальном окне успешного заказа для перехода на главную
	MODAL_OPEN = 'modal:open', //открытие модалки
	BASKET_OPEN = 'basket:open',//открытие корзины пользователя
	PRODUCT_DELETE_IN_BASKET = 'product:delete', //клик на иконку удаление товара из корзины
	FORM_ERRORS_CHANGED = 'form:errors-changed', //показ(скрытие) ошибок формы
	ORDER_OPEN = 'order:open', //открытие формы заказа
	ORDER_CLEAR = 'order:clear', //очистка формы заказа
	FORM_USERDATA_SUBMIT = 'form-userdata:submit', // клик на кнопку далее в модальном окне с данными пользователя
	SET_PAYMENT_TYPE = 'order: set_peyment-type' //выбор способа оплаты
}