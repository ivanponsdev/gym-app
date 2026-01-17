import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

const GraficoBarras = ({ data, dataKey, xAxisKey, titulo, color = "#8884d8", colors = [] }) => {
  // Si se pasa un array de colores, usar uno diferente por barra
  const useMultipleColors = colors.length > 0;
  
  return (
    <div style={{ width: '100%', height: '100%', minHeight: '300px' }}>
      {titulo && <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem', textAlign: 'center' }}>{titulo}</h3>}
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
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
          <Bar dataKey={dataKey} radius={[8, 8, 0, 0]}>
            {useMultipleColors ? (
              data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))
            ) : (
              <Cell fill={color} />
            )}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default GraficoBarras;

