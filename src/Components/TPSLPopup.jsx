import React, { useState } from 'react';

function TPSLPopup({ onClose, position }) {
    const [takeProfit, setTakeProfit] = useState(position.takeProfit || '');
    const [stopLoss, setStopLoss] = useState(position.stopLoss || '');
    const [loading, setLoading] = useState(false);
    const [feedback, setFeedback] = useState('');


    const handleSubmit = async () => {
        // Allow either TP or SL to be empty
        if (!takeProfit && !stopLoss) {
            alert('Please enter at least one of Take Profit or Stop Loss!');
            return;
        }

        setLoading(true);

        try {
            // Calling the IPC method to modify TP/SL
            const response = await window.bybitAPI.modifyTpsl(position.symbol, takeProfit, stopLoss);

            if (response.retCode === 0) {
                setFeedback('TP/SL modified successfully');
            } else {
                setFeedback(`Error: ${response.retMsg}`);
            }
        } catch (error) {
            console.error('Error modifying TP/SL:', error);
            setFeedback('Error modifying TP/SL');
        } finally {
            setLoading(false);
        }
    };



    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-gray-900 p-6 rounded-lg shadow-lg text-white w-96">
                <h3 className="text-lg font-semibold mb-4 text-center">Modify TP/SL</h3>

                {/* Take Profit */}
                <label className="block mb-4">
                    <span className="text-sm text-gray-400">Take Profit</span>
                    <input
                        type="number"
                        name="takeProfit"
                        value={takeProfit}
                        onChange={(e) => setTakeProfit(e.target.value)}
                        className="w-full p-2 rounded bg-gray-800 border border-gray-700 placeholder:text-sm"
                        placeholder="Optional"
                    />
                </label>

                {/* Stop Loss */}
                <label className="block mb-4">
                    <span className="text-sm text-gray-400">Stop Loss</span>
                    <input
                        type="number"
                        name="stopLoss"
                        value={stopLoss}
                        onChange={(e) => setStopLoss(e.target.value)}
                        className="w-full p-2 rounded bg-gray-800 border border-gray-700 placeholder:text-sm"
                        placeholder="Optional"
                    />
                </label>

                {/* Action Buttons */}
                <div className="flex space-x-2">
                    <button
                        className="flex-1 p-2 rounded bg-blue-600 text-white"
                        onClick={handleSubmit}
                        disabled={loading}
                    >
                        {loading ? 'Updating...' : 'Save'}
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

export default TPSLPopup;
