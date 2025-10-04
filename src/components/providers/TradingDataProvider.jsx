import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from 'react';

const TradingDataContext = createContext();

export function TradingDataProvider({ children }) {
  const [walletBalance, setWalletBalance] = useState({
    totalEquity: 0,
    totalWalletBalance: 0,
    totalAvailableBalance: 0,
    totalPerpUPL: 0,
    accountType: '',
    coins: [],
  });

  const [isConnected, setIsConnected] = useState(false);
  const [tradesData, setTradesData] = useState([]);
  const [orderBookData, setOrderBookData] = useState([]);
  const [closedPnl, setClosedPnl] = useState([]);
  const [longTermClosedPnl, setLongTermClosedPnl] = useState([]);
  const [todayClosedPnl, setTodayClosedPnl] = useState(0);
  const [refreshInterval, setRefreshInterval] = useState(5000); // Default 5 seconds
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);

  // Load refresh interval from Electron store on mount
  useEffect(() => {
    const loadRefreshInterval = async () => {
      try {
        const storedInterval = await window.api?.getStore('refreshInterval');
        if (storedInterval) {
          setRefreshInterval(parseInt(storedInterval));
        }
      } catch (error) {
        console.warn('Failed to load refresh interval from store:', error);
      }
    };
    loadRefreshInterval();
  }, []);

  // Function to fetch account balance
  const fetchAccountBalance = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await window.api?.getWalletBalance('unified');

      if (response && response.list && response.list[0]) {
        const walletData = response.list[0];
        setWalletBalance({
          totalEquity: parseFloat(walletData.totalEquity) || 0,
          totalWalletBalance: parseFloat(walletData.totalWalletBalance) || 0,
          totalAvailableBalance:
            parseFloat(walletData.totalAvailableBalance) || 0,
          totalPerpUPL: parseFloat(walletData.totalPerpUPL) || 0,
          accountType: walletData.accountType || '',
          coins: walletData.coin || [],
        });
        setIsConnected(true);
      } else {
        setIsConnected(false);
      }
    } catch (error) {
      console.error('Failed to fetch account balance:', error);
      setIsConnected(false);
    } finally {
      setIsLoading(false);
      setLastUpdated(new Date());
    }
  }, []);

  // Function to fetch trades data
  const fetchTradesData = useCallback(async () => {
    try {
      const trades = await window.api?.getAllPositions?.('linear', 'USDT');
      if (trades) {
        setTradesData(trades.list);
      }
    } catch (error) {
      console.error('Failed to fetch trades data:', error);
    }
  }, []);

  // Function to fetch order book
  const fetchOrderBookData = useCallback(async () => {
    try {
      const orders = await window.api?.getAllOrders('linear', 'USDT');
      if (orders) {
        setOrderBookData(orders.list);
      }
    } catch (error) {
      console.error('Failed to fetch orderbook:', error);
    }
  }, []);

  // Function to fetch closed PnL (last 7 days for charts)
  const fetchClosedPnl = useCallback(async () => {
    try {
      const response = await window.api?.getClosedPnl('linear');
      if (response?.list) {
        setClosedPnl(response.list);
      }
    } catch (error) {
      console.error('Failed to fetch closed pnl data:', error);
    }
  }, []);

  // Function to fetch today's closed PnL
  const fetchTodayClosedPnl = useCallback(async () => {
    try {
      // Get today's start time (midnight local time)
      const now = new Date();
      const todayStart = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        0,
        0,
        0,
        0
      );
      const startTime = todayStart.getTime();
      const endTime = Date.now();

      // Fetch today's closed PnL from API
      const response = await window.api?.getClosedPnl(
        'linear',
        startTime,
        endTime
      );

      // Sum up all closed PnL for today
      if (response?.list && response.list.length > 0) {
        const totalPnl = response.list.reduce(
          (sum, trade) => sum + parseFloat(trade.closedPnl || 0),
          0
        );
        setTodayClosedPnl(totalPnl);
      } else {
        setTodayClosedPnl(0);
      }
    } catch (error) {
      console.error('Failed to fetch today closed pnl data:', error);
      setTodayClosedPnl(0);
    }
  }, []);

  // Function to fetch long-term closed PnL (60 days)
  const fetchLongTermClosedPnl = useCallback(async () => {
    try {
      const allTrades = [];
      const now = Date.now();
      const daysToFetch = 60;
      const batchSizeDays = 7; // Bybit API limit
      const batches = Math.ceil(daysToFetch / batchSizeDays);

      // Fetch data in 7-day batches going backwards
      for (let i = 0; i < batches; i++) {
        const endTime = now - i * batchSizeDays * 24 * 60 * 60 * 1000;
        const startTime = endTime - batchSizeDays * 24 * 60 * 60 * 1000;

        try {
          const response = await window.api?.getClosedPnl(
            'linear',
            startTime,
            endTime
          );

          if (response?.list && response.list.length > 0) {
            allTrades.push(...response.list);
          }
        } catch (batchError) {
          console.error(`Failed to fetch batch ${i + 1}:`, batchError);
        }

        // Small delay to avoid rate limiting
        if (i < batches - 1) {
          await new Promise((resolve) => setTimeout(resolve, 100));
        }
      }

      setLongTermClosedPnl(allTrades);
    } catch (error) {
      console.error('Failed to fetch long-term closed pnl data:', error);
      setLongTermClosedPnl([]);
    }
  }, []);

  // Function to fetch all data
  const fetchAllData = useCallback(async () => {
    await Promise.all([
      fetchAccountBalance(),
      fetchTradesData(),
      fetchOrderBookData(),
      fetchClosedPnl(),
      fetchTodayClosedPnl(),
    ]);
  }, [
    fetchAccountBalance,
    fetchTradesData,
    fetchOrderBookData,
    fetchClosedPnl,
    fetchTodayClosedPnl,
  ]);

  // Function to update refresh interval
  const updateRefreshInterval = useCallback(async (newInterval) => {
    try {
      await window.api?.setStore('refreshInterval', newInterval.toString());
      setRefreshInterval(newInterval);
    } catch (error) {
      console.error('Failed to save refresh interval:', error);
    }
  }, []);

  // Fetch long-term data once on mount (doesn't refresh automatically)
  useEffect(() => {
    fetchLongTermClosedPnl();
  }, [fetchLongTermClosedPnl]);

  // Set up interval for real-time updates
  useEffect(() => {
    fetchAllData();
    const interval = setInterval(fetchAllData, refreshInterval);
    return () => clearInterval(interval);
  }, [refreshInterval, fetchAllData]);

  // Manual refresh function
  const refreshData = useCallback(() => {
    fetchAllData();
  }, [fetchAllData]);

  const value = {
    // Data
    walletBalance,
    tradesData,
    orderBookData,
    closedPnl,
    longTermClosedPnl,
    todayClosedPnl,
    isConnected,

    // State
    isLoading,
    lastUpdated,
    refreshInterval,

    // Actions
    refreshData,
    updateRefreshInterval,

    // Individual fetch functions
    fetchAccountBalance,
    fetchTradesData,
    fetchClosedPnl,
    fetchTodayClosedPnl,
    fetchLongTermClosedPnl,
  };

  return (
    <TradingDataContext.Provider value={value}>
      {children}
    </TradingDataContext.Provider>
  );
}

export function useTradingData() {
  const context = useContext(TradingDataContext);
  if (context === undefined) {
    throw new Error('useTradingData must be used within a TradingDataProvider');
  }
  return context;
}
