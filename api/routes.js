import {
  getAccountInfo,
  getAllOrders,
  getAllPositions,
  getClosedPnL,
  getInstrumentInfo,
  getPrice,
  getWalletBalance,
} from './get/index.js';
import {
  postCancelOrder,
  postPlaceOrder,
  postSetLeverage,
} from './post/index.js';
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
  { channel: 'postSetLeverage', handler: postSetLeverage },
  { channel: 'postPlaceOrder', handler: postPlaceOrder },
  { channel: 'postCancelOrder', handler: postCancelOrder },
];

export default routes;
