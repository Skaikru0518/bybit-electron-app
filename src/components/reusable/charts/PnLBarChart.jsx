import React from 'react';
import {
  Bar,
  Cell,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

const PnLBarChart = ({ data }) => {
  return (
    <ResponsiveContainer width={'100%'} height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray={'0 0'} />
        <XAxis
          dataKey={'date'}
          tickFormatter={(value) => new Date(value).toLocaleDateString()}
        />
        <YAxis />
        <Tooltip
          formatter={(value) => [`$${value}`, 'P&L']}
          labelFormatter={(value) => new Date(value).toLocaleDateString()}
        />
        <Bar dataKey={'pnl'}>
          {data.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={entry.pnl < 0 ? '#ef4444' : '#10b981'}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default PnLBarChart;
