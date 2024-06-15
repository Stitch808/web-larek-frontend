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
    phone: number;
    payment: OrderPayment;
    mail: string;
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
    items: IProduct[];
    total: number | null;
    resetBasket(): void; //очищение данных после успешного заказа
}

//интерфейс открытой карточки товара для просмотра
export interface IExploreCard {
    items: IProduct[];
    preview: string | null;
}

//интерфейс каталогa товаров
export interface IListItem {
    items: TMainCards[]; //массив карточек на главной странице
    preview: string | null; //id открытой карточки
    showOneItem(item: string): void; //открываем карточку для просмотра по id 
    getItems(): IProduct[]; //получаем массив карточек с сервера
    saveItems(): IProduct[]; //сохраняем массив карточек
}

// Отображение продукта на главной странице
type TMainCards = Omit<IProduct, "description">

//тип для отображения товара в корзине
type TBasket = Pick<IProduct, 'id' | 'title' | 'price'>

//тип для модалки сособ оплаты и адрес
type TPayment = Pick<IOrder, 'payment' | 'address'>

//тип для модалки контактные данные 
type TContactInf = Pick<IOrder, 'mail' | 'phone'>

//выбор способа оплаты
type OrderPayment = "online" | "cash"

//тип открфтого модального окна 
type AppStateModal = "card" | "basket" | "order"
