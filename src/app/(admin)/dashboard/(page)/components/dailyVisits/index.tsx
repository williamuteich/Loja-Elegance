'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useEffect, useState } from 'react';

interface PageView {
  date: string;
  count: number;
}

export default function DailyVisits() {
  const [pageViews, setPageViews] = useState<PageView[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPageViews = async () => {
      try {
        const response = await fetch('/api/analytics/page-views');
        const data = await response.json();
        
        console.log('Response data:', data);

        // Adicionar verificação mais robusta
        if (!data || typeof data !== 'object') {
          console.error('Invalid response format:', data);
          setPageViews([]);
          return;
        }

        // Se não tem pageViews, usar um array vazio
        const pageViewsData = data.pageViews || [];
        
        // Converter datas para o formato local do Brasil
        const formattedData = pageViewsData.map((item: any) => {
          // Converter string ISO para data
          const date = new Date(item.date);
          
          // Adicionar 1 dia à data
          date.setDate(date.getDate() + 1);
          
          return {
            ...item,
            date: date.toLocaleDateString('pt-BR', {
              day: '2-digit',
              month: '2-digit'
            })
          };
        });

        setPageViews(formattedData);
      } catch (error) {
        console.error('Error fetching page views:', error);
        setPageViews([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPageViews();
  }, []);

  const totalVisits = pageViews.reduce((sum, day) => sum + day.count, 0);

  if (isLoading) {
    return (
      <div className="p-4 bg-white rounded-lg shadow">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-700">Visitas Diárias</h3>
          <div className="text-right">
            <p className="text-sm text-gray-500">Carregando...</p>
          </div>
        </div>
        <div className="h-64 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-700"></div>
        </div>
      </div>
    );
  }

  if (pageViews.length === 0) {
    return (
      <div className="p-4 bg-white rounded-lg shadow">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-700">Visitas Diárias</h3>
          <div className="text-right">
            <p className="text-sm text-gray-500">Nenhuma visita registrada</p>
          </div>
        </div>
        <div className="h-64 flex items-center justify-center">
          <p className="text-gray-500">Nenhum dado disponível</p>
        </div>
      </div>
    );
  }

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
            data={pageViews}
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
              dataKey="count"
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