import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const VolumeChart = ({ data }) => {
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
          formatter={(value) => [`$${value}`, 'Volume']}
          labelFormatter={(value) => new Date(value).toLocaleDateString()}
          contentStyle={{
            color: '#1e293b',
            background: '#fff',
            border: '1px solid #e5e7eb',
          }}
        />
        <Bar
          dataKey={'volume'}
          fill="#3b82f6"
          fillOpacity={0.7}
          stroke="#3b82f6"
          isAnimationActive={false}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};
export default VolumeChart;
