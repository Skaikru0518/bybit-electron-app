import {
  getAccountInfo,
  getActiveOrders,
  getAllOrders,
  getAllPositions,
  getClosedPnL,
  getInstrumentInfo,
  getOnePosition,
  getPrice,
  getWalletBalance,
} from './get/index.js';
import {
  postCancelOrder,
  postModifyTpSl,
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
  { channel: 'getOnePosition', handler: getOnePosition },
  { channel: 'getWalletBalance', handler: getWalletBalance },
  { channel: 'getClosedPnl', handler: getClosedPnL },
  { channel: 'getInstrumentInfo', handler: getInstrumentInfo },
  { channel: 'getActiveOrders', handler: getActiveOrders },

  // post
  { channel: 'postSetLeverage', handler: postSetLeverage },
  { channel: 'postPlaceOrder', handler: postPlaceOrder },
  { channel: 'postCancelOrder', handler: postCancelOrder },
  { channel: 'postModifyTpSl', handler: postModifyTpSl },
];

export default routes;
