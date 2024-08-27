import { Form } from './common/Form';
import { IPaymentAndAddressForm, OrderForm, PaymentMethod} from '../types/index';
import { EventEmitter } from './base/events';
import { ensureElement, ensureAllElements } from '../utils/utils';

export class Order extends Form<OrderForm> {
// 	protected _paymentCard: HTMLButtonElement;
// 	protected _paymentCash: HTMLButtonElement;
// 	protected _alts: HTMLButtonElement[];
// 	protected _address: HTMLInputElement;
// 	protected _next: HTMLButtonElement;


// 	constructor(container: HTMLFormElement, events: EventEmitter) {
// 		super(container, events);
// 		this._paymentCard = ensureElement<HTMLButtonElement>(
// 			'.button_alt[name = card]',
// 			this.container
// 		);
// 		this._paymentCash = ensureElement<HTMLButtonElement>(
// 			'.button_alt[name = cash]',
// 			this.container
// 		);
// 		this._alts = ensureAllElements<HTMLButtonElement>('.button_alt', container);
// 		this._next = this.container.querySelector('button.order__button');
// 		this._address = this.container.querySelector('input[name="address"]');
		

// 		this._alts.forEach(tab => {
// 			tab.addEventListener('click', () => {
// 			  if (this._address.value != '') {
// 				this._next.removeAttribute('disabled')
// 			  } else {
// 				this._next.setAttribute('disabled', '');
// 			  }
// 			  if(this._paymentCard == tab) {
// 				this._paymentCard.classList.add('button_alt-active');
// 				this._paymentCash.classList.remove('button_alt-active');
// 			  } else {
// 				this._paymentCash.classList.add('button_alt-active');
// 				this._paymentCard.classList.remove('button_alt-active');
// 			  }
// 			})
  
// 		});

		
// 	}


	

// 	set payment(value: PaymentMethod) {
// 		this._paymentCard.classList.toggle('.button_alt-active', value === 'card')
// 		this._paymentCash.classList.toggle('.button_alt-active', value === 'cash')
// 	}

// 	set address(value: string) {
// 		(this.container.elements.namedItem('address') as HTMLInputElement).value = value;
// 	}
	
// }

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

