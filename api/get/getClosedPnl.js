import client from '../client.js';

const getClosedPnl = async (event, category) => {
  try {
    const closedPnl = await client.getClosedPnL({
      category: category, // unified
    });
    return closedPnl.result;
  } catch (error) {
    throw new Error(error);
  }
};

export default getClosedPnl;
