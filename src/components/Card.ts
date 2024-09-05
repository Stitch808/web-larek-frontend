import { Component } from './base/Component';
import { bem, ensureElement } from '../utils/utils';
import { CategoryType, IProduct } from '../types';

interface ICardActions {
	onClick: (event: MouseEvent) => void;
}

export class Card extends Component<IProduct> {
	protected _title: HTMLElement;
	protected _image?: HTMLImageElement;
	protected _price: HTMLElement;
	protected _category?: HTMLElement;
	protected _description?: HTMLElement;
	protected _button?: HTMLButtonElement;

	constructor(container: HTMLElement, actions?: ICardActions) {
		super(container);
		this._title = ensureElement<HTMLElement>(`.card__title`, container);
		this._image = container.querySelector(`.card__image`);
		this._price = ensureElement<HTMLImageElement>(`.card__price`, container);
		this._category = container.querySelector(`.card__category`);
		this._description = container.querySelector('.card__description')
		this._button = container.querySelector('.card__button')

		if (actions?.onClick) {
			if (this._button) {
				this._button.addEventListener('click', actions.onClick);
			} 
			else {
				container.addEventListener('click', actions.onClick);
			}
		}
	}

	set title(value: string) {
		this.setText(this._title, value);
	}

	get title(): string {
		return this._title.textContent || '';
	}

	set image(value: string) {
		this.setImage(this._image, value, this.title);
	}

	set price(value: number) {
		value === null
			? this.setText(this._price, 'Бесценно')
			: this.setText(this._price, `${value} синапсов`);
			if (this._button) {
				this._button.disabled = !value;
			}
	}

	set category(value: string) {
		this.setText(this._category, value);
		if (this._category) {
			this._category.className = `card__category card__category_${CategoryType[value]}`;
		}
	}

	set description(value: string) {
		this.setText(this._description, value);
	}

	set button(value: string) {
		this.setText(this._button, value);
	}
}
