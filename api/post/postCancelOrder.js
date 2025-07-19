import client from '../client.js';

const cancelOrder = async (event, category, symbol, orderId) => {
  try {
    const response = await client.cancelOrder({
      category: category, // inverse
      symbol: symbol, // USDT
      orderId: orderId,
    });
    console.log('Order cancel success with id/symbol', orderId, symbol);
    return response;
  } catch (err) {
    throw new Error(err);
  }
};

export default cancelOrder;
