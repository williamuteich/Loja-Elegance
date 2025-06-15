'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'iPhone 15', acessos: 156 },
  { name: 'Samsung S24', acessos: 132 },
  { name: 'AirPods Pro', acessos: 98 },
  { name: 'MacBook Pro', acessos: 87 },
  { name: 'iPad Pro', acessos: 65 },
];

export default function TopProducts() {
  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h3 className="text-lg font-semibold text-gray-700 mb-4">Produtos Mais Acessados</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis dataKey="name" type="category" width={100} />
            <Tooltip />
            <Bar dataKey="acessos" fill="#4f46e5" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
