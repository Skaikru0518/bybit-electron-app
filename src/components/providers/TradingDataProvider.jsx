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

  // Function to fetch all data
  const fetchAllData = useCallback(async () => {
    await Promise.all([fetchAccountBalance(), fetchTradesData()]);
  }, [fetchAccountBalance, fetchTradesData]);

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
