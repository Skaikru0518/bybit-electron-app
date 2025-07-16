import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { stats } from '../mock/stats.js';
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

const Dashboard = () => {
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
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p
                className={`text-xs ${
                  stat.positive ? 'text-green-500' : 'text-red-500'
                }`}
              >
                {stat.change}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="flex flex-col w-full">
        <div className="flex w-full">
          <div className="w-full flex flex-col items-center justify-center">
            <p>W/L Ratio</p>
            <WinLossPieChart data={winLossData} />
          </div>
          <div className="w-full flex flex-col items-center justify-center">
            <p>Asset distribution</p>
            <AssetDistribuitonChart data={assetsData} />
          </div>
        </div>

        <PnLChart data={cumulativeData} />
        <PnLBarChart data={cumulativeData} />
        <VolumeChart data={VolumeData} />
      </div>

      {/* Tradingview Chart */}
    </div>
  );
};

export default Dashboard;
