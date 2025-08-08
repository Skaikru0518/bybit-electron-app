import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import {
  assetsData,
  cumulativeData,
  VolumeData,
  winLossData,
} from '../mock/chartData.js';
import WinLossPieChart from '../reusable/charts/WinLossPieChart';
import VolumeChart from '../reusable/charts/VolumeChart';
import AssetDistribuitonChart from '../reusable/charts/AssetDistributionChart';
import PnLChart from '../reusable/charts/PnLChart';
import PnLBarChart from '../reusable/charts/PnLBarChart';
import { useTradingData } from '../providers/TradingDataProvider';
import { Activity, DollarSign, TrendingDown, TrendingUp } from 'lucide-react';

const Dashboard = () => {
  const { walletBalance, tradesData, yesterdaysEquity } = useTradingData();
  const [closedPnl, setClosedPnl] = useState([]);
  const stats = [
    {
      title: 'Total Balance',
      data: '$ ' + walletBalance.totalAvailableBalance.toLocaleString(),
      icon: DollarSign,
    },
    {
      title: 'Unrealized P&L',
      data: '$ ' + walletBalance.totalPerpUPL.toLocaleString(),
      pnl: walletBalance.totalPerpUPL,
      icon: TrendingUp,
    },
    { title: 'Open Positions', data: tradesData?.length, icon: Activity },
    {
      title: "Today's P&L",
      data:
        '$ ' +
        (
          parseFloat(walletBalance.totalEquity) - parseFloat(yesterdaysEquity)
        ).toLocaleString(),
      todayPnL:
        (
          ((parseFloat(walletBalance.totalEquity) -
            parseFloat(yesterdaysEquity)) /
            parseFloat(yesterdaysEquity)) *
          100
        ).toFixed(2) + ' %',
      icon: TrendingDown,
    },
  ];

  useEffect(() => {
    const getClosedPnl = async () => {
      try {
        const response = await window.api.getClosedPnl('linear');
        setClosedPnl(response.list);
      } catch (error) {
        console.error('Failed to fetch closed pnl data', error);
      }
    };
    getClosedPnl();
  }, []);

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
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 w-full">
        {stats.map((stat, idx) => (
          <Card key={idx}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.data}</div>
              <p
                className={`text-xs ${
                  stat.pnl >= 0 ? 'text-green-500' : 'text-red-500'
                }`}
              >
                {stat.todayPnL}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex flex-col w-full">
        <div className="flex w-full">
          <div className="w-full flex flex-col items-center justify-center">
            <p className="text-2xl font-semibold">Last 7 days W/L Ratio</p>
            <WinLossPieChart data={closedPnl} />
          </div>
          <div className="w-full flex flex-col items-center justify-center">
            <p>Asset distribution</p>
            <AssetDistribuitonChart data={assetsData} />
          </div>
        </div>
        <div className="w-full flex flex-col items-center justify-center space-y-5">
          <h1 className="text-2xl font-semibold">Cumulative PnL</h1>
          <PnLChart data={closedPnl} />
        </div>
        <div className="flex w-full">
          <div className="w-1/2 flex flex-col items-center justify-center">
            <p className="text-2xl font-semibold">PnL Barchart</p>
            <PnLBarChart data={cumulativeData} />
          </div>
          <div className="w-1/2 flex flex-col items-center justify-center">
            <p className="text-2xl font-semibold">Volume</p>
            <VolumeChart data={VolumeData} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
