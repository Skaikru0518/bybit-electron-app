import client from "../client.js";

const getWalletBalance = async (event, accountType) => {
	try {
		const response = await client.getWalletBalance({
			accountType: accountType,
		});
		return response.result;
	} catch (err) {
		console.error("[API] getWalletBalance error:", err.message);
		throw err;
	}
};

export default getWalletBalance;
