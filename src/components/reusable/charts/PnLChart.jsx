import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const PnLChart = ({ data }) => {
  return (
    <ResponsiveContainer width={'100%'} height={300}>
      <AreaChart data={data}>
        <CartesianGrid strokeDasharray={'0, 0'} />
        <XAxis
          dataKey={'date'}
          tickFormatter={(value) => new Date(value).toLocaleDateString()}
        />
        <YAxis />
        <Tooltip formatter={(value) => [`$${value}`, 'Cumulative P&L']} />
        <Area
          type={'monotone'}
          dataKey={'cumulative'}
          stroke="#3b82f6"
          fill="#3b82f6"
          fillOpacity={0.3}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};
export default PnLChart;
