import { useMemo } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Area,
} from 'recharts';

const PnLChart = ({ data }) => {
  const chartData = useMemo(() => {
    // order by date
    const dailyPnL = {};

    data?.forEach((trade) => {
      const date = new Date(parseInt(trade.updatedTime))
        .toISOString()
        .split('T')[0]; // YYYY-MM-DD
      const pnl = parseFloat(trade.closedPnl);

      if (!dailyPnL[date]) {
        dailyPnL[date] = 0;
      }
      dailyPnL[date] += pnl;
    });

    // order by date and caluclations
    const sortedDates = Object.keys(dailyPnL).sort();
    let cumulativePnL = 0;

    return sortedDates.map((date) => {
      cumulativePnL += dailyPnL[date];
      return {
        date: date,
        daily: dailyPnL[date],
        cumulative: cumulativePnL,
      };
    });
  }, [data]);

  return (
    <ResponsiveContainer width={'100%'} height={350}>
      <AreaChart data={chartData}>
        <CartesianGrid strokeDasharray={'0, 0'} />
        <XAxis
          dataKey={'date'}
          tickFormatter={(value) => new Date(value).toLocaleDateString()}
        />
        <YAxis />
        <Tooltip
          formatter={(value) => [`$${value.toFixed(2)}`, 'Cumulative P&L']}
          contentStyle={{
            color: '#1e293b',
            background: '#fff',
            border: '1px solid #e5e7eb',
          }}
        />
        <Area
          type={'monotone'}
          dataKey={'cumulative'}
          stroke="#3b82f6"
          fill="#3b82f6"
          fillOpacity={0.3}
          isAnimationActive={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default PnLChart;
