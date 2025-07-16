import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

function MarketPopup({ onClose, position }) {
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState('');

  // Handle closing position on market
  const handleCloseMarket = async () => {
    setLoading(true);
    setFeedback('Closing position...');

    try {
      const response = await window.bybitAPI.closePosition(position.symbol); // IPC hívás

      if (response.error) {
        setFeedback(`Error: ${response.error}`);
        console.error(
          `Error closing ${position.symbol} position: ${response.error}`,
        );
      } else {
        setFeedback(`${position.symbol} position closed successfully.`);
        console.log(`${position.symbol} position closed successfully.`);
      }
    } catch (error) {
      setFeedback('Error closing position');
      console.error(`Error closing ${position.symbol} position:`, error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
      >
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.5, opacity: 0 }}
          transition={{
            type: 'spring',
            stiffness: 300,
            damping: 25,
          }}
          className="bg-gray-900 p-6 rounded-lg shadow-lg text-white w-96"
        >
          <motion.h3
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-lg font-semibold mb-4 text-center"
          >
            Close Market Position
          </motion.h3>

          {/* Feedback Message */}
          {feedback && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm text-gray-400 mb-4"
            >
              {feedback}
            </motion.p>
          )}

          {/* Position Details */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-4"
          >
            <p>Symbol: {position.symbol}</p>
            <p>Position Size: {position.size}</p>
            <p>Market Price: {position.markPrice} USDT</p>
            <p>Current PNL: {position.unrealisedPnl} USDT</p>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex space-x-2"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex-1 p-2 rounded bg-red-600 text-white"
              onClick={handleCloseMarket}
              disabled={loading}
            >
              {loading ? 'Closing...' : 'Close Position'}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex-1 p-2 rounded bg-gray-600 text-white"
              onClick={onClose}
            >
              Cancel
            </motion.button>
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default MarketPopup;
