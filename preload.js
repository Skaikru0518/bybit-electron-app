const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  //get
  getAccountInfo: (accountType) =>
    ipcRenderer.invoke('getAccountInfo', accountType),

  getWalletBalance: (accountType) =>
    ipcRenderer.invoke('getWalletBalance', accountType),

  getPrice: (category, symbol) =>
    ipcRenderer.invoke('getPrice', category, symbol),

  getAllOrders: (category, settleCoin) =>
    ipcRenderer.invoke('getAllOrders', category, settleCoin),

  getAllPositions: (category, settleCoin) =>
    ipcRenderer.invoke('getAllPositions', category, settleCoin),

  getOnePosition: (category, symbol) =>
    ipcRenderer.invoke('getOnePosition', category, symbol),

  getActiveOrders: (category, symbol) =>
    ipcRenderer.invoke('getActiveOrders', category, symbol),

  getClosedPnl: (category) => ipcRenderer.invoke('getClosedPnl', category),

  getInstrumentInfo: (category, symbol) =>
    ipcRenderer.invoke('getInstrumentInfo', category, symbol),

  //post
  postSetLeverage: (category, symbol, buyLeverage, sellLeverage) =>
    ipcRenderer.invoke(
      'postSetLeverage',
      category,
      symbol,
      buyLeverage,
      sellLeverage,
    ),
  postPlaceOrder: (
    category,
    symbol,
    side,
    orderType,
    qty,
    price,
    takeProfit,
    stopLoss,
  ) =>
    ipcRenderer.invoke(
      'postPlaceOrder',
      category,
      symbol,
      side,
      orderType,
      qty,
      price,
      takeProfit,
      stopLoss,
    ),
  postCancelOrder: (category, symbol, orderId) =>
    ipcRenderer.invoke('postCancelOrder', category, symbol, orderId),
  postModifyTpSl: (category, symbol, takeProfit, stopLoss) =>
    ipcRenderer.invoke(
      'postModifyTpSl',
      category,
      symbol,
      takeProfit,
      stopLoss,
    ),

  //store
  setStore: (key, value) => ipcRenderer.invoke('setStore', key, value),
  getStore: (key) => ipcRenderer.invoke('getStore', key),
});
