import React, { useState } from 'react';
import './App.css';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './components/providers/ThemeProvider';
import { Toaster } from './components/ui/sonner';
import Sidebar from './components/parts/sidebar';
import Trades from './components/pages/Trades';
import Settings from './components/pages/Settings';
import Dashboard from './components/pages/Dashboard';
import Tradingview from './components/pages/Tradingview';
import { TradingDataProvider } from './components/providers/TradingDataProvider';

const App = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <ThemeProvider defaultTheme="dark" storageKey="crypto-trading-theme">
      <TradingDataProvider>
        <Router>
          <div className="flex h-screen w-full bg-background text-foreground">
            <Sidebar
              open={sidebarOpen}
              onToggle={() => setSidebarOpen(!sidebarOpen)}
            />
            <main className="flex-1 overflow-auto w-full">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/tradingview" element={<Tradingview />} />
                <Route path="/trades" element={<Trades />} />
                <Route path="/settings" element={<Settings />} />
              </Routes>
            </main>
          </div>
          <Toaster richColors closeButton />
        </Router>
      </TradingDataProvider>
    </ThemeProvider>
  );
};
export default App;
