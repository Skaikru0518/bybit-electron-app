import client from '../client.js';

const modifyTpSl = async (event, category, symbol, takeProfit, stopLoss) => {
  try {
    const response = await client.setTradingStop({
      category: category,
      symbol: symbol,
      takeProfit: takeProfit,
      stopLoss: stopLoss,
      positionIdx: 2,
      tpTriggerBy: 'MarkPrice',
      slTriggerBy: 'MarkPrice',
      tpslMode: 'Full',
      tpOrderType: 'Market',
      slOrderType: 'Market',
    });

    return response;
  } catch (err) {
    throw new Error(err);
  }
};

export default modifyTpSl;
