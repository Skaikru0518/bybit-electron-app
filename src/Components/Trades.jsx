import React, { useActionState, useEffect, useState } from 'react';
import OrderPopup from './OrderPopup';
import TPSLPopup from './TPSLPopup';
import MarketPopup from './MarketPopup';

export default function Trades() {
    const [positions, setPositions] = useState([]);
    const [refreshInterval, setRefreshInterval] = useState(5000);
    const [isOrderPopupOpen, setIsOrderPopupOpen] = useState(false);
    const [isTPSLPopupOpen, setIsTPSLPopupOpen] = useState(false);
    const [isMarketPopupOpen, setIsMarketPopupOpen] = useState(false);
    const [selectedPosition, setSelectedPosition] = useState(null);
    const [pendingOrders, setPendingOrders] = useState([]);

    useEffect(() => {
        let isMounted = true;

        const loadSettings = async () => {
            const settings = await window.bybitAPI.getSettings();
            setRefreshInterval(settings.interval || 5000);
        };
        loadSettings();

        const loadPositions = async () => {
            const data = await window.bybitAPI.fetchPositions();
            // console.log("pozi data", data)
            if (isMounted) {
                setPositions(data);
            }
        };

        loadPositions();
        const interval = setInterval(loadPositions, refreshInterval);

        return () => {
            isMounted = false;
            clearInterval(interval);
        };
    }, [refreshInterval]);

    useEffect(() => {
        let isMounted = true;

        const loadSettings = async () => {
            try {
                const settings = await window.bybitAPI.getSettings();
                if (isMounted) {
                    setRefreshInterval(settings.interval || 5000);
                }
            } catch (error) {
                console.error('Error loading settings:', error);
            }
        };
        loadSettings();

        const updatePendingOrders = async () => {
            const data = await window.bybitAPI.fetchPendingOrders();
            // console.log("pending ord:", data)
            if (isMounted) {
                setPendingOrders(data)
            }
        };

        updatePendingOrders();

        // Időzített frissítés
        const interval = setInterval(() => {
            if (isMounted) {
                updatePendingOrders();
            }
        }, refreshInterval);

        return () => {
            isMounted = false;
            clearInterval(interval);
        };
    }, [refreshInterval]);

    const handleCancelOrder = async (orderId, symbol) => {
        if (!orderId || !symbol) return console.error("Missing orderId or symbol!");

        try {
            const response = await window.bybitAPI.cancelOrder(orderId, symbol);
            if (response.retCode === 0) {
                // console.log("✅ Order canceled successfully:", response);
                // Remove the canceled order from the state
                setPendingOrders((prevOrders) => prevOrders.filter(order => order.orderId !== orderId));
            } else {
                console.error("❌ Error canceling order:", response.retMsg);
            }
        } catch (error) {
            console.error("❌ Cancel order failed:", error);
        }
    };


    const formatNumber = (num) => {
        return num ? new Intl.NumberFormat('en-US', { minimumFractionDigits: 3, maximumFractionDigits: 3 }).format(num).replace(/,/g, ' ') : '-';
    };

    const handleModifyClick = (position) => {
        setSelectedPosition(position);
        setIsTPSLPopupOpen(true);
    };

    const handleMarketCloseClick = (position) => {
        setSelectedPosition(position);
        setIsMarketPopupOpen(true);
    };

    return (
        <div className="w-full min-h-[calc(100vh-60px)] p-6 bg-gradient-to-r from-[#130f40] to-black text-primary-text">
            <div>
                <h2 className="text-center text-2xl font-semibold mb-4">Open Positions</h2>
                <div className='flex items-center justify-between'>
                    <button
                        onClick={() => setIsOrderPopupOpen(true)}
                        className="my-5 bg-success p-2 rounded-xl text-sm text-primary-text hover:bg-green-700 hover:scale-105 transition-all duration-300 ease-in-out">
                        Place Order
                    </button>
                    <p>Refresh Interval: {refreshInterval / 1000} s</p>
                </div>

                {isOrderPopupOpen && <OrderPopup onClose={() => setIsOrderPopupOpen(false)} />}
                {isTPSLPopupOpen && <TPSLPopup onClose={() => setIsTPSLPopupOpen(false)} position={selectedPosition} />}
                {isMarketPopupOpen && <MarketPopup onClose={() => setIsMarketPopupOpen(false)} position={selectedPosition} />}

                <div className="overflow-x-auto">
                    <table className="w-full border border-border rounded-lg shadow">
                        <thead>
                            <tr className="bg-navbar-bg text-white">
                                <th className="p-2">Symbol</th>
                                <th className="p-2">Market Price</th>
                                <th className="p-2">Entry</th>
                                <th className="p-2">Position Size</th>
                                <th className="p-2">Value</th>
                                <th className="p-2">Direction</th>
                                <th className="p-2">Leverage</th>
                                <th className="p-2">Unrealized PNL</th>
                                <th className="p-2">Realized PNL</th>
                                <th className="p-2">TP</th>
                                <th className="p-2">SL</th>
                                <th className="p-2">Modify TP/SL</th>
                                <th className="p-2">Instant Close</th>
                            </tr>
                        </thead>
                        <tbody>
                            {positions.length > 0 ? (
                                positions.map((position, index) => (
                                    <tr key={index} className="border-b border-border text-center  hover:bg-table-hover transition-all duration-200 ease-in-out cursor-pointer">
                                        <td>{position.symbol}</td>
                                        <td>{formatNumber(position.markPrice)} USDT</td>
                                        <td>{formatNumber(position.avgPrice)} USDT</td>
                                        <td className={position.side === "Buy" ? "text-green-500" : "text-red-500"}>
                                            {position.side === "Buy" ? `${formatNumber(position.size)} ${position.symbol.slice(0, -4)}` : `-${formatNumber(position.size)} ${position.symbol.slice(0, -4)}`}
                                        </td>
                                        <td>{formatNumber(position.positionValue)} USDT</td>
                                        <td className={position.side === "Buy" ? "text-green-500" : "text-red-500"}>{position.side}</td>
                                        <td>{position.leverage}x</td>
                                        <td className={position.unrealisedPnl > 0 ? "text-green-500" : "text-red-500"}>{formatNumber(position.unrealisedPnl)}</td>
                                        <td className={position.curRealisedPnl > 0 ? "text-green-500" : "text-red-500"}>{formatNumber(position.curRealisedPnl)}</td>
                                        <td>{position.takeProfit > 0 ? formatNumber(position.takeProfit) + " USDT" : "/"}</td>
                                        <td>{position.stopLoss > 0 ? formatNumber(position.stopLoss) + " USDT" : "/"}</td>
                                        <td>
                                            <button
                                                className='bg-[#6b05de] text-[#e0e0e0] border border-[#3b3663] px-4 py-2 my-3 rounded-md font-semibold text-sm transition-transform duration-200 ease-in-out hover:bg-[#5a04c7] hover:shadow-lg hover:scale-105'
                                                onClick={() => handleModifyClick(position)}
                                            >
                                                Modify
                                            </button>
                                        </td>
                                        <td>
                                            <button
                                                className='bg-[#6b05de] text-[#e0e0e0] border border-[#3b3663] px-4 py-2 my-3 rounded-md font-semibold text-sm transition-transform duration-200 ease-in-out hover:bg-[#5a04c7] hover:shadow-lg hover:scale-105'
                                                onClick={() => handleMarketCloseClick(position)}
                                            >
                                                Close
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="13" className="p-4 text-center text-muted-text">No open positions.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className='overflow-x-auto flex flex-col'>
                <h2 className='text-center text-2xl font-semibold mb-4 mt-5'>Pending Orders</h2>
                <table className="w-full border border-border rounded-lg shadow">
                    <thead>
                        <tr className='bg-navbar-bg text-primary-text'>
                            <th className='p-2'>Symbol</th>
                            <th className='p-2'>Side</th>
                            <th className='p-2'>Order Type</th>
                            <th className='p-2'>Price</th>
                            <th className='p-2'>Qty</th>
                            <th className='p-2'>Order Status</th>
                            <th className='p-2'>Cancel</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pendingOrders.length > 0 ? (
                            pendingOrders.map((order, index) => (
                                <tr key={index} className='border-b border-border text-center hover:bg-table-hover transition-all duration-200 ease-in-out cursor-pointer'>
                                    <td className='p-2'>{order.symbol}</td>
                                    <td className='p-2' style={{ color: order.side === 'Buy' ? 'green' : 'red' }}>{order.side}</td>
                                    <td className='p-2'>{order.orderType}</td>
                                    <td className='p-2'>{formatNumber(order.price)} USDT</td>
                                    <td className='p-2'>{order.qty}</td>
                                    <td className='p-2'>{order.orderStatus}</td>
                                    <td className='p-2'>
                                        <button className='bg-[#6b05de] text-[#e0e0e0] border border-[#3b3663] px-4 py-2 rounded-md font-semibold text-sm transition-transform duration-200 ease-in-out hover:bg-[#5a04c7] hover:shadow-lg hover:scale-105 active:bg- disabled:bg-[#555555] disabled:opacity-60 disabled:cursor-not-allowed' onClick={() => handleCancelOrder(order.orderId, order.symbol)}>
                                            Cancel
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7" className='text-center p-4'>No pending orders.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
