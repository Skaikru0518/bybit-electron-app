import { RestClientV5 } from 'bybit-api';
import { eStore } from './store/index.js';
import { decryptSync } from './utils/encrypt.js';

// Cached client instance
let cachedClient = null;
let cachedConfig = null;

// Create a getter function that always uses current store values
const getClient = () => {
  const encryptedKey = eStore.get('apiKey');
  const encryptedSecret = eStore.get('apiSecret');
  const isDemo = eStore.get('isDemo');

  // Decrypt API credentials
  let apiKey = '';
  let apiSecret = '';

  if (encryptedKey) {
    // Check if encrypted (contains ":" separator) or plaintext
    if (encryptedKey.includes(':')) {
      try {
        apiKey = decryptSync(encryptedKey).trim();
      } catch (error) {
        console.error('[Encryption] Failed to decrypt API key:', error.message);
      }
    } else {
      // Old plaintext key
      apiKey = encryptedKey.trim();
    }
  }

  if (encryptedSecret) {
    // Check if encrypted (contains ":" separator) or plaintext
    if (encryptedSecret.includes(':')) {
      try {
        apiSecret = decryptSync(encryptedSecret).trim();
      } catch (error) {
        console.error('[Encryption] Failed to decrypt API secret:', error.message);
      }
    } else {
      // Old plaintext secret
      apiSecret = encryptedSecret.trim();
    }
  }

  // Convert isDemo to boolean
  const isDemoBool = isDemo === true || isDemo === 'true';

  // Current config
  const currentConfig = {
    key: apiKey,
    secret: apiSecret,
    demoTrading: isDemoBool,
  };

  // Check if config changed
  const configChanged =
    !cachedConfig ||
    cachedConfig.key !== currentConfig.key ||
    cachedConfig.secret !== currentConfig.secret ||
    cachedConfig.demoTrading !== currentConfig.demoTrading;

  if (configChanged) {
    cachedClient = new RestClientV5(currentConfig);
    cachedConfig = currentConfig;
  }

  return cachedClient;
};

// Export a Proxy that uses cached client
const client = new Proxy(
  {},
  {
    get(target, prop) {
      const actualClient = getClient();
      const value = actualClient[prop];
      // Bind methods to the client instance
      return typeof value === 'function' ? value.bind(actualClient) : value;
    },
  },
);

export default client;
