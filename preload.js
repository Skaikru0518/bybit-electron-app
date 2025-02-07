const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('bybitAPI', {
    getPrice: (symbol) => ipcRenderer.invoke('get-price', symbol),
    getWalletBalance: (accountType) => ipcRenderer.invoke('get-wallet-balance', accountType),
    setApiKeys: (apiKey, apiSecret) => ipcRenderer.send('set-api-keys', { apiKey, apiSecret }),
    setInterval: (interval) => ipcRenderer.send('set-interval', interval),
    getSettings: () => ipcRenderer.invoke('get-settings'),
    placeOrder: (orderData) => ipcRenderer.invoke('place-order', orderData),
    fetchPositions: () => ipcRenderer.invoke('fetch-positions'),
    fetchMarketPrice: (symbol) => ipcRenderer.invoke('fetch-market-price', symbol),
    fetchSymbolInfo: (symbol) => ipcRenderer.invoke('fetch-symbol-info', symbol),
    updateLeverage: (symbol, leverage) => ipcRenderer.invoke('update-leverage', symbol, leverage),
    modifyTpsl: (symbol, takeProfit, stopLoss) => ipcRenderer.invoke('modify-tpsl', { symbol, takeProfit, stopLoss }),
    closePosition: (symbol) => ipcRenderer.invoke('close-position', symbol),
    fetchPendingOrders: (category) => ipcRenderer.invoke('fetch-pending-orders', category),
    cancelOrder: (orderId, symbol) => ipcRenderer.invoke('cancel-order', orderId, symbol),
});
