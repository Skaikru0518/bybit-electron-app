import client from '../client.js';

const getAccountInfo = async (event, accountType) => {
  try {
    const accountInfo = await client.getAccountInfo({
      accountType: accountType, // unified
    });
    return accountInfo.result;
  } catch (error) {
    throw new Error(error);
  }
};

export default getAccountInfo;
