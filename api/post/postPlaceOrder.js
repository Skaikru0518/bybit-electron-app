import client from '../client.js';

const placeOrder = async (
  event,
  category,
  symbol,
  side,
  orderType,
  qty,
  price,
  takeProfit,
  stopLoss,
) => {
  try {
    const response = await client.submitOrder({
      category: category, // inverse
      symbol: symbol, // USDT
      side: side,
      orderType: orderType,
      qty: qty,
      price: price,
      takeProfit: takeProfit,
      stopLoss: stopLoss,
    });
    console.log(
      'Order placed with details:',
      category,
      symbol,
      side,
      orderType,
      qty,
      price,
      takeProfit,
      stopLoss,
    );
    return response;
  } catch (err) {
    throw new Error(err);
  }
};

export default placeOrder;
