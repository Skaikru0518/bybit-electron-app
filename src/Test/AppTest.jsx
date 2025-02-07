import React, { useState, useEffect } from 'react';
import TradingView from './TradingView';

export default function App() {
  const [price, setPrice] = useState(null);
  const [symbol, setSymbol] = useState('BTCUSDT');
  const [walletBalance, setWalletBalance] = useState(null);
  const [accountType, setAccountType] = useState('UNIFIED');
  const [apiKey, setApiKey] = useState('');
  const [apiSecret, setApiSecret] = useState('');
  const [interval, setIntervalValue] = useState(5000);
  const [isAutoFetch, setIsAutoFetch] = useState(false);
  const [orderData, setOrderData] = useState({
    symbol: 'BTCUSDT',
    side: 'Buy',
    orderType: 'Market',
    qty: '',
    leverage: 25,
    orderValue: 0,
    price: '',
    triggerPrice: '',
    requiredMargin: '',
    tpSlEnabled: false,
    takeProfit: '',
    stopLoss: '',
    marketPrice: 0,
    minQty: 0,
    stepSize: 0,
    maxLeverage: 100
  });


  const createOrder = async (orderData) => {
    console.log("Küldött adatok:", orderData); // Ellenőrzés: mit küldünk?

    try {
      const response = await window.bybitAPI.placeOrder(orderData);
      console.log("Order Created:", response);
      return response;
    } catch (error) {
      console.error("Error creating order:", error);
      throw error;
    }
  };


  useEffect(() => {
    const loadSettings = async () => {
      const settings = await window.bybitAPI.getSettings();
      setApiKey(settings.apiKey);
      setApiSecret(settings.apiSecret);
      setIntervalValue(settings.interval);
    };
    loadSettings();
  }, []);

  const fetchPrice = async () => {
    const result = await window.bybitAPI.getPrice(symbol);
    if (result && !result.error) {
      setPrice(result.lastPrice);
    } else {
      setPrice('Hiba az ár lekérdezésekor');
    }
  };

  const fetchWalletBalance = async () => {
    const result = await window.bybitAPI.getWalletBalance(accountType);
    if (result && !result.error) {
      setWalletBalance(result.totalEquity);
    } else {
      setWalletBalance('Hiba a wallet balance lekérdezésekor');
    }
  };

  const placeOrder = async () => {
    const result = await window.bybitAPI.placeOrder(orderData);
    console.log('Order Response:', result);
    alert(result?.retMsg || 'Megrendelés sikeresen elküldve!');
  };

  const saveApiKeys = () => {
    window.bybitAPI.setApiKeys(apiKey, apiSecret);
    alert('API kulcsok elmentve!');
  };

  useEffect(() => {
    let priceInterval;
    if (isAutoFetch) {
      fetchPrice();
      priceInterval = setInterval(fetchPrice, interval);
    }
    return () => clearInterval(priceInterval);
  }, [isAutoFetch, interval, symbol]);

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gradient-to-r from-purple-500 to-indigo-500 text-white">
      <h1 className="text-4xl font-bold mb-4">Bybit Trader App</h1>
      <TradingView />

      <input
        type="text"
        value={apiKey}
        onChange={(e) => setApiKey(e.target.value)}
        className="mb-2 p-2 rounded text-black"
        placeholder="API Key"
      />
      <input
        type="text"
        value={apiSecret}
        onChange={(e) => setApiSecret(e.target.value)}
        className="mb-4 p-2 rounded text-black"
        placeholder="API Secret"
      />
      <button onClick={saveApiKeys} className="bg-accent hover:bg-accent-hover text-white py-2 px-4 rounded mb-4">
        API Kulcsok Mentése
      </button>

      <input
        type="text"
        value={symbol}
        onChange={(e) => setSymbol(e.target.value)}
        className="mb-4 p-2 rounded text-black"
        placeholder="Pl.: BTCUSDT"
      />
      <button onClick={fetchPrice} className="bg-accent hover:bg-accent-hover text-white py-2 px-4 rounded mb-4">
        Ár lekérdezése
      </button>

      <div className="mb-4">
        <label className="block text-lg mb-2">Account Típus:</label>
        <select
          value={accountType}
          onChange={(e) => setAccountType(e.target.value)}
          className="p-2 rounded text-black"
        >
          <option value="UNIFIED">Unified</option>
          <option value="CONTRACT">Contract</option>
          <option value="SPOT">Spot</option>
        </select>
      </div>
      <button onClick={fetchWalletBalance} className="bg-success hover:bg-green-700 text-white py-2 px-4 rounded mb-4">
        Wallet Balance Lekérdezése
      </button>

      <div className="flex flex-col items-center p-4 bg-gray-900 text-white">
        <h2 className="text-xl mb-4">Új megbízás létrehozása</h2>
        <input
          type="text"
          value={orderData.symbol.toUpperCase()}
          onChange={(e) => setOrderData({ ...orderData, symbol: e.target.value })}
          className="mb-2 p-2 rounded text-black"
          placeholder="Mennyiség"
        />
        <input
          type="text"
          value={orderData.qty}
          onChange={(e) => setOrderData({ ...orderData, qty: e.target.value })}
          className="mb-2 p-2 rounded text-black"
          placeholder="Mennyiség"
        />
        <button
          onClick={() => createOrder(orderData)}
          className="bg-green-500 hover:bg-green-700 text-white py-2 px-4 rounded"
        >
          Order Tesztelése
        </button>


      </div>

      {price && <p className="mt-4 text-2xl">Aktuális ár: {price}</p>}
      {walletBalance && <p className="mt-4 text-2xl">Wallet Balance: {walletBalance}</p>}
    </div>
  );
}
