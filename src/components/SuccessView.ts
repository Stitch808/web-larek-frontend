import { ensureElement } from "../utils/utils";
import { Component } from "./base/Component";
import { IEvents } from "./base/events";


interface ISuccess {
    title: string;
    description: string
}

interface ISuccessActions {
    onClick: () => void;
}


export class SuccessView extends Component<ISuccess> {
    
    protected _close: HTMLElement;
    protected _title: HTMLElement;
    protected _description: HTMLElement;

    constructor (container: HTMLFormElement, actions: ISuccessActions) {
        super(container)

        this._close = ensureElement<HTMLElement>('.order-success__close', this.container);
        this._title = ensureElement<HTMLElement>('.order-success__title', this.container);
        this._description = ensureElement<HTMLElement>('.order-success__description', this.container);  

        if (actions?.onClick) {
            this._close.addEventListener('click', actions.onClick);
        }
    }

    set title (value: string) {
        this.setText(this._title, value)
    }

    set description (value: string) {
        this.setText(this._description, value)
    }
}