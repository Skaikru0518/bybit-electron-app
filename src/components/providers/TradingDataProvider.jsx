import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from 'react';

const TradingDataContext = createContext();

export function TradingDataProvider({ children }) {
  const [accountData, setAccountData] = useState({
    balance: 0,
    unrealizedPnl: 0,
    todaysPnl: 0,
    isConnected: false,
  });

  const [tradesData, setTradesData] = useState([]);
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

  // Function to fetch account data
  const fetchAccountData = useCallback(async () => {
    try {
      setIsLoading(true);
      // This will be replaced with actual API call
      const accountInfo = await window.api?.getAccountInfo?.();
      if (accountInfo) {
        setAccountData({
          balance: accountInfo.balance || 0,
          unrealizedPnl: accountInfo.unrealizedPnl || 0,
          todaysPnl: accountInfo.todaysPnl || 0,
          isConnected: accountInfo.isConnected || false,
        });
      }
    } catch (error) {
      console.error('Failed to fetch account data:', error);
      setAccountData((prev) => ({ ...prev, isConnected: false }));
    } finally {
      setIsLoading(false);
      setLastUpdated(new Date());
    }
  }, []);

  // Function to fetch trades data
  const fetchTradesData = useCallback(async () => {
    try {
      // This will be replaced with actual API call
      const trades = await window.api?.getTrades?.();
      if (trades) {
        setTradesData(trades);
      }
    } catch (error) {
      console.error('Failed to fetch trades data:', error);
    }
  }, []);

  // Function to fetch all data
  const fetchAllData = useCallback(async () => {
    await Promise.all([fetchAccountData(), fetchTradesData()]);
  }, [fetchAccountData, fetchTradesData]);

  // Function to update refresh interval
  const updateRefreshInterval = useCallback(async (newInterval) => {
    try {
      await window.api?.setStore('refreshInterval', newInterval.toString());
      setRefreshInterval(newInterval);
    } catch (error) {
      console.error('Failed to save refresh interval:', error);
    }
  }, []);

  // Set up interval for real-time updates
  useEffect(() => {
    // Initial fetch
    fetchAllData();

    // Set up interval
    const interval = setInterval(fetchAllData, refreshInterval);

    return () => clearInterval(interval);
  }, [refreshInterval, fetchAllData]);

  // Manual refresh function
  const refreshData = useCallback(() => {
    fetchAllData();
  }, [fetchAllData]);

  const value = {
    // Data
    accountData,
    tradesData,

    // State
    isLoading,
    lastUpdated,
    refreshInterval,

    // Actions
    refreshData,
    updateRefreshInterval,

    // Individual fetch functions
    fetchAccountData,
    fetchTradesData,
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
