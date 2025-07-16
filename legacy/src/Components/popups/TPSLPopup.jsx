import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

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
      // Ensure empty fields are sent as "0" instead of null/undefined
      const tpValue = takeProfit.trim() === '' ? '0' : takeProfit;
      const slValue = stopLoss.trim() === '' ? '0' : stopLoss;

      // Calling the IPC method to modify TP/SL
      const response = await window.bybitAPI.modifyTpsl(
        position.symbol,
        tpValue,
        slValue,
      );

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
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
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
            Modify TP/SL
          </motion.h3>

          {/* Take Profit Input */}
          <motion.label
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="block mb-4"
          >
            <span className="text-sm text-gray-400">Take Profit</span>
            <motion.input
              type="number"
              name="takeProfit"
              value={takeProfit}
              onChange={(e) => setTakeProfit(e.target.value)}
              className="w-full p-2 rounded bg-gray-800 border border-gray-700 placeholder:text-sm"
              placeholder="Optional"
              defaultValue={0}
              whileFocus={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            />
          </motion.label>

          {/* Stop Loss Input */}
          <motion.label
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="block mb-4"
          >
            <span className="text-sm text-gray-400">Stop Loss</span>
            <motion.input
              type="number"
              name="stopLoss"
              value={stopLoss}
              onChange={(e) => setStopLoss(e.target.value)}
              className="w-full p-2 rounded bg-gray-800 border border-gray-700 placeholder:text-sm"
              placeholder="Optional"
              defaultValue={0}
              whileFocus={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            />
          </motion.label>

          {/* Action Buttons */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex space-x-2"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex-1 p-2 rounded bg-btn hover:bg-btn-hover transition-all duration-300 text-white"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? 'Updating...' : 'Save'}
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

export default TPSLPopup;
