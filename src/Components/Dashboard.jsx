import React, { useState, useEffect } from 'react';
import TradingView from './TradingView';
import UpdateButton from './UpdateButton';

export default function Dashboard() {
    const [accountEquity, setAccountEquity] = useState(null);
    const [accountBalance, setAccountBalance] = useState(null);
    const [openTradesCount, setOpenTradesCount] = useState(0);
    const [apiStatus, setApiStatus] = useState('Checking...');
    const [refreshInterval, setRefreshInterval] = useState(5000);

    useEffect(() => {
        let isMounted = true;

        const loadSettings = async () => {
            const settings = await window.bybitAPI.getSettings();
            setRefreshInterval(settings.interval || 5000);
        };
        loadSettings();

        // API adatok frissítése
        const fetchAccountData = async () => {
            setApiStatus('Updating...');
            const result = await window.bybitAPI.getWalletBalance('UNIFIED');
            // console.log(result)

            if (result && !result.error) {
                setAccountEquity(result.totalEquity);
                setAccountBalance(result.totalAvailableBalance);
                setApiStatus('Connected ✅');
            } else {
                setApiStatus('Error ❌');
            }
        };

        // Nyitott tradek számának lekérése
        const fetchOpenTrades = async () => {
            const positions = await window.bybitAPI.fetchPositions();
            if (positions && !positions.error) {
                setOpenTradesCount(positions.length);
            } else {
                setOpenTradesCount(0);
            }
        };
        fetchAccountData();
        fetchOpenTrades();
        console.log(`API Refresh interval: ${refreshInterval}`);
        const interval = setInterval(() => {
            fetchAccountData();
            fetchOpenTrades();
        }, refreshInterval);

        return () => {
            isMounted = false;
            clearInterval(interval);
        };

    }, [refreshInterval])

    const formatNumber = (num) => {
        return num ? new Intl.NumberFormat('en-US', { minimumFractionDigits: 3, maximumFractionDigits: 3 }).format(num).replace(/,/g, ' ') : 'Loading...';
    };

    return (
        <div className="min-h-[calc(100vh-60px)] flex bg-gradient-to-r from-[#130f40] to-black text-primary-text overflow-hidden">
            {/* Sidebar */}
            <div className="w-64 p-4 bg-sidebar-bg border-r border-sidebar-border text-sidebar-text shadow-lg flex flex-col overflow-hidden">
                <h2 className="text-lg font-semibold text-primary-text text-center mb-4">Bybit API Status</h2>
                <div className={`p-2 text-center rounded ${apiStatus === 'Connected ✅' ? 'bg-success' : 'bg-error'}`}>
                    {apiStatus}
                </div>
                <div className='text-sm text-muted-text text-center mt-2'>
                    Refresh Interval: {refreshInterval / 1000} s
                </div>
                <div className="mt-6 bg-card-bg p-3 rounded border border-card-border">
                    <h3 className="text-sm font-semibold">Account Equity</h3>
                    <p className="text-lg">{formatNumber(accountEquity)} USDT</p>
                </div>

                <div className="mt-4 bg-card-bg p-3 rounded border border-card-border">
                    <h3 className="text-sm font-semibold">Available Balance</h3>
                    <p className="text-lg">{formatNumber(accountBalance)} USDT</p>
                </div>

                <div className="mt-6 bg-card-bg p-3 rounded border border-card-border">
                    <h3 className="text-sm font-semibold">Currently Open Trades</h3>
                    <p className="text-lg">{openTradesCount}</p>
                </div>

                <div className='flex justify-center mt-4'>
                    <UpdateButton className="" />
                </div>
            </div>

            {/* TradingView - jobb oldal */}
            <div className="flex-1 h-auto overflow-hidden flex flex-col">
                <TradingView />
            </div>
        </div>
    );
}
