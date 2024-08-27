import { Form } from './common/Form';
import { OrderForm } from '../types/index';

export class ContactsForm extends Form<OrderForm> {

	set phone(value: string) {
		(this.container.elements.namedItem('phone') as HTMLInputElement).value = value;
	}

	set email(value: string) {
		(this.container.elements.namedItem('email') as HTMLInputElement).value = value;
	}
}
