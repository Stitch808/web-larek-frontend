import { TBasket, ListItem, ProductCategory } from "../types";
import { ensureElement } from "../utils/utils";
import { Component } from "./base/Component";

interface IProductActions {
    onClick: (event: MouseEvent) => void;
}

export interface IProductView {
    id: string
    description: string
    image: string
    title: string
    category: ProductCategory
    price: string
    button: string
    status: boolean
}

export class ProductViewBase extends Component<IProductView> {
    protected _title: HTMLElement;
    protected _price: HTMLElement;

    constructor(container: HTMLElement) {
        super(container);

        this._title = ensureElement<HTMLImageElement>('.card__title', container);
        this._price = ensureElement<HTMLElement>('.card__price', container);
    }

    set title(value: string) {
        this.setText(this._title, value);
    }

    set price(value: string) {
        this.setText(this._price, value);
    }
}

export class ProductView extends Component<IProductView | ProductViewBase> {
    private _image: HTMLImageElement;
    private _category: HTMLElement;
    private _price: HTMLElement;
    protected _button: HTMLButtonElement;
    events: any;

    constructor(container: HTMLElement, actions: IProductActions) {
        super(container);

        this._image = ensureElement<HTMLImageElement>('.card__image', container);
        this._category = ensureElement<HTMLElement>('.card__category', container);
        this._price = ensureElement<HTMLElement>('.card__price', container);
        this._button = container.querySelector('.card__button');

        if (actions?.onClick) {
            if (this._button) {
                this._button.addEventListener('click', actions.onClick);
            } else {
                container.addEventListener('click', actions.onClick);
            }
        }
    }

    set image(value: string) {
        this.setImage(this._image, value)
    }

    set category(value: keyof typeof ProductCategory) {
        if (this.category) {
            this.setText(this._category, value);
            const categoryStyle = `card__category_${ProductCategory[value]}`
            this.toggleClass(this._category, categoryStyle, true);
        }
    }

    set status(status: boolean) {
        if (this._button) {
            if (this._price.textContent === "") {
                this.setText(this._button, 'Недоступно')
                this.setDisabled(this._button, true)
            }
            else {
                this.setText(this._button, status ? 'Уже в корзине' : 'В корзину');
                this.setDisabled(this._button, status);
            }
        }
    }
}

export class ProductViewModal extends ProductView {
    private _description: HTMLElement;

    constructor(container: HTMLElement, actions: IProductActions) {
        super(container, actions);
        this._description = ensureElement<HTMLElement>('.card__text', container);
    }

    set description(value: string) {
        this.setText(this._description, value)
    }
}

export class ProductInBasketView extends Component<ProductViewBase | TBasket | ListItem> {
    private _index: HTMLElement;

    private _button: HTMLButtonElement;

    constructor(container: HTMLElement, actions: IProductActions) {
        super(container);

        this._index = ensureElement<HTMLElement>('.basket__item-index', container);
        this._button = container.querySelector('.basket__item-delete');

        this._button.addEventListener('click', actions.onClick);
    }

    set index(value: string) {
        this.setText(this._index, value)
    }
}