import React, { useEffect, useState } from 'react';
import OrderPopup from './OrderPopup';
import TPSLPopup from './TPSLPopup';
import MarketPopup from './MarketPopup';  // Import the MarketPopup

function Trades() {
    const [positions, setPositions] = useState([]);
    const [refreshInterval, setRefreshInterval] = useState(5000);
    const [isOrderPopupOpen, setIsOrderPopupOpen] = useState(false);
    const [isTPSLPopupOpen, setIsTPSLPopupOpen] = useState(false);
    const [isMarketPopupOpen, setIsMarketPopupOpen] = useState(false); // State for Market Popup
    const [selectedPosition, setSelectedPosition] = useState(null); // State for the selected position

    useEffect(() => {
        let isMounted = true;

        const loadSettings = async () => {
            const settings = await window.bybitAPI.getSettings();
            setRefreshInterval(settings.intervalTime || 5000);
        };
        loadSettings();

        const loadPositions = async () => {
            const data = await window.bybitAPI.fetchPositions();
            if (isMounted) {
                setPositions(data);
                console.log("Fetched positions:", data);
            }
        };

        loadPositions();
        console.log(`API Refresh interval: ${refreshInterval}`);
        const interval = setInterval(() => {
            loadPositions();
        }, refreshInterval);

        return () => {
            isMounted = false;
            clearInterval(interval);
        };
    }, [refreshInterval]);

    const handleModifyClick = (position) => {
        setSelectedPosition(position); // Set the selected position
        setIsTPSLPopupOpen(true); // Open the TP/SL popup
    };

    const handleMarketCloseClick = (position) => {
        setSelectedPosition(position); // Set the selected position
        setIsMarketPopupOpen(true); // Open the Market Close popup
    };

    return (
        <div className="w-full min-h-[calc(100vh-60px)] p-6 bg-gradient-to-r from-[#130f40] to-black text-primary-text">
            <h2 className="text-center text-2xl font-semibold mb-4">Open Positions</h2>

            <button
                onClick={() => setIsOrderPopupOpen(true)}
                className="my-5 bg-success p-2 rounded-xl text-sm text-primary-text hover:bg-green-700 hover:scale-105 transition-all duration-300 ease-in-out">
                Place Order
            </button>

            {isOrderPopupOpen && <OrderPopup onClose={() => setIsOrderPopupOpen(false)} />}

            {isTPSLPopupOpen && <TPSLPopup onClose={() => setIsTPSLPopupOpen(false)} position={selectedPosition} />}
            {isMarketPopupOpen && <MarketPopup onClose={() => setIsMarketPopupOpen(false)} position={selectedPosition} />} {/* Show Market Close popup */}

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
                                <tr key={index} className="border-b border-border text-center">
                                    <td>{position.symbol}</td>
                                    <td>{position.markPrice} USDT</td>
                                    <td>{position.avgPrice} USDT</td>
                                    <td className={position.side === "Buy" ? "text-green-500" : "text-red-500"}>
                                        {position.side === "Buy" ? `${position.size} ${position.symbol.slice(0, -4)}` : `-${position.size} ${position.symbol.slice(0, -4)}`}
                                    </td>
                                    <td>{position.positionValue} USDT</td>
                                    <td className={position.side === "Buy" ? "text-green-500" : "text-red-500"}>{position.side}</td>
                                    <td>{position.leverage}x</td>
                                    <td className={position.unrealisedPnl > 0 ? "text-green-500" : "text-red-500"}>{position.unrealisedPnl}</td>
                                    <td className={position.curRealisedPnl > 0 ? "text-green-500" : "text-red-500"}>{position.curRealisedPnl}</td>
                                    <td>{position.takeProfit > 0 ? position.takeProfit + " USDT" : "/"}</td>
                                    <td>{position.stopLoss > 0 ? position.stopLoss + " USDT" : "/"}</td>
                                    <td>
                                        {/* Modify TP/SL button */}
                                        <button
                                            className='my-3 bg-btn p-2 rounded-xl hover:bg-btn-hover hover:scale-105 transition-all duration-300 ease-in-out text-primary-text'
                                            onClick={() => handleModifyClick(position)}
                                        >
                                            Modify
                                        </button>
                                    </td>
                                    <td>
                                        {/* Instant Close Market button */}
                                        <button
                                            className='my-3 bg-btn p-2 rounded-xl hover:bg-btn-hover hover:scale-105 transition-all duration-300 ease-in-out text-primary-text'
                                            onClick={() => handleMarketCloseClick(position)}  // Trigger Market Close popup
                                        >
                                            Close Market
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="9" className="p-4 text-center text-muted-text">No open positions.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Trades;
