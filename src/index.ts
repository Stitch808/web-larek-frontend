import { AppData } from './components/AppData';
import { LarekApi } from './components/LarekApi';
import { PageView } from './components/PageView';
import { ProductView, ProductViewModal } from './components/Product';
import { Api } from './components/base/api';
import { EventEmitter, IEvents } from './components/base/events';
import './scss/styles.scss';
import {Events, IOrder, IProduct} from "./types";
import { API_URL, CDN_URL } from './utils/constants';
import { testProduct } from './utils/tempConstants';
import { ensureElement } from './utils/utils';


const events = new EventEmitter
const api = new LarekApi(CDN_URL, API_URL);
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');

// Модель данных приложения
const appData = new AppData({}, events, [], [], {
    email: '',
    phone: '',
    payment: null,
    address: '',
    total: 0,
    items: []
});

api.getProducts()
    .then(data => appData.setProducts(data.items))
    .catch(err => {
        console.error(err);
    });
    
