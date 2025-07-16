import client from '../client.js';

const getPrice = async (event, category, symbol) => {
  try {
    const currPrice = await client.getTickers({
      category: category, // inverse
      symbol: symbol, // USDT
    });
    return currPrice.result.list;
  } catch (err) {
    throw new Error(err);
  }
};

export default getPrice;
