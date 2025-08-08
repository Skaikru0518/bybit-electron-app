import eStore from './eStore.js';

const setStore = async (event, key, value) => {
  return eStore.set(`${key}`, value);
};
export default setStore;
