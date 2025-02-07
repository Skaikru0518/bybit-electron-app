import React, { useState } from 'react';

// Entry Calculator Component
const EntryCalculator = () => {
    const [currentPositionSize, setCurrentPositionSize] = useState('');
    const [firstEntryPrice, setFirstEntryPrice] = useState('');
    const [newPositionSize, setNewPositionSize] = useState('');
    const [newEntryPrice, setNewEntryPrice] = useState('');
    const [averageEntryPrice, setAverageEntryPrice] = useState(null);

    const calculateAverageEntry = () => {
        if (!currentPositionSize || !firstEntryPrice || !newPositionSize || !newEntryPrice) {
            alert("Please fill in all fields with valid numbers.");
            return;
        }

        const totalInvestment = (parseFloat(currentPositionSize) * parseFloat(firstEntryPrice)) +
            (parseFloat(newPositionSize) * parseFloat(newEntryPrice));
        const totalSize = parseFloat(currentPositionSize) + parseFloat(newPositionSize);

        if (totalSize === 0) {
            alert("Total position size cannot be zero.");
            return;
        }

        const averagePrice = totalInvestment / totalSize;
        setAverageEntryPrice(averagePrice.toFixed(2));
    };

    return (
        <div className="bg-card-bg p-6 rounded-lg shadow-lg mb-8 flex flex-col w-[400px]">
            <h2 className="text-xl font-semibold text-center mb-4 text-white">Entry Calculator</h2>
            <input
                type="number"
                placeholder="Current Position Size"
                value={currentPositionSize}
                onChange={(e) => setCurrentPositionSize(e.target.value)}
                className="w-full p-3 mb-4 bg-gray-800 text-primary-text rounded"
            />
            <input
                type="number"
                placeholder="First Entry Price"
                value={firstEntryPrice}
                onChange={(e) => setFirstEntryPrice(e.target.value)}
                className="w-full p-3 mb-4 bg-gray-800 text-primary-text rounded"
            />
            <input
                type="number"
                placeholder="New Position Size"
                value={newPositionSize}
                onChange={(e) => setNewPositionSize(e.target.value)}
                className="w-full p-3 mb-4 bg-gray-800 text-primary-text rounded"
            />
            <input
                type="number"
                placeholder="New Entry Price"
                value={newEntryPrice}
                onChange={(e) => setNewEntryPrice(e.target.value)}
                className="w-full p-3 mb-4 bg-gray-800 text-primary-text rounded"
            />
            <button
                onClick={calculateAverageEntry}
                className="w-full p-3 bg-btn rounded-lg text-primary-text hover:bg-btn-hover transition-all duration-300"
            >
                Calculate
            </button>
            {averageEntryPrice && <p className="mt-4 text-center text-white">New Average Entry Price: {averageEntryPrice} USDT</p>}
        </div>
    );
};

// TP/SL Calculator Component
const TPSLCalculator = () => {
    const [entryPrice, setEntryPrice] = useState('');
    const [investedAmount, setInvestedAmount] = useState('');
    const [leverage, setLeverage] = useState('');
    const [riskRewardRatio, setRiskRewardRatio] = useState('');
    const [takeProfitPercent, setTakeProfitPercent] = useState('');
    const [stopLossPercent, setStopLossPercent] = useState('');
    const [results, setResults] = useState(null);

    const calculateTPSL = () => {
        if (!entryPrice || !investedAmount || !leverage || !riskRewardRatio || (!takeProfitPercent && !stopLossPercent)) {
            alert("Please fill in all required fields with valid numbers.");
            return;
        }

        const positionSize = parseFloat(investedAmount) * parseFloat(leverage);
        const coinsPurchased = positionSize / parseFloat(entryPrice);

        let tpPrice, slPrice;

        if (takeProfitPercent) {
            tpPrice = parseFloat(entryPrice) * (1 + parseFloat(takeProfitPercent) / 100);
            slPrice = parseFloat(entryPrice) * (1 - (parseFloat(takeProfitPercent) / riskRewardRatio) / 100);
        } else if (stopLossPercent) {
            slPrice = parseFloat(entryPrice) * (1 - parseFloat(stopLossPercent) / 100);
            tpPrice = parseFloat(entryPrice) * (1 + (parseFloat(stopLossPercent) * riskRewardRatio) / 100);
        }

        if (tpPrice <= 0 || slPrice <= 0) {
            alert("Invalid TP/SL calculation. Check your inputs.");
            return;
        }

        const maxProfit = (tpPrice - parseFloat(entryPrice)) * coinsPurchased;
        const maxLoss = (parseFloat(entryPrice) - slPrice) * coinsPurchased;

        setResults({
            tpPrice: tpPrice.toFixed(2),
            slPrice: slPrice.toFixed(2),
            coinsPurchased: coinsPurchased.toFixed(4),
            maxProfit: maxProfit.toFixed(2),
            maxLoss: maxLoss.toFixed(2)
        });
    };

    return (
        <div className="bg-card-bg p-6 rounded-lg shadow-lg mb-8 flex flex-col w-[400px]">
            <h2 className="text-xl font-semibold text-center mb-4 text-white">TP/SL Calculator</h2>
            <input
                type="number"
                placeholder="Entry Price"
                value={entryPrice}
                onChange={(e) => setEntryPrice(e.target.value)}
                className="w-full p-3 mb-4 bg-gray-800 text-primary-text rounded"
            />
            <input
                type="number"
                placeholder="Invested Amount"
                value={investedAmount}
                onChange={(e) => setInvestedAmount(e.target.value)}
                className="w-full p-3 mb-4 bg-gray-800 text-primary-text rounded"
            />
            <input
                type="number"
                placeholder="Leverage"
                value={leverage}
                onChange={(e) => setLeverage(e.target.value)}
                className="w-full p-3 mb-4 bg-gray-800 text-primary-text rounded"
            />
            <input
                type="number"
                placeholder="Risk/Reward Ratio"
                value={riskRewardRatio}
                onChange={(e) => setRiskRewardRatio(e.target.value)}
                className="w-full p-3 mb-4 bg-gray-800 text-primary-text rounded"
            />
            <input
                type="number"
                placeholder="Take Profit % (optional)"
                value={takeProfitPercent}
                onChange={(e) => setTakeProfitPercent(e.target.value)}
                className="w-full p-3 mb-4 bg-gray-800 text-primary-text rounded"
            />
            <input
                type="number"
                placeholder="Stop Loss % (optional)"
                value={stopLossPercent}
                onChange={(e) => setStopLossPercent(e.target.value)}
                className="w-full p-3 mb-4 bg-gray-800 text-primary-text rounded"
            />
            <p className="text-sm text-center text-muted-text mb-4">Either TP or SL is required to be filled, the other can be calculated from RR.</p>
            <button
                onClick={calculateTPSL}
                className="w-full p-3 bg-btn rounded-lg text-primary-text hover:bg-btn-hover transition-all duration-300"
            >
                Calculate
            </button>
            {results && (
                <div className="mt-4 text-center text-white">
                    <p>TP Price: {results.tpPrice} USDT</p>
                    <p>SL Price: {results.slPrice} USDT</p>
                    <p>Coins Purchased: {results.coinsPurchased}</p>
                    <p>Max Profit: {results.maxProfit} USDT</p>
                    <p>Max Loss: {results.maxLoss} USDT</p>
                </div>
            )}
        </div>
    );
};

// Order By Value Calculator Component
const OrderByValueCalculator = () => {
    const [entryPrice, setEntryPrice] = useState('');
    const [maxLoss, setMaxLoss] = useState('');
    const [leverage, setLeverage] = useState('');
    const [slPrice, setSlPrice] = useState('');
    const [orderValue, setOrderValue] = useState(null);
    const [marginRequired, setMarginRequired] = useState(null);

    const calculateOrderByValue = () => {
        const entry = parseFloat(entryPrice);
        const loss = parseFloat(maxLoss);
        const lev = parseFloat(leverage);
        const stopLoss = parseFloat(slPrice);

        if (isNaN(entry) || isNaN(loss) || isNaN(lev) || isNaN(stopLoss)) {
            alert("Please enter valid numeric values.");
            return;
        }

        const perUnitLoss = entry - stopLoss;
        if (perUnitLoss === 0) {
            alert("Stop-loss price cannot be equal to the entry price.");
            return;
        }

        const positionSize = loss / perUnitLoss;
        const totalOrderValue = +(positionSize * entry).toFixed(3);
        const requiredMargin = +(totalOrderValue / lev).toFixed(3);

        setOrderValue(totalOrderValue);
        setMarginRequired(requiredMargin);
    };

    return (
        <div className="bg-card-bg p-6 rounded-lg shadow-lg mb-8 flex flex-col w-[400px]">
            <h2 className="text-xl font-semibold text-center mb-4 text-white">Order by Value Calculator</h2>
            <input
                type="number"
                placeholder="Entry Price"
                value={entryPrice}
                onChange={(e) => setEntryPrice(e.target.value)}
                className="w-full p-3 mb-4 bg-gray-800 text-primary-text rounded"
            />
            <input
                type="number"
                placeholder="Max Loss"
                value={maxLoss}
                onChange={(e) => setMaxLoss(e.target.value)}
                className="w-full p-3 mb-4 bg-gray-800 text-primary-text rounded"
            />
            <input
                type="number"
                placeholder="Leverage"
                value={leverage}
                onChange={(e) => setLeverage(e.target.value)}
                className="w-full p-3 mb-4 bg-gray-800 text-primary-text rounded"
            />
            <input
                type="number"
                placeholder="Stop Loss Price"
                value={slPrice}
                onChange={(e) => setSlPrice(e.target.value)}
                className="w-full p-3 mb-4 bg-gray-800 text-primary-text rounded"
            />
            <button
                onClick={calculateOrderByValue}
                className="w-full p-3 bg-btn rounded-lg text-primary-text hover:bg-btn-hover transition-all duration-300"
            >
                Calculate
            </button>
            {orderValue !== null && marginRequired !== null && (
                <div className="mt-4 text-center text-white">
                    <p>Order Value: {orderValue} USDT</p>
                    <p>Required Margin: {marginRequired} USDT</p>
                </div>
            )}
        </div>
    );
};

// Fő Calculator komponens
const Calculator = () => {
    const [activeCalculator, setActiveCalculator] = useState('entry');

    return (
        <div className="bg-gradient-to-r from-[#130f40] to-black text-primary-text p-6 w-full min-h-[calc(100vh-60px)] flex flex-col items-center">
            <h1 className="text-3xl text-center mb-6">Calculators</h1>
            {/* Navigációs gombok */}
            <div className="calculator-nav flex justify-center space-x-4 mb-8">
                <button
                    className={`p-3 ${activeCalculator === 'entry' ? 'bg-btn' : 'bg-gray-800'} rounded-lg text-primary-text hover:bg-btn-hover transition-all`}
                    onClick={() => setActiveCalculator('entry')}
                >
                    Entry Calculator
                </button>
                <button
                    className={`p-3 ${activeCalculator === 'tpsl' ? 'bg-btn' : 'bg-gray-800'} rounded-lg text-primary-text hover:bg-btn-hover transition-all`}
                    onClick={() => setActiveCalculator('tpsl')}
                >
                    TP/SL Calculator
                </button>
                <button
                    className={`p-3 ${activeCalculator === 'order' ? 'bg-btn' : 'bg-gray-800'} rounded-lg text-primary-text hover:bg-btn-hover transition-all`}
                    onClick={() => setActiveCalculator('order')}
                >
                    Order by Value Calculator
                </button>
            </div>

            {/* Aktív kalkulátor megjelenítése */}
            <div className="calculator-content">{activeCalculator === 'entry' && <EntryCalculator />}</div>
            <div className="calculator-content">{activeCalculator === 'tpsl' && <TPSLCalculator />}</div>
            <div className="calculator-content">{activeCalculator === 'order' && <OrderByValueCalculator />}</div>
        </div>
    );
};

export default Calculator;
