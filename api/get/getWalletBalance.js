import client from '../client.js';

const getWalletBalance = async (event, accountType) => {
  try {
    const response = await client.getWalletBalance({
      accountType: accountType,
    });
    return response.result;
  } catch (err) {
    throw new Error(err);
  }
};

export default getWalletBalance;
