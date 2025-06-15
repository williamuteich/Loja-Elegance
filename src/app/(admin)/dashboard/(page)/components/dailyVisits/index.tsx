'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Dados mockados para os últimos 7 dias
const data = [
  { date: '15/06', visitas: 120 },
  { date: '16/06', visitas: 150 },
  { date: '17/06', visitas: 180 },
  { date: '18/06', visitas: 210 },
  { date: '19/06', visitas: 190 },
  { date: '20/06', visitas: 230 },
  { date: '21/06', visitas: 250 },
];

export default function DailyVisits() {
  const totalVisits = data.reduce((sum, day) => sum + day.visitas, 0);
  const todayVisits = data[data.length - 1].visitas;
  const percentageChange = ((todayVisits - data[data.length - 2].visitas) / data[data.length - 2].visitas) * 100;

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-700">Visitas Diárias</h3>
        <div className="text-right">
          <p className="text-sm text-gray-500">Total acumulado (7 dias)</p>
          <p className="text-3xl font-extrabold text-indigo-700">{totalVisits.toLocaleString()}</p>
        </div>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '0.5rem',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
            />
            <Line
              type="monotone"
              dataKey="visitas"
              stroke="#4f46e5"
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6, stroke: '#4338ca' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
