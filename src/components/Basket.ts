import { View } from './base/Component';
import { createElement, ensureElement, cloneTemplate } from './../utils/utils';
import { EventEmitter } from './base/events';

interface IBasketView {
	items: [];
}

export class Basket extends View<IBasketView> {
	protected _list: HTMLElement;
	protected _total: HTMLElement;
	protected button: HTMLElement;
	static template = ensureElement<HTMLTemplateElement>('#basket')

	constructor(events: EventEmitter) {
		super(events, cloneTemplate(Basket.template));

		this._list = ensureElement<HTMLElement>('.basket__list', this.container);
		this._total = ensureElement<HTMLElement>('.basket__price', this.container);
		this.button = ensureElement<HTMLElement>('.basket__button', this.container);

		if (this.button) {
			this.button.addEventListener('click', () => {
				events.emit('order:open');
			});
		}

		this.items = [];
	}

	set items(items: HTMLElement[]) {
		if (items.length) {
			this._list.replaceChildren(...items);
			this.button.removeAttribute('disabled')
		} else {
			this._list.replaceChildren(
				createElement<HTMLParagraphElement>('p', {
					textContent: 'Корзина пуста',
				})
			);
			this.button.setAttribute('disabled', 'disabled')
		}
	}

	set total (total: number) { 
        this.setText(this._total, total.toString() + ' синапсов') 
    } 
}
