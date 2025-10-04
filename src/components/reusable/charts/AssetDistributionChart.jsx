import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
const COLORS = [
  '#3b82f6',
  '#f59e0b',
  '#10b981',
  '#ef4444',
  '#8b5cf6',
  '#ec4899',
  '#06b6d4',
  '#f97316',
];

const AssetDistribuitonChart = ({ data }) => {
  return (
    <ResponsiveContainer width={'100%'} height={300}>
      <PieChart>
        <Pie
          data={data}
          cx={'50%'}
          cy={'50%'}
          outerRadius={'60%'}
          fill="#8884d8"
          dataKey={'value'}
          label={({ name, value }) => `${name}: ${value}%`}
          isAnimationActive={false}
        >
          {data?.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          position={{ x: 0, y: 0 }}
          allowEscapeViewBox={{ x: false, y: false }}
          wrapperStyle={{ zIndex: 1000 }}
          formatter={(value, name, props) => [
            `${value.toFixed(2)}% - ${props.payload.amount}`,
            props.payload.name,
          ]}
        />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default AssetDistribuitonChart;
