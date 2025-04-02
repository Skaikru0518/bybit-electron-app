import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { modifyTPSL } from '../Backend/Api';

const ModifyTPSLPopup = ({ symbol, currentTP, currentSL, onClose }) => {
  const [takeProfit, setTakeProfit] = useState(currentTP || '');
  const [stopLoss, setStopLoss] = useState(currentSL || '');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await modifyTPSL(symbol, takeProfit, stopLoss); // Ez aszinkron, de helyesen kezeljük
      console.log(`TP/SL for ${symbol} modified successfully.`);
      onClose(); // Bezárjuk a popupot sikeres módosítás után
    } catch (error) {
      console.error(`Error modifying TP/SL for ${symbol}:`, error);
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
        className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 tpsl-popup-overlay"
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
          className="bg-gray-900 p-6 rounded-lg shadow-lg text-white w-96 tpsl-popup-content"
        >
          <motion.h3
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-lg font-semibold mb-4 text-center"
          >
            Modify TP/SL for {symbol}
          </motion.h3>

          {/* Take Profit Input */}
          <motion.label
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="block mb-4"
          >
            Take Profit:
            <input
              type="number"
              value={takeProfit}
              onChange={(e) => setTakeProfit(e.target.value)}
              placeholder="Take Profit"
              className="w-full p-2 mt-1 bg-gray-800 text-white rounded"
            />
          </motion.label>

          {/* Stop Loss Input */}
          <motion.label
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="block mb-4"
          >
            Stop Loss:
            <input
              type="number"
              value={stopLoss}
              onChange={(e) => setStopLoss(e.target.value)}
              placeholder="Stop Loss"
              className="w-full p-2 mt-1 bg-gray-800 text-white rounded"
            />
          </motion.label>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex space-x-2"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSubmit}
              disabled={loading}
              className="flex-1 p-2 rounded bg-green-600 text-white hover:bg-green-700 transition-all"
            >
              {loading ? 'Updating...' : 'Update'}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onClose}
              className="flex-1 p-2 rounded bg-gray-600 text-white hover:bg-gray-700 transition-all"
            >
              Cancel
            </motion.button>
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ModifyTPSLPopup;
