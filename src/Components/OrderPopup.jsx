import React, { useEffect, useState } from 'react';
import debounce from 'lodash.debounce';

function OrderPopup({ onClose }) {
    const [orderData, setOrderData] = useState({
        symbol: '',
        side: 'Buy',
        orderType: 'Limit',
        qty: '',
        leverage: 1,
        orderValue: 0,
        price: '',
        triggerPrice: '',
        requiredMargin: '',
        tpSlEnabled: false,
        takeProfit: '',
        stopLoss: '',
        marketPrice: 0,
        minQty: 0,
        stepSize: 0,
        maxLeverage: 100
    });

    const [loading, setLoading] = useState(false);
    const [feedback, setFeedback] = useState(''); // State for feedback messages

    // Debounce function for fetching market data
    const fetchMarketData = debounce(async (symbol) => {
        if (symbol) {
            setLoading(true);
            try {
                const price = await window.bybitAPI.fetchMarketPrice(symbol);
                const symbolInfo = await window.bybitAPI.fetchSymbolInfo(symbol);

                if (price && symbolInfo) {
                    setOrderData(prevData => {
                        const qty = prevData.orderValue / price;
                        const requiredMargin = prevData.orderValue / prevData.leverage;
                        return {
                            ...prevData,
                            marketPrice: price,
                            minQty: parseFloat(symbolInfo.lotSizeFilter.minOrderQty),
                            stepSize: parseFloat(symbolInfo.lotSizeFilter.qtyStep),
                            maxLeverage: parseFloat(symbolInfo.leverageFilter.maxLeverage),
                            qty: qty.toFixed(2),
                            requiredMargin: requiredMargin.toFixed(2)
                        };
                    });
                }
            } catch (error) {
                console.error('Error fetching market data:', error);
            } finally {
                setLoading(false);
            }
        }
    }, 1000); // 1000ms debounce delay

    useEffect(() => {
        if (orderData.symbol) {
            fetchMarketData(orderData.symbol);
        }

        return () => {
            fetchMarketData.cancel(); // Cleanup debounce on unmount
        };
    }, [orderData.symbol]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        const updatedData = { ...orderData, [name]: value };
        setOrderData(updatedData);

        if (updatedData.orderType === 'Limit' && updatedData.price && updatedData.orderValue && updatedData.leverage) {
            calculateOrderDetails(updatedData);
        } else if (updatedData.orderType === 'Market') {
            calculateMarketOrderDetails(updatedData);
        }
    };

    const roundToStepSize = (qty, stepSize) => {
        const precision = Math.ceil(-Math.log10(stepSize));
        return (Math.floor(qty / stepSize) * stepSize).toFixed(precision);
    };

    const calculateOrderDetails = (data) => {
        const entry = parseFloat(data.price);
        const lev = parseFloat(data.leverage);
        const orderValue = parseFloat(data.orderValue);

        if (entry > 0 && lev > 0 && orderValue > 0) {
            let positionSize = orderValue / entry;
            positionSize = roundToStepSize(positionSize, data.stepSize);
            const requiredMargin = +(orderValue / lev).toFixed(4);

            setOrderData(prevData => ({
                ...prevData,
                qty: positionSize.toString(),
                requiredMargin
            }));
        }
    };

    const calculateMarketOrderDetails = (data) => {
        const lev = parseFloat(data.leverage);
        const orderValue = parseFloat(data.orderValue);
        const marketPrice = parseFloat(data.marketPrice);

        if (lev > 0 && orderValue > 0 && marketPrice > 0) {
            let positionSize = orderValue / marketPrice;
            positionSize = roundToStepSize(positionSize, data.stepSize);
            const requiredMargin = +(orderValue / lev).toFixed(4);

            if (parseFloat(positionSize) >= data.minQty) {
                setOrderData(prevData => ({
                    ...prevData,
                    qty: positionSize.toString(),
                    requiredMargin
                }));
            } else {
                console.error('Calculated qty is below the minimum required:', positionSize);
            }
        }
    };

    // const createOrder = async (orderData) => {
    //     setFeedback('');  // Reset feedback before placing the order
    //     try {
    //         const response = await window.bybitAPI.placeOrder(orderData);
    //         console.log("Order Created:", response);
    //         if (response.retCode === 0) {
    //             setFeedback('Order successfully placed!');
    //         } else {
    //             setFeedback(`Error: ${response.retMsg}`);
    //         }
    //     } catch (error) {
    //         console.error('Error creating order:', error);
    //         setFeedback('Error placing order');
    //     }
    // };

    const handleOrderSubmit = async (side) => {
        let updatedOrderData = {
            ...orderData,
            side,
            leverage: orderData.leverage.toString(),
        };

        try {
            const leverageResponse = await window.bybitAPI.updateLeverage({
                symbol: orderData.symbol,
                leverage: orderData.leverage,
            });
            if (leverageResponse.error) {
                console.error('Failed to update leverage:', leverageResponse.error);
                return;
            }
            console.log('Leverage updated successfully:', leverageResponse);
        } catch (error) {
            console.error('Error setting leverage:', error);
            return;
        }

        // **Market Order Logika (NEM változtatunk rajta)**
        if (orderData.orderType === "Market") {
            updatedOrderData = {
                ...updatedOrderData,
                orderType: "Market",
            };
        }
        // **Limit Order Logika (TriggerPrice beállítással)**
        else if (orderData.orderType === "Limit") {
            if (!orderData.price || parseFloat(orderData.price) === 0) {
                console.error('Price is required for limit orders.');
                return;
            }

            updatedOrderData = {
                ...updatedOrderData,
                orderType: "Limit",
                price: orderData.price.toString(),
                triggerPrice: orderData.price.toString(), // 🔹 **TriggerPrice beállítása**
                triggerDirection: side === "Buy" ? 1 : 2, // 🔹 **Buy = 1 (amikor eléri vagy felette van), Sell = 2 (amikor eléri vagy alatta van)**
                timeInForce: "GTC", // 🔹 Jó, ha a rendelés addig marad aktív, amíg ki nem törlik
            };

            if (side === 'Buy' && parseFloat(updatedOrderData.price) <= parseFloat(orderData.marketPrice)) {
                console.error('Limit Buy price must be above the market price!');
                setFeedback('Limit Buy price must be above market price!');
                return;
            }
            if (side === 'Sell' && parseFloat(updatedOrderData.price) >= parseFloat(orderData.marketPrice)) {
                console.error('Limit Sell price must be below the market price!');
                setFeedback('Limit Sell price must be below market price!');
                return;
            }
        }

        console.log('Final Order Data to be sent:', updatedOrderData);

        try {
            const response = await window.bybitAPI.placeOrder(updatedOrderData);
            console.log('Order created successfully:', response);
            if (response.retCode === 0) {
                setFeedback('Order successfully placed!');
                onClose();
            } else {
                setFeedback(`Error: ${response.retMsg}`);
            }
        } catch (error) {
            console.error('Error creating order:', error);
            setFeedback('Error placing order');
        }
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

                {/* Quantity and Required Margin */}
                <div className="text-sm text-gray-400 mb-4">
                    <p>Qty: {orderData.qty}</p>
                    <p>Required Margin: {orderData.requiredMargin} USDT</p>
                </div>

                {/* Feedback Message */}
                {feedback && <p className="text-sm text-gray-400 mb-4">{feedback}</p>}

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
