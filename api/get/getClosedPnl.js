import client from '../client.js';

const getClosedPnl = async (event, category, startTime, endTime) => {
  try {
    const params = {
      category: category, // unified or linear
    };

    // Add optional time filters if provided
    if (startTime) params.startTime = startTime;
    if (endTime) params.endTime = endTime;

    const closedPnl = await client.getClosedPnL(params);
    return closedPnl.result;
  } catch (error) {
    throw new Error(error);
  }
};

export default getClosedPnl;
