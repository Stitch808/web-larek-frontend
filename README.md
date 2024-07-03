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
interface IProduct {
	id: string; // Уникальный идентификатор товара
	name: string; //Название товара
	description: string; //Описание товара
	price: number; //Цена товара
	image: string; //URL изображения товара
	category: string; // Категория товара
}
```

- Интерфейс для класса Basket:

```ts
interface IBasket {
	items: HTMLElement[]; // Массив элементов, представляющих товары в корзине
	price: number; // Общая цена товаров в корзине
}
```

- Интерфейс для класса ContactsForm:

```ts
interface IOrderForm {
	email: string; //Электронный адрес пользователя
	phone: string; //Номер телефона пользователя
}
```

- Интерфейс для класса Order:
  
```ts 
interface IOrderContact {
	payment: string; // Способ оплаты
	address: string; // Адрес доставки
}
```

- Интерфейс IOrder, расширяющий IOrderForm и IOrderContact:

```ts
interface IOrder extends IOrderForm {
	items: string[]; // Массив строк, представляющий идентификаторы или описания товаров, включенных в заказ
}
```

- Интерфейс для класса Card:

```ts
interface ICard {
	id: string; //Уникальный идентификатор карточки
	title: string; //Заголовок карточки
	category: string; //Категория, к которой относится карточка
	description: string; //Текст, отображаемый на карточке
	image: string; // URL изображения, отображаемого на карточке
}
```

- Интерфейс для класса Page:

```ts
interface IPage {
	counter: number; //Счетчик на странице
	catalog: HTMLElement[]; //Каталог товаров или элементов
	basket: HTMLElement; // Отображение корзины
}
```

- Интерфейс для класса AppState:

```ts
interface IAppState {
	basket: Product[]; // Массив товаров в корзине
	order: IOrder; // Текущий заказ
	catalog: Product[]; // Каталог товаров
}
```

- Интерфейс для класса EventEmitter:

```ts
interface IEvents {
	on<T extends object>(event: EventName, callback: (data: T) => void): void;
	emit<T extends object>(event: string, data?: T): void;
	trigger<T extends object>(
		event: string,
		context?: Partial<T>
	): (data: T) => void;
}
```

- Интерфейс для класса Form:

```ts
interface IFormState {
	valid: boolean; // Флаг валидности формы
	errors: string[]; // Массив строк с ошибками
}
```

- Интерфейс для создание заказа:
  
 ```ts
interface IOrderAnswer {
	total: number; // идентификатор заказа
}
```

- Интерфейс для работы с API магазина:
  
```ts
export interface IStoreApi {
	getProductList: () => Promise<IProduct[]>; // Получение списка всех продуктов, доступных в магазине
	orderProduct: (value: IOrder) => Promise<IOrderAnswer>; // Отправка заказа на сервер
}
```

- Тип **FormErrors**, который используется для представления ошибок формы:

```ts
type FormErrors = Partial<Record<keyof IOrder, string>>;
```
---
 #_Базовые классы:_ 

- **Api**
Класс, представляющий базовый API-клиент, который включает в себя методы для отправки GET и POST запросов:

```ts
class Api {
	//Конструктор класса принимает базовый URL и дополнительные опции для запросов
	constructor(baseUrl: string, options: RequestInit = {});

	//Метод, который обрабатывает ответы от сервера
	protected async handleResponse(response: Response): Promise<Partial<object>>;

	// Get запрос
	async get(uri: string);

	// Post запрос
	async post(uri: string, data: object);
}
```

- **EventEmitter**
Класс реализует интерфейс **IEvents** и предоставляет методы для управления подписками на события, инициирования событий и создания функций-триггеров:

```ts
class EventEmitter implements IEvents {
    //Конструктор инициализирует пустую карту событий
	constructor()ж

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

- **AppState**
Класс, описывающий состояние приложения, наследуется от Model:

```ts
class AppState extends Model<IAppState> {
	basket: Product[];
	order: IOrder;
	catalog: Product[];
	formErrors: FormErrors;

	// Метод для добавления товара в корзину
	addToBasket();

	// Метод для полной очистки корзины
	clearBasket();

	// Метод для получения общей суммы заказа
	getTotal();

	// Метод для установки каталога товаров
	setCatalog();

	// Метод для валидации заказа
	validateOrderform();

	// Метод для установки поля заказа
	setOrderField();

    // Метод для добавления идентификатора товара в заказ
    addOrderID();

    // Метод для удаления идентификатора товара из заказа
	removeOrderID();

    // Метод для удаления товара из корзины
	removeBasket();

    // Метод для установки поля контакта
	setContactsField();

    // Метод для проверки, содержится ли товар в корзине
	containsProduct(); 

    // Метод для валидации формы контакта
    validateContactsForm();
}
```
---
#_Слой представления:_

- **Basket**
Класс, представляющий корзину пользователя. Содержит список товаров, добавленных пользователем, и методы для добавления и удаления товаров:

```ts
class Basket extends Component<IBasket> {
	// Конструктор класса, который принимает контейнер и EventEmitter
	constructor(container: HTMLElement, protected events: EventEmitter);

	// Сеттер для установки выбранных элементов в корзине
	set selected();

	// Сеттер для установки списка элементов в корзине
	set items();

	// Сеттер для установки общей суммы заказа
	set total();
}
```

- **Form**
Класс представляет собой компонент формы, который наследуется от базового класса Component и реализует дополнительные методы для управления состоянием и валидацией формы:

```ts
class Form<T> extends Component<IFormState> {
	// Конструктор класса, который принимает контейнер формы и и обработчик событий
	constructor(protected container: HTMLFormElement, protected events: IEvents);

	// Метод, который вызывается при изменении поля ввода
	protected onInputChange();

	// Сеттер для установки флага валидности формы
	set valid();

	// Сеттер для установки ошибки формы
	set errors();

	//Метод для рендеринга формы с новым состоянием
	render();
}
```
---
#_Компоненты предметной области:_

- **Card**
Класс является подклассом Component и представляет карточку в пользовательском интерфейсе:

```ts
class Card extends Component<ICard> {
	//Конструктор класса принимает один параметр, элемент HTML, в котором будет отображаться карточка
	constructor(container: HTMLElement);

	// Сеттер и геттер для идентификатора карточки
	set id();
	get id();

	// Сеттер для заголовка карточки
	set title();
	
	// Сеттер для изображения, отображаемое на карточке
	set image();

    // Сеттер используется для установки цены товара
	set price();

	//Сеттер для категории, к которой относится карточка
	set category(): void;
}
```
- **CardView**
 Класс является подклассом Card и представляет собой компонент, который отвечает за отображение и взаимодействие с карточкой товара в пользовательском интерфейсе:

```ts
class CardView extends Card {
    // Конструктор класса принимает контейнер, в котором будет отрисовываться карточка, и объект для обработки событий
	constructor(container: HTMLElement, actions?: ICardActions);

    // Сеттер для установки индекса карточки
	set index();

    //Сеттер и гетер для текста, отображаемого на карточке
	set description(); 
}
```

- **Page**
Класс является подклассом Component и представляет собой страницу в веб-приложении:

```ts
class Page extends Component<IPage> {
	//Конструктор класса принимает элемент HTML, в котором будет отображаться страница, и объект, содержащий обработчики событий для страницы
	constructor(container: HTMLElement, protected events: IEvents);

	//Сеттер для установки значения счетчика
	set counter();

	//Сеттер для установки элементов магазина
	set store();

	//Сеттер для блокировки или разблокировки страницы
	set locked();
}
```

- **Order**
Класс, представляющий заказ пользователя. Содержит информацию о пользователе, список товаров в заказе и статус заказа:

```ts
class Order extends Form<IOrderForm> {
	// Конструктор класса, который принимает контейнер формы и обработчик событий
	constructor(container: HTMLFormElement, events: IEvents);

	// Сеттер для выбора оплаты
	set payment();

	//Сеттер для установки адреса 
	set address();
}
```

- **ContactsForm**
Класс является подклассом Form и представляет собой компонент, который отвечает за взаимодействие с формой контактов в пользовательском интерфейсе:

```ts
class ContactsForm extends Form<IOrderForm> {
	// Конструктор класса принимает контейнер формы и обработчик событий
	constructor(container: HTMLFormElement, events: IEvents)

    // Сеттер для установки значения поля ввода телефона
	set phone()

    // Сеттер для установки значения поля ввода электронной почты
	set email()
}
```

- **StoreAPI**
 Класс является подклассом Api и реализует интерфейс IStoreApi. Он отвечает за взаимодействие с сервером, предоставляя методы для получения списка товаров и отправки заказа:

```ts
class StoreAPI extends Api implements IStoreApi {
	// Конструктор класса, который принимает базовый URL, и объект для настройки запросов:
	constructor(cdn: string, baseUrl: string, options?: RequestInit);

    // Метод для получения списка товаров
	getProductList();

    // Метод для отправки заказа
	orderProduct();
}
```

- **Modal**
Класс является подклассом Component и представляет собой компонент, который отвечает за отображение и взаимодействие с модальным окном в пользовательском интерфейсе:

```ts
class Modal extends Component<IModalData> {
	// Конструктор класса, который принимает контейнер, в котором будет отрисовываться модальное окно, и обработчик событий
	constructor(container: HTMLElement, protected events: IEvents);
    
	// Метод, открывающий модальное окно
	open();
    
	//  Метод, закрывающий модальное окно
	close();

    // Метод, который рендерит данные в модальное окно и открывает его
	render();

    // Сеттер для установки содержимого модального окна
	set content();
}
```

- **Success**
Класс является подклассом Component и представляет собой компонент, который отвечает за отображение и взаимодействие с модальным окном успешного заказа в пользовательском интерфейсе:

```ts
class Success extends Component<ISuccess> {
    // Конструктор класса принимает контейнер, в котором будет отрисовываться модальное окно успешного заказа, и обработчик событий
	constructor(container: HTMLElement, actions?: ISuccessActions);

    //Сеттер для установки общей суммы заказа
	set total();
}
```