import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
const COLORS = ['#3b82f6', '#f59e0b', '#10b981', '#ef4444'];

const AssetDistribuitonChart = ({ data }) => {
  return (
    <ResponsiveContainer width={'50%'} height={300}>
      <PieChart>
        <Pie
          data={data}
          cx={'50%'}
          cy={'50%'}
          outerRadius={80}
          fill="#8884d8"
          dataKey={'value'}
          label={({ name, value }) => `${name}: ${value}%`}
        >
          {data?.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
};

export default AssetDistribuitonChart;
