import { Events } from "../types";
import { ensureElement } from "../utils/utils";
import { Component } from "./base/Component";
import { IEvents } from "./base/events";


interface IPage {
    basketCounter: number;
    products: HTMLElement[];
    locked: boolean;
}

export class PageView extends Component<IPage> {

    private _basketCounter: HTMLElement;
    private _products: HTMLElement;
    private _basket: HTMLElement;
    private wrapper: HTMLElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);

        this._basketCounter = ensureElement<HTMLElement>('.header__basket-counter', container);
        this._products = ensureElement<HTMLElement>('.gallery', container);
        this._basket = ensureElement<HTMLElement>('.header__basket', container);
        this.wrapper = ensureElement<HTMLElement>('.page__wrapper', container);

        this._basket.addEventListener('click', () => {
            this.events.emit(Events.BASKET_OPEN);
        });

    }

    set products(products: HTMLElement[]) {
        this._products.replaceChildren(...products);
    }

    set locked(value: boolean) {
        this.toggleClass(this.wrapper, 'page__wrapper_locked', value)
    }

    set basketCounter(counter: number) {
        this.setText(this._basketCounter, counter);
    }
}