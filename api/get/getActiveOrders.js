import client from '../client.js';

const getActiveOrders = async (event, category, symbol) => {
  try {
    const response = await client.getActiveOrders({
      category: category, // inverse
      symbol: symbol, // BTCUSDT
    });
    return response.result;
  } catch (err) {
    throw new Error(err);
  }
};

export default getActiveOrders;
