import { RestClientV5 } from 'bybit-api';
import { eStore } from './store/index.js';

const client = new RestClientV5({
  key: eStore.get('api_key'),
  secret: eStore.get('api_secret'),
  demoTrading: eStore.get('isDemo'),
});

export default client;
