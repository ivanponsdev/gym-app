import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Colores neón vibrantes y distintos
const COLORS = ['#00BFFF', '#FF1493', '#FFFF00', '#9400D3', '#00FF00', '#FF073A'];

const GraficoCircular = ({ data, dataKey, nameKey, titulo }) => {
  return (
    <div style={{ width: '100%', height: '100%', minHeight: '300px' }}>
      {titulo && <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem', textAlign: 'center' }}>{titulo}</h3>}
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            outerRadius={100}
            fill="#8884d8"
            dataKey={dataKey}
            nameKey={nameKey}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '0.5rem' }}
          />
          <Legend wrapperStyle={{ paddingTop: '10px' }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default GraficoCircular;

