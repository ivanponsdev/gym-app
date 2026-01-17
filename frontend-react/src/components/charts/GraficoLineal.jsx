import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const GraficoLineal = ({ data, dataKeys, xAxisKey, titulo, colors = ["#8884d8", "#82ca9d", "#ffc658"] }) => {
  return (
    <div style={{ width: '100%', height: '100%', minHeight: '300px' }}>
      {titulo && <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem', textAlign: 'center' }}>{titulo}</h3>}
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis 
            dataKey={xAxisKey} 
            stroke="#9ca3af"
            style={{ fontSize: '0.875rem' }}
          />
          <YAxis 
            stroke="#9ca3af"
            style={{ fontSize: '0.875rem' }}
          />
          <Tooltip 
            contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '0.5rem' }}
            labelStyle={{ color: '#f3f4f6' }}
          />
          <Legend wrapperStyle={{ paddingTop: '10px' }} />
          {dataKeys.map((key, index) => (
            <Line
              key={key}
              type="monotone"
              dataKey={key}
              stroke={colors[index % colors.length]}
              strokeWidth={2}
              activeDot={{ r: 8 }}
              dot={{ r: 4 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default GraficoLineal;

