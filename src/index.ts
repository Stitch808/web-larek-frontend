import './scss/styles.scss';

import { LarekApi} from './components/LarekAPI';
import { API_URL, CDN_URL } from './utils/constants';
import { EventEmitter } from './components/base/events';
import { AppData} from './components/AppData';
import { cloneTemplate, ensureElement } from './utils/utils';
import { Card } from './components/Card';
import { Page } from './components/Page';
import { Modal } from './components/common/Modal';
import { Order } from './components/Order';
import { IOrder, IProduct, OrderForm,  } from './types';
import { ContactsForm } from './components/Contacts';
import { Basket } from './components//Basket';
import { Success } from './components//Success';

const events = new EventEmitter();
const api = new LarekApi(CDN_URL, API_URL);

const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');

// Модель данных приложения
const appData = new AppData(events);

const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);
const basket = new Basket(events);
const orderForm = new Order (cloneTemplate<HTMLFormElement>('#order'), events);
const contactsForm = new ContactsForm(cloneTemplate(ensureElement<HTMLTemplateElement>('#contacts')), events)
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');

// Дальше идет бизнес-логика

// Логика отправки заказа
events.on('contacts:submit', () => {
	api
	.orderProduct(appData.order)
	.then((result) => {
		const success = new Success(cloneTemplate(ensureElement<HTMLTemplateElement>('#success')), {
			onClick: () => {
				modal.close();
			}
		});
		modal.render({
			content: success.render({id: result.id, total: result.total}),
			
		});
		appData.clearBasket();
	})
	.catch(err => {
		console.error(err)
	});
});

events.on('order:ready', (order: IOrder) => {
	contactsForm.valid = true
})

// Реакция на изменении способа оплаты в форме заказа.
events.on('payment:change', (item: HTMLButtonElement) => {
	appData.order.payment = item.name;
	appData.validateOrderForm();
});

// Изменилось одно из полей заказа
events.on(
	/^order\..*:change/,
	(data: { field: keyof OrderForm; value: string }) => {
		appData.setOrderField(data.field, data.value);
	}
);

// Изменилось одно из полей контакта
events.on(
	/^contacts\..*:change/,
	(data: { field: keyof OrderForm; value: string }) => {
		appData.setContactsField(data.field, data.value);
	}
);

// Изменилось состояние валидации формы
events.on('formErrors:change', (errors: Partial<IOrder>) => {
	const {payment, address, email, phone } = errors;
	orderForm.valid = !payment && !address;
	contactsForm.valid = !email && !phone;
	orderForm.errors = Object.values({ payment, address }).filter((i) => !!i).join('; ');
	contactsForm.errors = Object.values({ email, phone }).filter((i) => !!i).join('; ');
});

// Форма заказа
events.on('order:open', () => {
	modal.render({
		content: orderForm.render({
			payment: '',
			address: '',
			valid: false,
			errors: [],
		}),
	});
});

// Форма с контактами
events.on('order:submit', () => {
	appData.order.total = appData.getTotalPrice();
	modal.render({
		content: contactsForm.render({
			email: '',
			phone: '',
			valid: false,
			errors: [],
		}),
	});
});

// Открытие корзины пользователем.
events.on('basket:open', () => {
	basket.total = appData.getTotalPrice();
	modal.render({
		content: basket.render(),
	});
});

// Блокируем прокрутку страницы если открыта модалка
events.on('modal:open', () => {
	page.locked = true;
});

// Разблокируем
events.on('modal:close', () => {
	page.locked = false;
});

events.on('card:select', (item: IProduct) => {
	appData.setPreview(item)
})

events.on('items:changed', () => {
	page.catalog = appData.items.map(item => {
		const card = new Card(cloneTemplate(cardCatalogTemplate), {
			onClick: () => events.emit('card:select', item),
		});
		return card.render(item);
	})
})


events.on('basket:changed', () => {
	page.counter = appData.basket.items.length;

	basket.items = appData.basket.items.map(id => {
		const item = appData.items.find(item => item === id);
		const card = new Card(cloneTemplate(cardBasketTemplate), {
			onClick: () => appData.removeFromBasket (item!),
		});
		return card.render(item);
	});

	basket.total = appData.basket.total
});

events.on('preview:changed', (item: IProduct) => {
	if (item) {
		const card = new Card(cloneTemplate(cardPreviewTemplate), {
			onClick: () => {
				if (appData.inBasket(item)) {
					appData.removeFromBasket(item);
					card.button = 'В корзину'
				}
				else {
					appData.addToBasket(item);
					card.button = 'Удалить из корзины'
				}
			}
		});
		card.button = appData.inBasket(item) ? 'Удалить из корзины' : 'В корзину'
		modal.render({
			content: card.render(item)
		});
	}
	else {
		modal.close()
	}
});

// Получаем карточки с сервера
api.getProductList()
	.then(appData.setItems.bind(appData))
	.catch((err) => {
		console.error(err);
	});
