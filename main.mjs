import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
import axios from 'axios';
import crypto, { sign } from 'crypto';
import Store from 'electron-store';
import { time } from 'console';

// __dirname ESM-ben
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const BASE_URL = "https://api-demo.bybit.com";

const store = new Store();

// API kulcsok betöltése tárolóból (ha már elmentve)
let apiKey = store.get('apiKey', '');
let apiSecret = store.get('apiSecret', '');

function createWindow() {
    const win = new BrowserWindow({
        width: 1280,
        height: 720,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),  // IPC kapcsolat
            webviewTag: true,
        },
    });

    const startUrl = process.env.NODE_ENV === 'development'
        ? 'http://localhost:5173'
        : `file://${path.join(__dirname, 'dist/index.html')}`;

    win.loadURL(startUrl);
}

// Signature generálása a Bybit API-hoz
const createSignature = (params, apiSecret) => {
    const paramString = Object.keys(params)
        .sort()
        .map(key => `${key}=${params[key]}`)
        .join('&');
    return crypto.createHmac('sha256', apiSecret).update(paramString).digest('hex');
};

// API kulcsok beállítása és mentése
ipcMain.on('set-api-keys', (event, { apiKey: key, apiSecret: secret }) => {
    apiKey = key;
    apiSecret = secret;
    store.set('apiKey', apiKey);
    store.set('apiSecret', apiSecret);
    console.log('API kulcsok elmentve!');
});

// Ár lekérdezése a Bybit API-ból
ipcMain.handle('get-price', async (event, symbol) => {
    const timestamp = Date.now();
    const params = {
        category: 'linear',
        symbol,
        api_key: apiKey,
        timestamp,
    };

    const signature = createSignature(params, apiSecret);

    try {
        const response = await axios.get(`${BASE_URL}/v5/market/tickers`, {
            params: {
                ...params,
                sign: signature,
            },
        });
        return response.data.result.list[0];  // Az ár visszaadása a frontendnek
    } catch (error) {
        console.error('API hiba:', error);
        return { error: 'Nem sikerült az ár lekérdezése' };
    }
});

// Wallet Balance lekérdezése a Bybit API-ból
ipcMain.handle('get-wallet-balance', async (event, accountType = 'UNIFIED') => {
    const timestamp = Date.now();
    const params = {
        api_key: apiKey,
        timestamp,
        accountType,  // Pl. UNIFIED, CONTRACT, SPOT
    };

    const signature = createSignature(params, apiSecret);

    try {
        const response = await axios.get(`${BASE_URL}/v5/account/wallet-balance`, {
            params: {
                ...params,
                sign: signature,
            },
        });
        return response.data.result.list[0];  // Visszaküldjük az első account balance adatot
    } catch (error) {
        console.error('API hiba:', error);
        return { error: 'Nem sikerült a wallet balance lekérdezése' };
    }
});

ipcMain.handle('fetch-positions', async (event, category = 'linear', settleCoin = 'USDT') => {
    const timestamp = Date.now();
    const params = {
        category,
        settleCoin,
        api_key: apiKey,
        timestamp
    };
    const signature = createSignature(params, apiSecret);

    try {
        // console.log("Küldött API paraméterek:", params);

        const response = await axios.get(`${BASE_URL}/v5/position/list`, {
            params: {
                ...params,
                sign: signature
            },
        });

        // console.log("API válasz:", response.data);

        return response.data.result.list || [];
    } catch (error) {
        console.error('API hiba:', error.response ? JSON.stringify(error.response.data, null, 2) : error.message);
        return { error: 'Nem sikerült a nyitott pozíciók lekérése.' };
    }
});

// 🔹 Piaci ár lekérdezése adott szimbólumhoz
ipcMain.handle('fetch-market-price', async (event, symbol) => {
    const timestamp = Date.now();
    const params = {
        category: 'linear',
        symbol,
        api_key: apiKey,
        timestamp
    };

    const signature = createSignature(params, apiSecret);

    try {
        const response = await axios.get(`${BASE_URL}/v5/market/tickers`, {
            params: { ...params, sign: signature }
        });

        if (response.data && response.data.result && response.data.result.list) {
            return response.data.result.list[0].lastPrice;
        } else {
            console.error('Market price API response error:', response.data);
            return { error: 'Piaci ár nem érhető el' };
        }
    } catch (error) {
        console.error('API hiba (fetchMarketPrice):', error);
        return { error: 'Hiba történt a piaci ár lekérdezésekor' };
    }
});


// 🔹 Szimbólum információ lekérdezése (lot size, step size, leverage, stb.)
ipcMain.handle('fetch-symbol-info', async (event, symbol) => {
    const timestamp = Date.now();
    const params = {
        symbol: symbol.toUpperCase(), // Convert symbol to uppercase as required by Bybit API
        category: 'linear', // Specify category for the instrument (can be 'linear', 'inverse', etc.)
        api_key: apiKey, // Use the stored API key
        timestamp,
    };

    const signature = createSignature(params, apiSecret); // Use the stored API secret

    try {
        // Use the correct Bybit V5 API endpoint for instruments-info
        const response = await axios.get(`${BASE_URL}/v5/market/instruments-info`, {
            params: {
                ...params,
                sign: signature, // Add signature to the request
            },
        });

        // Check the response data to ensure it contains the expected structure
        if (response.data && response.data.result && Array.isArray(response.data.result.list) && response.data.result.list.length > 0) {
            return response.data.result.list[0]; // Return the first symbol data
        } else {
            console.error('Symbol information not found:', response.data);
            return { error: 'Symbol information not found' };
        }
    } catch (error) {
        // Handle errors and log them
        console.error('API error (fetchSymbolInfo):', error.response ? error.response.data : error.message);
        return { error: 'Error fetching symbol data' };
    }
});

// Update leverage on Bybit
ipcMain.handle('update-leverage', async (event, { symbol, leverage }) => {
    const timestamp = Date.now();

    // Prepare the payload for Bybit API
    const params = {
        category: 'linear',  // Specify the category (linear or inverse)
        symbol,  // The trading pair symbol
        buy_leverage: leverage,  // Set the buy leverage
        sell_leverage: leverage,  // Set the sell leverage
        api_key: apiKey,  // The API key
        timestamp,  // Current timestamp
    };

    // Create the signature using the provided API secret
    const signature = createSignature(params, apiSecret);
    params.sign = signature;  // Attach the signature to the params

    try {
        // Send the POST request to Bybit's set-leverage endpoint
        const response = await axios.post(`${BASE_URL}/v5/position/set-leverage`, params, {
            headers: { 'Content-Type': 'application/json' },
        });

        console.log('Leverage update response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error updating leverage:', error);
        return { error: 'Failed to update leverage' };
    }
});

//Modify TP/SL
ipcMain.handle('modify-tpsl', async (event, { symbol, takeProfit, stopLoss }) => {
    const timestamp = Date.now();

    // Prepare the payload for Bybit API
    const params = {
        category: 'linear',
        symbol: symbol.toUpperCase(), // Ensure the symbol is uppercase
        takeProfit: takeProfit || null, // Set takeProfit as null if not provided
        stopLoss: stopLoss || null, // Set stopLoss as null if not provided
        api_key: apiKey,  // The API key
        timestamp,  // Current timestamp
    };

    // Generate the signature using the params
    const signature = createSignature(params, apiSecret);
    params.sign = signature;  // Attach the signature to the params

    console.log('Generated signature:', signature);  // Debugging the signature
    console.log('Params:', params);  // Debugging the params

    try {
        const response = await axios.post(`${BASE_URL}/v5/position/trading-stop`, params, {
            headers: { 'Content-Type': 'application/json' },
        });

        console.log('Modify TP/SL response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error modifying TP/SL:', error.response ? error.response.data : error.message);
        return { error: 'Failed to modify TP/SL' };
    }
});

ipcMain.handle('close-market-position', async (event, { symbol, side, qty }) => {
    const timestamp = Date.now();

    // Ensure side and qty are provided
    if (!side || !qty) {
        return { error: 'Side and qty are required' };
    }

    // Prepare the payload for Bybit API
    const closeParams = {
        category: 'linear',  // Specify category as 'linear'
        symbol: symbol.toUpperCase(),  // Ensure symbol is in uppercase
        side,  // Buy/Sell to close position
        qty,  // Quantity to close
        order_type: 'Market',  // Close position at market price
        reduceOnly: true,  // Ensure position is reduced and not increased
        stopLoss: null,  // If you don't want to set a stop loss, pass null
        takeProfit: null,  // If you don't want to set a take profit, pass null
        trailingStop: null,  // If you don't want to set trailing stop, pass null
        api_key: apiKey,  // The stored API key
        timestamp,  // Current timestamp
    };

    // Generate the signature using the params
    const signature = createSignature(closeParams, apiSecret);
    closeParams.sign = signature;  // Attach the signature to the params

    console.log('Generated signature for close market:', signature);  // Debugging the signature
    console.log('Close Market Params:', closeParams);  // Debugging the params

    try {
        // Send the POST request to Bybit's trading-stop endpoint
        const response = await axios.post(`${BASE_URL}/v5/position/trading-stop`, closeParams, {
            headers: { 'Content-Type': 'application/json' },
        });

        console.log('Close Market response:', response.data);
        return response.data;  // Return the response to the frontend
    } catch (error) {
        console.error('Error closing market position:', error.response ? error.response.data : error.message);
        return { error: 'Failed to close market position' };  // Return the error to the frontend
    }
});




// Order nyitás bybiten
ipcMain.handle('place-order', async (event, orderData) => {
    const timestamp = Date.now();

    // Ellenőrizzük, hogy minden szükséges paramétert megadunk-e
    if (!orderData.symbol || !orderData.qty || !orderData.side || !orderData.orderType) {
        return { error: 'Hiányzó paraméter: Symbol, qty, side és orderType kötelező!' };
    }

    const params = {
        category: 'linear',
        symbol: orderData.symbol,
        side: orderData.side,
        orderType: orderData.orderType,
        qty: orderData.qty,
        leverage: orderData.leverage,
        api_key: apiKey,
        timestamp,
    };

    if (orderData.orderType === 'Limit' && orderData.price) {
        params.price = orderData.price;
    }

    if (orderData.triggerPrice) {
        params.triggerPrice = orderData.triggerPrice;
        params.triggerDirection = 1;
    }

    if (orderData.tpSlEnabled) {
        if (orderData.takeProfit) params.takeProfit = orderData.takeProfit;
        if (orderData.stopLoss) params.stopLoss = orderData.stopLoss;
    }

    const signature = createSignature(params, apiSecret);
    params.sign = signature;

    console.log("Végső küldött adatok:", params); // Logolás hibakereséshez

    try {
        const response = await axios.post(`${BASE_URL}/v5/order/create`, params, {
            headers: { 'Content-Type': 'application/json' },
        });
        console.log("Response:", response.data);  // Log the entire response to see the details
        return response.data;
    } catch (error) {
        console.error('POST API hiba:', error.response ? error.response.data : error.message);
        return { error: 'Nem sikerült a megbízás létrehozása.' };
    }

});

// Elmentett beállítások lekérése a frontend számára
ipcMain.handle('get-settings', () => {
    return {
        apiKey: store.get('apiKey', ''),  // Retrieve the stored API key
        apiSecret: store.get('apiSecret', ''),  // Retrieve the stored API secret
        interval: store.get('intervalTime', 5000),  // Default interval value if not set
    };
});




app.whenReady().then(createWindow);
app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });
app.on('activate', () => { if (BrowserWindow.getAllWindows().length === 0) createWindow(); });
