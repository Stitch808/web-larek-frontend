import './scss/styles.scss';

import { StoreAPI } from './components/StoreAPI';
import { API_URL, CDN_URL } from './utils/constants';
import { EventEmitter } from './components/base/events';
import { AppState } from './components/AppState';
import { cloneTemplate, ensureElement } from './utils/utils';
import { Card, CardView } from './components/Card';
import { Page } from './components/Page';
import { Modal } from './components/common/Modal';
import { Order } from './components/Order';
import { IOrder, IProduct, IOrderForm } from './types';
import { ContactsForm } from './components/Contacts';
import { Basket } from './components//Basket';
import { Success } from './components//Success';

const events = new EventEmitter();
const api = new StoreAPI(CDN_URL, API_URL);

// Чтобы мониторить все события, для отладки
events.onAll(({ eventName, data }) => {
	console.log(eventName, data);
});

// Все шаблоны
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

// Модель данных приложения
const appData = new AppState({}, events);

// Глобальные контейнеры
const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);

// Переиспользуемые части интерфейса
const basket = new Basket(
	cloneTemplate<HTMLTemplateElement>(basketTemplate),
	events
);
const order = new Order(cloneTemplate<HTMLFormElement>(orderTemplate), events);
const contacts = new ContactsForm(cloneTemplate(contactsTemplate), events);

// Дальше идет бизнес-логика

// Изменились элементы каталога
events.on('items:changed', () => {
	page.catalog = appData.catalog.map((item) => {
		const card = new Card(cloneTemplate(cardCatalogTemplate), {
			onClick: () => events.emit('card:select', item),
		});
		return card.render({
			id: item.id,
			title: item.title,
			image: item.image,
			price: item.price,
			category: item.category,
		});
	});
});

// Отображение предварительного просмотра карточки товара.
events.on('card:select', (item: IProduct) => {
	const card = new CardView(cloneTemplate(cardPreviewTemplate), {
		onClick: () => events.emit('card:add', item),
	});
	modal.render({
		content: card.render({
			id: item.id,
			title: item.title,
			image: item.image,
			price: item.price,
			category: item.category,
			description: item.description,
		}),
	});

	if (item.price === null) {
		card.setDisabled(card.buttonElement, true);
	} else if (appData.containsProduct(item)) {
		card.setDisabled(card.buttonElement, true);
	}
});

// Установка данных о добавленном элементе корзины
events.on('card:add', (item: IProduct) => {
	appData.addOrderID(item);
	appData.addToBasket(item);
	page.counter = appData.basket.length;
	modal.close();
});

// Открытие корзины пользователем.
events.on('basket:open', () => {
	basket.total = appData.getTotal();
	basket.setDisabled(basket.button, appData.isEmpty);
	basket.items = appData.basket.map((item, index) => {
		const card = new CardView(cloneTemplate(cardBasketTemplate), {
			onClick: () => events.emit('card:remove', item),
		});
		return card.render({
			title: item.title,
			price: item.price,
			index: index + 1,
		});
	});
	modal.render({
		content: basket.render(),
	});
});

// Удаление карточки товара из корзины.
events.on('card:remove', (item: IProduct) => {
	appData.removeBasket(item);
	appData.removeOrderID(item);
	page.counter = appData.basket.length;
	basket.setDisabled(basket.button, appData.isEmpty);
	basket.total = appData.getTotal();
	basket.items = appData.basket.map((item, index) => {
		const card = new CardView(cloneTemplate(cardBasketTemplate), {
			onClick: () => events.emit('card:remove', item),
		});
		return card.render({
			title: item.title,
			price: item.price,
			index: index + 1,
		});
	});
	modal.render({
		content: basket.render(),
	});
});

// Форма заказа
events.on('order:open', () => {
	modal.render({
		content: order.render({
			address: '',
			payment: '',
			valid: false,
			errors: [],
		}),
	});
});

// Форма с контактами
events.on('order:submit', () => {
	appData.order.total = appData.getTotal();
	modal.render({
		content: contacts.render({
			email: '',
			phone: '',
			valid: false,
			errors: [],
		}),
	});
});

// Изменилось состояние валидации формы
events.on('formErrors:change', (errors: Partial<IOrder>) => {
	const { email, phone, address, payment } = errors;
	order.valid = !address && !payment;
	contacts.valid = !email && !phone;
	order.errors = Object.values({ address, payment })
		.filter((i) => !!i)
		.join('; ');
	contacts.errors = Object.values({ phone, email })
		.filter((i) => !!i)
		.join('; ');
});

// Реакция на изменении способа оплаты в форме заказа.
events.on('payment:change', (item: HTMLButtonElement) => {
	appData.order.payment = item.name;
	appData.validateOrderForm();
});

// Изменилось одно из полей
events.on(
	/^order\..*:change/,
	(data: { field: keyof IOrderForm; value: string }) => {
		appData.setOrderField(data.field, data.value);
	}
);

// Изменилось одно из полей контакта
events.on(
	/^contacts\..*:change/,
	(data: { field: keyof IOrderForm; value: string }) => {
		appData.setContactsField(data.field, data.value);
	}
);

// Логика отправки заказа после заполнения формы контактов.
events.on('contacts:submit', () => {
	api
		.orderProduct(appData.order)
		.then((res) => {
			const success = new Success(cloneTemplate(successTemplate), {
				onClick: () => {
					modal.close();
				},
			});

			modal.render({
				content: success.render({
					total: res.total,
				}),
			});

			appData.clearBasket();
			page.counter = 0;
		})
		.catch((err) => {
			console.error(err);
		});
});

// Тестирование
events.on('items:test', (item) => {
	console.log(item);
});

// Блокируем прокрутку страницы если открыта модалка
events.on('modal:open', () => {
	page.locked = true;
});

// ... и разблокируем
events.on('modal:close', () => {
	page.locked = false;
});

// Получаем карточки с сервера
api
	.getProductList()
	.then(appData.setCatalog.bind(appData))
	.catch((err) => {
		console.error(err);
	});
