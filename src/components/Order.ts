import { Form } from './common/Form';
import { IPaymentAndAddressForm, OrderForm, PaymentMethod} from '../types/index';
import { EventEmitter } from './base/events';
import { ensureElement, ensureAllElements } from '../utils/utils';

export class Order extends Form<OrderForm> {

	protected _buttons: HTMLButtonElement[];

	constructor(container: HTMLFormElement, events: EventEmitter) {
		super(container, events);
		this._buttons = ensureAllElements<HTMLButtonElement>(
			'.button_alt',
			container
		);
		this._buttons.forEach((button) => {
			button.addEventListener('click', () => {
				this.payment = button.name;
				events.emit('payment:change', button);
			});
		});
	}

	set payment(name: string) {
		this._buttons.forEach((button) => {
			this.toggleClass(button, 'button_alt-active', button.name === name);
		});
	}

	set address(value: string) {
		(this.container.elements.namedItem('address') as HTMLInputElement).value =
			value;
	}
}

