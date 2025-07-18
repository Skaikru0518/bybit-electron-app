import client from '../client.js';

const cancelOrder = async (event, category, symbol, orderId) => {
  try {
    const response = await client.cancelOrder({
      category: category, // inverse
      symbol: symbol, // USDT
      orderId: orderId,
    });
    return { message: 'Order closed!' };
  } catch (err) {
    throw new Error(err);
  }
};

export default cancelOrder;
