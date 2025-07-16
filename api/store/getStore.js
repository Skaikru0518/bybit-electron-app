import eStore from './eStore.js';

const getStore = async (event, key) => {
  return eStore.get(`${key}`);
};

export default getStore;
