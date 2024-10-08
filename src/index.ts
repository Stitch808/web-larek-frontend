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
import { ContactsForm } from './components/ContactsForm';
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
const success = new Success(cloneTemplate(ensureElement<HTMLTemplateElement>('#success')), {
	onClick: () => {
	  modal.close();
	}
  });

// Дальше идет бизнес-логика

//изменились элементы каталога
events.on('items:changed', () => {
	page.catalog = appData.items.map(item => {
		const card = new Card(cloneTemplate(cardCatalogTemplate), {
			onClick: () => events.emit('card:select', item),
		});
		return card.render(item);
	})
})

//превьюшку продукта
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

//открываем превьюшку продукта
events.on('card:select', (item: IProduct) => {
	appData.setPreview(item)
})

// Блокируем прокрутку страницы если открыта модалка
events.on('modal:open', () => {
	page.locked = true;
});

// Разблокируем
events.on('modal:close', () => {
	page.locked = false;
});

// Открытие корзины пользователем.
events.on('basket:open', () => {	
	basket.total = appData.getTotalPrice();
	modal.render({
		content: basket.render(),
	});
});

//изменение состояния корзины
events.on('basket:changed', () => {
	page.counter = appData.basket.items.length;
	basket.items = appData.basket.items.map((id, index) => {
		const item = appData.items.find(item => item === id);
		const card = new Card(cloneTemplate(cardBasketTemplate), {
			onClick: () => appData.removeFromBasket(item!),
			
		});
		card.index = (index + 1).toString()
		return card.render(item);
	});

	basket.total = appData.getTotalPrice();
});

// начинаем оформлять заказ
events.on('order:ready', (order: IOrder) => {
	contactsForm.valid = true
})

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
	basket.total = appData.getTotalPrice();
	modal.render({
		content: contactsForm.render({
			email: '',
			phone: '',
			valid: false,
			errors: [],
		}),
	});
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

// Реакция на изменении способа оплаты в форме заказа.
events.on('payment:change', (item: HTMLButtonElement) => {
	appData.order.payment = item.name;
	appData.validateOrderForm();
});

// Логика отправки заказа
events.on('contacts:submit', () => {
	const orderItems = appData.basket.items.map(item => item.id);
  	const orderTotal = appData.getTotalPrice();
  	const orderData = { ...appData.order, items: orderItems, total: orderTotal };
	api
	.orderProduct(orderData)
	.then((result) => {
		
		modal.render({
			content: success.render({id: result.id, total: result.total}),
			
		});
		appData.clearBasket();
	})
	.catch(err => {
		console.error(err)
	});
	appData.clearOrder()
});

// Получаем карточки с сервера
api.getProductList()
	.then(appData.setItems.bind(appData))
	.catch((err) => {
		console.error(err);
	});
