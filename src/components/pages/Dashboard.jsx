import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { TrendingUp, TrendingDown, DollarSign, Activity } from 'lucide-react';

const Dashboard = () => {
  const stats = [
    {
      title: 'Total Balance',
      value: '$12,345.67',
      change: '+2.5%',
      icon: DollarSign,
      positive: true,
    },
    {
      title: 'Unrealized P&L',
      value: '+$234.56',
      change: '+5.2%',
      icon: TrendingUp,
      positive: true,
    },
    {
      title: 'Open Positions',
      value: '3',
      change: 'Active',
      icon: Activity,
      positive: true,
    },
    {
      title: "Today's P&L",
      value: '-$45.23',
      change: '-1.2%',
      icon: TrendingDown,
      positive: false,
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

      {/* Tradingview Chart */}
    </div>
  );
};

export default Dashboard;
