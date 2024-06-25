//Продукт
export interface IProduct {
	id: string;
	description: string;
	image: string;
	title: string;
	category: string;
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
	items: IProduct[]
}

//Ошибки в форме
export type FormErrors = {
	email?: string;
	phone?: string;
	address?: string;
	payment?: string;
}

//интерфейс для данных пользователя
export interface IUserData {
	adress: string;
	email: string;
	phone: string;
	payment: string;
	getUserData(): IUserData; //данные пользователя для заказа
	checkUserInfoValidation(data: Record<keyof TContactInf, string>): boolean; //проверка корректности данных пользователя
}

//Результат заказа
export interface IOrderResult {
	id: string;
	total: number | null;
}

//интерфейс корзины товаров
export interface IBasket {
	basket: TBasket[];
	resetBasket(): void; //очищение данных после успешного заказа
}

//интерфейс открытой карточки товара для просмотра
export interface IExploreCard {
	items: IProduct[];
	preview: string | null;
}

export type ListItem = {
    index: number
}

// Отображение продукта на главной странице
type TMainCards = Omit<IProduct, "description">

//тип для отображения товара в корзине
export type TBasket = Pick<IProduct, 'id' | 'title' | 'price'>

//тип для модалки сособ оплаты и адрес
type TPayment = Pick<IOrder, 'payment' | 'address'>

//тип для модалки контактные данные 
type TContactInf = Pick<IOrder, 'email' | 'phone'>

//выбор способа оплаты
type OrderPayment = "online" | "cash"

//тип открфтого модального окна 
type AppStateModal = "card" | "basket" | "order"

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
	SET_PAYMENT_TYPE = 'order:set-payment-type', //выбор типа оплаты
	FORM_PAYMENT_SUBMIT = 'form-payment:submit', //клик на кнопку далее в модальном окне со способом оплаты
	FORM_USERDATA_SUBMIT = 'form-userdata:submit', // клик на кнопку далее в модальном окне с данными пользователя
	FORM_PAYMENT_VALID = 'form-payment:validation', // событие необходимости валидации всей формы с данными способа оплаты (влияет на активность кнопки)
	FORM_USERDATA_VALID = 'form-userdata:validation', // событие необходимости валидации всей формы с данными юзера (влияет на активность кнопки)
	BASKET_VALID = 'basket:validation',
    ADD_PRODUCT_TO_BASKET = "ADD_PRODUCT_TO_BASKET", // событие необходимости валидировать, что в корзине есть товары
}