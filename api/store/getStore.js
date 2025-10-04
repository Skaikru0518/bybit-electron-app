import eStore from './eStore.js';
import { decryptSync } from '../utils/encrypt.js';

const ENCRYPTED_KEYS = ['apiKey', 'apiSecret'];

const getStore = async (event, key) => {
  const value = eStore.get(`${key}`);

  // Decrypt sensitive data
  if (ENCRYPTED_KEYS.includes(key) && value) {
    // Check if the value is already encrypted (contains IV separator ":")
    if (value.includes(':')) {
      try {
        const decryptedValue = decryptSync(value);
        return decryptedValue;
      } catch (error) {
        console.error(`[Encryption] Failed to decrypt ${key}:`, error.message);
        return '';
      }
    } else {
      // Old plaintext data - return as is
      console.warn(`[Encryption] ${key} is stored as plaintext. Please re-save in Settings.`);
      return value;
    }
  }

  return value;
};

export default getStore;
