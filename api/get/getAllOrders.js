import client from '../client.js';

const getAllOrders = async (event, category, settleCoin) => {
  try {
    const response = await client.getActiveOrders({
      category: category, // inverse
      settleCoin: settleCoin, // USDT
    });
    return response.result;
  } catch (err) {
    throw new Error(err);
  }
};

export default getAllOrders;
