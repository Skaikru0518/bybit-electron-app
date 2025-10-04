import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import WinLossPieChart from '../reusable/charts/WinLossPieChart';
import VolumeChart from '../reusable/charts/VolumeChart';
import AssetDistribuitonChart from '../reusable/charts/AssetDistributionChart';
import SimplePieChart from '../reusable/charts/SimplePieChart';
import PnLChart from '../reusable/charts/PnLChart';
import PnLBarChart from '../reusable/charts/PnLBarChart';
import { useTradingData } from '../providers/TradingDataProvider';
import { Activity, DollarSign, TrendingDown, TrendingUp } from 'lucide-react';

const Dashboard = () => {
  const {
    walletBalance,
    tradesData,
    closedPnl,
    longTermClosedPnl,
    todayClosedPnl,
  } = useTradingData();

  // Calculate Today's P&L percentage
  const todaysPnlPercentage =
    walletBalance.totalWalletBalance > 0
      ? (
          (todayClosedPnl / parseFloat(walletBalance.totalWalletBalance)) *
          100
        ).toFixed(2)
      : '0.00';

  // Calculate Overall P&L (60 days total)
  const overallPnl = useMemo(() => {
    if (!longTermClosedPnl || longTermClosedPnl.length === 0) return 0;
    return longTermClosedPnl.reduce(
      (sum, trade) => sum + parseFloat(trade.closedPnl || 0),
      0
    );
  }, [longTermClosedPnl]);

  const overallPnlPercentage =
    walletBalance.totalWalletBalance > 0
      ? ((overallPnl / parseFloat(walletBalance.totalWalletBalance)) * 100).toFixed(2)
      : '0.00';

  // Calculate asset distribution from wallet coins
  const assetDistribution = useMemo(() => {
    if (!walletBalance.coins || walletBalance.coins.length === 0) return [];

    const totalEquity = parseFloat(walletBalance.totalEquity) || 1;

    return walletBalance.coins
      .map((coin) => {
        const equity = parseFloat(coin.equity) || 0;
        const percentage = (equity / totalEquity) * 100;

        return {
          name: coin.coin,
          value: parseFloat(percentage.toFixed(2)),
          amount: `$${equity.toLocaleString()}`,
        };
      })
      .filter((asset) => asset.value > 0) // Only show assets with value
      .sort((a, b) => b.value - a.value); // Sort by percentage descending
  }, [walletBalance.coins, walletBalance.totalEquity]);

  // Calculate daily PnL for bar chart (60 days)
  const dailyPnlData = useMemo(() => {
    if (!longTermClosedPnl || longTermClosedPnl.length === 0) return [];

    const dailyPnL = {};

    longTermClosedPnl.forEach((trade) => {
      const date = new Date(parseInt(trade.updatedTime))
        .toISOString()
        .split('T')[0];
      const pnl = parseFloat(trade.closedPnl);

      if (!dailyPnL[date]) {
        dailyPnL[date] = 0;
      }
      dailyPnL[date] += pnl;
    });

    return Object.keys(dailyPnL)
      .sort()
      .map((date) => ({
        date,
        pnl: dailyPnL[date],
      }));
  }, [longTermClosedPnl]);

  // Calculate daily volume for volume chart (60 days)
  const volumeData = useMemo(() => {
    if (!longTermClosedPnl || longTermClosedPnl.length === 0) return [];

    const dailyVolume = {};

    longTermClosedPnl.forEach((trade) => {
      const date = new Date(parseInt(trade.updatedTime))
        .toISOString()
        .split('T')[0];
      const qty = parseFloat(trade.qty) || 0;
      const avgPrice = parseFloat(trade.avgExitPrice) || 0;
      const volume = qty * avgPrice;

      if (!dailyVolume[date]) {
        dailyVolume[date] = 0;
      }
      dailyVolume[date] += volume;
    });

    return Object.keys(dailyVolume)
      .sort()
      .map((date) => ({
        date,
        volume: dailyVolume[date],
      }));
  }, [longTermClosedPnl]);

  // Calculate Long vs Short distribution
  const longShortData = useMemo(() => {
    if (!longTermClosedPnl || longTermClosedPnl.length === 0) return [];

    let longCount = 0;
    let shortCount = 0;

    longTermClosedPnl.forEach((trade) => {
      if (trade.side === 'Buy') {
        longCount++;
      } else if (trade.side === 'Sell') {
        shortCount++;
      }
    });

    const total = longCount + shortCount;
    return [
      {
        name: 'Long',
        value: total ? parseFloat(((longCount / total) * 100).toFixed(2)) : 0,
        count: longCount,
      },
      {
        name: 'Short',
        value: total ? parseFloat(((shortCount / total) * 100).toFixed(2)) : 0,
        count: shortCount,
      },
    ];
  }, [longTermClosedPnl]);

  // Calculate Profit by Symbol (top 5)
  const profitBySymbol = useMemo(() => {
    if (!longTermClosedPnl || longTermClosedPnl.length === 0) return [];

    const symbolPnl = {};

    longTermClosedPnl.forEach((trade) => {
      const symbol = trade.symbol || 'Unknown';
      const pnl = parseFloat(trade.closedPnl) || 0;

      if (!symbolPnl[symbol]) {
        symbolPnl[symbol] = 0;
      }
      symbolPnl[symbol] += pnl;
    });

    // Get top 5 symbols by absolute profit/loss
    const sorted = Object.entries(symbolPnl)
      .sort(([, a], [, b]) => Math.abs(b) - Math.abs(a))
      .slice(0, 5);

    const totalAbsolute = sorted.reduce(
      (sum, [, pnl]) => sum + Math.abs(pnl),
      0
    );

    return sorted.map(([symbol, pnl]) => ({
      name: symbol.replace('USDT', ''),
      value:
        totalAbsolute > 0
          ? parseFloat(((Math.abs(pnl) / totalAbsolute) * 100).toFixed(2))
          : 0,
      amount: `$${pnl.toFixed(2)}`,
      pnl: pnl,
    }));
  }, [longTermClosedPnl]);

  const stats = [
    {
      title: 'Total Equity',
      value: walletBalance.totalEquity,
      formatted: '$ ' + walletBalance.totalEquity.toLocaleString(),
      icon: DollarSign,
    },
    {
      title: 'Unrealized P&L',
      value: walletBalance.totalPerpUPL,
      formatted: '$ ' + walletBalance.totalPerpUPL.toLocaleString(),
      percentage: walletBalance.totalWalletBalance > 0
        ? ((walletBalance.totalPerpUPL / walletBalance.totalWalletBalance) * 100).toFixed(2) + ' %'
        : '0.00 %',
      icon: walletBalance.totalPerpUPL >= 0 ? TrendingUp : TrendingDown,
    },
    {
      title: 'Open Positions',
      value: tradesData?.length || 0,
      formatted: tradesData?.length || 0,
      icon: Activity,
    },
    {
      title: "Today's Closed P&L",
      value: todayClosedPnl,
      formatted: '$ ' + todayClosedPnl.toLocaleString(),
      percentage: todaysPnlPercentage + ' %',
      icon: todayClosedPnl >= 0 ? TrendingUp : TrendingDown,
    },
    {
      title: 'Overall P&L (60 days)',
      value: overallPnl,
      formatted: '$ ' + overallPnl.toLocaleString(),
      percentage: overallPnlPercentage + ' %',
      icon: overallPnl >= 0 ? TrendingUp : TrendingDown,
    },
  ];

  return (
    <div className="flex-1 space-y-6 p-6 w-full">
      <div className="flex items-center justify-between w-full">
        <h2 className="text-3xl font-bold tracking-tight">Trading Dashboard</h2>
        <Badge className="gap-2" variant="outline">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          Live market data
        </Badge>
      </div>

      {/* stat cards */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 w-full">
        {stats.map((stat, idx) => (
          <Card key={idx}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.formatted}</div>
              {stat.percentage && (
                <p
                  className={`text-xs ${
                    stat.value >= 0 ? 'text-green-500' : 'text-red-500'
                  }`}
                >
                  {stat.percentage}
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pie Charts Grid - 1x4 */}
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4 w-full">
        {/* Win/Loss Ratio */}
        <Card>
          <CardHeader>
            <CardTitle>Win/Loss Ratio (60 days)</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center">
            <WinLossPieChart data={longTermClosedPnl} />
          </CardContent>
        </Card>

        {/* Long vs Short */}
        <Card>
          <CardHeader>
            <CardTitle>Long vs Short (60 days)</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center">
            <SimplePieChart
              data={longShortData}
              colors={['#10b981', '#ef4444']}
            />
          </CardContent>
        </Card>

        {/* Asset Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Asset Distribution</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center">
            <AssetDistribuitonChart data={assetDistribution} />
          </CardContent>
        </Card>

        {/* Profit by Symbol */}
        <Card>
          <CardHeader>
            <CardTitle>Top 5 Symbols by P&L (60 days)</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center">
            <SimplePieChart data={profitBySymbol} />
          </CardContent>
        </Card>
      </div>

      {/* Line & Bar Charts Grid */}
      <div className="grid gap-6 md:grid-cols-2 w-full">
        {/* Cumulative PnL - Full Width */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Cumulative P&L (60 days)</CardTitle>
          </CardHeader>
          <CardContent>
            <PnLChart data={longTermClosedPnl} />
          </CardContent>
        </Card>

        {/* Daily PnL */}
        <Card>
          <CardHeader>
            <CardTitle>Daily P&L (60 days)</CardTitle>
          </CardHeader>
          <CardContent>
            <PnLBarChart data={dailyPnlData} />
          </CardContent>
        </Card>

        {/* Daily Volume */}
        <Card>
          <CardHeader>
            <CardTitle>Daily Volume (60 days)</CardTitle>
          </CardHeader>
          <CardContent>
            <VolumeChart data={volumeData} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
