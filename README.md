# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```
## Архитектура проекта:

Проект представляет собой интернет-магазин с товарами для веб-разработчиков - **Web-ларёк**. Он состоит из трех основных частей, соответствующих слоям Model-View-Presenter (MVP):

**Слой данных (Model)** - это слой, который содержит данные и логику приложения. В нашем случае, это классы Product, Cart и Order.

**Слой отображения (View)** - это слой, который отвечает за взаимодействие с пользователем. В нашем случае, это классы ProductList, CartView и OrderView, которые отвечают за отображение данных и обработку пользовательских событий.

**Слой представления (Presenter)** - это слой, который соединяет отображение, данные и коммуникацию. Он отвечает за обработку пользовательских событий, обновление модели и обновление отображения.

---
#_Типы данных:_

- Интерфейс, описывающий карточку товара:

```ts
export interface IProduct {
	id: string;
	description?: string;
	image: string;
	name: string;
	category: string;
	price: number | null;
}
```

- Интерфейс для класса Basket:

```ts
export interface IBasket {
	items: IProduct[];
	total: number; 
}
```

- Интерфейс заказа:

```ts
export interface IOrder {
	address: string;
	phone: string;
	payment: string;
	email: string;
	total: number;
	items: string[]
}
```

- Интерфейс результата заказа:
  
```ts 
export interface IOrderResult {
	id: string;
	total: number;
}
```


- Интерфейс для выбора способа оплаты и адреса:

```ts
export interface IPaymentAndAddressForm {
	address: string,
	paymentType: string,
}
```


---
 #_Базовые классы:_ 

- **Api**
Класс, представляющий базовый API-клиент, который включает в себя методы для отправки GET и POST запросов:

```ts
class Api {
	readonly baseUrl: string; //базовый URL для API
	protected options: RequestInit;	//настройки для запросов к API, которые включают заголовки. По умолчанию установлен заголовок 'Content-Type': 'application/json'

	//Конструктор класса принимает базовый URL и дополнительные опции для запросов
	constructor(baseUrl: string, options: RequestInit = {});

	//тип выбора метода
	type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

	//Метод, который обрабатывает ответы от сервера
	protected async handleResponse(response: Response): Promise<Partial<object>>;

	// Get запрос
	async get(uri: string);

	// Post запрос
	async post(uri: string, data: object, method: ApiPostMethods);
}
```

- **EventEmitter**
Класс реализует интерфейс **IEvents** и предоставляет методы для управления подписками на события, инициирования событий и создания функций-триггеров:

```ts
class EventEmitter implements IEvents {
    
	constructor() {
		this._events = new Map<EventName, Set<Subscriber>>();
	}

	//Подписывает обработчик на событие
	on<T extends object>(eventName: EventName, callback: (event: T) => void);

	//Отписывает обработчик от события
	off(eventName: EventName, callback: Subscriber);

	//Инициирует событие с данными
	emit<T extends object>(eventName: string, data?: T);

	//Подписывает обработчик на все события
	onAll(callback: (event: EmitterEvent) => void); 

	//Отписывает все обработчики от всех событий
	offAll();

	//Создает функцию, которая будет инициировать событие
	trigger<T extends object>(eventName: string, context?: Partial<T>);
}
```

- **Component**
Абстрактный базовый класс для компонентов отображения:

```ts
abstract class Component<T> {
	//Конструктор класса принимает один параметр: элемент HTML, в котором будет отображаться компонент
	protected constructor(protected readonly container: HTMLElement);

	// Переключить класс
	toggleClass(element: HTMLElement, className: string, force?: boolean) {}

	// Сменить статус блокировки
	setDisabled(element: HTMLElement, state: boolean) {}

	// Скрыть
	protected setHidden(element: HTMLElement) {}

	// Показать
	protected setVisible(element: HTMLElement) {}

	// Установить изображение с альтернативным текстом
	protected setImage(element: HTMLImageElement, src: string, alt?: string) {}

	// Вернуть корневой DOM-элемент
	render(data?: Partial<T>): HTMLElement {}
}
```

- **Model**
Абстрактный базовый класс для моделей данных:

```ts
abstract class Model<T> {
	//Конструктор класса принимает два параметра:  объект, который представляет данные модели и объект, который содержит обработчики событий для модели
	constructor(data: Partial<T>, protected events: IEvents);

	//Этот метод используется для генерации событий, которые уведомляют подписчиков об изменениях в модели
	emitChanges(event: string, payload?: object);
}
```
---
#_Слой данных:_

- **AppData**
Класс, описывающий состояние приложения:

```ts
export class AppData extends Model<IOrder> {
	items: IProduct[] = []; //массив, который должен содержать список товаров.
	preview: IProduct = null; //содержит превьюшку товаров
	basket: IBasket = { //объект, который содержит массив всех товаров в корзине 
		items: [],
	};

	order: IOrder = { //Объект, представляющий заказ, который содержит выбор способа оплаты, строку для хранения адресса, строку для хранения электронной почты покупателя, строку для хранения телефона. 
		payment: '',
		address: '',
		email: '',
		phone: '',
	};

	formErrors: FormErrors = {}; //объект содержит ошибки валидации форм

	//Конструктор класса принимает объект, который содержит обработчики событий для модели
	constructor(protected events: IEvents) {}

	// Метод для получения католога товаров
	setItems(items: IProduct[]);

	// Метод для получения превью продукта
	setPreview(item: IProduct);

    // Метод для проверки, содержится ли товар в корзине
	inBasket(item: IProduct);

	// Метод для добавления товара в корзину
	addToBasket(item: IProduct);

	// Метод для удаления товара из корзины
	removeFromBasket(item: IProduct);

	// Метод для полной очистки корзины
	clearBasket();

	//метод для полной очистки заказа
	clearOrder();

	// Метод для получения общей суммы заказа
	getTotalPrice();

	// Метод для установки поля заказа
	setOrderField(field: keyof OrderForm, value: string);

	// Метод для установки поля контакта
	setContactsField(field: keyof OrderForm, value: string);

	// Метод для валидации заказа
	validateOrderForm();

    // Метод для валидации формы контакта
    validateContactsForm();

}
```
---
#_Слой представления:_

- **Basket**
Класс, представляющий корзину пользователя. Содержит список товаров, добавленных пользователем, и методы для добавления и удаления товаров:

```ts
class Basket extends View<IBasketView>  {
	protected _list: HTMLElement; // элементы корзины
	protected _total: HTMLElement; //элемент суммы заказов
	protected button: HTMLElement; //элемент кнопки
	static template = ensureElement<HTMLTemplateElement>('#basket') //элемент шаблона HTML с идентификатором должен быть загружен и доступен до создания экземпляра класса. Ключевое слово означает, что свойство является статическим свойством класса, то есть оно является общим для всех экземпляров класса

	// Конструктор класса, который принимает EventEmitter
	constructor(events: EventEmitter) 

	// Сеттер для установки списка элементов в корзине
	set items(items: HTMLElement[]);

	// Сеттер для установки общей суммы заказа
	set total(total: number);
}
```

- **Form**
Класс представляет собой компонент формы, который наследуется от базового класса Component и реализует дополнительные методы для управления состоянием и валидацией формы:

```ts
// Интерфейс статуса формы
interface IFormState {
	valid: boolean;
	errors: string[];
}

export class Form<T> extends View<IFormState>  {
	protected _submit: HTMLButtonElement; //кнопка отправки формы
	protected _errors: HTMLElement; //контейнер для отображения ошибок валидации

	// Конструктор класса, который принимает контейнер формы и и обработчик событий
	constructor(protected container: HTMLFormElement, protected events: EventEmitter);

	// Метод, который вызывается при изменении поля ввода
	protected onInputChange();

	// Сеттер для установки флага валидности формы
	set valid(value: boolean);

	// Сеттер для установки ошибки формы
	set errors(value: string);

	//Метод для рендеринга формы с новым состоянием
	render(state: Partial<T> & IFormState);
}
```
---
#_Компоненты предметной области:_

- **Card**
Класс является подклассом Component и представляет карточку в пользовательском интерфейсе:

```ts
class Card extends Component<IProduct>  {
	protected _title: HTMLElement; //заголовок карточки.
	protected _image?: HTMLImageElement; //изображение карточки.
	protected _price: HTMLElement; //цена товара.
	protected _category?: HTMLElement; //категория карточки.
	protected _description?: HTMLElement; //описание карточки.
	protected _button?: HTMLButtonElement; //кнопка действия карточки
	protected _index?: HTMLElement; //индекс карточки

	//Конструктор класса принимает элемент HTML, в котором будет отображаться карточка, и обработчик событий
	constructor(container: HTMLElement, actions?: ICardActions);

	// Сеттер  для заголовка карточки
	set title(value: string);
	
	// Сеттер для изображения, отображаемое на карточке
	set image(value: string);

    // Сеттер используется для установки цены товара
	set price(value: number);

	//Сеттер для категории, к которой относится карточка
	set category(value: string);

	//Сеттер для текста, отображаемого на карточке
	set description(value: string); 

	//Сеттер для текста, отображаемого на кнопке
	set button(value: string); 

	//Сетер для индекса(порядкого номера), отображаемого в корзине
	set index(value: string)
}

```

- **Page**
Класс является подклассом Component и представляет собой страницу в веб-приложении:

```ts
// Интерфейс отображения страницы 
interface IPage {
	counter: number;
	catalog: HTMLElement[];
}

class Page extends Component<IPage> {
	protected _counter: HTMLElement; //элемент счётчика
	protected _catalog: HTMLElement; //элемент, предоставляющий каталог
	protected _wrapper: HTMLElement; //элемент, оборачивающий страницу
	protected _basket: HTMLElement; //лемент, предоставляющий корзину.

	//Конструктор класса принимает элемент HTML, в котором будет отображаться страница, и объект, содержащий обработчики событий для страницы
	constructor(container: HTMLElement, protected events: IEvents);

	//Сеттер для установки значения счетчика
	set counter(value: number);

	//Сеттер для установки элементов магазина
	set catalog(items: HTMLElement[]);

	//Сеттер для блокировки или разблокировки страницы
	set locked(value: boolean);
}
```

- **Order**
Класс, представляющий заказ пользователя. Содержит информацию о пользователе, список товаров в заказе и статус заказа:

```ts
class Order extends Form<OrderForm> {
	protected _buttons: HTMLButtonElement[]; //кнопка выбора способа оплаты

	// Конструктор класса, который принимает контейнер формы и обработчик событий
	constructor(container: HTMLFormElement, events: EventEmitter);

	// Сеттер для выбора оплаты
	set payment(name: string);

	//Сеттер для установки адреса 
	set address(value: string);
}
```

- **ContactsForm**
Класс является подклассом Form и представляет собой компонент, который отвечает за взаимодействие с формой контактов в пользовательском интерфейсе:

```ts
class ContactsForm extends Form<OrderForm> {

    // Сеттер для установки значения поля ввода телефона
	set phone(value: string)

    // Сеттер для установки значения поля ввода электронной почты
	set email(value: string)
}
```

- **LarekApi**
 Класс является подклассом Api и реализует интерфейс IStoreApi. Он отвечает за взаимодействие с сервером, предоставляя методы для получения списка товаров и отправки заказа:

```ts
// Интерфейс отправки заказа на сервер
interface LarekAPI {
	getProductList: () => Promise<IProduct[]>; // Получение списка всех продуктов, доступных в магазине
	orderProduct: (value: IOrder) => Promise<IOrderResult>; // Отправка заказа на сервер
}

class LarekApi extends Api implements LarekAPI{
	// Конструктор класса, который принимает базовый URL, и объект для настройки запросов:
	constructor(cdn: string, baseUrl: string, options?: RequestInit);

    // Метод для получения списка товаров
	getProductList(): Promise<IProduct[]>;

    // Метод для отправки заказа
	orderProduct(value: IOrder): Promise<IOrderResult>;
}
```

- **Modal**
Класс является подклассом Component и представляет собой компонент, который отвечает за отображение и взаимодействие с модальным окном в пользовательском интерфейсе:

```ts
//Интерфейс модалки
interface IModalData {
	content: HTMLElement;
}

class Modal extends Component<IModalData> {
	protected _closeButton: HTMLButtonElement; //кнопка закрытие модалки
	protected _content: HTMLElement; //элемент содержимого модального окна

	// Конструктор класса, который принимает контейнер, в котором будет отрисовываться модальное окно, и обработчик событий
	constructor(container: HTMLElement, protected events: IEvents);
    
	// Метод, открывающий модальное окно
	open();
    
	//  Метод, закрывающий модальное окно
	close();

    // Метод, который рендерит данные в модальное окно и открывает его
	render(data: IModalData): HTMLElement;

    // Сеттер для установки содержимого модального окна
	set content(value: HTMLElement);
}
```

- **Success**
Класс является подклассом Component и представляет собой компонент, который отвечает за отображение и взаимодействие с модальным окном успешного заказа в пользовательском интерфейсе:

```ts
//Интерфейс успешного заказа
interface ISuccess {
	id: string;
	total: number;
}

//Интерфейс обработчика события 
interface ISuccessActions {
	onClick: () => void;
}

class Success extends Component<ISuccess> {
	protected _close: HTMLElement; //элемент, который, при клике, вызывает функцию onClick из объекта actions
	protected _total: HTMLElement; //общая сумма заказа

    // Конструктор класса принимает контейнер, в котором будет отрисовываться модальное окно успешного заказа, и обработчик событий
	constructor(container: HTMLElement, actions?: ISuccessActions);

    //Сеттер для установки общей суммы заказа
	set total(total: number);
}
```