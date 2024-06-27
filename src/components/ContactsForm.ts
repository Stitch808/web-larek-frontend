import { IOrder } from "../types";
import { IEvents } from "./base/events";
import { Form } from "./common/Form";


export class ContactsForm extends Form<IOrder> {

    protected _inputPhone: HTMLInputElement;
    protected _inputEmail: HTMLInputElement;

    constructor (container: HTMLFormElement, protected events: IEvents) {
        super(container, events)

        this._inputPhone = container.querySelector<HTMLInputElement>('input[name="phone"]');
        this._inputEmail = container.querySelector<HTMLInputElement>('input[name="email"]');
    }

    set inputPhone (value: string) {
        if (this._inputPhone) {
            this._inputPhone.value = value
        }
    }

    set inputEmail (value: string) {
        if (this._inputEmail) {
            this._inputEmail.value = value;
        }
    }
}