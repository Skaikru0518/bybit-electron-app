import React, { useState } from 'react';

function MarketPopup({ onClose, position }) {
    const [loading, setLoading] = useState(false);
    const [feedback, setFeedback] = useState('');

    // Handle closing position on market
    const handleCloseMarket = async (symbol, side, qty) => {
        setLoading(true);
        setFeedback('Closing position...');

        try {
            // Corrected logic to pass the correct side and qty
            const response = await window.bybitAPI.closeMarketPosition(symbol, side, qty);
            if (response.retCode === 0) {
                setFeedback(`${symbol} position closed successfully.`);
                console.log(`${symbol} position closed successfully.`);
            } else {
                setFeedback(`Error: ${response.retMsg}`);
                console.error(`Error closing ${symbol} position: ${response.retMsg}`);
            }
        } catch (error) {
            setFeedback('Error closing position');
            console.error(`Error closing ${symbol} position:`, error);
        } finally {
            setLoading(false);
        }
    };

    // Determine side based on current position (Buy -> Sell or Sell -> Buy)
    const side = position.side === 'Buy' ? 'Sell' : 'Buy'; // Correctly determine side
    const qty = position.size; // Use the position size for qty

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-gray-900 p-6 rounded-lg shadow-lg text-white w-96">
                <h3 className="text-lg font-semibold mb-4 text-center">Close Market Position</h3>

                {/* Feedback Message */}
                {feedback && <p className="text-sm text-gray-400 mb-4">{feedback}</p>}

                {/* Position Details */}
                <div className="mb-4">
                    <p>Symbol: {position.symbol}</p>
                    <p>Position Size: {position.size}</p>
                    <p>Market Price: {position.markPrice} USDT</p>
                    <p>Current PNL: {position.unrealisedPnl} USDT</p>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2">
                    <button
                        className="flex-1 p-2 rounded bg-red-600 text-white"
                        onClick={() => handleCloseMarket(position.symbol, side, qty)} // Correct side and qty
                        disabled={loading}
                    >
                        {loading ? 'Closing...' : 'Close Position'}
                    </button>
                    <button
                        className="flex-1 p-2 rounded bg-gray-600 text-white"
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}

export default MarketPopup;
