import {
  getAccountInfo,
  getAllOrders,
  getAllPositions,
  getPrice,
  getWalletBalance,
} from './get/index.js';
import { getStore, setStore } from './store/index.js';

const routes = [
  // get
  { channel: 'getAccountInfo', handler: getAccountInfo },
  { channel: 'setStore', handler: setStore },
  { channel: 'getStore', handler: getStore },
  { channel: 'getPrice', handler: getPrice },
  { channel: 'getAllOrders', handler: getAllOrders },
  { channel: 'getAllPositions', handler: getAllPositions },
  { channel: 'getWalletBalance', handler: getWalletBalance },
];

export default routes;
