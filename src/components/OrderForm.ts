import { Events, IOrder } from "../types";
import { IEvents } from "./base/events";
import { Form } from "./common/Form";

export class OrderForm extends Form<IOrder> {
    private _buttonOnlinePayment: HTMLButtonElement;
    private _buttonCashPayment: HTMLButtonElement;
    private _inputAddress: HTMLInputElement;

    constructor(container: HTMLFormElement, protected events: IEvents) {
        super(container, events)

        this._buttonOnlinePayment = container.querySelector<HTMLButtonElement>('button[name="card"]');
        this._buttonCashPayment = container.querySelector<HTMLButtonElement>('button[name="cash"]');

        this._inputAddress = container.querySelector<HTMLInputElement>('input[name="address"]');

        this._buttonOnlinePayment.addEventListener('click', () => this.togglePaymentMethod('online'));
        this._buttonCashPayment.addEventListener('click', () => this.togglePaymentMethod('cash'));
    }

    set payment(value: string) {
        this.events.emit(Events.SET_PAYMENT_TYPE, { paymentType: value });
    }

    set address(value: string) {
        this._inputAddress.value = value;
    }

    toggleOnline (state: boolean = true) {
        this.toggleClass(this._buttonOnlinePayment, 'button_alt-active', state);
    }

    toggleCash (state: boolean = true) {
        this.toggleClass(this._buttonCashPayment, 'button_alt-active', state);
    }

    togglePaymentMethod(selectedPayment: string) {
        const isOnlineActive = this._buttonOnlinePayment.classList.contains('button_alt-active')
        const isCashActive = this._buttonCashPayment.classList.contains('button_alt-active')

        if (selectedPayment === 'online') {
            this.toggleOnline(!isOnlineActive);
            this.payment = isOnlineActive ? null : 'online'
            if (!isOnlineActive) {this.toggleOnline(false)}
        }
        else if (selectedPayment === 'cash') {
            this.toggleCash(!isCashActive);
            this.payment = isCashActive ? null : 'cash';
            if (!isCashActive) {this.toggleCash(false)}
        }
    }

    resetPaymentButtons() {
        this.toggleOnline(false);
        this.toggleCash(false);
    }
}
