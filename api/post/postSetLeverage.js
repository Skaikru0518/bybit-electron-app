import client from '../client.js';

const setLeverage = async (
  event,
  category,
  symbol,
  buyLeverage,
  sellLeverage,
) => {
  try {
    const response = await client.setLeverage({
      category: category, // inverse
      symbol: symbol, // USDT
      buyLeverage: buyLeverage,
      sellLeverage: sellLeverage,
    });
    console.log(
      'Leverage adjusted: ',
      category,
      symbol,
      buyLeverage,
      sellLeverage,
    );
    return response;
  } catch (err) {
    throw new Error(err);
  }
};

export default setLeverage;
