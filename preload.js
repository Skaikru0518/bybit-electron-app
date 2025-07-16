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
  //store
  setStore: (key, value) => ipcRenderer.invoke('setStore', key, value),
  getStore: (key) => ipcRenderer.invoke('getStore', key),
});
