import client from '../client.js';

const getAllPositions = async (event, category, settleCoin) => {
  try {
    const response = await client.getPositionInfo({
      category: category, //'linear',
      settleCoin: settleCoin, //'USDT',
    });
    return response.result;
  } catch (err) {
    throw new Error(err);
  }
};

export default getAllPositions;
