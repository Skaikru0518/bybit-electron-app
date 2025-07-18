import client from '../client.js';

const setLeverage = async (
  event,
  category,
  symbol,
  buyLeverage,
  sellLeverage,
) => {
  try {
    const currPrice = await client.setLeverage({
      category: category, // inverse
      symbol: symbol, // USDT
      buyLeverage: buyLeverage,
      sellLeverage: sellLeverage,
    });
    return currPrice.result;
  } catch (err) {
    throw new Error(err);
  }
};

export default setLeverage;
