import React, { useEffect, useState } from 'react';
import debounce from 'lodash.debounce';

function OrderPopup({ onClose }) {
    const [orderData, setOrderData] = useState({
        symbol: '',
        side: 'Buy',
        orderType: 'Limit',
        qty: '0',
        leverage: 25,
        orderValue: 0,
        price: '',
        triggerPrice: '',
        requiredMargin: '0',
        tpSlEnabled: false,
        takeProfit: '',
        stopLoss: '',
        marketPrice: 0,
        minQty: 0,
        stepSize: 0,
        maxLeverage: 100
    });

    const [loading, setLoading] = useState(false); // Loading state for API calls

    // Debounce function for market data fetch
    const fetchMarketData = debounce(async (symbol) => {
        if (symbol) {
            setLoading(true);
            try {
                // Fetch market price
                const price = await window.bybitAPI.fetchMarketPrice(symbol);
                // Fetch symbol info
                const symbolInfo = await window.bybitAPI.fetchSymbolInfo(symbol);

                if (price && symbolInfo) {
                    setOrderData(prevData => ({
                        ...prevData,
                        marketPrice: price,
                        minQty: parseFloat(symbolInfo.lotSizeFilter.minOrderQty),
                        stepSize: parseFloat(symbolInfo.lotSizeFilter.qtyStep),
                        maxLeverage: parseFloat(symbolInfo.leverageFilter.maxLeverage)
                    }));
                }
            } catch (error) {
                console.error('Error fetching market data:', error);
            } finally {
                setLoading(false);
            }
        }
    }, 500); // 500ms debounce delay

    useEffect(() => {
        // Fetch data when symbol changes with debounce
        if (orderData.symbol) {
            fetchMarketData(orderData.symbol);
        }

        // Cleanup on component unmount
        return () => {
            fetchMarketData.cancel(); // Cleanup debounce when component unmounts
        };
    }, [orderData.symbol]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setOrderData(prevData => ({ ...prevData, [name]: value }));
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-gray-900 p-6 rounded-lg shadow-lg text-white w-96">
                <h3 className="text-lg font-semibold mb-4 text-center">Create New Order</h3>

                {/* Symbol Input */}
                <label className="block mb-4">
                    <span className="text-sm text-gray-400">Coin</span>
                    <input
                        type="text"
                        placeholder="e.g. BTCUSDT"
                        name="symbol"
                        value={orderData.symbol}
                        onChange={handleInputChange}
                        className="w-full p-2 rounded bg-gray-800 border border-gray-700 placeholder:text-sm"
                    />
                </label>

                {/* Market Price */}
                <p className="text-sm text-gray-400 mb-4">
                    Market Price: {loading ? 'Loading...' : `${orderData.marketPrice} USDT`}
                </p>

                {/* Leverage Selector */}
                <label className="block mb-4">
                    <span className="text-sm text-gray-400">Leverage</span>
                    <select
                        name="leverage"
                        value={orderData.leverage}
                        onChange={handleInputChange}
                        className="w-full p-2 rounded bg-gray-800 border border-gray-700"
                    >
                        {[...Array(orderData.maxLeverage).keys()].map(num => (
                            <option key={num + 1} value={num + 1}>{num + 1}x</option>
                        ))}
                    </select>
                </label>

                {/* Order Type Tabs */}
                <div className="flex space-x-2 mb-4">
                    <button
                        className={`flex-1 p-2 rounded ${orderData.orderType === 'Limit' ? 'bg-blue-600' : 'bg-gray-700'}`}
                        onClick={() => setOrderData({ ...orderData, orderType: 'Limit' })}
                    >
                        Limit
                    </button>
                    <button
                        className={`flex-1 p-2 rounded ${orderData.orderType === 'Market' ? 'bg-blue-600' : 'bg-gray-700'}`}
                        onClick={() => setOrderData({ ...orderData, orderType: 'Market' })}
                    >
                        Market
                    </button>
                </div>

                {/* Order Value Input */}
                <label className="block mb-4">
                    <span className="text-sm text-gray-400">Order Value (USDT)</span>
                    <input
                        type="number"
                        name="orderValue"
                        value={orderData.orderValue}
                        onChange={handleInputChange}
                        className="w-full p-2 rounded bg-gray-800 border border-gray-700"
                    />
                </label>

                {/* Price Input (for Limit Orders) */}
                {orderData.orderType === 'Limit' && (
                    <label className="block mb-4">
                        <span className="text-sm text-gray-400">Price</span>
                        <input
                            type="number"
                            name="price"
                            value={orderData.price}
                            onChange={handleInputChange}
                            className="w-full p-2 rounded bg-gray-800 border border-gray-700"
                        />
                    </label>
                )}

                {/* Trigger Price Input (for Conditional Orders) */}
                {orderData.orderType === 'Limit' && (
                    <label className="block mb-4">
                        <span className="text-sm text-gray-400">Trigger Price (for Conditional Orders)</span>
                        <input
                            type="number"
                            name="triggerPrice"
                            value={orderData.triggerPrice}
                            onChange={handleInputChange}
                            className="w-full p-2 rounded bg-gray-800 border border-gray-700"
                        />
                    </label>
                )}

                {/* Quantity and Required Margin */}
                <div className="text-sm text-gray-400 mb-4">
                    <p>Qty: {orderData.qty}</p>
                    <p>Required Margin: {orderData.requiredMargin} USDT</p>
                </div>

                {/* TP/SL Checkbox */}
                <label className="flex items-center mb-4">
                    <input
                        type="checkbox"
                        checked={orderData.tpSlEnabled}
                        onChange={() => setOrderData(prev => ({ ...prev, tpSlEnabled: !prev.tpSlEnabled }))}
                        className="mr-2"
                    />
                    <span className="text-sm text-gray-400">TP/SL</span>
                </label>

                {/* TP/SL Inputs */}
                {orderData.tpSlEnabled && (
                    <div className="space-y-2 mb-4">
                        <input
                            type="number"
                            name="takeProfit"
                            placeholder="Take Profit Price (USDT)"
                            value={orderData.takeProfit}
                            onChange={handleInputChange}
                            className="w-full p-2 rounded bg-gray-800 border border-gray-700"
                        />
                        <input
                            type="number"
                            name="stopLoss"
                            placeholder="Stop Loss Price (USDT)"
                            value={orderData.stopLoss}
                            onChange={handleInputChange}
                            className="w-full p-2 rounded bg-gray-800 border border-gray-700"
                        />
                    </div>
                )}

                {/* Buy/Sell Buttons */}
                <div className="flex space-x-2 mb-4">
                    <button
                        className="flex-1 p-2 rounded bg-green-600 text-white"
                        onClick={() => handleOrderSubmit('Buy')}
                    >
                        Buy / Long
                    </button>
                    <button
                        className="flex-1 p-2 rounded bg-red-600 text-white"
                        onClick={() => handleOrderSubmit('Sell')}
                    >
                        Sell / Short
                    </button>
                </div>

                {/* Cancel Button */}
                <button
                    className="w-full p-2 rounded bg-gray-700 text-white"
                    onClick={onClose}
                >
                    Cancel
                </button>
            </div>
        </div>
    );
}

export default OrderPopup;
