import client from '../client.js';

const getOnePosition = async (event, category, symbol) => {
  try {
    const response = await client.getPositionInfo({
      category: category, //'linear',
      symbol: symbol, //'BTCUSDT',
    });
    return response.result;
  } catch (err) {
    throw new Error(err);
  }
};

export default getOnePosition;
