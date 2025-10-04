import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

const COLORS = ['#10b981', '#ef4444']; // Win (green), Loss (red)

const WinLossPieChart = ({ data }) => {
  const pieData = useMemo(() => {
    let win = 0;
    let loss = 0;

    data?.forEach((trade) => {
      const pnl = parseFloat(trade.closedPnl);
      if (pnl > 0) win++;
      else if (pnl < 0) loss++;
    });

    const total = win + loss;
    return [
      { name: 'Win', value: total ? (win / total) * 100 : 0 },
      { name: 'Loss', value: total ? (loss / total) * 100 : 0 },
    ];
  }, [data]);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={pieData}
          cx="50%"
          cy="50%"
          outerRadius="60%"
          fill="#8884d8"
          dataKey={'value'}
          label={({ name, value }) => `${name}: ${value.toFixed(2)}%`}
          isAnimationActive={false}
        >
          {pieData?.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          position={{ x: 0, y: 0 }}
          allowEscapeViewBox={{ x: false, y: false }}
          wrapperStyle={{ zIndex: 1000 }}
          formatter={(value, name) => [`${value.toFixed(2)}%`, `${name}`]}
        />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default WinLossPieChart;
