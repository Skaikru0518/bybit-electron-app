import { RestClientV5 } from 'bybit-api';
import { eStore } from './store/index.js';

const client = new RestClientV5({
  key: eStore.get('apiKey'),
  secret: eStore.get('apiSecret'),
  demoTrading: eStore.get('isDemo'),
});

export default client;
