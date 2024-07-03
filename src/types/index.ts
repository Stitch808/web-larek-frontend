// Тип категории товара
export type CatalogItemStatus = {
	category: 'софт-скил' | 'хард-скил' | 'другое' | 'кнопка' | 'дополнительное';
};

// Интерфейс, описывающий карточку товара
export interface IProduct {
	id: string; // Уникальный идентификатор товара
	description: string; // Описание товара
	image: string; // URL изображения товара
	title: string; // Название товара
	category: string; // Категория товара
	price: number | null; //Цена товара
}

// Интерфейс для класса ContactsForm
export interface IOrderForm {
	email: string; // Электронный адрес пользователя
	phone: string; // Номер телефона пользователя
}

// Интерфейс для класса Order
export interface IOrderContact {
	payment: string; // Способ оплаты
	address: string; // Адрес доставки
}

// Интерфейс IOrder, расширяющий IOrderForm и IOrderContact
export interface IOrder extends IOrderForm, IOrderContact {
	total: number; // Общая сумма заказа
	items: string[]; // Массив строк, представляющий идентификаторы или описания товаров, включенных в заказ
}

// Интерфейс для создание заказа
export interface IOrderAnswer {
	total: number; // идентификатор заказа
}

// Интерфейс для класса AppState
export interface IAppState {
	catalog: IProduct[]; // Массив товаров в корзине
	basket: string[]; // Каталог товаров
	order: IOrder; // Текущий заказ
}

// Интерфейс для работы с API магазина
export interface IStoreApi {
	getProductList: () => Promise<IProduct[]>; // Получение списка всех продуктов, доступных в магазине
	orderProduct: (value: IOrder) => Promise<IOrderAnswer>; // Отправка заказа на сервер
}

// Интерфейс для класса Page
export interface IPage {
	counter: HTMLElement; // Счетчик на странице
	catalog: HTMLElement; //Каталог товаров или элементов
	basket: HTMLElement; // Отображение корзины
}

//Тип **FormErrors**, который используется для представления ошибок формы
export type FormErrors = Partial<Record<keyof IOrder, string>>;
