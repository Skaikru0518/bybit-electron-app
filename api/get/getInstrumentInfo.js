import client from '../client.js';

const getInstrumentInfo = async (event, category, symbol) => {
  try {
    const response = await client.getInstrumentsInfo({
      category: category, // unified
      symbol: symbol,
    });
    return response.result;
  } catch (error) {
    throw new Error(error);
  }
};

export default getInstrumentInfo;
