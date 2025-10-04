import eStore from './eStore.js';
import { encryptSync } from '../utils/encrypt.js';

const ENCRYPTED_KEYS = ['apiKey', 'apiSecret'];

const setStore = async (event, key, value) => {
  // Encrypt sensitive data
  if (ENCRYPTED_KEYS.includes(key) && value) {
    const encryptedValue = encryptSync(value);
    return eStore.set(`${key}`, encryptedValue);
  }

  return eStore.set(`${key}`, value);
};
export default setStore;
