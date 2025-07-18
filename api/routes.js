import {
  getAccountInfo,
  getAllOrders,
  getAllPositions,
  getClosedPnL,
  getInstrumentInfo,
  getPrice,
  getWalletBalance,
} from './get/index.js';
import cancelOrder from './post/postCancelOrder.js';
import placeOrder from './post/postPlaceOrder.js';
import setLeverage from './post/postSetLeverage.js';
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
  { channel: 'getClosedPnl', handler: getClosedPnL },
  { channel: 'getInstrumentInfo', handler: getInstrumentInfo },

  // post
  { channel: 'setLeverage', handler: setLeverage },
  { channel: 'placeOrder', handler: placeOrder },
  { channel: 'cancelOrder', handler: cancelOrder },
];

export default routes;
