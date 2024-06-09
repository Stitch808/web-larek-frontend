export interface ICard {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number | null;
}

export interface IOrder {
    address: string;
    telephone: number;
    paymethod: OrderPayment;
    mail: string;
    total: number | null;
    items: ICard[]
}

//Результат заказа
export interface IOrderResult {
    id: string;
    total: number
}

//интерфейс корзины товаров
export interface IBasket {
    items: ICard[];
    total: number | null;
    resetBasket(): void; //очищение данных после успешного заказа
}

//интерфейс открытой карточки товара для просмотра
export interface IExploreCard {
    items: ICard[];
    preview: string | null;
}

//Интерфейс для модели данных карточек
export interface ICardsData {
    cards: TProduct[];
    preview: string | null;
    
    loadCards(): Promise<void>;
    addBasket(id: string, payload: Function | null): TBasket;
    deleteBasket(id: string, payload: Function | null): void;
    showOneItem(id: string): void; //открываем карточку для просмотра по id 
    getItems(): ICard[]; //получаем массив карточек с сервера
    saveItems(): ICard[]; //сохраняем массив карточек
}


//интерфейс для заказа
export interface IOrderData {
    basket: TBasket[];
    openedModal: AppStateModal | null;
    orderFields: Record<keyof IOrder, [value:string, error:string]> | null;
    buttonActive: boolean;

    openModal(modal: AppStateModal): void;
    closeModal(): void;
    selectCard(id: string): ICard;
    checkOrderValidation(data: Record<keyof IOrder, string>): boolean;
    setUserInfo(userData: IOrder): void;
    orderCard(): Promise<IOrderResult>;
    checkItem(id: string): void;
    sumPrice(): number | null;
    setListCards(items: TBasket[]): void;
}

// Отображение продукта на главной странице
type TProduct = Omit<ICard, "description">

//тип для отображения модалки корзины
export type TBasket = Pick<ICard, 'id' | 'title' | 'price'>

//тип для модалки сособ оплаты и адрес
export type TPayment = Pick<IOrder, 'paymethod' | 'address'>

//тип для модалки контактные данные 
export type TContactInf = Pick<IOrder, 'mail' | 'telephone'>

//выбор способа оплаты
type OrderPayment = "online" | "cash"

//тип открфтого модального окна 
type AppStateModal = "card" | "basket" | "order"
