import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

const COLORS = ['#10b981', '#ef4444'];
const WinLossPieChart = ({ data }) => {
  return (
    <ResponsiveContainer width="50%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          outerRadius={80}
          fill="#8884d8"
          dataKey={'value'}
          label={({ name, value }) => `${name}: ${value}%`}
        >
          {data?.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default WinLossPieChart;
